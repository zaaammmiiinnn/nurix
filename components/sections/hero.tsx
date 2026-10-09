"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { MessageCircle, ChevronDown, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/ui/reveal";

const WA_URL =
  "https://wa.me/918840936715?text=Hi%20NeuralWaves%2C%20I%20need%20help%20with%20automation";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax shift for orb 1 (±10px) and orb 2 (opposite ±8px)
  const orb1X = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const orb1Y = useTransform(smoothMouseY, [-1, 1], [-12, 12]);
  const orb2X = useTransform(smoothMouseX, [-1, 1], [10, -10]);
  const orb2Y = useTransform(smoothMouseY, [-1, 1], [10, -10]);

  // Scroll opacity for chevron indicator
  const { scrollY } = useScroll();
  const chevronOpacity = useTransform(scrollY, [0, 100], [0.6, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 select-none"
      aria-label="Hero"
    >
      {/* ── Layer 1 & 2: Background orbs with Framer Motion drift & mouse parallax ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Orb 1: Violet (blur 140px, drifts ±40px, 14s loop) */}
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <motion.div
            animate={{
              x: [-40, 40, -40],
              y: [-25, 30, -25],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[620px] h-[520px] rounded-full blur-[140px] opacity-25"
            style={{
              background: "radial-gradient(circle, #8B5CF6 0%, #6D28D9 50%, transparent 75%)",
            }}
          />
        </motion.div>

        {/* Orb 2: Cyan (smaller, opposite drift phase, blur 120px, 8% opacity) */}
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute left-[48%] top-[35%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <motion.div
            animate={{
              x: [35, -35, 35],
              y: [20, -25, 20],
              scale: [1.06, 0.95, 1.06],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="w-[450px] h-[380px] rounded-full blur-[120px] opacity-[0.14]"
            style={{
              background: "radial-gradient(circle, #22D3EE 0%, #0284C7 60%, transparent 75%)",
            }}
          />
        </motion.div>
      </div>

      {/* ── Layer 3: Grid overlay with radial mask ── */}
      <div
        className="absolute inset-0 pointer-events-none hero-grid-mask"
        aria-hidden="true"
      />

      {/* ── Layer 4: Noise texture overlay at 4% opacity with mix-blend-overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* ── Main Hero Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Badge: Live indicator dot (pulsing green) + "Available for Q4 2026 projects" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-8 hover:border-white/20 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs tracking-wider uppercase text-zinc-300">
            Available for Q4 2026 projects
          </span>
        </motion.div>

        {/* Headline: text-[72px] md:text-[96px], tracking -0.04em, leading 0.95, weight 600 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-[64px] sm:text-[76px] md:text-[96px] font-semibold tracking-[-0.04em] leading-[0.95] text-white mb-6"
        >
          AI that{" "}
          <span className="animated-gradient-text inline-block">
            ships.
          </span>
        </motion.h1>

        {/* Subhead: max-width 560px, text-lg text-zinc-400, + small mono line below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-[560px] mx-auto mb-10 space-y-3"
        >
          <p className="text-lg text-zinc-400 leading-relaxed font-normal">
            Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.
          </p>
          <p className="font-mono text-xs text-zinc-500 tracking-wider">
            • 50% upfront • Delivered in days
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          {/* "See pricing" with gradient border, glow shadow, scale 1.02 on hover */}
          <Link
            href="/pricing"
            className="group relative p-[1px] rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] w-full sm:w-auto"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 transition-opacity duration-300 opacity-80 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="relative flex items-center justify-center gap-2 px-7 py-3.5 rounded-[11px] bg-[#0A0A0F] group-hover:bg-violet-950/40 text-sm font-medium text-white transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]">
              See pricing
              <ArrowRight size={16} className="text-violet-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* "WhatsApp us" glass with backdrop blur, hover glow */}
          <Link
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium text-zinc-200 bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl hover:bg-white/[0.1] hover:border-violet-500/40 hover:text-white transition-all duration-200 w-full sm:w-auto hover:shadow-[0_0_24px_rgba(255,255,255,0.06)]"
          >
            <MessageCircle size={17} className="text-emerald-400" />
            WhatsApp us
          </Link>
        </motion.div>

        {/* 3 Mini stats in a row: monospace labels, count-up on mount */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-3 gap-4 sm:gap-12 pt-6 border-t border-white/[0.06] w-full max-w-xl text-center"
        >
          <div className="flex flex-col items-center">
            <span className="font-mono text-xl sm:text-2xl font-semibold text-white">
              <CountUp value={12} suffix="+" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
              projects shipped
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/[0.06] px-2 sm:px-4">
            <span className="font-mono text-xl sm:text-2xl font-semibold text-white">
              <CountUp value={5} suffix="-day" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
              avg delivery
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-mono text-xl sm:text-2xl font-semibold text-white">
              UAE
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
              based
            </span>
          </div>
        </motion.div>

        {/* Scroll indicator: subtle animated chevron, fades on scroll */}
        <motion.div
          style={{ opacity: chevronOpacity }}
          className="mt-12 flex flex-col items-center gap-1.5 pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-zinc-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
