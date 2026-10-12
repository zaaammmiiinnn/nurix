"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { WaveVisual } from "@/components/ui/wave-visual";

interface HeroSectionProps {
  shippedCount?: number;
}

export function HeroSection({ shippedCount: _shippedCount = 0 }: HeroSectionProps) {
  return (
    <section
      className="relative pt-32 md:pt-40 pb-16 md:pb-24 border-b border-stone/80 overflow-hidden"
      aria-label="Hero"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow / Technical Classification */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
              <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
                AI ENGINEERING · AUTOMATION · DIGITAL SYSTEMS
              </p>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] text-charcoal tracking-tight leading-[1.08] mb-6">
              Build less busywork. <br className="hidden sm:inline" />
              <span className="text-charcoal/80">Build a better business.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed max-w-xl mb-10 font-sans">
              We design and deploy AI systems, intelligent workflows, and custom software that
              help businesses operate with greater speed and clarity.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="btn-editorial-primary text-center group"
                id="hero-primary-cta"
              >
                Discuss a Project
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/work"
                className="btn-editorial-secondary text-center group"
                id="hero-secondary-cta"
              >
                Explore Our Work
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Technical Operating Parameters */}
            <div className="mt-12 pt-8 border-t border-stone/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-olive">
              <div>
                <span className="mono-label block text-[10px] text-olive/70 mb-1">TARGET REGIONS</span>
                <span className="font-sans font-medium text-charcoal">UAE & India</span>
              </div>
              <div>
                <span className="mono-label block text-[10px] text-olive/70 mb-1">DEPLOYMENT</span>
                <span className="font-sans font-medium text-charcoal">Meta Cloud · OpenAI · Cloudflare</span>
              </div>
              <div>
                <span className="mono-label block text-[10px] text-olive/70 mb-1">IP OWNERSHIP</span>
                <span className="font-sans font-medium text-charcoal">100% Client Retained</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom NeuralWaves WaveVisual */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Outer architectural corner accents */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-charcoal/40 pointer-events-none z-10" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-charcoal/40 pointer-events-none z-10" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-charcoal/40 pointer-events-none z-10" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-charcoal/40 pointer-events-none z-10" />

              <WaveVisual />
            </div>

            {/* Technical caption below visual */}
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-olive px-1">
              <span>FIG. 01 — DYNAMIC INTELLIGENCE MODEL</span>
              <span>POINTER RESPONSIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
