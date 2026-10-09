import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vbinpwwerrvkqcaqqxls.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_5ioMLbbxPAH6Qgrsv-inhw_ohOogLr9";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
