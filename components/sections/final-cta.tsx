"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

const WA_URL =
  "https://wa.me/971501234567?text=Hi%20NeuralWaves%2C%20I%20need%20help%20with%20automation";

export function FinalCta() {
  return (
    <section
      className="relative py-40 px-6 md:px-8 overflow-hidden bg-[#040407] border-t border-white/[0.08] select-none"
      aria-labelledby="cta-heading"
    >
      {/* ── Big radial gradient orb behind (centered, drifting) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.18, 0.28, 0.18],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 40%, transparent 70%)",
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Monospace label */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <span className="w-6 h-[1px] bg-violet-500/40 inline-block" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            07 / GET STARTED
          </span>
        </div>

        {/* Headline: text-5xl font-semibold */}
        <h2
          id="cta-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] text-white mb-6 leading-[1.05]"
        >
          Let&apos;s build something.
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-12 font-normal leading-relaxed">
          15-minute call. No pitch deck. Just scope and price.
        </p>

        {/* Two CTAs (same treatment as hero) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA with gradient border and hover glow */}
          <Link
            href="/contact"
            className="group relative p-[1px] rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] w-full sm:w-auto"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-80 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
            <span className="relative flex items-center justify-center gap-2 px-8 py-4 rounded-[11px] bg-[#0A0A0F] group-hover:bg-violet-950/40 text-sm font-medium text-white transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]">
              Book a 15-min call
              <ArrowRight size={16} className="text-violet-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* WhatsApp CTA glass */}
          <Link
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-medium text-zinc-200 bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl hover:bg-white/[0.1] hover:border-violet-500/40 hover:text-white transition-all duration-200 w-full sm:w-auto"
          >
            <MessageCircle size={17} className="text-emerald-400" />
            WhatsApp us instead
          </Link>
        </div>
      </div>
    </section>
  );
}
