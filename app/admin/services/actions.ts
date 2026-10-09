"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { SERVICES_DATA } from "@/lib/data/site-data";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback when invoked outside Next.js request context
  }
}

export interface AdminService {
  id?: string;
  slug: string;
  title: string;
  number?: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: string;
  delivery_days: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

// In-memory fallback
let localServicesCache: AdminService[] = SERVICES_DATA.map((s, idx) => ({
  id: `mock-srv-${idx + 1}`,
  slug: s.slug,
  title: s.title,
  number: s.number,
  tagline: s.tagline,
  description: s.description,
  features: s.deliverables,
  pricing: s.pricing,
  delivery_days: s.delivery,
  sort_order: idx + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

export async function getAdminServices(): Promise<AdminService[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item, idx) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          number: `0${idx + 1}`,
          tagline: item.tagline || "",
          description: item.description || "",
          features: Array.isArray(item.features) ? item.features : [],
          pricing: item.pricing || "",
          delivery_days: item.delivery_days || "",
          sort_order: item.sort_order ?? idx + 1,
          is_active: Boolean(item.is_active),
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      console.warn("Failed fetching services from Supabase:", err);
    }
  }

  return localServicesCache;
}

export async function createAdminService(
  service: Omit<AdminService, "id" | "created_at">
): Promise<{ success: boolean; service?: AdminService; message?: string }> {
  const newService: AdminService = {
    ...service,
    id: `srv-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("services")
        .insert([
          {
            slug: service.slug,
            title: service.title,
            tagline: service.tagline,
            description: service.description,
            features: service.features,
            pricing: service.pricing,
            delivery_days: service.delivery_days,
            sort_order: service.sort_order,
            is_active: service.is_active,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        safeRevalidate("/admin/services");
        safeRevalidate("/services");
        safeRevalidate(`/services/${service.slug}`);
        safeRevalidate("/");
        return { success: true, service: data };
      }
      console.warn("Supabase insert error (falling back to cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to cache):", err);
    }
  }

  localServicesCache = [...localServicesCache, newService];
  safeRevalidate("/admin/services");
  safeRevalidate("/services");
  safeRevalidate(`/services/${service.slug}`);
  safeRevalidate("/");
  return { success: true, service: newService };
}

export async function updateAdminService(
  id: string,
  service: Partial<AdminService>
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (service.slug !== undefined) updatePayload.slug = service.slug;
      if (service.title !== undefined) updatePayload.title = service.title;
      if (service.tagline !== undefined) updatePayload.tagline = service.tagline;
      if (service.description !== undefined) updatePayload.description = service.description;
      if (service.features !== undefined) updatePayload.features = service.features;
      if (service.pricing !== undefined) updatePayload.pricing = service.pricing;
      if (service.delivery_days !== undefined) updatePayload.delivery_days = service.delivery_days;
      if (service.sort_order !== undefined) updatePayload.sort_order = service.sort_order;
      if (service.is_active !== undefined) updatePayload.is_active = service.is_active;

      const { error } = await supabaseAdmin
        .from("services")
        .update(updatePayload)
        .eq("id", id);

      if (!error) {
        safeRevalidate("/admin/services");
        safeRevalidate("/services");
        if (service.slug) safeRevalidate(`/services/${service.slug}`);
        safeRevalidate("/");
        return { success: true };
      }
      console.warn("Supabase update error (falling back to cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to cache):", err);
    }
  }

  localServicesCache = localServicesCache.map((s) =>
    s.id === id || s.slug === service.slug ? { ...s, ...service } : s
  );

  safeRevalidate("/admin/services");
  safeRevalidate("/services");
  safeRevalidate("/");
  return { success: true };
}

export async function deleteAdminService(
  id: string
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from("services").delete().eq("id", id);
      if (!error) {
        safeRevalidate("/admin/services");
        safeRevalidate("/services");
        safeRevalidate("/");
        return { success: true };
      }
      console.warn("Supabase delete error (falling back to cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to cache):", err);
    }
  }

  localServicesCache = localServicesCache.filter((s) => s.id !== id);
  safeRevalidate("/admin/services");
  safeRevalidate("/services");
  safeRevalidate("/");
  return { success: true };
}
