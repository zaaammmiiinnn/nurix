import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

const isPlaceholder = (str: string) =>
  !str ||
  str.includes("YOUR_PROJECT") ||
  str.includes("your-project") ||
  str.includes("your-anon-key") ||
  str.includes("your-service-role-key");

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  !isPlaceholder(supabaseUrl) &&
  ((supabaseAnonKey && !isPlaceholder(supabaseAnonKey)) ||
   (supabaseServiceKey && !isPlaceholder(supabaseServiceKey)))
);

function safeCreateClient(url: string, key: string, options?: Parameters<typeof createClient>[2]): SupabaseClient | null {
  try {
    if (!url || !key || isPlaceholder(url) || isPlaceholder(key)) {
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
export const supabaseAdmin = isSupabaseConfigured && supabaseServiceKey && !isPlaceholder(supabaseServiceKey)
  ? safeCreateClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : supabase;
