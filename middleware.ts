import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(
  clerkPublishableKey &&
    !clerkPublishableKey.includes("YOUR_") &&
    clerkPublishableKey.startsWith("pk_")
);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/admin/login(.*)", "/admin/auth(.*)"]);

// Helper handler when Clerk is active
const clerkAuthHandler = isClerkConfigured
  ? clerkMiddleware((auth, req) => {
      if (isAdminRoute(req) && !isAuthRoute(req)) {
        const loginUrl = new URL("/admin/login", req.url).toString();
        auth().protect({ unauthenticatedUrl: loginUrl });
      }
    })
  : null;

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // If Clerk is configured, use Clerk middleware protection
  if (clerkAuthHandler) {
    return clerkAuthHandler(request, event);
  }

  // Fallback protection for local development and Supabase auth
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/auth")
  ) {
    const hasDemoCookie =
      request.cookies.get("nurix_admin_demo_session")?.value === "1" ||
      request.cookies.get("neuralwaves_admin_demo_session")?.value === "1";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isSupabaseConfigured = Boolean(
      supabaseUrl &&
        supabaseAnonKey &&
        !supabaseUrl.includes("YOUR_PROJECT") &&
        !supabaseUrl.includes("placeholder")
    );

    if (isSupabaseConfigured) {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      try {
        const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              response.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              response.cookies.set({ name, value: "", ...options });
            },
          },
        });

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && !hasDemoCookie) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/admin/login";
          redirectUrl.searchParams.set("redirectedFrom", pathname);
          return NextResponse.redirect(redirectUrl);
        }

        return response;
      } catch {
        if (!hasDemoCookie) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/admin/login";
          return NextResponse.redirect(redirectUrl);
        }
      }
    } else {
      // Unconfigured local dev mode: require demo session
      if (!hasDemoCookie) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin/login";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
