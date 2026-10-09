"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { insertLead, type LeadStatus } from "@/lib/data/leads";

/**
 * Admin lead management.
 *
 * Every export below is a publicly-callable server action, so every one starts
 * with `await requireAdmin()`. See lib/auth/require-admin.ts.
 *
 * Public lead capture does NOT live here — it lives in lib/data/leads.ts
 * (insertLead) and is called from app/contact/actions.ts and app/actions/lead.ts.
 */

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback when invoked outside a Next.js request context (scripts/tests)
  }
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  message: string;
  status: LeadStatus;
  notes?: string | null;
  created_at: string;
}

interface SupabaseLeadRow {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  company?: string | null;
  service?: string;
  message?: string;
  status?: string;
  notes?: string | null;
  metadata?: { notes?: string };
  created_at?: string;
}

function mapRow(d: SupabaseLeadRow): Lead {
  return {
    id: String(d.id),
    name: d.name || "",
    email: d.email || "",
    phone: d.phone || "",
    company: d.company || null,
    service: d.service || "chatbots",
    message: d.message || "",
    status: (d.status || "new") as LeadStatus,
    notes: d.notes || d.metadata?.notes || null,
    created_at: d.created_at || new Date().toISOString(),
  };
}

export async function getLeads(): Promise<Lead[]> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[leads] fetch failed:", error.message);
      return [];
    }

    // An empty table is a valid result. Previously this fell through to a
    // hardcoded array of seven fabricated leads, which the operator saw as real
    // pipeline on day one.
    return (data as unknown as SupabaseLeadRow[] | null)?.map(mapRow) ?? [];
  } catch (e) {
    console.error("[leads] fetch threw:", e);
    return [];
  }
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  notes?: string
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("leads")
      .update({
        status,
        metadata: notes ? { notes } : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      console.error("[leads] update failed:", error.message);
      return { success: false, message: error.message };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[leads] update threw:", message);
    return { success: false, message };
  }

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true };
}

export async function bulkUpdateLeads(
  leadIds: string[],
  status: LeadStatus
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return { success: false, message: "No leads selected." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", leadIds);

    if (error) {
      console.error("[leads] bulk update failed:", error.message);
      return { success: false, message: error.message };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[leads] bulk update threw:", message);
    return { success: false, message };
  }

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true };
}

export async function bulkDeleteLeads(
  leadIds: string[]
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return { success: false, message: "No leads selected." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("leads").delete().in("id", leadIds);

    if (error) {
      console.error("[leads] bulk delete failed:", error.message);
      return { success: false, message: error.message };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[leads] bulk delete threw:", message);
    return { success: false, message };
  }

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true };
}

/**
 * Manually add a lead from the admin panel (e.g. a referral or a call).
 */
export async function createManualLead(
  leadData: Omit<Lead, "id" | "created_at">
): Promise<{ success: boolean; lead?: Lead; message?: string }> {
  await requireAdmin();

  const result = await insertLead({
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company ?? null,
    service: leadData.service,
    message: leadData.message,
    status: leadData.status,
    source: "admin_manual",
    notes: leadData.notes ?? null,
  });

  if (!result.success) {
    return { success: false, message: result.error ?? "Failed to create lead." };
  }

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");

  return {
    success: true,
    lead: {
      id: result.id ?? `lead-${Date.now()}`,
      ...leadData,
      created_at: new Date().toISOString(),
    },
  };
}
