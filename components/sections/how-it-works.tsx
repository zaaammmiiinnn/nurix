"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description: "30-min call. Scope and price locked.",
  },
  {
    number: "02",
    title: "Build",
    description: "We build. You review in staging.",
  },
  {
    number: "03",
    title: "Launch",
    description: "Deployed. Team trained.",
  },
  {
    number: "04",
    title: "Support",
    description: "30 days free. Then month-to-month.",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 50%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate threshold for glowing each step
  const step1Glow = useTransform(smoothProgress, [0, 0.25], [0.3, 1]);
  const step2Glow = useTransform(smoothProgress, [0.2, 0.5], [0.3, 1]);
  const step3Glow = useTransform(smoothProgress, [0.45, 0.75], [0.3, 1]);
  const step4Glow = useTransform(smoothProgress, [0.7, 1], [0.3, 1]);

  const glows = [step1Glow, step2Glow, step3Glow, step4Glow];

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto relative select-none"
      aria-labelledby="how-heading"
    >
      <SectionHeader
        label="02 / PROCESS"
        title="From brief to live in 5 days."
        description="No 3-month consulting cycles. A crisp 4-step delivery pipeline engineered for speed and certainty."
      />

      <div className="relative mt-20">
        {/* Desktop Connecting Line (horizontal) */}
        <div className="hidden lg:block absolute top-[28px] left-[6%] right-[6%] h-[2px] bg-white/[0.08] z-0 overflow-hidden">
          <motion.div
            style={{ scaleX: smoothProgress }}
            className="w-full h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 origin-left"
          />
        </div>

        {/* Mobile Connecting Line (vertical) */}
        <div className="lg:hidden absolute top-[28px] bottom-[28px] left-[27px] w-[2px] bg-white/[0.08] z-0 overflow-hidden">
          <motion.div
            style={{ scaleY: smoothProgress }}
            className="w-full h-full bg-gradient-to-b from-violet-500 via-cyan-400 to-violet-500 origin-top"
          />
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              style={{ opacity: glows[idx] }}
              className="flex lg:flex-col items-start gap-6 lg:gap-5 group"
            >
              {/* Step indicator circle with glow */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#0B0B10] border border-white/[0.12] group-hover:border-violet-500/50 flex items-center justify-center font-mono text-base font-semibold text-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  {step.number}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-violet-500/10 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Step details */}
              <div className="space-y-2 pt-1 lg:pt-0">
                <h3 className="text-lg font-medium text-white group-hover:text-violet-200 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
