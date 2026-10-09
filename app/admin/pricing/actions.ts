"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { PRICING_TIERS_DATA } from "@/lib/data/site-data";

export interface AdminPricingTier {
  id?: string;
  name: string;
  price: string;
  price_numeric?: number;
  description: string;
  delivery_timeframe: string;
  features: string[];
  cta_label: string;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
}

// In-memory fallback
let localPricingCache: AdminPricingTier[] = PRICING_TIERS_DATA.map((t, idx) => ({
  id: `mock-tier-${idx + 1}`,
  name: t.name,
  price: t.price,
  price_numeric: parseInt(t.price.replace(/[^0-9]/g, "")) || 0,
  description: t.description,
  delivery_timeframe: t.deliveryTimeframe,
  features: t.features,
  cta_label: t.ctaLabel || "Get started",
  is_featured: t.isFeatured,
  sort_order: idx + 1,
  created_at: new Date().toISOString(),
}));

export async function getAdminPricingTiers(): Promise<AdminPricingTier[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("pricing_tiers")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          price_numeric: item.price_numeric,
          description: item.description || "",
          delivery_timeframe: item.delivery_timeframe || "",
          features: Array.isArray(item.features) ? item.features : [],
          cta_label: item.cta_label || "Get started",
          is_featured: Boolean(item.is_featured),
          sort_order: item.sort_order ?? idx + 1,
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      console.warn("Failed fetching pricing tiers from Supabase:", err);
    }
  }

  return localPricingCache;
}

export async function createAdminPricingTier(
  tier: Omit<AdminPricingTier, "id" | "created_at">
): Promise<{ success: boolean; tier?: AdminPricingTier; message?: string }> {
  const newTier: AdminPricingTier = {
    ...tier,
    id: `tier-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("pricing_tiers")
        .insert([
          {
            name: tier.name,
            price: tier.price,
            price_numeric: tier.price_numeric,
            description: tier.description,
            delivery_timeframe: tier.delivery_timeframe,
            features: tier.features,
            cta_label: tier.cta_label,
            is_featured: tier.is_featured,
            sort_order: tier.sort_order,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        try {
          revalidatePath("/admin/pricing");
          revalidatePath("/pricing");
          revalidatePath("/");
        } catch {}
        return { success: true, tier: data };
      }
      console.warn("Supabase insert error (falling back to local cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to local cache):", err);
    }
  }

  localPricingCache = [...localPricingCache, newTier];
  try {
    revalidatePath("/admin/pricing");
    revalidatePath("/pricing");
    revalidatePath("/");
  } catch {}
  return { success: true, tier: newTier };
}

export async function updateAdminPricingTier(
  id: string,
  tier: Partial<AdminPricingTier>
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (tier.name !== undefined) updatePayload.name = tier.name;
      if (tier.price !== undefined) updatePayload.price = tier.price;
      if (tier.price_numeric !== undefined) updatePayload.price_numeric = tier.price_numeric;
      if (tier.description !== undefined) updatePayload.description = tier.description;
      if (tier.delivery_timeframe !== undefined)
        updatePayload.delivery_timeframe = tier.delivery_timeframe;
      if (tier.features !== undefined) updatePayload.features = tier.features;
      if (tier.cta_label !== undefined) updatePayload.cta_label = tier.cta_label;
      if (tier.is_featured !== undefined) updatePayload.is_featured = tier.is_featured;
      if (tier.sort_order !== undefined) updatePayload.sort_order = tier.sort_order;

      const { error } = await supabaseAdmin
        .from("pricing_tiers")
        .update(updatePayload)
        .eq("id", id);

      if (!error) {
        try {
          revalidatePath("/admin/pricing");
          revalidatePath("/pricing");
          revalidatePath("/");
        } catch {}
        return { success: true };
      }
      console.warn("Supabase update error (falling back to local cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to local cache):", err);
    }
  }

  localPricingCache = localPricingCache.map((t) =>
    t.id === id || t.name === tier.name ? { ...t, ...tier } : t
  );

  try {
    revalidatePath("/admin/pricing");
    revalidatePath("/pricing");
    revalidatePath("/");
  } catch {}
  return { success: true };
}

export async function deleteAdminPricingTier(
  id: string
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("pricing_tiers")
        .delete()
        .eq("id", id);

      if (!error) {
        try {
          revalidatePath("/admin/pricing");
          revalidatePath("/pricing");
          revalidatePath("/");
        } catch {}
        return { success: true };
      }
      console.warn("Supabase delete error (falling back to local cache):", error?.message);
    } catch (err: unknown) {
      console.warn("Supabase network error (falling back to local cache):", err);
    }
  }

  localPricingCache = localPricingCache.filter((t) => t.id !== id);
  try {
    revalidatePath("/admin/pricing");
    revalidatePath("/pricing");
    revalidatePath("/");
  } catch {}
  return { success: true };
}
