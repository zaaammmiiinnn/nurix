"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const STAGES = [
  {
    step: "01",
    title: "Discover",
    timeline: "1–3 Days",
    desc: "Process audit, technical dependency review, API feasibility check, and fixed-price specification. No ambiguous scope.",
    deliverable: "Architecture Spec & Fixed Quote",
  },
  {
    step: "02",
    title: "Design",
    timeline: "3–5 Days",
    desc: "Workflow state-machines, conversational prompt design, database schemas, and interface wireframes approved by your team.",
    deliverable: "System Blueprint & Staging Plan",
  },
  {
    step: "03",
    title: "Build",
    timeline: "1–3 Weeks",
    desc: "Iterative engineering, Meta Cloud API connections, CRM webhooks, and exhaustive testing with real historical edge cases.",
    deliverable: "Functional Staging Environment",
  },
  {
    step: "04",
    title: "Deploy",
    timeline: "Ongoing Assurance",
    desc: "Production release on your cloud infrastructure, staff training, full code & IP handover, and 30-day warranty support.",
    deliverable: "Live System & 100% IP Transfer",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 50%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      id="process"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas"
      aria-labelledby="process-heading"
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              02 // DELIVERY PHILOSOPHY
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                id="process-heading"
                className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight"
              >
                Disciplined execution. <br className="hidden sm:inline" />
                Zero speculative consulting.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm md:text-base text-olive leading-relaxed font-sans">
                We replace endless discovery meetings with an architectural 4-stage delivery pipeline engineered for speed, transparency, and dependable uptime.
              </p>
            </div>
          </div>
        </div>

        {/* Process Timeline Grid */}
        <div className="relative">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[4%] right-[4%] h-[1px] bg-stone z-0 overflow-hidden">
            <motion.div
              style={{ scaleX: smoothProgress }}
              className="w-full h-full bg-charcoal origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STAGES.map((stage) => (
              <div
                key={stage.step}
                className="flex flex-col justify-between p-6 border border-stone bg-white transition-all hover:border-charcoal/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-9 h-9 flex items-center justify-center font-mono text-sm font-semibold text-charcoal bg-canvas border border-stone">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-mono text-olive uppercase tracking-wider">
                      {stage.timeline}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-xl text-charcoal mb-3">
                    {stage.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans mb-6">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone/60">
                  <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                    KEY DELIVERABLE
                  </span>
                  <span className="font-sans text-xs font-medium text-charcoal">
                    {stage.deliverable}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
