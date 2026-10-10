"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/data/site-data";
import { requireAdmin } from "@/lib/auth/require-admin";

export interface SettingRecord {
  key: string;
  value: string;
  description?: string;
}

// In-memory fallback
const localSettingsCache: Record<string, string> = {
  whatsapp_number: SITE_CONFIG.contact.whatsapp,
  contact_email: SITE_CONFIG.contact.email,
  contact_phone: SITE_CONFIG.contact.phone,
  calendar_url: SITE_CONFIG.contact.calUrl,
  social_linkedin: SITE_CONFIG.socials.linkedin,
  social_instagram: "https://instagram.com/neuralwaves.in",
  studio_address: `${SITE_CONFIG.address.streetAddress}, ${SITE_CONFIG.address.addressLocality}, ${SITE_CONFIG.location}`,
};

export async function getAdminSettings(): Promise<Record<string, string>> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from("site_settings").select("key, value");
      if (!error && data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((row) => {
          map[row.key] = row.value;
        });
        return { ...localSettingsCache, ...map };
      }
    } catch (err) {
      console.warn("Failed fetching site_settings from Supabase:", err);
    }
  }

  return localSettingsCache;
}

export async function updateAdminSettings(
  settings: Record<string, string>
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const upsertRows = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabaseAdmin
        .from("site_settings")
        .upsert(upsertRows, { onConflict: "key" });

      if (!error) {
        try {
          revalidatePath("/admin/settings");
          revalidatePath("/");
          revalidatePath("/contact");
        } catch {}
        return { success: true };
      }
      return { success: false, message: error?.message || "Failed to update settings in database" };
    } catch (err: unknown) {
      console.error("Supabase settings update error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}

export async function deleteAdminSetting(
  key: string
): Promise<{ success: boolean; message?: string }> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("site_settings")
        .delete()
        .eq("key", key);

      if (!error) {
        try {
          revalidatePath("/admin/settings");
          revalidatePath("/");
          revalidatePath("/contact");
        } catch {}
        return { success: true };
      }
      return { success: false, message: error?.message || "Failed to delete setting from database" };
    } catch (err: unknown) {
      console.error("Supabase settings delete error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Database error" };
    }
  }

  return { success: false, message: "Database is unconfigured" };
}

