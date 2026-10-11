"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  isEmailAuthorizedAdmin,
  isDummyPassword,
} from "@/lib/auth/admin-auth";
import {
  setAdminSessionCookie,
  getAdminSession,
  clearAdminSessionCookie,
} from "@/lib/auth/admin-session";

const CLERK_SECRET_KEY =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_Hzh9qp7kvHfU1YviDX4eDT8p9xzRUDgWBURtQbX0mF";

/**
 * Direct Database Admin Login with Email & Password.
 * Authenticates against the Supabase `public.admins` table.
 */
export async function loginWithAdminPassword(formData: FormData) {
  try {
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return {
        success: false,
        error: "Please provide both email address and password.",
      };
    }

    // 1. Verify email authorization against whitelist
    const isAuthorized = await isEmailAuthorizedAdmin(email);
    if (!isAuthorized) {
      return {
        success: false,
        error: "This email address is not registered on the administrator whitelist.",
      };
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: "Database connection unavailable. Please check system configuration.",
      };
    }

    // 2. Fetch admin record from Supabase
    const { data: adminRecord, error: dbError } = await supabaseAdmin
      .from("admins")
      .select("id, email, role, Password")
      .ilike("email", email)
      .maybeSingle();

    if (dbError || !adminRecord) {
      return {
        success: false,
        error: "Administrator account not found in database.",
      };
    }

    // 3. Verify password
    const storedPassword = (adminRecord.Password || "").toString().trim();
    const inputPassword = password.trim();

    if (!storedPassword || storedPassword !== inputPassword) {
      return {
        success: false,
        error: "Incorrect password. Please verify your credentials.",
      };
    }

    // 4. Check if password is dummy/temporary
    const mustChange = isDummyPassword(storedPassword);

    // 5. Issue tamper-proof admin session cookie
    await setAdminSessionCookie({
      email: adminRecord.email,
      role: adminRecord.role || "superadmin",
      mustChangePassword: mustChange,
    });

    return {
      success: true,
      redirectUrl: mustChange ? "/admin/change-password" : "/admin",
      mustChangePassword: mustChange,
    };
  } catch (err: unknown) {
    console.error("[AdminLogin] unexpected error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during authentication.",
    };
  }
}

/**
 * Synchronizes password update to Clerk so both Supabase and Clerk stay in sync.
 */
async function syncPasswordToClerk(email: string, newPassword: string): Promise<boolean> {
  try {
    if (!CLERK_SECRET_KEY || CLERK_SECRET_KEY.includes("YOUR_")) return false;

    // 1. Find Clerk user by email
    const searchRes = await fetch(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!searchRes.ok) return false;
    const users = await searchRes.json();

    if (Array.isArray(users) && users.length > 0) {
      const userId = users[0].id;
      // 2. Update password in Clerk
      const updateRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
          skip_password_checks: true,
        }),
      });

      return updateRes.ok;
    }
    return false;
  } catch (e) {
    console.warn("[syncPasswordToClerk] Failed to sync to Clerk:", e);
    return false;
  }
}

/**
 * Change Administrator Password.
 * Updates password in Supabase `admins` table and Clerk user database.
 */
export async function changeAdminPassword(formData: FormData) {
  try {
    const session = await getAdminSession();
    if (!session || !session.email) {
      return {
        success: false,
        error: "Session expired. Please sign in again.",
        redirect: "/admin/login",
      };
    }

    const currentPassword = formData.get("currentPassword")?.toString().trim();
    const newPassword = formData.get("newPassword")?.toString().trim();
    const confirmPassword = formData.get("confirmPassword")?.toString().trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        error: "All password fields are required.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "New password and confirmation do not match.",
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters long.",
      };
    }

    if (isDummyPassword(newPassword)) {
      return {
        success: false,
        error: "Please choose a unique, custom password instead of a default dummy password.",
      };
    }

    if (newPassword === currentPassword) {
      return {
        success: false,
        error: "New password must be different from your current password.",
      };
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: "Database client unavailable.",
      };
    }

    // 1. Verify current password matches database
    const { data: adminRecord, error: selectError } = await supabaseAdmin
      .from("admins")
      .select("id, email, Password")
      .ilike("email", session.email)
      .maybeSingle();

    if (selectError || !adminRecord) {
      return {
        success: false,
        error: "Admin record not found.",
      };
    }

    const storedCurrent = (adminRecord.Password || "").toString().trim();
    if (storedCurrent !== currentPassword) {
      return {
        success: false,
        error: "Current password is incorrect.",
      };
    }

    // 2. Update password in Supabase database
    const { error: updateError } = await supabaseAdmin
      .from("admins")
      .update({ Password: newPassword })
      .ilike("email", session.email);

    if (updateError) {
      console.error("[changeAdminPassword] Supabase update failed:", updateError);
      return {
        success: false,
        error: "Failed to update password in database. Please try again.",
      };
    }

    // 3. Synchronize to Clerk in background
    await syncPasswordToClerk(session.email, newPassword);

    // 4. Refresh session cookie with mustChangePassword = false
    await setAdminSessionCookie({
      email: session.email,
      role: session.role,
      mustChangePassword: false,
    });

    return {
      success: true,
      message: "Password updated successfully! Welcome to the Admin Portal.",
      redirectUrl: "/admin",
    };
  } catch (err: unknown) {
    console.error("[changeAdminPassword] error:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to update password.",
    };
  }
}

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
        const supabase = await createClient();
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
        return {
          success: false,
          message: error.message || "Failed to send magic link.",
        };
      } catch (sbErr) {
        console.warn("[Supabase Auth] network error sending magic link:", sbErr);
        return {
          success: false,
          message: "Unable to connect to Supabase auth service.",
        };
      }
    }

    return {
      success: false,
      message:
        "Supabase is not configured for Magic Links. Please sign in with your Email & Password.",
    };
  } catch (err: unknown) {
    console.error("sendMagicLink unexpected error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Authentication temporarily unavailable.",
    };
  }
}

export async function signOutAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT") && !supabaseUrl.includes("placeholder")
  );

  if (isConfigured) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }

  await clearAdminSessionCookie();

  const cookieStore = await cookies();
  cookieStore.delete("nurix_admin_demo_session");
  cookieStore.delete("nurix_admin_email");
  cookieStore.delete("neuralwaves_admin_demo_session");
  cookieStore.delete("neuralwaves_admin_email");

  redirect("/admin/login");
}
