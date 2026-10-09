import { currentUser } from "@clerk/nextjs/server";
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
  if (
    supabaseUrl &&
    !supabaseUrl.includes("YOUR_PROJECT") &&
    !supabaseUrl.includes("placeholder") &&
    supabaseUrl.startsWith("https://")
  ) {
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

      // 1. Collect verified email addresses
      const verifiedEmails = emailObjects
        .filter((e) => e.verification?.status === "verified")
        .map((e) => e.emailAddress.toLowerCase());

      // Candidate emails for admin whitelist check
      const candidateEmails = [
        ...verifiedEmails,
        primaryEmail.toLowerCase(),
        ...emailObjects.map((e) => e.emailAddress.toLowerCase()),
      ].filter(Boolean);

      // 2. Check if any candidate email matches authorized admin whitelist
      for (const candidateEmail of candidateEmails) {
        const isAuthorized = await isEmailAuthorizedAdmin(candidateEmail);
        if (isAuthorized) {
          // If the user has unverified emails only, prompt verification
          const isVerified =
            verifiedEmails.includes(candidateEmail) ||
            emailObjects.find((e) => e.emailAddress.toLowerCase() === candidateEmail)
              ?.verification?.status === "verified";

          if (!isVerified && verifiedEmails.length === 0) {
            return {
              status: "unverified",
              email: candidateEmail,
              authProvider: "clerk",
              user,
              message:
                "Your email address is not yet verified in Clerk. Please verify your email before entering the admin portal.",
            };
          }

          return {
            status: "authorized",
            email: candidateEmail,
            authProvider: "clerk",
            user,
          };
        }
      }

      // User signed into Clerk, but neither primary nor attached emails are on admin whitelist
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
      // Continue to unauthenticated
    }
  }

  return { status: "unauthenticated" };
}
