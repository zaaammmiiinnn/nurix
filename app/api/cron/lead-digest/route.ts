import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verify Vercel Cron authorization header if CRON_SECRET is configured
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Nurix Ops <alerts@nurix.ae>",
        to: process.env.ADMIN_EMAIL,
        subject: `Weekly Pipeline Digest: ${leadCount} New Inbound Leads`,
        text: `You received ${leadCount} new leads in the past 7 days.\n\n${leadsList
          .map((l) => `• ${l.name} (${l.email}) - Service: ${l.service} - Status: ${l.status}`)
          .join("\n")}\n\nReview them at: https://nurix.ae/admin/leads`,
      });
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
