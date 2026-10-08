"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(email: string, redirectToOrigin: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT") && !supabaseUrl.includes("placeholder")
  );

  if (!isConfigured) {
    // In local dev without Supabase keys set up yet
    return {
      success: true,
      isDev: true,
      message: "Supabase not configured in .env.local. Use Dev Demo Login below to test the admin panel.",
    };
  }

  const supabase = createClient();
  const redirectUrl = `${redirectToOrigin}/admin/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Magic link sent! Check your inbox to sign in.",
  };
}

export async function loginAsDemoAdmin() {
  const cookieStore = cookies();
  cookieStore.set("nurix_admin_demo_session", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  cookieStore.set("nurix_admin_email", "admin@nurix.ae", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function signOutAdmin() {
  const cookieStore = cookies();
  cookieStore.delete("nurix_admin_demo_session");
  cookieStore.delete("nurix_admin_email");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT") && !supabaseUrl.includes("placeholder")
  );

  if (isConfigured) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
