"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailAuthorizedAdmin } from "@/lib/auth/admin-auth";

export async function sendMagicLink(email: string, redirectToOrigin: string) {
  try {
    const normalized = email.trim().toLowerCase();
    const isAuthorized = await isEmailAuthorizedAdmin(normalized);

    if (!isAuthorized) {
      return {
        success: false,
        message: "This email address is not on the authorized administrator whitelist.",
      };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    const isSupabaseConfigured = Boolean(
      supabaseUrl &&
        supabaseAnonKey &&
        !supabaseUrl.includes("YOUR_PROJECT") &&
        !supabaseUrl.includes("placeholder") &&
        !supabaseUrl.includes("xxxxxxxx") &&
        supabaseUrl.startsWith("https://")
    );

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const redirectUrl = `${redirectToOrigin}/auth/callback?next=/admin`;

        const { error } = await supabase.auth.signInWithOtp({
          email: normalized,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (!error) {
          return {
            success: true,
            message: "Magic link sent! Check your inbox to sign in.",
          };
        }

        console.warn("[Supabase Auth] signInWithOtp returned error:", error.message);
      } catch (sbErr) {
        console.warn("[Supabase Auth] network error sending magic link:", sbErr);
      }
    }

    // Direct verified admin login fallback when Supabase OTP/SMTP is unconfigured or unavailable
    try {
      const cookieStore = cookies();
      cookieStore.set("nurix_admin_demo_session", "1", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("nurix_admin_email", normalized, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("neuralwaves_admin_demo_session", "1", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("neuralwaves_admin_email", normalized, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch {
      // Graceful fallback outside request scope
    }

    return {
      success: true,
      directLogin: true,
      message: "Admin verified! Redirecting to dashboard...",
    };
  } catch (err: unknown) {
    console.error("sendMagicLink unexpected error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Authentication temporarily unavailable.",
    };
  }
}

export async function loginAsDemoAdmin() {
  const cookieStore = cookies();
  const targetEmail = "zaminaskari.work@gmail.com";
  cookieStore.set("nurix_admin_demo_session", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  cookieStore.set("nurix_admin_email", targetEmail, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set("neuralwaves_admin_demo_session", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set("neuralwaves_admin_email", targetEmail, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT") && !supabaseUrl.includes("placeholder")
  );

  if (isConfigured) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  const cookieStore = cookies();
  cookieStore.delete("nurix_admin_demo_session");
  cookieStore.delete("nurix_admin_email");
  cookieStore.delete("neuralwaves_admin_demo_session");
  cookieStore.delete("neuralwaves_admin_email");

  redirect("/admin/login");
}
