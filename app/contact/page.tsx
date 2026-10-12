"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageCircle, ArrowRight, CheckCircle2, Loader2, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/lead";
import { useSiteConfig, toDialable } from "@/lib/hooks/use-site-config";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const siteConfig = useSiteConfig({
    whatsappNumber: "918840936715",
    email: "support@neuralwaves.in",
    phone: "+91-8840936715",
    calendarUrl: "",
    address: "",
    linkedin: "",
  });

  const waUrl = `https://wa.me/${toDialable(siteConfig.whatsappNumber)}?text=Hi%20NeuralWaves%2C%20I%20want%20to%20discuss%20an%20AI%20project`;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "UAE",
    service: "chatbots",
    budget: "AED 3,500 – 7,500",
    message: "",
    honeypot: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const pkg = searchParams.get("package") || searchParams.get("tier");
    const srv = searchParams.get("service");
    const project = searchParams.get("project");

    setFormData((prev) => {
      let updatedService = prev.service;
      if (srv && ["chatbots", "agents", "dashboards", "custom"].includes(srv)) {
        updatedService = srv;
      }
      let updatedMessage = prev.message;
      if (pkg && !prev.message) {
        updatedMessage = `I would like to initiate the ${pkg} sprint package.`;
      } else if (project && !prev.message) {
        updatedMessage = `I would like to discuss building a system similar to "${project}".`;
      }
      return {
        ...prev,
        service: updatedService,
        message: updatedMessage,
      };
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("phone", formData.phone.trim() || "+97100000000"); // fallback phone if user left empty
      if (formData.company) payload.append("company", formData.company.trim());
      
      const combinedService = `${formData.service} [Market: ${formData.country}, Budget: ${formData.budget}]`;
      payload.append("service", combinedService);
      payload.append("message", formData.message.trim());
      payload.append("website", formData.honeypot); // Honeypot spam test

      const result = await submitLead(payload);

      if (result.success) {
        toast.success("Project brief transmitted. Expect response within 4 hours.");
        setSubmitted(true);
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error || "Please check the required fields and submit again.");
      }
    } catch {
      toast.error("Transmission failed. Please reach our engineering desk directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <div className="container-editorial">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">CONTACT</span>
        </nav>

        {/* Hero */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              PROJECT INQUIRY // DIRECT ENGINEERING ACCESS
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            Discuss a project. <br className="hidden sm:inline" />
            <span className="text-charcoal/70">Receive a fixed-price scope.</span>
          </h1>

          <p className="text-base sm:text-lg text-olive leading-relaxed font-sans max-w-2xl">
            Tell us about the repetitive tasks or operational bottlenecks slowing your business down. We will analyze feasibility and respond with a technical scoping blueprint within 4 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Inquiries & Contact Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-stone bg-white p-8 space-y-6">
              <span className="mono-label text-[10px] text-olive uppercase block border-b border-stone/70 pb-3">
                DIRECT COMMUNICATION
              </span>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <span className="mono-label text-[9px] text-olive uppercase block mb-1">
                    OFFICIAL WHATSAPP DESK
                  </span>
                  <Link
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono font-medium text-charcoal text-sm hover:text-olive transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>+91 88409 36715 (Click to Chat)</span>
                  </Link>
                  <p className="text-[11px] text-olive mt-1">
                    Direct line to senior engineering. Immediate replies during GST & IST hours.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone/60">
                  <span className="mono-label text-[9px] text-olive uppercase block mb-1">
                    OFFICIAL EMAIL
                  </span>
                  <a
                    href="mailto:support@neuralwaves.in"
                    className="inline-flex items-center gap-2 font-mono font-medium text-charcoal text-sm hover:text-olive transition-colors"
                  >
                    <Mail className="w-4 h-4 text-charcoal" />
                    <span>support@neuralwaves.in</span>
                  </a>
                  <p className="text-[11px] text-olive mt-1">
                    Send RFPs, technical documents, or architecture requirements.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone/60">
                  <span className="mono-label text-[9px] text-olive uppercase block mb-1">
                    OPERATING MARKETS
                  </span>
                  <span className="font-mono text-charcoal font-medium">United Arab Emirates & India</span>
                  <p className="text-[11px] text-olive mt-1">
                    Serving Dubai, Abu Dhabi, Sharjah, and major Indian enterprise hubs.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Confidentiality Guarantee */}
            <div className="border border-stone bg-canvas/60 p-6 space-y-2 text-xs font-sans text-olive">
              <div className="flex items-center gap-2 text-charcoal font-medium font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>CONFIDENTIALITY ASSURANCE</span>
              </div>
              <p className="leading-relaxed">
                All business metrics, workflows, and contact information shared remain strictly confidential. We never share customer data or use inquiries for unsolicited sales marketing.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="border border-stone bg-white p-8 sm:p-12">
              <div className="flex items-center justify-between pb-4 border-b border-stone/80 mb-8 text-[11px] font-mono text-olive">
                <span className="text-charcoal font-medium uppercase">PROJECT SPECIFICATION FORM</span>
                <span>UNDER 4-HR RESPONSE</span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-charcoal text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-display font-medium text-3xl text-charcoal">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-olive max-w-md mx-auto font-sans leading-relaxed">
                    Thank you. Our engineering team has logged your submission in our CRM. We will review your process details and reply with an initial architecture overview and quote within 4 business hours.
                  </p>
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          country: "UAE",
                          service: "chatbots",
                          budget: "AED 3,500 – 7,500",
                          message: "",
                          honeypot: "",
                        });
                      }}
                      className="text-xs font-mono text-charcoal underline hover:text-olive cursor-pointer"
                    >
                      Submit additional brief →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field for bot spam prevention */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="form-name" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        placeholder="Rashid Al-Nuaimi / Vikram Mehta"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:bg-white focus:outline-none"
                      />
                      {fieldErrors.name && (
                        <span className="text-[10px] text-red-600 block mt-1">{fieldErrors.name[0]}</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="form-email" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Work Email *
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:bg-white focus:outline-none"
                      />
                      {fieldErrors.email && (
                        <span className="text-[10px] text-red-600 block mt-1">{fieldErrors.email[0]}</span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="form-phone" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="form-phone"
                        type="tel"
                        required
                        placeholder="+971 50 123 4567 / +91 98..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:bg-white focus:outline-none"
                      />
                      {fieldErrors.phone && (
                        <span className="text-[10px] text-red-600 block mt-1">{fieldErrors.phone[0]}</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="form-company" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Company / Website (Optional)
                      </label>
                      <input
                        id="form-company"
                        type="text"
                        placeholder="e.g. Elysian Properties / company.ae"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Country & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="form-country" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Market / Country *
                      </label>
                      <select
                        id="form-country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal focus:border-charcoal focus:bg-white focus:outline-none"
                      >
                        <option value="UAE">United Arab Emirates (UAE)</option>
                        <option value="India">India</option>
                        <option value="Other">Other International</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="form-service" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                        Project Type *
                      </label>
                      <select
                        id="form-service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal focus:border-charcoal focus:bg-white focus:outline-none"
                      >
                        <option value="chatbots">AI Chatbots & WhatsApp Automation</option>
                        <option value="agents">AI Agents & Intelligent Workflows</option>
                        <option value="dashboards">Web Applications & Admin Dashboards</option>
                        <option value="custom">Custom Enterprise Architecture</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="form-budget" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                      Budget Range (Optional)
                    </label>
                    <select
                      id="form-budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal focus:border-charcoal focus:bg-white focus:outline-none"
                    >
                      <option value="AED 2,500 – 3,500">AED 2,500 – 3,500 (Starter / Single Channel)</option>
                      <option value="AED 3,500 – 7,500">AED 3,500 – 7,500 (Growth / CRM Integrated)</option>
                      <option value="AED 7,500 – 15,000">AED 7,500 – 15,000 (Business Dashboard & Agents)</option>
                      <option value="AED 15,000+">AED 15,000+ (Multi-Tenant Enterprise)</option>
                    </select>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label htmlFor="form-message" className="mono-label block text-[10px] text-olive uppercase mb-1.5">
                      Project Description *
                    </label>
                    <textarea
                      id="form-message"
                      rows={4}
                      required
                      placeholder="Describe what manual process, spreadsheet, or workflow friction you want automated..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-canvas/40 border border-stone px-3.5 py-2.5 text-xs text-charcoal placeholder:text-olive/50 focus:border-charcoal focus:bg-white focus:outline-none resize-none"
                    />
                    {fieldErrors.message && (
                      <span className="text-[10px] text-red-600 block mt-1">{fieldErrors.message[0]}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-editorial-primary text-center justify-center py-4 text-xs font-mono tracking-wider cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Transmitting Project Brief...
                      </>
                    ) : (
                      <>
                        Submit Project Inquiry
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] font-mono text-olive text-center pt-2">
                    Direct review by senior developer · No spam · Fixed quote within 4 hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
