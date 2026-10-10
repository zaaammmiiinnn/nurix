import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Route protection for the admin area.
 *
 * Layered authorization model (all layers must hold):
 *   1. This middleware requires an authenticated Clerk session for /admin/*.
 *   2. If Clerk exposes an email claim we also require it to be on the
 *      ADMIN_EMAILS allowlist.
 *   3. app/admin/(dashboard)/layout.tsx re-verifies and renders an
 *      "unauthorized" view for signed-in non-admins.
 *   4. EVERY admin server action and route handler calls requireAdmin()
 *      (lib/auth/require-admin.ts) and fails closed. This is the layer that
 *      actually protects data: a layout is a render-time check and cannot stop a
 *      direct server-action POST.
 *
 * This middleware previously accepted *any* authenticated Clerk user, and fell
 * back to `supabase.auth.getSession()` — which reads a cookie without verifying
 * the JWT and must never gate server-side authorization. That fallback is gone.
 */

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c3Ryb25nLWRvZ2Zpc2gtMzU0Ni5jbGVyay5hY2NvdW50cy5kZXYk";
const isClerkConfigured = Boolean(
  clerkPublishableKey &&
    !clerkPublishableKey.includes("YOUR_") &&
    !clerkPublishableKey.includes("placeholder") &&
    clerkPublishableKey.startsWith("pk_")
);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/admin/login(.*)", "/admin/auth(.*)"]);

/**
 * Parsed inline on purpose: middleware runs on the edge runtime, so we avoid
 * importing server modules that depend on next/headers.
 */
function getAuthorizedAdminEmails(): Set<string> {
  const allowed = new Set<string>();
  for (const raw of [process.env.ADMIN_EMAILS, process.env.ADMIN_EMAIL]) {
    if (!raw) continue;
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
      .forEach((e) => allowed.add(e));
  }
  return allowed;
}

const clerkSecretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_Hzh9qp7kvHfU1YviDX4eDT8p9xzRUDgWBURtQbX0mF";

const clerkAuthHandler = isClerkConfigured
  ? clerkMiddleware(
      (auth, req) => {
        if (!isAdminRoute(req) || isAuthRoute(req)) return;

        const { userId, sessionClaims } = auth();

        if (!userId) {
          const loginUrl = new URL("/admin/login", req.url);
          loginUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
          return NextResponse.redirect(loginUrl);
        }

        // Enforce the allowlist when the session token carries an email claim.
        // Whether it does depends on the Clerk session-token template; when the
        // claim is absent we deliberately fall through to the layout and the
        // requireAdmin() guards in every action rather than locking out a
        // legitimate administrator.
        const email = (sessionClaims?.email as string | undefined)?.toLowerCase();
        if (email) {
          const allowed = getAuthorizedAdminEmails();
          if (allowed.size > 0 && !allowed.has(email)) {
            const deniedUrl = new URL("/admin/login", req.url);
            deniedUrl.searchParams.set("error", "not_authorized");
            return NextResponse.redirect(deniedUrl);
          }
        }
      },
      {
        publishableKey: clerkPublishableKey,
        secretKey: clerkSecretKey,
      }
    )
  : null;

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Public marketing pages (/), API endpoints, and metadata routes MUST NOT run
  // Clerk middleware. Running Clerk unconditionally throws when secretKey is absent
  // or verifying cookies at the edge, crashing public traffic with HTTP 500.
  if (!isAdminRoute(request) || isAuthRoute(request)) {
    return NextResponse.next();
  }

  if (clerkAuthHandler) {
    try {
      return await clerkAuthHandler(request, event);
    } catch (err) {
      console.error("[Middleware] Clerk auth error, redirecting to login:", err);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "auth_error");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Clerk is not configured. Do not attempt a cookie-based session check here —
  // fail closed and send admin traffic to the login page.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
