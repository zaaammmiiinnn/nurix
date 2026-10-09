"use client";

import { Zap, DollarSign, MapPin, Brain } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const BULLETS = [
  {
    icon: DollarSign,
    title: "Fixed price. No hourly billing.",
    description:
      "You know the number before we start. One agreed scope, zero hourly creep, no surprise change requests.",
  },
  {
    icon: Zap,
    title: "5-day delivery, not 5 weeks.",
    description:
      "Most builds ship in 5 working days. No 3-month roadmaps, no agile ceremony theatre. Just production code.",
  },
  {
    icon: MapPin,
    title: "UAE-based. Same timezone.",
    description:
      "Operating from Dubai. Same timezone, fluent Arabic/English AI workflows, UAE compliance and local context.",
  },
  {
    icon: Brain,
    title: "AI-first. Built by engineers, not account managers.",
    description:
      "Direct communication with the engineers building your systems. No layers of non-technical middlemen.",
  },
];

export function WhyNeuralWaves() {
  return (
    <section
      id="why-neuralwaves"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto select-none"
      aria-labelledby="why-heading"
    >
      <SectionHeader
          id="why-heading"
        label="05 / WHY NEURALWAVES"
        title="Why teams pick us over agencies."
        description="We replaced traditional agency fluff with high-speed engineering sprints tailored for UAE business owners."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BULLETS.map((bullet) => {
          const Icon = bullet.icon;
          return (
            <div
              key={bullet.title}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 flex gap-6 hover:border-violet-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon size={20} className="text-violet-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-white text-base leading-snug group-hover:text-violet-200 transition-colors">
                  {bullet.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {bullet.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
