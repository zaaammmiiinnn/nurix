"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { FAQS_DATA } from "@/lib/data/site-data";
import { requireAdmin } from "@/lib/auth/require-admin";

export interface AdminFaq {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

const localFaqsCache: AdminFaq[] = FAQS_DATA.map((f, idx) => ({
  id: `mock-faq-${idx + 1}`,
  question: f.question,
  answer: f.answer,
  category: f.category,
  sort_order: idx + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

export async function getAdminFaqs(): Promise<AdminFaq[]> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item, idx) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          category: item.category || "general",
          sort_order: item.sort_order ?? idx + 1,
          is_active: Boolean(item.is_active),
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      console.warn("Failed fetching FAQs from Supabase:", err);
    }
  }

  return localFaqsCache;
}

export async function createAdminFaq(
  faq: Omit<AdminFaq, "id" | "created_at">
): Promise<{ success: boolean; faq?: AdminFaq; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("faqs")
        .insert([
          {
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            sort_order: faq.sort_order,
            is_active: faq.is_active,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        try {
          revalidatePath("/admin/faqs");
          revalidatePath("/");
          revalidatePath("/pricing");
        } catch {}
        return { success: true, faq: data };
      }
      return { success: false, message: error?.message || "Failed to create FAQ" };
    } catch (err: unknown) {
      console.error("Supabase insert error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}

export async function updateAdminFaq(
  id: string,
  faq: Partial<AdminFaq>
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (faq.question !== undefined) updatePayload.question = faq.question;
      if (faq.answer !== undefined) updatePayload.answer = faq.answer;
      if (faq.category !== undefined) updatePayload.category = faq.category;
      if (faq.sort_order !== undefined) updatePayload.sort_order = faq.sort_order;
      if (faq.is_active !== undefined) updatePayload.is_active = faq.is_active;

      const { error } = await supabaseAdmin
        .from("faqs")
        .update(updatePayload)
        .eq("id", id);

      if (!error) {
        try {
          revalidatePath("/admin/faqs");
          revalidatePath("/");
          revalidatePath("/pricing");
        } catch {}
        return { success: true };
      }
      return { success: false, message: error?.message || "Failed to update FAQ" };
    } catch (err: unknown) {
      console.error("Supabase update error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}

export async function deleteAdminFaq(
  id: string
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("faqs")
        .delete()
        .eq("id", id);

      if (!error) {
        try {
          revalidatePath("/admin/faqs");
          revalidatePath("/");
          revalidatePath("/pricing");
        } catch {}
        return { success: true };
      }
      return { success: false, message: error?.message || "Failed to delete FAQ" };
    } catch (err: unknown) {
      console.error("Supabase delete error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}
