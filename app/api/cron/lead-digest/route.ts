import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Weekly lead digest. Triggered by a Cloudflare Cron Trigger (see wrangler.toml).
 *
 * SECURITY: this fails closed. The previous guard was
 * `if (process.env.CRON_SECRET && ...)` which short-circuits to "allow" whenever
 * the secret is unset — and it was unset — leaving the endpoint open to anyone
 * who could trigger a service-role lead read plus an outbound email.
 */
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const header = req.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";

  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(secret, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    console.error(
      "[cron] CRON_SECRET is not set — refusing to run. Generate one (e.g. `openssl rand -hex 32`) and set it in the environment."
    );
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let leadCount = 0;
    let leadsList: Array<{ name: string; email: string; service: string; status: string }> = [];

    if (isSupabaseConfigured && supabaseAdmin) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data, count } = await supabaseAdmin
        .from("leads")
        .select("name, email, service, status", { count: "exact" })
        .gte("created_at", oneWeekAgo);

      leadCount = count || 0;
      leadsList = data || [];
    }

    // Send digest email via Resend if configured
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
    const toEmail = process.env.RESEND_TO_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE_URL;

    if (resendKey && toEmail) {
      const resend = new Resend(resendKey);
      const { error: mailError } = await resend.emails.send({
        from: `NeuralWaves Ops <${fromEmail}>`,
        to: toEmail,
        subject: `Weekly Pipeline Digest: ${leadCount} New Inbound Leads`,
        text: `You received ${leadCount} new leads in the past 7 days.\n\n${leadsList
          .map((l) => `• ${l.name} (${l.email || "no email"}) - Service: ${l.service} - Status: ${l.status}`)
          .join("\n")}\n\nReview them at: ${siteUrl}/admin/leads`,
      });
      if (mailError) {
        console.error("[cron] digest email failed:", mailError.message);
      }
    } else {
      console.warn("[cron] digest not emailed: set RESEND_API_KEY and RESEND_TO_EMAIL/ADMIN_EMAIL.");
    }

    return NextResponse.json({
      success: true,
      newLeads: leadCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to run cron digest";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
