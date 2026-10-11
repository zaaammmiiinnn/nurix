import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "nw_admin_session";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.CLERK_SECRET_KEY ||
  "nw_secret_key_admin_neuralwaves_2026_prod_session_token";

export interface AdminSessionPayload {
  email: string;
  role: string;
  mustChangePassword: boolean;
  exp: number; // timestamp in ms
}

/**
 * Base64 URL encode / decode helpers
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a session payload into a compact, tamper-proof token:
 * header.payload.signature
 */
export async function createAdminSessionToken(
  payload: Omit<AdminSessionPayload, "exp"> & { exp?: number }
): Promise<string> {
  const fullPayload: AdminSessionPayload = {
    ...payload,
    exp: payload.exp || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days default
  };

  const enc = new TextEncoder();
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${header}.${body}`;

  const key = await getHmacKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const sig = Buffer.from(sigBuffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${data}.${sig}`;
}

/**
 * Verifies and decodes an admin session token. Works in Edge and Node runtime.
 */
export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, sig] = parts;
    const data = `${header}.${body}`;
    const enc = new TextEncoder();

    const key = await getHmacKey();

    // Reconstruct binary signature
    let sigBase64 = sig.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) {
      sigBase64 += "=";
    }
    const sigBytes = Buffer.from(sigBase64, "base64");

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(data)
    );

    if (!isValid) return null;

    const parsed: AdminSessionPayload = JSON.parse(base64UrlDecode(body));

    if (Date.now() > parsed.exp) {
      return null; // Expired
    }

    return parsed;
  } catch (err) {
    console.warn("[AdminSession] Token verification error:", err);
    return null;
  }
}

/**
 * Sets the signed admin session cookie in Next.js Server Action or Route Handler.
 */
export async function setAdminSessionCookie(
  payload: Omit<AdminSessionPayload, "exp"> & { exp?: number }
): Promise<void> {
  const token = await createAdminSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Reads and verifies the current admin session from Next.js cookies.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return await verifyAdminSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Deletes the admin session cookie.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignore error
  }
}
