import React from "react";
import Link from "next/link";
import {
  Cpu,
  ExternalLink,
  MessageSquare,
  LayoutDashboard,
  Bot,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { SERVICES_DATA } from "@/lib/data/site-data";

const ICONS = [MessageSquare, LayoutDashboard, Bot];

export default function AdminServicesPage() {
  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Offerings · Core Services
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Services &amp; Capabilities
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Core fixed-price studio offerings, deliverables scope, and starting pricing
          </p>
        </div>

        <Link
          href="/services"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost-border px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <ExternalLink size={14} className="text-zinc-400" />
          View Public Services
        </Link>
      </div>

      {/* ── Services Cards ── */}
      <div className="grid grid-cols-1 gap-6">
        {SERVICES_DATA.map((service, index) => {
          const Icon = ICONS[index] || Cpu;
          return (
            <div
              key={service.slug}
              className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 lg:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-violet-400">{service.number}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active Offering
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">{service.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-white block">
                      {service.pricing}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 flex items-center justify-end gap-1">
                      <Clock size={11} /> {service.delivery}
                    </span>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-border p-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="Open Public Service Page"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-5 space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed max-w-4xl">
                  {service.description}
                </p>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-2">
                    Included Deliverables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {service.deliverables.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-zinc-300"
                      >
                        <CheckCircle2 size={13} className="text-violet-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
