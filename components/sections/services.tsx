"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MessageSquare, LayoutDashboard, Bot, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

// Card wrapper with radial cursor spotlight effect
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] group ${className}`}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.12), transparent 40%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}

// 1. Chatbot micro-animation: Sequential chat bubbles loop
function ChatbotMockup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const messages = [
    { sender: "user", text: "Can I book a VIP tour in Palm Jumeirah for tomorrow?" },
    { sender: "bot", text: "Slots available at 11:30 AM & 3:00 PM. Which suits you?" },
    { sender: "user", text: "3:00 PM works perfect." },
    { sender: "bot", text: "Confirmed! Booking ref #DXB-942 sent to your WhatsApp." },
  ];

  return (
    <div className="w-full bg-[#0B0B10]/80 rounded-xl border border-white/[0.06] p-4 font-sans text-xs space-y-2.5 backdrop-blur-md shadow-inner">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[10px] font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          WhatsApp AI Concierge
        </span>
        <span>Online</span>
      </div>

      {messages.map((msg, idx) => {
        const isVisible = idx <= activeStep;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{
              opacity: isVisible ? 1 : 0.25,
              y: isVisible ? 0 : 4,
              scale: isVisible ? 1 : 0.98,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-3.5 py-2 rounded-xl text-[12px] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-violet-600/30 text-violet-100 border border-violet-500/30 rounded-br-none"
                  : "bg-white/[0.06] text-zinc-300 border border-white/[0.08] rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// 2. Dashboard micro-animation: Bars grow from 0 to height on view
function DashboardMockup() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const bars = [
    { label: "Mon", height: "45%" },
    { label: "Tue", height: "65%" },
    { label: "Wed", height: "90%" },
    { label: "Thu", height: "70%" },
    { label: "Fri", height: "85%" },
    { label: "Sat", height: "60%" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0B0B10]/80 rounded-xl border border-white/[0.06] p-4 font-sans text-xs space-y-3 backdrop-blur-md shadow-inner"
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span>Weekly Inquiries</span>
        <span className="text-emerald-400 font-medium">+34% vs last wk</span>
      </div>

      <div className="flex items-end justify-between h-24 pt-4 px-1 gap-2">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: isInView ? bar.height : "0%" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="w-full rounded-t bg-gradient-to-t from-violet-600/40 to-cyan-400/80 hover:brightness-125 transition-all"
            />
            <span className="text-[9px] font-mono text-zinc-500">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. AI Agents micro-animation: SVG nodes connected with animated stroke-dashoffset
function AgentsMockup() {
  return (
    <div className="w-full bg-[#0B0B10]/80 rounded-xl border border-white/[0.06] p-4 font-sans text-xs flex flex-col justify-center backdrop-blur-md shadow-inner min-h-[140px] relative overflow-hidden">
      <div className="relative flex items-center justify-between z-10 px-2 py-4">
        {/* Node 1 */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[10px] font-mono text-violet-300">
            RAW
          </div>
          <span className="text-[9px] font-mono text-zinc-500">Scrape</span>
        </div>

        {/* Node 2 */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono text-cyan-300">
            LLM
          </div>
          <span className="text-[9px] font-mono text-zinc-500">Enrich</span>
        </div>

        {/* Node 3 */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono text-emerald-300">
            CRM
          </div>
          <span className="text-[9px] font-mono text-zinc-500">Sync</span>
        </div>
      </div>

      {/* SVG Connecting Paths with animated pulse */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <line
          x1="22%"
          y1="48%"
          x2="50%"
          y2="48%"
          stroke="rgba(139, 92, 246, 0.4)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="50%"
          y1="48%"
          x2="78%"
          y2="48%"
          stroke="rgba(34, 211, 238, 0.4)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto"
      aria-labelledby="services-heading"
    >
      <SectionHeader
        label="01 / SERVICES"
        title="Three things we do. Done properly."
        description="We don't do 50 different things. We master conversational bots, client dashboards, and autonomous workflow engines for UAE companies."
      />

      {/* Bento Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1 (Chatbots) — spans 2 cols, tall */}
        <div className="lg:col-span-2">
          <SpotlightCard className="p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <MessageSquare size={22} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-white mb-2">
                    AI Chatbots & WhatsApp Automation
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Menu bots, AI replies, and human handoff — on the app your customers already use.
                  </p>
                </div>
                <Link
                  href="/services/chatbots"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-cyan-400 transition-colors pt-2 group-hover:translate-x-1 duration-200"
                >
                  Learn more <ArrowRight size={15} />
                </Link>
              </div>

              <div className="lg:col-span-6">
                <ChatbotMockup />
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Card 2 (Dashboards) — 1 col, square */}
        <div className="lg:col-span-1">
          <SpotlightCard className="h-full justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <LayoutDashboard size={22} className="text-violet-400" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 border border-white/[0.08] px-2.5 py-1 rounded-full">
                  App Router
                </span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Web & Admin Dashboards
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Custom dashboards for the operations you&apos;re running on spreadsheets.
                </p>
              </div>
              <DashboardMockup />
            </div>

            <div className="pt-6">
              <Link
                href="/services/dashboards"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-cyan-400 transition-colors group-hover:translate-x-1 duration-200"
              >
                Learn more <ArrowRight size={15} />
              </Link>
            </div>
          </SpotlightCard>
        </div>

        {/* Card 3 (AI Agents) — 1 col, square */}
        <div className="lg:col-span-1">
          <SpotlightCard className="h-full justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Bot size={22} className="text-violet-400" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 border border-white/[0.08] px-2.5 py-1 rounded-full">
                  Autonomous
                </span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  AI Agents for Business
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Lead gen, scraping, reporting. Agents that work while you sleep.
                </p>
              </div>
              <AgentsMockup />
            </div>

            <div className="pt-6">
              <Link
                href="/services/agents"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-cyan-400 transition-colors group-hover:translate-x-1 duration-200"
              >
                Learn more <ArrowRight size={15} />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
