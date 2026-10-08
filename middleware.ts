import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, excluding login and auth callbacks
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/auth")
  ) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isConfigured = Boolean(
      supabaseUrl &&
        supabaseAnonKey &&
        !supabaseUrl.includes("YOUR_PROJECT") &&
        !supabaseUrl.includes("placeholder")
    );

    const hasDemoCookie = request.cookies.get("nurix_admin_demo_session")?.value === "1";

    if (isConfigured) {
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
      } catch (e) {
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
  matcher: ["/admin/:path*"],
};
