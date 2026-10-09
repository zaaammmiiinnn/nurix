import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Check if user exists in the admins table (by user_id or email)
      const { data: adminData } = await supabase
        .from("admins")
        .select("id")
        .or(`user_id.eq.${data.user.id},email.eq.${data.user.email}`)
        .maybeSingle();

      if (!adminData) {
        // Not an authorized admin: sign out immediately
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/admin/login?error=not_authorized&email=${encodeURIComponent(
            data.user.email || ""
          )}`
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
