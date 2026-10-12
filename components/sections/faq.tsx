"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export const REQUIRED_FAQS = [
  {
    q: "How much does an AI automation project cost?",
    a: "Our fixed-price project packages start at AED 2,500 (approx. ₹58,000 INR) for single-channel WhatsApp or Web lead bots, AED 3,500 for bilingual CRM-integrated assistants, and AED 7,500 for custom full-stack web dashboards and multi-agent workflows. Custom enterprise systems are scoped upfront with zero hidden fees. Billing is 50% upfront to initiate the sprint and 50% upon verified staging sign-off.",
  },
  {
    q: "How long does development take?",
    a: "A focused chatbot or lead intake workflow typically ships in 3 to 7 working days. More comprehensive projects—such as multi-branch restaurant portals or multi-agent document extraction engines—generally require 1 to 3 weeks depending on API access and custom integrations. Realistic timelines are locked during the initial discovery stage.",
  },
  {
    q: "Can you integrate with existing business software?",
    a: "Yes. We build native webhook connections and REST API integrations with CRMs (HubSpot, Salesforce, Zoho, Pipedrive), messaging platforms (Meta WhatsApp Cloud API, Telegram, Slack), scheduling tools (Cal.com, Google Calendar), and databases (PostgreSQL, Supabase, Google Sheets).",
  },
  {
    q: "Who owns the delivered software?",
    a: "You do. 100% of custom code, database configurations, architectural blueprints, and prompt logic belong entirely to your company upon final milestone payment. We provide complete repository access and deployment documentation with zero vendor lock-in.",
  },
  {
    q: "Are third-party API and messaging charges included?",
    a: "Third-party utility charges—such as Meta WhatsApp Business conversation fees (fractions of a cent per conversation) and OpenAI / Anthropic model token consumption—are billed directly to your corporate payment card at actual cost. We do not apply any markup to your third-party API usage.",
  },
  {
    q: "Can you support Arabic and English workflows?",
    a: "Yes. All our conversational systems and interfaces are built to understand Modern Standard Arabic (MSA), regional Gulf dialects (Khaleeji), and English fluently. The AI detects the customer's language dynamically and responds in the identical tone and dialect.",
  },
  {
    q: "Do you provide maintenance and support?",
    a: "Every deployment includes a 30-day post-launch warranty period covering bug fixes, edge-case tuning, and prompt calibrations. After launch, clients can opt for month-to-month maintenance retainers for continuous monitoring, new feature rollouts, and model updates.",
  },
  {
    q: "How do you protect customer data?",
    a: "We adhere to strict data-minimization principles. Sensitive customer records are stored securely within your own dedicated cloud infrastructure (e.g. Supabase PostgreSQL with Row Level Security). We never use your proprietary business data or customer transcripts to train public AI foundation models.",
  },
  {
    q: "What happens when an AI system needs human intervention?",
    a: "Our systems feature deterministic confidence score evaluations and explicit human-handover protocols. When an inquiry falls outside predefined guardrails or requests executive negotiation, the bot flags the conversation, pauses automated replies, and alerts a human team member via WhatsApp, Slack, or email with full conversational context.",
  },
];

interface FaqSectionProps {
  faqs?: { q: string; a: string }[];
}

export function FaqSection({ faqs }: FaqSectionProps = {}) {
  const items = faqs && faqs.length > 0 ? faqs : REQUIRED_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas select-none"
      aria-labelledby="faq-heading"
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              06 // FREQUENTLY ASKED QUESTIONS
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                id="faq-heading"
                className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight"
              >
                Clear answers. <br className="hidden sm:inline" />
                No ambiguous fine print.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm md:text-base text-olive leading-relaxed font-sans">
                Everything you need to know regarding pricing, timelines, integrations, IP ownership, and data privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-4xl">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="border border-stone bg-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 pr-4">
                    <span className="font-mono text-xs text-olive w-6 shrink-0">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="font-display font-medium text-base sm:text-lg text-charcoal group-hover:text-olive transition-colors">
                      {faq.q}
                    </span>
                  </div>

                  <div className="w-6 h-6 border border-stone flex items-center justify-center shrink-0 text-charcoal bg-canvas">
                    {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pl-16 text-xs sm:text-sm text-olive leading-relaxed font-sans border-t border-stone/50 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
