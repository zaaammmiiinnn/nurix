"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface PricingTierData {
  name: string;
  priceAED: string;
  priceINR: string;
  idealFor: string;
  delivery: string;
  revisions: string;
  integrationsLimit: string;
  features: string[];
  cta: string;
  featured: boolean;
}

const TIERS: PricingTierData[] = [
  {
    name: "Starter",
    priceAED: "AED 2,500",
    priceINR: "₹58,000",
    idealFor: "Solo founders, boutique clinics, single-location practices.",
    delivery: "3–5 Working Days",
    revisions: "1 Calibration Round Included",
    integrationsLimit: "1 Data Endpoint (Google Sheets, Email, or Webhook)",
    features: [
      "Official Meta WhatsApp or Web conversational lead bot",
      "Lead qualification & instant email / Sheets dispatch",
      "Bilingual Arabic or English intent recognition",
      "Staging sandbox review before production deployment",
      "Full source code & configuration handover",
    ],
    cta: "Select Starter",
    featured: false,
  },
  {
    name: "Growth",
    priceAED: "AED 3,500",
    priceINR: "₹79,000",
    idealFor: "Real estate brokerages, hospitality, and B2B agencies.",
    delivery: "5–7 Working Days",
    revisions: "2 Calibration Rounds Included",
    integrationsLimit: "Up to 3 Endpoints (CRM + Calendar + Meta API)",
    features: [
      "Bilingual Arabic + English natural language conversational bot",
      "Bi-directional CRM sync (HubSpot, Salesforce, Zoho, Supabase)",
      "Automated calendar booking (Cal.com / Google Calendar)",
      "Human handover notification trigger for complex inquiries",
      "Comprehensive edge-case staging simulation",
      "30-day post-launch warranty support",
    ],
    cta: "Select Growth",
    featured: true,
  },
  {
    name: "Business",
    priceAED: "AED 7,500",
    priceINR: "₹1,69,000",
    idealFor: "Multi-branch operators, clinics, and logistics teams.",
    delivery: "10–14 Working Days",
    revisions: "3 Calibration Rounds Included",
    integrationsLimit: "Unlimited Endpoints (Portal + ERP + Webhooks)",
    features: [
      "Custom Next.js operational web dashboard + Admin portal",
      "Autonomous data processing & document extraction agents",
      "Multi-user Role-Based Access Control (RBAC)",
      "Real-time PostgreSQL database records with Supabase",
      "Immutable audit log telemetry & human approval gates",
      "30-day dedicated warranty & developer support",
    ],
    cta: "Select Business",
    featured: false,
  },
];

export function PricingGrid() {
  const [currency, setCurrency] = useState<"AED" | "INR">("AED");

  return (
    <div className="space-y-12">
      {/* Currency Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone/80 pb-6">
        <div>
          <span className="mono-label block text-[10px] text-olive uppercase mb-1">
            TARGET REGION CURRENCY
          </span>
          <p className="text-xs text-charcoal font-sans">
            Select your preferred billing currency. All deliverables remain identical.
          </p>
        </div>

        <div className="inline-flex items-center border border-stone bg-white p-1">
          <button
            type="button"
            onClick={() => setCurrency("AED")}
            className={`px-4 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
              currency === "AED" ? "bg-charcoal text-white font-semibold" : "text-olive hover:text-charcoal"
            }`}
          >
            UAE (AED Dirhams)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`px-4 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
              currency === "INR" ? "bg-charcoal text-white font-semibold" : "text-olive hover:text-charcoal"
            }`}
          >
            India (₹ INR Rupee)
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`border p-8 md:p-10 flex flex-col justify-between transition-all ${
              tier.featured
                ? "border-charcoal bg-white shadow-md relative"
                : "border-stone bg-white/70 hover:border-charcoal/50"
            }`}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-8 px-2.5 py-0.5 bg-charcoal text-white text-[10px] font-mono uppercase tracking-widest">
                MOST REQUESTED SPRINT
              </div>
            )}

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone/70 mb-6">
                <h3 className="font-display font-medium text-2xl text-charcoal">{tier.name}</h3>
                <span className="text-[11px] font-mono text-olive uppercase">
                  EST. {tier.delivery}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-semibold text-4xl sm:text-5xl text-charcoal tracking-tight">
                    {currency === "AED" ? tier.priceAED : tier.priceINR}
                  </span>
                  <span className="font-mono text-xs text-olive">/ sprint</span>
                </div>
              </div>

              {/* Ideal For */}
              <div className="mb-6 pb-6 border-b border-stone/60">
                <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                  IDEAL CLIENT PROFILE
                </span>
                <p className="text-xs text-charcoal/90 leading-relaxed font-sans">
                  {tier.idealFor}
                </p>
              </div>

              {/* Inclusions */}
              <div className="space-y-3 mb-6">
                <span className="mono-label block text-[9px] text-olive uppercase">
                  INCLUDED DELIVERABLES
                </span>
                <ul className="space-y-2.5 text-xs text-charcoal">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-charcoal shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Operational Constraints */}
              <div className="p-3 bg-canvas/60 border border-stone/60 text-[11px] text-olive font-mono mb-8 space-y-1">
                <div>
                  <span className="text-charcoal font-semibold">INTEGRATIONS: </span>
                  {tier.integrationsLimit}
                </div>
                <div>
                  <span className="text-charcoal font-semibold">REVISIONS: </span>
                  {tier.revisions}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/contact?package=${encodeURIComponent(tier.name)}&currency=${currency}`}
              className={`w-full py-3.5 px-4 text-xs font-mono uppercase tracking-wider text-center block transition-colors ${
                tier.featured
                  ? "bg-charcoal text-white hover:bg-black"
                  : "border border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
              }`}
            >
              {tier.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* Enterprise Custom Block */}
      <div className="border border-stone bg-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2 max-w-2xl">
          <span className="mono-label text-[10px] text-olive uppercase">CUSTOM ENGAGEMENT</span>
          <h3 className="font-display font-medium text-2xl text-charcoal">
            Custom Architecture & Multi-Agent Systems
          </h3>
          <p className="text-xs sm:text-sm text-olive font-sans leading-relaxed">
            For organizations requiring multi-tenant cloud platforms, custom vision/OCR pipelines, legacy ERP synchronizations, or private on-premise VPC deployments with dedicated SLAs.
          </p>
        </div>

        <Link
          href="/contact?package=Custom"
          className="btn-editorial-primary shrink-0"
        >
          Discuss Custom Architecture
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
