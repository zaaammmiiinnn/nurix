"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { FAQS_DATA } from "@/lib/data/site-data";

export interface AdminFaq {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

let localFaqsCache: AdminFaq[] = FAQS_DATA.map((f, idx) => ({
  id: `mock-faq-${idx + 1}`,
  question: f.question,
  answer: f.answer,
  category: f.category,
  sort_order: idx + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

export async function getAdminFaqs(): Promise<AdminFaq[]> {
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
  const newFaq: AdminFaq = {
    ...faq,
    id: `faq-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

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

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/faqs");
      revalidatePath("/");
      revalidatePath("/pricing");
      return { success: true, faq: data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create FAQ";
      return { success: false, message };
    }
  }

  localFaqsCache = [...localFaqsCache, newFaq];
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/pricing");
  return { success: true, faq: newFaq };
}

export async function updateAdminFaq(
  id: string,
  faq: Partial<AdminFaq>
): Promise<{ success: boolean; message?: string }> {
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

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/faqs");
      revalidatePath("/");
      revalidatePath("/pricing");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update FAQ";
      return { success: false, message };
    }
  }

  localFaqsCache = localFaqsCache.map((f) =>
    f.id === id ? { ...f, ...faq } : f
  );

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/pricing");
  return { success: true };
}

export async function deleteAdminFaq(
  id: string
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("faqs")
        .delete()
        .eq("id", id);

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/faqs");
      revalidatePath("/");
      revalidatePath("/pricing");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete FAQ";
      return { success: false, message };
    }
  }

  localFaqsCache = localFaqsCache.filter((f) => f.id !== id);
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/pricing");
  return { success: true };
}
