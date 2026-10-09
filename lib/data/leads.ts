import "server-only";

import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Lead persistence, shared by the PUBLIC forms (contact page, homepage CTA) and
 * by the admin panel.
 *
 * This module is deliberately NOT a `"use server"` module. Every export of a
 * `"use server"` file becomes a publicly-callable HTTP endpoint, so lead
 * insertion used by anonymous visitors must not live next to the guarded admin
 * actions.
 */

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost" | "archived";

/** Statuses accepted by the database CHECK constraint. */
export const LEAD_STATUSES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "archived",
] as const;

export interface LeadInput {
  name: string;
  /** Nullable: WhatsApp enquiries arrive with a phone number and no email address. */
  email?: string | null;
  phone: string;
  company?: string | null;
  service: string;
  message: string;
  status?: LeadStatus;
  source?: string;
  notes?: string | null;
  metadata?: Record<string, unknown>;
}

export interface InsertLeadResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Insert a lead. Returns an explicit failure rather than pretending to succeed —
 * the previous implementation reported `{ success: true }` even when the
 * Supabase write failed, so operators saw "saved" for lost enquiries.
 */
export async function insertLead(input: LeadInput): Promise<InsertLeadResult> {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    // No database configured. Do not silently pretend the lead was stored —
    // surface it so the caller (and the operator) can react.
    console.error("[leads] Supabase is not configured; lead was NOT persisted.");
    return { success: false, error: "Database not configured" };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          name: input.name,
          email: input.email ?? null,
          phone: input.phone,
          company: input.company ?? null,
          service: input.service,
          message: input.message,
          status: input.status ?? "new",
          source: input.source ?? "website_contact",
          metadata: {
            ...(input.metadata ?? {}),
            ...(input.notes ? { notes: input.notes } : {}),
          },
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("[leads] insert failed:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[leads] insert threw:", message);
    return { success: false, error: message };
  }
}
