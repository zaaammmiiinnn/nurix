"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/data/site-data";

export interface SettingRecord {
  key: string;
  value: string;
  description?: string;
}

// In-memory fallback
let localSettingsCache: Record<string, string> = {
  whatsapp_number: SITE_CONFIG.contact.whatsapp,
  contact_email: SITE_CONFIG.contact.email,
  contact_phone: SITE_CONFIG.contact.phone,
  calendar_url: SITE_CONFIG.contact.calUrl,
  social_linkedin: SITE_CONFIG.socials.linkedin,
  social_instagram: "https://instagram.com/neuralwaves.in",
  studio_address: `${SITE_CONFIG.address.streetAddress}, ${SITE_CONFIG.address.addressLocality}, ${SITE_CONFIG.location}`,
};

export async function getAdminSettings(): Promise<Record<string, string>> {
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

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/settings");
      revalidatePath("/");
      revalidatePath("/contact");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save settings";
      return { success: false, message };
    }
  }

  localSettingsCache = { ...localSettingsCache, ...settings };
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}

export async function deleteAdminSetting(
  key: string
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("site_settings")
        .delete()
        .eq("key", key);

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath("/admin/settings");
      revalidatePath("/");
      revalidatePath("/contact");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete setting";
      return { success: false, message };
    }
  }

  delete localSettingsCache[key];
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}

