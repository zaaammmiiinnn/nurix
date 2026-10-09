import React from "react";
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
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/data/site-data";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const isResendConfigured = Boolean(
    process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("YOUR_KEY")
  );

  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Operations · Studio Configuration
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Settings &amp; Infrastructure
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Global communication endpoints, API credentials, and administrative access
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Studio Channels (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Information Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Settings size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Public Communication Channels</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <Phone size={12} className="text-violet-400" /> Landline Phone
                </span>
                <p className="text-sm font-mono text-white font-medium">
                  {SITE_CONFIG.contact.phone}
                </p>
                <span className="text-[10px] text-zinc-500">Official UAE studio line</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-emerald-400" /> Direct WhatsApp
                </span>
                <p className="text-sm font-mono text-white font-medium">
                  {SITE_CONFIG.contact.whatsapp}
                </p>
                <span className="text-[10px] text-zinc-500">Fastest client response channel</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <Mail size={12} className="text-cyan-400" /> Inbound Lead Email
                </span>
                <p className="text-sm font-mono text-white font-medium">
                  {SITE_CONFIG.contact.email}
                </p>
                <span className="text-[10px] text-zinc-500">Direct inquiries &amp; proposals</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <Calendar size={12} className="text-amber-400" /> Native Scope Scheduler
                </span>
                <p className="text-sm font-mono text-white font-medium">
                  Active (GST Timezone)
                </p>
                <span className="text-[10px] text-zinc-500">Next 5 business days, 15-min slots</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <MapPin size={12} className="text-violet-400" /> Studio Headquarters
              </span>
              <p className="text-xs text-white">
                {SITE_CONFIG.address.streetAddress}, {SITE_CONFIG.address.addressLocality},{" "}
                {SITE_CONFIG.location}
              </p>
            </div>
          </div>

          {/* Admin Team Members */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Shield size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Authorized Studio Admins</h2>
            </div>

            <div className="divide-y divide-white/[0.06]">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center font-bold text-xs text-violet-300">
                    Z
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Zamin Askari Rizvi
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      askarizamin110@gmail.com
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Superadmin
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-zinc-400">
                    NW
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      NeuralWaves Operations
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      admin@neuralwaves.in
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Server size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">System Integrations</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Supabase PostgreSQL</span>
                  <span className="text-[10px] font-mono text-zinc-500">Database &amp; Auth</span>
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
                    Onboarding Dev
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">WhatsApp Cloud API</span>
                  <span className="text-[10px] font-mono text-zinc-500">Meta Webhook Handler</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Endpoint Live
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Vercel Edge &amp; Cron</span>
                  <span className="text-[10px] font-mono text-zinc-500">Weekly Lead Digest</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
