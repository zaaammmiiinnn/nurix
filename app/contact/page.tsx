"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, Calendar, ArrowRight, CheckCircle2, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { submitContactForm, type ContactFormData } from "./actions";

const WA_URL =
  "https://wa.me/971000000000?text=Hi%20Nurix%2C%20I%20want%20to%20discuss%20an%20AI%20project";

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "chatbots",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success(result.message);
        setSubmitted(true);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message || "Please fix the highlighted fields.");
      }
    } catch {
      toast.error("Submission failed. Please try messaging us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden select-none">
      {/* Background glow orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Monospace section label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-[1px] bg-violet-500/40 inline-block" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            01 / CONTACT
          </span>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-6">
          {/* Left Column: Direct channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] text-white mb-4 leading-[1.05]">
                Let&apos;s talk.
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
                Pick whatever&apos;s fastest for you. Direct developer access, zero sales pitches.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* WhatsApp card */}
              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-emerald-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle size={22} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-base">WhatsApp</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">FASTEST</span>
                    </div>
                    <span className="text-xs text-zinc-400">Average reply: &lt; 15 mins</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Email card */}
              <a
                href="mailto:hello@nurix.ae"
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-violet-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Mail size={22} className="text-violet-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white text-base block">Email</span>
                    <span className="text-xs text-zinc-400 font-mono">hello@nurix.ae</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </a>

              {/* Calendar card (Cal.com embed toggle) */}
              <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                className="w-full text-left group flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-cyan-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(34,211,238,0.12)] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Calendar size={22} className="text-cyan-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white text-base block">Schedule Call</span>
                    <span className="text-xs text-zinc-400">15-minute video scope session</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 group-hover:underline">
                  {showCalendar ? "Close" : "Open Cal"}
                </span>
              </button>

              {/* Phone card */}
              <a
                href="tel:+971000000000"
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-zinc-300" />
                  </div>
                  <div>
                    <span className="font-medium text-white text-base block">Phone</span>
                    <span className="text-xs text-zinc-400 font-mono">+971 00 000 0000</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            {/* SLA / Commitment note */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3 text-xs text-zinc-400">
              <Clock size={16} className="text-violet-400 shrink-0" />
              <span>We reply to all inquiries within 4 business hours. No spam, ever.</span>
            </div>
          </div>

          {/* Right Column: Contact form / Cal embed */}
          <div className="lg:col-span-7">
            {showCalendar ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                  <h3 className="font-medium text-white text-base flex items-center gap-2">
                    <Calendar size={18} className="text-cyan-400" />
                    Book a 15-Minute Scope Call
                  </h3>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="text-xs font-mono text-zinc-500 hover:text-white"
                  >
                    Back to Form
                  </button>
                </div>
                {/* Responsive Cal.com embed */}
                <div className="w-full h-[540px] rounded-xl overflow-hidden bg-white/[0.01]">
                  <iframe
                    src="https://cal.com/nurix/15min?embed=true"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Schedule with Nurix"
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            ) : submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/30 bg-[#0E1512] p-10 sm:p-12 text-center space-y-6 shadow-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white">Got it.</h3>
                  <p className="text-base text-zinc-300 max-w-md mx-auto">
                    We&apos;ll review your requirements and reply within 4 hours with a scope and fixed quote.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        service: "chatbots",
                        message: "",
                        honeypot: "",
                      });
                    }}
                    className="btn-ghost-border px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white"
                  >
                    Send another message
                  </button>
                  <Link
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Message on WhatsApp
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-10 shadow-2xl space-y-6 relative"
                noValidate
              >
                {/* Honeypot field (hidden from view) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Your Name <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rashid Al Nuaimi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors ${
                        errors.name ? "border-rose-500/60" : "border-white/[0.08]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-400">{errors.name[0]}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Work Email <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rashid@company.ae"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors ${
                        errors.email ? "border-rose-500/60" : "border-white/[0.08]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-400">{errors.email[0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone (UAE Validation) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                      UAE Phone / WhatsApp <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors ${
                        errors.phone ? "border-rose-500/60" : "border-white/[0.08]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-400">{errors.phone[0]}</p>
                    )}
                  </div>

                  {/* Company (Optional) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Company Name <span className="text-zinc-600">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gulf Horizon LLC"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                    />
                  </div>
                </div>

                {/* Service Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    What are you looking to build? <span className="text-violet-400">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        service: e.target.value as ContactFormData["service"],
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0F0F16] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                  >
                    <option value="chatbots">AI Chatbots & WhatsApp Automation</option>
                    <option value="dashboards">Web & Admin Dashboard</option>
                    <option value="agents">AI Agents for Business</option>
                    <option value="not_sure">Not sure yet / Needs consultation</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Project Details & Goals <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you want to automate, what tools you currently use, or your desired delivery timeline."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors resize-none ${
                      errors.message ? "border-rose-500/60" : "border-white/[0.08]"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-400">{errors.message[0]}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl text-sm font-semibold uppercase tracking-wider text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      Submit Project Scope
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-center font-mono text-[11px] text-zinc-500">
                  Fixed price scope agreed before work starts • 50% upfront
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
