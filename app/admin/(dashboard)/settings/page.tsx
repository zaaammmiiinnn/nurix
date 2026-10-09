import React from "react";
import { getAdminSettings } from "@/app/admin/settings/actions";
import { SettingsForm } from "@/components/admin/settings-form";
import { isSupabaseConfigured } from "@/lib/supabase";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();
  const isResendConfigured = Boolean(
    process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("YOUR_KEY")
  );

  return (
    <SettingsForm
      initialSettings={settings}
      isSupabaseConfigured={isSupabaseConfigured}
      isResendConfigured={isResendConfigured}
    />
  );
}
