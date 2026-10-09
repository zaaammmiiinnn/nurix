import React from "react";
import Link from "next/link";
import {
  Users,
  Inbox,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { getLeads } from "@/app/admin/leads/actions";
import { getAdminProjects } from "@/app/admin/portfolio/actions";

export default async function AdminDashboardPage() {
  const [leads, projects] = await Promise.all([
    getLeads(),
    getAdminProjects(),
  ]);

  // Metrics computation
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;

  const totalProjectsCount = projects.length;
  const featuredProjectsCount = projects.filter((p) => p.is_featured).length;

  const recentLeads = leads.slice(0, 8);

  // 14-day mock chart data
  const days = [
    { day: "Sep 24", count: 2 },
    { day: "Sep 25", count: 3 },
    { day: "Sep 26", count: 1 },
    { day: "Sep 27", count: 4 },
    { day: "Sep 28", count: 2 },
    { day: "Sep 29", count: 5 },
    { day: "Sep 30", count: 3 },
    { day: "Oct 01", count: 6 },
    { day: "Oct 02", count: 4 },
    { day: "Oct 03", count: 5 },
    { day: "Oct 04", count: 7 },
    { day: "Oct 05", count: 4 },
    { day: "Oct 06", count: 8 },
    { day: "Oct 07", count: 6 },
  ];

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header & Quick Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Executive Overview
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Real-time pipeline, inbound inquiries, and active deployments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads?create=true"
            className="btn-ghost-border px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} className="text-violet-400" />
            Add Lead Manually
          </Link>
          <Link
            href="/admin/portfolio"
            className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
          >
            <Plus size={14} />
            Add Project
          </Link>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Leads this week */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Leads this week</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {totalLeads}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={12} /> +28%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {contactedLeads} currently in active discussion
          </p>
        </div>

        {/* Card 2: New leads */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>New Inbound</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Inbox size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {newLeads}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
              Needs Reply
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Average response time: 24 mins
          </p>
        </div>

        {/* Card 3: Won / Closed */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Deals Won</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {wonLeads}
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              AED 28,500
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            50% deposit received across 3 active sprints
          </p>
        </div>

        {/* Card 4: Total Projects */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-zinc-300">
              <FolderKanban size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {totalProjectsCount}
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {featuredProjectsCount} Featured
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Active client deployments in database
          </p>
        </div>
      </div>

      {/* ── 14-Day Inbound Chart ── */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white">
              Inbound Pipeline Activity (Last 14 Days)
            </h3>
            <p className="text-xs text-zinc-500 font-mono">
              Daily website inquiries and WhatsApp inbound chats
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Peak: {maxCount} inquiries/day
          </span>
        </div>

        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-2 h-36 px-2">
            {days.map((item, idx) => {
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-md bg-gradient-to-t from-violet-600/40 via-violet-500/70 to-cyan-400/90 group-hover:brightness-125 transition-all cursor-pointer"
                  />
                  <span className="text-[9px] font-mono text-zinc-500 truncate w-full text-center">
                    {item.day.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Leads Table (Last 8) ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white">Recent Leads</h3>
            <p className="text-xs text-zinc-500 font-mono">
              Inbound scopes submitted through contact form and WhatsApp
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-mono text-violet-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            View all ({leads.length}) <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5">Lead / Company</th>
                <th className="py-3 px-5">Service</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentLeads.map((lead) => {
                const statusStyles = {
                  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
                  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                  lost: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                  archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
                };

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {lead.company || lead.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-zinc-300 capitalize">
                      {lead.service}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${
                          statusStyles[lead.status]
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-zinc-500">
                      {new Date(lead.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/leads?id=${lead.id}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-violet-400 hover:text-white transition-colors"
                      >
                        Open <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
