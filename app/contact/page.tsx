"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { submitContactForm } from "./actions";
import { type ContactFormData } from "@/lib/schemas/contact";
import { SITE_CONFIG } from "@/lib/data/site-data";

const WA_NUMBER = "918840936715";
const WA_BASE_URL = `https://wa.me/${WA_NUMBER}?text=Hi%20NeuralWaves%2C%20I%20want%20to%20discuss%20an%20AI%20project`;

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];

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

  // Dynamic next 5 business days generator
  const availableDays = useMemo(() => {
    const days: Array<{ label: string; dateStr: string; dayName: string }> = [];
    const today = new Date();
    const current = new Date(today);

    // If afternoon, start from tomorrow
    current.setDate(current.getDate() + 1);

    while (days.length < 5) {
      const dayOfWeek = current.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dayName = current.toLocaleDateString("en-US", { weekday: "short" });
        const monthDay = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        days.push({
          label: `${dayName}, ${monthDay}`,
          dateStr: current.toISOString().split("T")[0],
          dayName,
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, []);

  const [selectedDay, setSelectedDay] = useState<string>(availableDays[0]?.label || "Tomorrow");
  const [selectedSlot, setSelectedSlot] = useState<string>("02:00 PM");

  const configuredCalUrl = process.env.NEXT_PUBLIC_CAL_COM_URL;
  const hasCustomCalUrl =
    configuredCalUrl &&
    configuredCalUrl !== "https://cal.com/neuralwaves/15min" &&
    !configuredCalUrl.includes("cal.com/neuralwaves");

  const useIframeEmbed = Boolean(hasCustomCalUrl);

  const handleSlotSelectionConfirm = (destination: "form" | "whatsapp") => {
    const slotText = `Preferred Scope Call: ${selectedDay} at ${selectedSlot} (GST / Dubai Time)`;

    if (destination === "whatsapp") {
      const waText = encodeURIComponent(
        `Hi NeuralWaves, I would like to book a 15-minute scoping call on ${selectedDay} at ${selectedSlot} (GST).`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, "_blank");
      toast.success("Opening WhatsApp to confirm your slot!");
    } else {
      setFormData((prev) => ({
        ...prev,
        message: prev.message
          ? `${prev.message}\n\n[${slotText}]`
          : `[${slotText}] Looking forward to discussing our project scope.`,
      }));
      setShowCalendar(false);
      toast.success("Time slot selected! Complete your contact details below.");
    }
  };

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
                href={WA_BASE_URL}
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
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-violet-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Mail size={22} className="text-violet-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white text-base block">Email</span>
                    <span className="text-xs text-zinc-400 font-mono">{SITE_CONFIG.contact.email}</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </a>

              {/* Calendar card (Schedule call toggle) */}
              <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                className={`w-full text-left group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                  showCalendar
                    ? "border-cyan-500/50 bg-[#0A1218] shadow-[0_8px_30px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/30"
                    : "border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-cyan-500/40 hover:-translate-y-0.5"
                }`}
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
                  {showCalendar ? "Close" : "Choose Slot"}
                </span>
              </button>

              {/* Phone card */}
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, "")}`}
                className="group flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-zinc-300" />
                  </div>
                  <div>
                    <span className="font-medium text-white text-base block">Phone</span>
                    <span className="text-xs text-zinc-400 font-mono">{SITE_CONFIG.contact.phone}</span>
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

          {/* Right Column: Contact form / Interactive In-App Scheduler */}
          <div className="lg:col-span-7">
            {showCalendar ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div>
                    <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                      <Calendar size={18} className="text-cyan-400" />
                      15-Minute Scope Session
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Direct developer discussion • Dubai GST (UTC+4)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                  >
                    Back to Form
                  </button>
                </div>

                {hasCustomCalUrl && useIframeEmbed ? (
                  <div className="w-full h-[520px] rounded-xl overflow-hidden bg-white/[0.01]">
                    <iframe
                      src={`${configuredCalUrl}?embed=true`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      title="Schedule with NeuralWaves"
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  /* Native In-App Slot Selector */
                  <div className="space-y-6">
                    {/* Day selector */}
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-3">
                        1. Select Business Day
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {availableDays.map((day) => (
                          <button
                            key={day.label}
                            type="button"
                            onClick={() => setSelectedDay(day.label)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              selectedDay === day.label
                                ? "border-cyan-500/60 bg-cyan-500/10 text-white font-medium shadow-[0_0_16px_rgba(34,211,238,0.15)]"
                                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20"
                            }`}
                          >
                            <span className="block text-[11px] font-mono text-zinc-500 uppercase">
                              {day.dayName}
                            </span>
                            <span className="text-xs font-semibold block mt-0.5">
                              {day.label.split(", ")[1]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time slot selector */}
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-3">
                        2. Select Dubai Time Slot (GST)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 px-4 rounded-xl border text-center font-mono text-xs transition-all ${
                              selectedSlot === slot
                                ? "border-violet-500/60 bg-violet-500/10 text-white font-semibold shadow-[0_0_16px_rgba(139,92,246,0.15)]"
                                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected summary banner */}
                    <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400 block">
                          Selected Slot
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {selectedDay} at {selectedSlot} GST
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Sparkles size={14} className="text-violet-400" />
                        <span>Google Meet link generated</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => handleSlotSelectionConfirm("whatsapp")}
                        className="btn-glow flex-1 py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={15} className="text-emerald-400" />
                        Book via WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSlotSelectionConfirm("form")}
                        className="btn-ghost-border flex-1 py-3 px-5 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
                      >
                        Confirm in Form
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
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
                    href={WA_BASE_URL}
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
                {/* Honeypot field for bot protection */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, honeypot: e.target.value }))
                  }
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="mono-label block text-[11px] text-zinc-400">
                      Your Name <span className="text-violet-400">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Tariq Mansoor"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400">{errors.name[0]}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="mono-label block text-[11px] text-zinc-400">
                      Work Email <span className="text-violet-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="tariq@company.ae"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400">{errors.email[0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="mono-label block text-[11px] text-zinc-400">
                      Phone / WhatsApp <span className="text-violet-400">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91-8840936715"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400">{errors.phone[0]}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="mono-label block text-[11px] text-zinc-400">
                      Company / Organization
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Skyline Properties"
                      value={formData.company || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <label htmlFor="service" className="mono-label block text-[11px] text-zinc-400">
                    What are you looking to build? <span className="text-violet-400">*</span>
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        service: e.target.value as ContactFormData["service"],
                      }))
                    }
                    className="w-full bg-[#0F0F14] border border-white/[0.08] focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="chatbots">AI Chatbots &amp; WhatsApp Automation (from AED 1,500)</option>
                    <option value="dashboards">Web &amp; Admin Dashboards (from AED 2,500)</option>
                    <option value="agents">AI Agents for Business (from AED 7,500)</option>
                    <option value="not_sure">Not Sure / Multi-System Architecture</option>
                  </select>
                </div>

                {/* Message / Brief */}
                <div className="space-y-2">
                  <label htmlFor="message" className="mono-label block text-[11px] text-zinc-400">
                    Project Brief &amp; Scope <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell us about the workflow you want automated, systems to integrate, and timeline..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400">{errors.message[0]}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-glow py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      Sending Scope Request...
                    </>
                  ) : (
                    <>
                      Send Scope Request
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-zinc-500 font-mono">
                  Fixed quotes sent in &lt; 4 hours. No obligation.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
