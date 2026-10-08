"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const PROJECTS = [
  {
    slug: "realestate-whatsapp-bot",
    tag: "AI Chatbot",
    title: "WhatsApp Lead Concierge for Dubai Brokerage",
    metric: "3× lead capture rate",
    url: "dxb-realestate.ai/lead-desk",
    accent: "from-violet-600/30 via-violet-950/20 to-black",
    preview: (
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-[11px] font-mono text-zinc-400">Palm Jumeirah Villa Inquiry</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">QUALIFIED</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-zinc-300">
          <p className="text-zinc-500">Client: &ldquo;Looking for 4-bed villa with private pool under 18M AED&rdquo;</p>
          <p className="text-violet-300">AI Bot: Matched 3 listings · Viewing booked for Thursday 4:00 PM</p>
        </div>
      </div>
    ),
  },
  {
    slug: "logistics-dashboard",
    tag: "Admin Dashboard",
    title: "Fleet Dispatch & Route Dashboard for UAE Logistics",
    metric: "12 hrs/week saved in dispatch",
    url: "portal.gulf-fleet.ae/live",
    accent: "from-cyan-600/25 via-blue-950/20 to-black",
    preview: (
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-[11px] font-mono text-zinc-400">Live Dispatches (DXB ⇄ AUH)</span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">28 ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white/[0.04] p-2 rounded border border-white/[0.06]">
            <span className="text-[9px] text-zinc-500 block">Avg Delivery</span>
            <span className="font-mono text-white text-xs">42 mins</span>
          </div>
          <div className="bg-white/[0.04] p-2 rounded border border-white/[0.06]">
            <span className="text-[9px] text-zinc-500 block">Fuel Optimized</span>
            <span className="font-mono text-emerald-400 text-xs">-18.4%</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "ecommerce-agent",
    tag: "Demo · AI Agent",
    title: "Autonomous Stock & Price Monitor for E-Commerce",
    metric: "Daily reports, zero manual work",
    url: "agent.retail-uae.com/sync",
    accent: "from-purple-600/25 via-indigo-950/20 to-black",
    preview: (
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-[11px] font-mono text-zinc-400">Inventory Sync Agent</span>
          <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">DEMO</span>
        </div>
        <div className="space-y-1 text-[11px] font-mono text-zinc-400">
          <p className="flex justify-between"><span>Noon Store:</span><span className="text-zinc-200">1,420 synced</span></p>
          <p className="flex justify-between"><span>Amazon UAE:</span><span className="text-zinc-200">890 synced</span></p>
          <p className="text-[10px] text-emerald-400 pt-1">Report emailed to founders at 08:00 AM</p>
        </div>
      </div>
    ),
  },
];

export function FeaturedWork() {
  return (
    <section
      id="work"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto"
      aria-labelledby="work-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <SectionHeader
          label="03 / WORK"
          title="Recent builds."
          description="Every system is custom-built, stress-tested in production, and delivering measurable returns in hours, not quarters."
          className="mb-0 md:mb-0"
        />

        <Link
          href="/work"
          className="hidden md:inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-white transition-colors group mb-4"
        >
          View all case studies
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden flex flex-col transition-all duration-300 hover:border-violet-500/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] relative"
          >
            {/* Browser Chrome Container */}
            <div className="p-3 pb-0">
              <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
                {/* Browser Top Bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/[0.06]">
                  {/* macOS fake dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>

                  {/* URL Bar */}
                  <div className="px-3 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-zinc-500 truncate max-w-[180px]">
                    https://{project.url}
                  </div>

                  <div className="w-6" />
                </div>

                {/* Preview Window with scale on hover */}
                <div className="relative h-44 overflow-hidden bg-gradient-to-b transition-transform duration-500 group-hover:scale-[1.03]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {project.preview}
                  </div>
                  {/* Subtle hover darkening */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-1 justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-violet-300 border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 rounded-full">
                    {project.tag}
                  </span>
                  <span className="font-mono text-xs text-cyan-400 font-medium">
                    {project.metric}
                  </span>
                </div>

                <h3 className="font-medium text-white text-base leading-snug group-hover:text-violet-200 transition-colors">
                  {project.title}
                </h3>
              </div>

              {/* Bottom "View case study →" slide on hover */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-white transition-colors">
                <span>Case study</span>
                <span className="inline-flex items-center gap-1 text-violet-400 group-hover:translate-x-1 transition-all duration-200">
                  View case study <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-white"
        >
          View all case studies <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
