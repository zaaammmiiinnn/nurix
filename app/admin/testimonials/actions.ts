"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth/require-admin";

export interface AdminTestimonial {
  id?: string;
  client_name: string;
  client_role: string;
  company: string;
  content: string;
  avatar_url?: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

const localTestimonialsCache: AdminTestimonial[] = [
  {
    id: "mock-test-1",
    client_name: "Tariq Mansour",
    client_role: "Managing Director",
    company: "Gulf Skyline Real Estate, Dubai",
    content:
      "NeuralWaves delivered our WhatsApp concierge in exactly 5 days. We captured 34 qualified property viewings in our first weekend without our brokers working overtime. Best agency investment we made this year.",
    rating: 5,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-test-2",
    client_name: "Farah Al Hashimi",
    client_role: "Head of Operations",
    company: "Karak Express Hospitality, Abu Dhabi",
    content:
      "Replacing our branch reporting spreadsheets with NeuralWaves's custom admin portal saved our ops managers 15 hours every single week. Fast, direct, zero corporate nonsense.",
    rating: 5,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-test-3",
    client_name: "Vikram Mehta",
    client_role: "Founder & CEO",
    company: "Apex Courier & Freight, Dubai",
    content:
      "Traditional agencies in Dubai quoted us 3 months and AED 60,000 for what NeuralWaves built in 7 business days for a fixed fee. The system is rock solid and handles all our client inquiries.",
    rating: 5,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

export async function getAdminTestimonials(): Promise<AdminTestimonial[]> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item, idx) => ({
          id: item.id,
          client_name: item.client_name,
          client_role: item.client_role || "",
          company: item.company || "",
          content: item.content,
          avatar_url: item.avatar_url || "",
          rating: item.rating ?? 5,
          is_active: Boolean(item.is_active),
          sort_order: item.sort_order ?? idx + 1,
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      console.warn("Failed fetching testimonials from Supabase:", err);
    }
  }

  return localTestimonialsCache;
}

export async function createAdminTestimonial(
  testimonial: Omit<AdminTestimonial, "id" | "created_at">
): Promise<{ success: boolean; testimonial?: AdminTestimonial; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("testimonials")
        .insert([
          {
            client_name: testimonial.client_name,
            client_role: testimonial.client_role,
            company: testimonial.company,
            content: testimonial.content,
            avatar_url: testimonial.avatar_url,
            rating: testimonial.rating,
            is_active: testimonial.is_active,
            sort_order: testimonial.sort_order,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        try {
          revalidatePath("/admin/testimonials");
          revalidatePath("/");
        } catch {}
        return { success: true, testimonial: data };
      }
      return { success: false, message: error?.message || "Failed to create testimonial" };
    } catch (err: unknown) {
      console.error("Supabase insert error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}

export async function updateAdminTestimonial(
  id: string,
  testimonial: Partial<AdminTestimonial>
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (testimonial.client_name !== undefined)
        updatePayload.client_name = testimonial.client_name;
      if (testimonial.client_role !== undefined)
        updatePayload.client_role = testimonial.client_role;
      if (testimonial.company !== undefined) updatePayload.company = testimonial.company;
      if (testimonial.content !== undefined) updatePayload.content = testimonial.content;
      if (testimonial.avatar_url !== undefined) updatePayload.avatar_url = testimonial.avatar_url;
      if (testimonial.rating !== undefined) updatePayload.rating = testimonial.rating;
      if (testimonial.is_active !== undefined) updatePayload.is_active = testimonial.is_active;
      if (testimonial.sort_order !== undefined) updatePayload.sort_order = testimonial.sort_order;

      const { error } = await supabaseAdmin
        .from("testimonials")
        .update(updatePayload)
        .eq("id", id);

      if (!error) {
        try {
          revalidatePath("/admin/testimonials");
          revalidatePath("/");
        } catch {}
        return { success: true };
      }
      return { success: false, message: error?.message || "Failed to update testimonial" };
    } catch (err: unknown) {
      console.error("Supabase update error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}

export async function deleteAdminTestimonial(
  id: string
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (!error) {
        try {
          revalidatePath("/admin/testimonials");
          revalidatePath("/");
        } catch {}
        return { success: true };
      }
      return { success: false, message: error?.message || "Failed to delete testimonial" };
    } catch (err: unknown) {
      console.error("Supabase delete error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}
