import "server-only";

import { verifyAdminAccess, type AdminAuthResult } from "./admin-auth";

export class UnauthorizedError extends Error {
  readonly status = 403;
  constructor(message = "Unauthorized: administrator access required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

type AuthorizedResult = Extract<AdminAuthResult, { status: "authorized" }>;

/**
 * Authorization guard for every server action and route handler that reads or
 * writes administrative data.
 *
 * Files marked `"use server"` expose *every* export as a public HTTP endpoint.
 * Page-level gating (a layout calling verifyAdminAccess) is a render-time check
 * only and does NOT protect an action invocation. Therefore every privileged
 * export must call this first.
 *
 * Fails closed: any status other than "authorized" throws. Never branch on
 * NODE_ENV here — on Cloudflare Workers NODE_ENV is not a reliable signal and
 * such a branch is a production auth bypass.
 */
export async function requireAdmin(): Promise<AuthorizedResult> {
  const result = await verifyAdminAccess();
  if (result.status !== "authorized") {
    // Structured log for operators; no PII beyond the attempted email.
    console.warn(
      `[auth] Blocked privileged call: status=${result.status}` +
        ("email" in result && result.email ? ` email=${result.email}` : "")
    );
    throw new UnauthorizedError();
  }
  return result;
}

/**
 * Non-throwing variant, for actions whose return type can carry a failure.
 */
export async function isAuthorizedAdmin(): Promise<boolean> {
  const result = await verifyAdminAccess();
  return result.status === "authorized";
}
