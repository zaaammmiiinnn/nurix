import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | {
      status: "authorized";
      email: string;
      authProvider: "clerk" | "supabase" | "demo";
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
      authProvider: "clerk" | "supabase";
      user?: unknown;
      message: string;
    }
  | {
      status: "unauthenticated";
    };

/**
 * Returns true if Clerk publishable key is present in environment
 */
export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(key && !key.includes("YOUR_") && !key.includes("placeholder") && key.startsWith("pk_"));
}

/**
 * Whitelist of authorized administrator emails.
 * Loaded from ADMIN_EMAILS, ADMIN_EMAIL, and default owners.
 */
export function getAuthorizedAdminEmails(): Set<string> {
  const allowed = new Set<string>([
    "zaminaskari.work@gmail.com",
    "askarizamin110@gmail.com",
  ]);

  if (process.env.ADMIN_EMAIL) {
    allowed.add(process.env.ADMIN_EMAIL.trim().toLowerCase());
  }

  if (process.env.ADMIN_EMAILS) {
    process.env.ADMIN_EMAILS.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
      .forEach((e) => allowed.add(e));
  }

  return allowed;
}

/**
 * Validates whether an email belongs to an authorized admin,
 * including checking the database `admins` table if Supabase is active.
 */
export async function isEmailAuthorizedAdmin(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const whitelist = getAuthorizedAdminEmails();

  if (whitelist.has(normalized)) {
    return true;
  }

  // Check Supabase admins table if available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT")) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("admins")
        .select("id, email")
        .ilike("email", normalized)
        .maybeSingle();

      if (data) return true;
    } catch {
      // Ignore database lookup failure and rely on whitelist
    }
  }

  return false;
}

/**
 * Server-side verification for admin dashboard access.
 * Enforces Clerk authentication, email verification status, and admin whitelist check.
 */
export async function verifyAdminAccess(): Promise<AdminAuthResult> {
  const clerkActive = isClerkConfigured();

  if (clerkActive) {
    try {
      const user = await currentUser();

      if (!user) {
        return { status: "unauthenticated" };
      }

      // Check user's verified email addresses
      const emailObjects = user.emailAddresses || [];
      const primaryEmail =
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        "";

      // 1. Verify that user has at least one verified email
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
            "Your email address is not verified in Clerk. Please verify your email before accessing the admin portal.",
        };
      }

      // 2. Check if any verified email is in the admin whitelist
      for (const verifiedEmail of verifiedEmails) {
        const isAuthorized = await isEmailAuthorizedAdmin(verifiedEmail);
        if (isAuthorized) {
          return {
            status: "authorized",
            email: verifiedEmail,
            authProvider: "clerk",
            user,
          };
        }
      }

      // User is verified, but not on the admin whitelist
      return {
        status: "unauthorized",
        email: verifiedEmails[0] || primaryEmail,
        authProvider: "clerk",
        user,
        message:
          "Your verified account is not on the authorized administrator whitelist.",
      };
    } catch (err) {
      console.error("[AdminAuth] Clerk verification error:", err);
    }
  }

  // Fallback to Supabase / Demo Cookie when Clerk is not configured or fails
  const cookieStore = cookies();
  const hasDemoCookie =
    cookieStore.get("neuralwaves_admin_demo_session")?.value === "1" ||
    cookieStore.get("nurix_admin_demo_session")?.value === "1";
  const demoEmail =
    cookieStore.get("neuralwaves_admin_email")?.value ||
    "zaminaskari.work@gmail.com";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
      !supabaseUrl.includes("YOUR_PROJECT") &&
      !supabaseUrl.includes("placeholder")
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
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
      // Continue to check demo session
    }
  }

  if (hasDemoCookie) {
    return {
      status: "authorized",
      email: demoEmail,
      authProvider: "demo",
    };
  }

  return { status: "unauthenticated" };
}
