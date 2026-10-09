"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/lead";

const WA_URL =
  "https://wa.me/918840936715?text=Hi%20NeuralWaves%2C%20I%20need%20help%20with%20automation";

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
        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-6 font-normal leading-relaxed">
          15-minute call. No pitch deck. Just scope and price.
        </p>

        {/* Quick WhatsApp option */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Link
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all"
          >
            <MessageCircle size={14} className="text-emerald-400" />
            <span>Need immediate reply? Chat on WhatsApp</span>
          </Link>
        </div>

        {/* Direct Scope Inquiry Form Card */}
        <div className="w-full max-w-2xl mt-4 text-left">
          <HomepageQuickForm />
        </div>
      </div>
    </section>
  );
}

function HomepageQuickForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "chatbots",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("service", formData.service);
      payload.append("message", formData.message.trim());
      payload.append("website", "");

      const res = await submitLead(payload);
      if (res.success) {
        toast.success("Got it. We'll reply within 4 hours with scope and fixed quote.");
        setSubmitted(true);
      } else {
        toast.error(res.error || "Please fill in all required fields.");
      }
    } catch {
      toast.error("Submission failed. Please message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-[#0E1512] p-8 text-center space-y-3 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white">Requirement Received</h3>
        <p className="text-sm text-zinc-300 max-w-md mx-auto">
          We&apos;re preparing your scope breakdown and fixed quotation. Expect our response within 4 hours.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", phone: "", service: "chatbots", message: "" });
            }}
            className="text-xs font-mono text-zinc-400 hover:text-white underline"
          >
            Submit another project
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-8 shadow-2xl space-y-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Quick Project Inquiry</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          4-HR REPLY
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cta-name" className="mono-label block text-[10px] text-zinc-400 mb-1">
            Your Name *
          </label>
          <input
            id="cta-name"
            type="text"
            required
            placeholder="Tariq Mansoor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="cta-email" className="mono-label block text-[10px] text-zinc-400 mb-1">
            Work Email *
          </label>
          <input
            id="cta-email"
            type="email"
            required
            placeholder="tariq@company.ae"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cta-phone" className="mono-label block text-[10px] text-zinc-400 mb-1">
            Phone / WhatsApp *
          </label>
          <input
            id="cta-phone"
            type="tel"
            required
            placeholder="+971 50 123 4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="cta-service" className="mono-label block text-[10px] text-zinc-400 mb-1">
            Area of Interest *
          </label>
          <select
            id="cta-service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full bg-[#0F0F14] border border-white/[0.08] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
          >
            <option value="chatbots">AI Chatbots &amp; WhatsApp</option>
            <option value="dashboards">Web &amp; Admin Dashboards</option>
            <option value="agents">AI Agents for Business</option>
            <option value="not_sure">Multi-System Integration</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cta-message" className="mono-label block text-[10px] text-zinc-400 mb-1">
          Brief Requirements *
        </label>
        <textarea
          id="cta-message"
          rows={3}
          required
          placeholder="Describe your workflows, goals, and any systems you want connected..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-glow py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin text-white" />
            Sending Scope Brief...
          </>
        ) : (
          <>
            Send Scope Brief
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}
