import React from "react";
import { CheckCircle2, ShieldCheck, Code2, Globe2 } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Globe2,
    tag: "CROSS-BORDER",
    title: "India & UAE B2B Focus",
    desc: "Bilingual English & Arabic workflows tailored for regional commerce.",
  },
  {
    icon: Code2,
    tag: "INTEGRATION",
    title: "Direct Engineering Access",
    desc: "Work directly with senior developers without agency layer friction.",
  },
  {
    icon: ShieldCheck,
    tag: "GOVERNANCE",
    title: "100% IP & Data Ownership",
    desc: "Your data stays in your infrastructure with zero vendor lock-in.",
  },
  {
    icon: CheckCircle2,
    tag: "STANDARDS",
    title: "Production-Grade AI",
    desc: "Meta Cloud API, Supabase, and deterministic validation pipelines.",
  },
];

export function TrustStrip() {
  return (
    <section
      className="border-b border-stone/80 bg-white/50 py-8 select-none"
      aria-label="Engineering Capabilities"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CAPABILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-4 border border-stone/60 bg-canvas/40 transition-colors hover:border-charcoal/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono-label text-[10px] text-olive tracking-wider">
                      {item.tag}
                    </span>
                    <Icon className="w-4 h-4 text-olive" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-display font-medium text-sm text-charcoal mb-1">
                    {item.title}
                  </h2>
                  <p className="font-sans text-xs text-olive leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
