import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Check if user is in the admins table
      const { data: adminData } = await supabase
        .from("admins")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!adminData) {
        // Not an admin: sign out immediately
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

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
