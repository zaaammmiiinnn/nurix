import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

import { getAdminSession } from "./admin-session";

export type AdminAuthResult =
  | {
      status: "authorized";
      email: string;
      authProvider: "clerk" | "supabase" | "database";
      mustChangePassword?: boolean;
      user?: unknown;
    }
  | {
      status: "unverified";
      email: string;
      authProvider: "clerk";
      user?: unknown;
      message: string;
    }
  | {
      status: "unauthorized";
      email: string;
      authProvider: "clerk" | "supabase" | "database";
      user?: unknown;
      message: string;
    }
  | {
      status: "unauthenticated";
    };

export const DUMMY_PASSWORDS = new Set([
  "admin_1@",
  "admin_neural@",
  "zamin_admin@",
  "zamin.work_admin@",
  "zamin_personalmail",
  "belal_admin@-2",
  "dummy123",
  "admin123",
  "password123",
]);

export function isDummyPassword(pw: string): boolean {
  if (!pw) return false;
  const trimmed = pw.trim();
  if (DUMMY_PASSWORDS.has(trimmed)) return true;
  if (trimmed.endsWith("_admin@") || trimmed.endsWith("_personalmail")) return true;
  return false;
}

/**
 * Returns true if Clerk publishable key is present in environment
 */
export function isClerkConfigured(): boolean {
  const key =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_c3Ryb25nLWRvZ2Zpc2gtMzU0Ni5jbGVyay5hY2NvdW50cy5kZXYk";
  return Boolean(key && !key.includes("YOUR_") && !key.includes("placeholder") && key.startsWith("pk_"));
}

/**
 * Whitelist of authorized administrator emails, read from environment with built-in owner fallback.
 */
export function getAuthorizedAdminEmails(): Set<string> {
  const allowed = new Set<string>();

  const add = (raw: string | undefined) => {
    if (!raw) return;
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
      .forEach((e) => allowed.add(e));
  };

  add(process.env.ADMIN_EMAILS);
  add(process.env.ADMIN_EMAIL);
  // Built-in project administrators
  allowed.add("askarizamin110@gmail.com");
  allowed.add("neuralwaves.official@gmail.com");
  allowed.add("support@neuralwaves.in");
  allowed.add("zamin@neuralwaves.in");
  allowed.add("belal@neuralwaves.in");
  allowed.add("zaminaskari.work@gmail.com");

  return allowed;
}

/**
 * Validates whether an email belongs to an authorized admin,
 * checking the environment allowlist and the database `admins` table via service role.
 */
export async function isEmailAuthorizedAdmin(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const whitelist = getAuthorizedAdminEmails();

  if (whitelist.has(normalized)) {
    return true;
  }

  // Check Supabase admins table using service role client
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from("admins")
        .select("id, email")
        .ilike("email", normalized)
        .maybeSingle();

      if (data) return true;
    } catch (e) {
      console.warn("[AdminAuth] Supabase admins check error:", e);
    }
  }

  return false;
}

/**
 * Server-side verification for admin dashboard access.
 * Enforces Clerk authentication, email verification status, and admin whitelist check.
 */
export async function verifyAdminAccess(): Promise<AdminAuthResult> {
  // 1. Check direct database admin session cookie
  const adminSession = await getAdminSession();
  if (adminSession) {
    const isAuthorized = await isEmailAuthorizedAdmin(adminSession.email);
    if (isAuthorized) {
      return {
        status: "authorized",
        email: adminSession.email,
        authProvider: "database",
        mustChangePassword: Boolean(adminSession.mustChangePassword),
        user: { email: adminSession.email, role: adminSession.role },
      };
    }
    return {
      status: "unauthorized",
      email: adminSession.email,
      authProvider: "database",
      message: "Account not authorized in admins table.",
    };
  }

  // 2. Fall back to Clerk authentication if configured
  const clerkActive = isClerkConfigured();

  if (clerkActive) {
    try {
      const user = await currentUser();

      if (!user) {
        return { status: "unauthenticated" };
      }

      // Resolve the account's email addresses.
      const emailObjects = user.emailAddresses || [];
      const primaryEmail =
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        "";

      const verifiedEmails = emailObjects
        .filter((e) => e.verification?.status === "verified")
        .map((e) => e.emailAddress.toLowerCase());

      if (verifiedEmails.length === 0) {
        return {
          status: "unverified",
          email: primaryEmail,
          authProvider: "clerk",
          user,
          message:
            "Your email address is not yet verified in Clerk. Please verify your email before entering the admin portal.",
        };
      }

      for (const verifiedEmail of verifiedEmails) {
        if (await isEmailAuthorizedAdmin(verifiedEmail)) {
          // Check if database records flag dummy password
          let mustChange = false;
          if (supabaseAdmin) {
            try {
              const { data } = await supabaseAdmin
                .from("admins")
                .select("Password")
                .ilike("email", verifiedEmail)
                .maybeSingle();
              if (data?.Password && isDummyPassword(data.Password)) {
                mustChange = true;
              }
            } catch {
              // Ignore check error
            }
          }

          return {
            status: "authorized",
            email: verifiedEmail,
            authProvider: "clerk",
            mustChangePassword: mustChange,
            user,
          };
        }
      }

      // Signed into Clerk, but no verified address is on the admin whitelist.
      return {
        status: "unauthorized",
        email: verifiedEmails[0],
        authProvider: "clerk",
        user,
        message:
          "Your verified account is not on the authorized administrator whitelist.",
      };
    } catch (err) {
      console.error("[AdminAuth] Clerk verification error:", err);
    }
  }

  // Fallback to Supabase authentication when Clerk is not active
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
      !supabaseUrl.includes("YOUR_PROJECT") &&
      !supabaseUrl.includes("placeholder") &&
      !supabaseUrl.includes("xxxxxxxx") &&
      !supabaseUrl.includes("your-project") &&
      supabaseUrl.startsWith("https://")
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        const isAuthorized = await isEmailAuthorizedAdmin(user.email);
        if (isAuthorized) {
          return {
            status: "authorized",
            email: user.email,
            authProvider: "supabase",
            user,
          };
        }
        return {
          status: "unauthorized",
          email: user.email,
          authProvider: "supabase",
          message: "Account not authorized in admins table.",
        };
      }
    } catch {
      // Continue to unauthenticated
    }
  }

  return { status: "unauthenticated" };
}
