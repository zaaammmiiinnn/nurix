"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback when invoked outside Next.js request context (tests/scripts)
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
  status: "new" | "contacted" | "won" | "lost" | "archived";
  notes?: string | null;
  created_at: string;
}

// Fallback in-memory leads store when running in dev mode before Supabase credentials are configured
let memoryLeads: Lead[] = [
  {
    id: "lead-001",
    name: "Tariq Al Mansoori",
    email: "tariq@skylineproperties.ae",
    phone: "+971 50 491 8291",
    company: "Skyline Luxury Realty",
    service: "chatbots",
    message: "Need a WhatsApp bot for Palm Jumeirah villa inquiries with calendar booking integration.",
    status: "new",
    notes: "High intent. Budget AED 3,500+. Call back at 2 PM.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "lead-002",
    name: "Omar Al Qasimi",
    email: "omar@karakcafegroup.ae",
    phone: "+971 55 921 4402",
    company: "Karak & Co.",
    service: "dashboards",
    message: "Looking for an order dispatch dashboard connecting our 4 cloud kitchens in Dubai.",
    status: "contacted",
    notes: "Demo scheduled for Thursday morning.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "lead-003",
    name: "Sarah Jenkins",
    email: "sarah@apexmaritime.ae",
    phone: "+971 52 388 9104",
    company: "Apex Maritime Logistics",
    service: "agents",
    message: "Need automated tender scraping and lead qualification across JAFZA and KEZAD ports.",
    status: "won",
    notes: "Approved proposal. Deposit paid. Sprint starts Monday.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "lead-004",
    name: "Dr. Khaled Haddad",
    email: "khaled@auraclinics.ae",
    phone: "+971 50 112 4920",
    company: "Aura Dental & Wellness",
    service: "chatbots",
    message: "WhatsApp patient appointment bot to reduce no-shows. Bilingual Arabic and English.",
    status: "contacted",
    notes: "Discussed Meta Cloud API setup requirements.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "lead-005",
    name: "Zaid Nabulsi",
    email: "zaid@desertwheels.ae",
    phone: "+971 56 772 1092",
    company: "Desert Wheels Car Rental",
    service: "dashboards",
    message: "Admin dashboard to track 85 fleet cars, lease agreements, and fines from RTA.",
    status: "new",
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "lead-006",
    name: "Fatima Al Zaabi",
    email: "fatima@souqgourmet.ae",
    phone: "+971 50 994 2281",
    company: "Souq Gourmet Foods",
    service: "agents",
    message: "Inventory sync agent across Noon and Amazon UAE with daily stock alerts.",
    status: "lost",
    notes: "Decided to keep using Shopify native sync for now.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: "lead-007",
    name: "Hamdan Al Suwaidi",
    email: "hamdan@dubaihorizon.ae",
    phone: "+971 55 601 3918",
    company: "Horizon Legal Consultants",
    service: "chatbots",
    message: "Document intake and consultation booking bot for legal practice in DIFC.",
    status: "won",
    notes: "Project shipped on Growth tier. 30-day warranty active.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
  },
];

export async function getLeads(): Promise<Lead[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Lead[];
      }
    } catch (e) {
      console.error("Error fetching leads from Supabase, using local fallback:", e);
    }
  }

  return memoryLeads;
}

export async function updateLeadStatus(
  leadId: string,
  status: Lead["status"],
  notes?: string
) {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("leads")
        .update({
          status,
          metadata: notes ? { notes } : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId);
    } catch (e) {
      console.error("Supabase update error:", e);
    }
  }

  // Update memory
  memoryLeads = memoryLeads.map((l) =>
    l.id === leadId
      ? { ...l, status, notes: notes !== undefined ? notes : l.notes }
      : l
  );

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true };
}

export async function bulkUpdateLeads(leadIds: string[], status: Lead["status"]) {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("leads")
        .update({ status, updated_at: new Date().toISOString() })
        .in("id", leadIds);
    } catch (e) {
      console.error("Supabase bulk update error:", e);
    }
  }

  memoryLeads = memoryLeads.map((l) =>
    leadIds.includes(l.id) ? { ...l, status } : l
  );

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true };
}

export async function bulkDeleteLeads(leadIds: string[]) {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("leads").delete().in("id", leadIds);
    } catch (e) {
      console.error("Supabase bulk delete error:", e);
    }
  }

  memoryLeads = memoryLeads.filter((l) => !leadIds.includes(l.id));

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true };
}

export async function createManualLead(leadData: Omit<Lead, "id" | "created_at">) {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    ...leadData,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("leads").insert([
        {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          service: leadData.service,
          message: leadData.message,
          status: leadData.status,
          metadata: leadData.notes ? { notes: leadData.notes } : {},
        },
      ]);
    } catch (e) {
      console.error("Supabase manual lead create error:", e);
    }
  }

  memoryLeads = [newLead, ...memoryLeads];

  safeRevalidate("/admin");
  safeRevalidate("/admin/leads");
  return { success: true, lead: newLead };
}
