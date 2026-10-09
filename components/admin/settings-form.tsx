"use client";

import React, { useState } from "react";
import {
  Settings,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  Shield,
  Server,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Share2,
  Plus,
  Trash2,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { updateAdminSettings, deleteAdminSetting } from "@/app/admin/settings/actions";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
  isSupabaseConfigured: boolean;
  isResendConfigured: boolean;
}

export function SettingsForm({
  initialSettings,
  isSupabaseConfigured,
  isResendConfigured,
}: SettingsFormProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCustomRow = () => {
    const formattedKey = newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!formattedKey) {
      toast.error("Please provide a valid setting key name.");
      return;
    }
    if (settings[formattedKey] !== undefined) {
      toast.error("This key already exists. You can edit its value directly.");
      return;
    }
    setSettings((prev) => ({ ...prev, [formattedKey]: newValue.trim() }));
    setNewKey("");
    setNewValue("");
    toast.success(`Key '${formattedKey}' added to pending changes. Click Save.`);
  };

  const handleDeleteRow = async (key: string) => {
    if (!window.confirm(`Delete setting '${key}'?`)) return;
    try {
      const res = await deleteAdminSetting(key);
      if (res.success) {
        setSettings((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        toast.success(`Setting '${key}' removed`);
      } else {
        toast.error(res.message || "Failed to delete setting");
      }
    } catch {
      toast.error("Failed to delete setting");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateAdminSettings(settings);
      if (res.success) {
        toast.success("Site settings updated successfully");
      } else {
        toast.error(res.message || "Failed to update settings");
      }
    } catch {
      toast.error("An error occurred while saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Operations · site_settings Table
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Settings &amp; Infrastructure
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage global dynamic studio endpoints, contact phone lines, and integration configuration
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-glow px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save size={14} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Channels Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Settings size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Public Communication Channels</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <Phone size={12} className="text-violet-400" /> Landline Phone
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ""}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  placeholder="+971 4 812 9400"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">Official UAE studio line</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-emerald-400" /> Direct WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number || ""}
                  onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">Fastest client response channel</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <Mail size={12} className="text-cyan-400" /> Inbound Lead Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="zaminaskari.work@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">Direct inquiries &amp; proposals</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <Calendar size={12} className="text-amber-400" /> Scope Scheduling URL
                </label>
                <input
                  type="text"
                  value={settings.calendar_url || ""}
                  onChange={(e) => handleChange("calendar_url", e.target.value)}
                  placeholder="https://cal.com/neuralwaves/15min"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">Native scope booking link</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <MapPin size={12} className="text-violet-400" /> Studio Location
              </label>
              <input
                type="text"
                value={settings.studio_address || ""}
                onChange={(e) => handleChange("studio_address", e.target.value)}
                placeholder="DIFC Gate Precinct, Building 4, Dubai, UAE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Social Profiles Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Share2 size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Social &amp; Brand Links</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={settings.social_linkedin || ""}
                  onChange={(e) => handleChange("social_linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/neuralwaves"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={settings.social_instagram || ""}
                  onChange={(e) => handleChange("social_instagram", e.target.value)}
                  placeholder="https://instagram.com/neuralwaves.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Status & Team (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Integration Status */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Server size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">System Integrations</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Supabase PostgreSQL</span>
                  <span className="text-[10px] font-mono text-zinc-500">Database &amp; RLS</span>
                </div>
                {isSupabaseConfigured ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} /> Mock Mode
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Resend Email API</span>
                  <span className="text-[10px] font-mono text-zinc-500">Lead notifications</span>
                </div>
                {isResendConfigured ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Dev Fallback
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Meta WhatsApp API</span>
                  <span className="text-[10px] font-mono text-zinc-500">Cloud Webhook</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Live
                </span>
              </div>
            </div>
          </div>

          {/* Admin Team Members */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Shield size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Authorized Admins</h2>
            </div>

            <div className="divide-y divide-white/[0.06]">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center font-bold text-xs text-violet-300">
                    Z
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Zamin Askari Rizvi
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      zaminaskari.work@gmail.com
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Superadmin
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-zinc-400">
                    N
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      NeuralWaves Operations
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      hello@neuralwaves.in
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* ── Dynamic site_settings Key-Value Store ── */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-cyan-400" />
                <h2 className="text-sm font-semibold text-white">
                  Database Key-Value Store (<code>site_settings</code>)
                </h2>
              </div>
              <span className="font-mono text-xs text-zinc-500">
                {Object.keys(settings).length} parameters
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-400">
              Live configuration attributes retrieved dynamically across public pages and backend webhooks.
            </p>

            {/* Existing rows table */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500 pb-1 border-b border-white/[0.06]">
                <div className="col-span-4">Setting Key</div>
                <div className="col-span-7">Configured Value</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {Object.entries(settings).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-12 gap-3 items-center py-1.5 hover:bg-white/[0.02] rounded-lg px-1 transition-colors"
                >
                  <div className="col-span-4 font-mono text-xs text-violet-300 truncate">
                    {key}
                  </div>
                  <div className="col-span-7">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-200 focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(key)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                      title={`Delete ${key}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new key/value row */}
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              <span className="text-xs font-semibold text-white block">
                Add New Configuration Key
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  placeholder="key_name (e.g. hero_notice)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="sm:w-1/3 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <input
                  type="text"
                  placeholder="value (e.g. Q4 booking slots available)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomRow}
                  className="btn-ghost-border px-4 py-2 rounded-xl text-xs font-mono text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus size={13} />
                  Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
