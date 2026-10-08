import React from "react";
import Link from "next/link";
import { ExternalLink, Clock, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { PRICING_TIERS_DATA } from "@/lib/data/site-data";

export default function AdminPricingPage() {
  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Commercial · Pricing Architecture
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Fixed Pricing Tiers (AED)
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Production fixed price tiers for UAE SMEs — zero hourly billing, guaranteed delivery SLAs
          </p>
        </div>

        <Link
          href="/pricing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost-border px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <ExternalLink size={14} className="text-zinc-400" />
          View Public Pricing Table
        </Link>
      </div>

      {/* ── Pricing Tiers Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRICING_TIERS_DATA.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl border p-6 flex flex-col justify-between space-y-6 relative ${
              tier.isFeatured
                ? "border-violet-500/40 bg-gradient-to-b from-violet-500/[0.08] to-transparent shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                : "border-white/[0.08] bg-[#0A0A0F]"
            }`}
          >
            {tier.isFeatured && (
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-violet-500 text-white shadow-md flex items-center gap-1">
                <Sparkles size={10} /> Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                  Tier Package
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">{tier.name}</h2>
                <p className="text-xs text-zinc-400 mt-1">{tier.description}</p>
              </div>

              <div className="pt-2 pb-1 border-y border-white/[0.06]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-mono text-zinc-400">AED</span>
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">/ fixed</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-1">
                  <Clock size={11} className="text-violet-400" />
                  SLA: {tier.deliveryTimeframe}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block">
                  Included Scope
                </span>
                {tier.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-center">
              <span className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" /> 14-Day Post-Launch Warranty
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
