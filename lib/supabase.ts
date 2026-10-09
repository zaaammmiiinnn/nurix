import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase clients.
 *
 * NOTE: there are no hardcoded project URLs or keys here by design. An earlier
 * revision fell back to the production project reference and the public
 * publishable key, which made a misconfigured deployment silently target
 * production instead of failing fast.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

const isPlaceholderUrl = (str: string) => {
  if (!str) return true;
  const s = str.toLowerCase().trim();
  return (
    s.includes("placeholder") ||
    s.includes("your_project") ||
    s.includes("your-project") ||
    s.includes("example.com") ||
    !s.startsWith("http")
  );
};

const isPlaceholderKey = (str: string) => {
  if (!str) return true;
  const s = str.toLowerCase().trim();
  return (
    s.includes("placeholder") ||
    s.includes("your-anon-key") ||
    s.includes("your-service-role-key") ||
    s.includes("your_anon_key") ||
    s.includes("your_service_role_key") ||
    s.includes("xxxxxxxx")
  );
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    !isPlaceholderUrl(supabaseUrl) &&
    ((supabaseAnonKey && !isPlaceholderKey(supabaseAnonKey)) ||
      (supabaseServiceKey && !isPlaceholderKey(supabaseServiceKey)))
);

function safeCreateClient(
  url: string,
  key: string,
  options?: Parameters<typeof createClient>[2]
): SupabaseClient | null {
  try {
    if (!url || !key || isPlaceholderUrl(url) || isPlaceholderKey(key)) {
      return null;
    }
    return createClient(url, key, options);
  } catch (err) {
    console.warn("Supabase client init suppressed:", err);
    return null;
  }
}

/**
 * Public / client-safe instance (anonymous key). Used by the browser for
 * read-only public content.
 */
export const supabase = isSupabaseConfigured
  ? safeCreateClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-only privileged instance.
 *
 * SECURITY: this must NEVER fall back to the anonymous client. Doing so meant a
 * missing or misspelled SUPABASE_SERVICE_ROLE_KEY silently ran every admin read
 * and write as `anon`: RLS rejected the writes, the code reported success, and
 * the operator saw "saved" for changes that were never persisted. It is `null`
 * when unconfigured so callers can fail explicitly.
 *
 * Do not import this into a client component.
 */
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured && supabaseServiceKey && !isPlaceholderKey(supabaseServiceKey)
    ? safeCreateClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;
