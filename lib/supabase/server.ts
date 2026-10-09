import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase clients.
 *
 * There are deliberately NO hardcoded project URLs or keys here. An earlier
 * revision fell back to the production project reference and the publishable
 * key, which meant a misconfigured deployment silently talked to production
 * instead of failing. Worse, `serviceRoleKey` fell back to the *anonymous* key,
 * so createAdminClient() silently ran unprivileged: RLS rejected every write and
 * the admin panel appeared to save while persisting nothing.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

/**
 * Standard server-side Supabase client using authenticated cookies (RLS respected).
 *
 * Async because Next 15 made `cookies()` asynchronous.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Privileged server-side Supabase client using SUPABASE_SERVICE_ROLE_KEY for
 * administrative operations and server actions.
 *
 * Throws when the service-role key is absent rather than silently degrading to
 * the anonymous key. Failing loudly once at the call site is far cheaper than an
 * admin panel that reports success for writes that RLS rejected.
 */
export function createAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client unavailable: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set. " +
        "Refusing to fall back to the anonymous key."
    );
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {},
    },
  });
}
