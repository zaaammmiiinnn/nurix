"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowUpRight, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/lead";
import { useSiteConfig, toDialable } from "@/lib/hooks/use-site-config";

const FALLBACK_WA_NUMBER = "918840936715";

export function FinalCta() {
  const siteConfig = useSiteConfig({
    whatsappNumber: FALLBACK_WA_NUMBER,
    email: "support@neuralwaves.in",
    phone: "+91-8840936715",
    calendarUrl: "",
    address: "",
    linkedin: "",
  });
  const waUrl = `https://wa.me/${toDialable(siteConfig.whatsappNumber)}?text=Hi%20NeuralWaves%2C%20I%20have%20a%20process%20I%20want%20to%20automate`;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "UAE",
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
      payload.append("service", `${formData.service} (${formData.country})`);
      payload.append("message", formData.message.trim());
      payload.append("website", ""); // Honeypot spam protection

      const res = await submitLead(payload);
      if (res.success) {
        toast.success("Inquiry confirmed. We will reply with initial architecture & quote within 4 business hours.");
        setSubmitted(true);
      } else {
        toast.error(res.error || "Please verify your input and try again.");
      }
    } catch {
      toast.error("Submission could not be completed. Please message our engineering desk directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="py-24 md:py-36 border-b border-stone/80 bg-white"
      aria-labelledby="cta-heading"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
              <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
                07 // INITIATE COLLABORATION
              </p>
            </div>

            <h2
              id="cta-heading"
              className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.08]"
            >
              Have a process worth automating?
            </h2>

            <p className="text-base sm:text-lg text-olive leading-relaxed font-sans max-w-lg">
              Tell us what slows your business down. We&apos;ll help you identify what to build.
            </p>

            {/* Direct Options */}
            <div className="pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/contact"
                  className="btn-editorial-primary text-center"
                  id="final-cta-discuss"
                >
                  Discuss a Project
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial-secondary text-center inline-flex items-center justify-center gap-2"
                  id="final-cta-whatsapp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp Engineering Desk</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-stone/80 text-xs font-mono text-olive space-y-1">
                <p>DIRECT DESK: support@neuralwaves.in</p>
                <p>RESPONSE TIMEFRAME: Under 4 business hours</p>
                <p>REGIONAL TIMEZONES: GST (Dubai) & IST (India)</p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Quick Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="border border-stone bg-canvas/40 p-8 sm:p-10">
              <div className="flex items-center justify-between pb-4 border-b border-stone/80 mb-6 text-[11px] font-mono text-olive">
                <span className="text-charcoal font-medium uppercase">PROJECT INQUIRY DESK</span>
                <span>DIRECT DISPATCH</span>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 bg-charcoal text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-display font-medium text-2xl text-charcoal">
                    Inquiry Transmitted
                  </h3>
                  <p className="text-xs sm:text-sm text-olive max-w-md mx-auto font-sans leading-relaxed">
                    Our engineering team has received your submission. We review feasibility, identify the required integration endpoints, and respond with a scoping blueprint within 4 hours.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", country: "UAE", service: "chatbots", message: "" });
                      }}
                      className="text-xs font-mono text-charcoal underline hover:text-olive cursor-pointer"
                    >
                      Submit additional brief →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="cta-name" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      placeholder="Ahmed Al-Maktoum / Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta-email" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Work Email *
                      </label>
                      <input
                        id="cta-email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="cta-country" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Market / Region *
                      </label>
                      <select
                        id="cta-country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-white border border-stone px-3.5 py-2.5 text-xs text-charcoal focus:border-charcoal focus:outline-none"
                      >
                        <option value="UAE">United Arab Emirates (UAE)</option>
                        <option value="India">India</option>
                        <option value="Other">Other International</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cta-service" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                      System Requirement *
                    </label>
                    <select
                      id="cta-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-white border border-stone px-3.5 py-2.5 text-xs text-charcoal focus:border-charcoal focus:outline-none"
                    >
                      <option value="chatbots">AI Chatbots & WhatsApp Automation</option>
                      <option value="agents">AI Autonomous Agents & Document Workflows</option>
                      <option value="dashboards">Web Applications & Custom Operations Dashboards</option>
                      <option value="custom">Full Enterprise Scope / Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cta-message" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                      Brief Operational Problem *
                    </label>
                    <textarea
                      id="cta-message"
                      rows={3}
                      required
                      placeholder="Describe what repetitive manual process or tool slowdown you want to eliminate..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-editorial-primary text-center justify-center mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Transmitting Brief...
                      </>
                    ) : (
                      <>
                        Transmit Project Brief
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] font-mono text-olive/80 text-center pt-1">
                    Direct developer review · Zero marketing spam · Complete confidentiality
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
