"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServiceItem } from "@/lib/data/site-data";

export function ServicesSection({ services: _services }: { services?: ServiceItem[] } = {}) {
  // WhatsApp simulation state
  const [chatStep, setChatStep] = useState(2);
  const sampleChats = [
    { sender: "user", text: "Hi, do you have 3-bedroom villas available in Dubai Hills under AED 4.2M?" },
    { sender: "bot", text: "Yes. We have 2 verified listings matching your budget. Would you like the brochure and virtual tour link on WhatsApp?" },
    { sender: "user", text: "Please send the brochure and arrange a callback for tomorrow 3 PM." },
    { sender: "bot", text: "Brochure dispatched. CRM updated & inspection scheduled with senior advisor for tomorrow at 3:00 PM GST." },
  ];

  return (
    <section
      id="services"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas"
      aria-labelledby="services-heading"
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              01 // CORE ENGINEERING CAPABILITIES
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                id="services-heading"
                className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight"
              >
                Disciplined AI engineering. <br className="hidden sm:inline" />
                Tailored for high-velocity operations.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm md:text-base text-olive leading-relaxed font-sans">
                We avoid generic agency bloat. We focus strictly on three high-impact digital systems that drive measurable commercial throughput in India and the UAE.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Core Services in Varied Editorial Layouts */}
        <div className="space-y-16 md:space-y-24">
          {/* Service 1: AI Chatbots & WhatsApp Automation (Split Layout) */}
          <div className="border border-stone bg-white p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="mono-label text-[11px] text-olive">SERVICE 01</span>
                  <span className="text-stone">/</span>
                  <span className="mono-label text-[11px] text-charcoal">CONVERSATIONAL ENGINE</span>
                </div>
                <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-charcoal tracking-tight">
                  AI Chatbots & WhatsApp Automation
                </h3>
                <p className="text-sm sm:text-base text-olive leading-relaxed">
                  Turn high-frequency inbound inquiries into validated leads, calendar appointments, and automated CRM records on WhatsApp and web—in English and Arabic.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-2.5 text-xs text-charcoal">
                    <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                    <span>Official Meta WhatsApp Business Cloud API integration (no third-party markup)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-charcoal">
                    <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                    <span>Real-time CRM sync (HubSpot, Salesforce, Zoho, Google Sheets)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-charcoal">
                    <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                    <span>Intelligent human handover when complex negotiation is required</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/services/ai-chatbots"
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-charcoal font-medium border-b border-charcoal pb-1 transition-colors hover:text-olive hover:border-olive group"
                  >
                    View chatbot architecture & live simulator
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Bespoke Interactive WhatsApp Simulation Panel */}
              <div className="lg:col-span-6">
                <div className="border border-stone/90 bg-canvas/70 p-5 md:p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone text-[11px] font-mono text-olive">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      <span className="text-charcoal font-medium">WhatsApp AI Concierge</span>
                    </div>
                    <span>META CLOUD API</span>
                  </div>

                  <div className="space-y-3 min-h-[220px]">
                    {sampleChats.slice(0, chatStep + 1).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 text-xs leading-relaxed border ${
                            msg.sender === "user"
                              ? "bg-charcoal text-white border-charcoal"
                              : "bg-white text-charcoal border-stone"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span
                            className={`block text-[9px] font-mono mt-1 ${
                              msg.sender === "user" ? "text-stone/70 text-right" : "text-olive"
                            }`}
                          >
                            {msg.sender === "user" ? "CLIENT" : "SYSTEM · 18ms"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone flex items-center justify-between">
                    <span className="text-[10px] font-mono text-olive uppercase">INTERACTIVE DEMO</span>
                    <button
                      type="button"
                      onClick={() => setChatStep((prev) => (prev >= 3 ? 1 : prev + 1))}
                      className="text-xs font-mono text-charcoal underline hover:text-olive cursor-pointer"
                    >
                      {chatStep >= 3 ? "Reset Dialog" : "Simulate Next Turn →"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service 2: AI Agents & Business Workflows (Dark Contrast Editorial Section) */}
          <div className="border border-charcoal bg-charcoal text-white p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="mono-label text-[11px] text-stone/70">SERVICE 02</span>
                  <span className="text-stone/40">/</span>
                  <span className="mono-label text-[11px] text-stone">AUTONOMOUS WORKFLOWS</span>
                </div>
                <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                  AI Agents & Business Workflows
                </h3>
                <p className="text-sm sm:text-base text-stone/80 leading-relaxed font-sans">
                  From multi-step document intake to automated invoice parsing and compliance reconciliation—deploy intelligent agents that safely handle business rules without manual intervention.
                </p>

                <div className="space-y-2.5 pt-2 text-stone/90 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-stone shrink-0 mt-0.5" />
                    <span>Deterministic guardrails and human approval checkpoints for sensitive tasks</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-stone shrink-0 mt-0.5" />
                    <span>Automated structured data extraction from PDFs, scanned bills, and contracts</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-stone shrink-0 mt-0.5" />
                    <span>Audit trail logs recording every decision, tool call, and state change</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/services/ai-agents"
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-white font-medium border-b border-white pb-1 transition-colors hover:text-stone hover:border-stone group"
                  >
                    Explore agent pipeline architecture
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Workflow Pipeline Diagram */}
              <div className="lg:col-span-6">
                <div className="border border-white/20 bg-black/40 p-5 md:p-6 space-y-3 font-mono text-xs">
                  <div className="text-[10px] text-stone/60 uppercase tracking-wider pb-2 border-b border-white/10 flex justify-between">
                    <span>AGENT PIPELINE ARCHITECTURE</span>
                    <span>DETERMINISTIC RUNTIME</span>
                  </div>

                  {/* Stage 1 */}
                  <div className="flex items-center gap-3 p-2.5 border border-white/10 bg-white/[0.04]">
                    <span className="text-[10px] text-stone/60">01</span>
                    <span className="font-semibold text-white">Incoming Request</span>
                    <span className="text-[10px] text-stone/60 ml-auto">PDF / Webhook</span>
                  </div>
                  <div className="text-center text-stone/40 text-xs">↓</div>

                  {/* Stage 2 */}
                  <div className="flex items-center gap-3 p-2.5 border border-white/10 bg-white/[0.04]">
                    <span className="text-[10px] text-stone/60">02</span>
                    <span className="font-semibold text-white">Extract & Validate Data</span>
                    <span className="text-[10px] text-stone/60 ml-auto">OCR + LLM Schema</span>
                  </div>
                  <div className="text-center text-stone/40 text-xs">↓</div>

                  {/* Stage 3 */}
                  <div className="flex items-center gap-3 p-2.5 border border-white/10 bg-white/[0.04]">
                    <span className="text-[10px] text-stone/60">03</span>
                    <span className="font-semibold text-white">Human Approval Gate</span>
                    <span className="text-[10px] text-amber-300 ml-auto">Policy Check</span>
                  </div>
                  <div className="text-center text-stone/40 text-xs">↓</div>

                  {/* Stage 4 */}
                  <div className="flex items-center gap-3 p-2.5 border border-white/10 bg-white/[0.04]">
                    <span className="text-[10px] text-stone/60">04</span>
                    <span className="font-semibold text-white">ERP / CRM Writeback</span>
                    <span className="text-[10px] text-emerald-400 ml-auto">Dispatched</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service 3: Web Applications & Admin Dashboards */}
          <div className="border border-stone bg-white p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="mono-label text-[11px] text-olive">SERVICE 03</span>
                  <span className="text-stone">/</span>
                  <span className="mono-label text-[11px] text-charcoal">OPERATIONAL INTERFACES</span>
                </div>
                <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-charcoal tracking-tight">
                  Web Applications & Admin Dashboards
                </h3>
                <p className="text-sm sm:text-base text-olive leading-relaxed">
                  Replace fragile spreadsheets and disconnected SaaS tools with fast, bespoke web apps built on Next.js, Postgres, and high-performance cloud backends.
                </p>

                <div className="space-y-2.5 pt-2 text-xs text-charcoal">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                    <span>Role-based access control (RBAC), SSO, and audit-ready permissions</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                    <span>Live real-time dashboards with low-latency Supabase WebSockets</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                    <span>Responsive mobile viewports tailored for field teams and managers</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/services/web-apps"
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-charcoal font-medium border-b border-charcoal pb-1 transition-colors hover:text-olive hover:border-olive group"
                  >
                    View dashboard demo & capabilities
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Dashboard Preview Graphic */}
              <div className="lg:col-span-6">
                <div className="border border-stone bg-canvas/60 p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone text-[11px] font-mono text-olive">
                    <span>OPS_DASHBOARD // RESTAURANT_PORTAL</span>
                    <span className="text-emerald-700 font-medium">LIVE STREAM</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white border border-stone">
                      <span className="text-[10px] font-mono text-olive block mb-1">TOTAL ORDERS</span>
                      <span className="text-xl font-display font-medium text-charcoal">1,428</span>
                    </div>
                    <div className="p-3 bg-white border border-stone">
                      <span className="text-[10px] font-mono text-olive block mb-1">AVG TIME</span>
                      <span className="text-xl font-display font-medium text-charcoal">14.2m</span>
                    </div>
                    <div className="p-3 bg-white border border-stone">
                      <span className="text-[10px] font-mono text-olive block mb-1">BOT RESOLVED</span>
                      <span className="text-xl font-display font-medium text-charcoal">94.8%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-stone space-y-2">
                    <div className="flex justify-between text-[11px] font-mono text-olive">
                      <span>PEAK HOURLY LOAD</span>
                      <span>85% OPTIMAL</span>
                    </div>
                    <div className="h-2 w-full bg-stone/40 overflow-hidden">
                      <div className="h-full bg-charcoal w-[78%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
