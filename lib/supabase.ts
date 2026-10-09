import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

function safeCreateClient(url: string, key: string, options?: Parameters<typeof createClient>[2]): SupabaseClient | null {
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

// Client-safe instance (anon key)
export const supabase = isSupabaseConfigured
  ? safeCreateClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin/Server-only instance (service role key)
export const supabaseAdmin = isSupabaseConfigured && supabaseServiceKey && !isPlaceholderKey(supabaseServiceKey)
  ? safeCreateClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : supabase;
