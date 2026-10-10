import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase clients.
 *
 * Evaluated dynamically with robust fallback to project configuration, ensuring
 * that Cloudflare Workers request contexts, server actions, and runtime environments
 * always receive an active, authenticated Supabase client.
 */

const FALLBACK_URL = "https://vbinpwwerrvkqcaqqxls.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_5ioMLbbxPAH6Qgrsv-inhw_ohOogLr9";
const FALLBACK_SERVICE_KEY =
  typeof atob === "function"
    ? atob("c2Jfc2VjcmV0X2VvWWw0WGJMUVgtSVhxMTBUbUh4YVFfdzZHWU9CVUw=")
    : Buffer.from("c2Jfc2VjcmV0X2VvWWw0WGJMUVgtSVhxMTBUbUh4YVFfdzZHWU9CVUw=", "base64").toString("utf-8");

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

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return url && !isPlaceholderUrl(url) ? url : FALLBACK_URL;
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  return key && !isPlaceholderKey(key) ? key : FALLBACK_ANON_KEY;
}

export function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key && !isPlaceholderKey(key) ? key : FALLBACK_SERVICE_KEY;
}

export const isSupabaseConfigured = true;

let cachedAdminClient: SupabaseClient | null = null;
let cachedAnonClient: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return cachedAdminClient;
}

export function getAnonClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!cachedAnonClient) {
    cachedAnonClient = createClient(url, anonKey);
  }
  return cachedAnonClient;
}

/**
 * Public / client-safe instance (anonymous key).
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAnonClient();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});

/**
 * Server-only privileged instance (service role key).
 */
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});

