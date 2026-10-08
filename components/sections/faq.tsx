"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const FAQS = [
  {
    q: "How fast can you deliver?",
    a: "Most projects are delivered in 5 working days. Complex builds with custom CRM or ERP integrations take 7 to 10 days. We lock the exact delivery date on our discovery call.",
  },
  {
    q: "What does 50% upfront mean?",
    a: "You pay 50% to initiate the sprint and secure dedicated engineering time. The remaining 50% is only billed once the build is deployed, tested, and approved by your team.",
  },
  {
    q: "Do you support Arabic?",
    a: "Yes. All our AI models, chatbots, and dashboards natively support Modern Standard Arabic (MSA) as well as Gulf dialects and English.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Every build includes a 14 to 30-day post-launch warranty with instant fixes and revisions. For ongoing changes or feature additions, we offer month-to-month retainers.",
  },
  {
    q: "Do you work with WordPress sites?",
    a: "Yes. We embed custom AI chatbots, lead capture flows, and dashboards seamlessly into WordPress, Webflow, Shopify, or custom Next.js websites via clean script tags or APIs.",
  },
  {
    q: "Who pays WhatsApp/Meta charges?",
    a: "You pay Meta directly via your own Meta Business Manager at cost (typically a few fils per conversation). We configure and connect your WhatsApp Business Cloud API with zero markup.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="py-32 md:py-40 px-6 md:px-8 max-w-4xl mx-auto select-none"
      aria-labelledby="faq-heading"
    >
      <SectionHeader
        label="06 / FAQ"
        title="Questions. Answered."
        description="Everything you need to know about our sprints, pricing, contracts, and IP ownership."
      />

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-200 overflow-hidden"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-6 text-left group"
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium text-white group-hover:text-violet-200 transition-colors pr-6">
                  {faq.q}
                </span>

                {/* Rotating Plus icon (rotates 45deg to X on open) */}
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 text-zinc-400 group-hover:text-white group-hover:border-violet-500/30 transition-colors"
                >
                  <Plus size={16} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
