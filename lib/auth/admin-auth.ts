import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | {
      status: "authorized";
      email: string;
      authProvider: "clerk" | "supabase";
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

      // 1. Collect VERIFIED email addresses only.
      //
      // SECURITY: this list must never include unverified addresses. Previously
      // the candidate list included every attached address and the verification
      // requirement was only applied when the account had zero verified
      // addresses — so a user holding one verified email of their own plus any
      // unverified address matching an admin whitelist entry was granted access.
      const verifiedEmails = emailObjects
        .filter((e) => e.verification?.status === "verified")
        .map((e) => e.emailAddress.toLowerCase());

      // 2. Unverified accounts cannot be admins. Prompt them to verify.
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

      // 3. Authorize only against a VERIFIED address on the whitelist.
      for (const verifiedEmail of verifiedEmails) {
        if (await isEmailAuthorizedAdmin(verifiedEmail)) {
          return {
            status: "authorized",
            email: verifiedEmail,
            authProvider: "clerk",
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
