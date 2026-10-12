import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "About — NeuralWaves",
  description:
    "Good software should make business simpler. NeuralWaves builds practical AI systems and custom digital tools for businesses across India and the UAE.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const PRINCIPLES = [
  {
    tag: "PRINCIPLE 01",
    title: "Utility Over Novelty",
    desc: "We do not build AI toys or speculative chat gimmicks. We measure software exclusively by the manual hours eliminated, leads captured, and operational errors prevented.",
  },
  {
    tag: "PRINCIPLE 02",
    title: "Direct Engineering Access",
    desc: "Clients collaborate directly with senior full-stack and systems engineers. We eliminate the telephone game of non-technical account managers and bloated agency hierarchies.",
  },
  {
    tag: "PRINCIPLE 03",
    title: "Absolute Scope Discipline",
    desc: "Every sprint starts with a fixed-scope technical blueprint and locked price. We do not engage in open-ended hourly billing or surprise milestone change orders.",
  },
  {
    tag: "PRINCIPLE 04",
    title: "100% Client Ownership",
    desc: "You own every line of code, database schema, and deployment configuration. Deployed directly into your corporate cloud accounts with zero proprietary vendor lock-in.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />

      <div className="container-editorial">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">ABOUT</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-20 md:mb-28 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              ABOUT NEURALWAVES // MISSION & PHILOSOPHY
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-8">
            Good software should make business simpler.
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-charcoal/80 font-normal leading-relaxed font-sans max-w-3xl mb-6">
            NeuralWaves builds practical AI systems and custom digital tools that help teams reduce repetitive work, improve visibility, and deliver better service.
          </p>

          <p className="text-sm sm:text-base text-olive leading-relaxed font-sans max-w-2xl">
            We operate as a focused engineering studio partnering with growing businesses in the UAE and India. We replace disconnected spreadsheets, manual data entry, and delayed communication with robust, production-grade automated systems.
          </p>
        </div>

        {/* Operating Model & Cross-Border Reality */}
        <div className="border border-stone bg-white p-8 md:p-14 mb-20 space-y-8">
          <div className="max-w-2xl">
            <span className="mono-label text-[10px] text-olive uppercase">THE OPERATING MODEL</span>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-charcoal mt-2">
              Cross-Border Engineering Focused on India & UAE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-olive leading-relaxed font-sans">
            <div>
              <p className="mb-4">
                We bridge high-velocity software engineering with deep regional commercial context. In the UAE, customer commerce and service inquiries live almost entirely on WhatsApp, demanding bilingual English and Arabic capabilities with official Meta Cloud API compliance.
              </p>
              <p>
                In India, operational teams require high-concurrency systems, robust data parsing, and integrations that connect internal teams without friction.
              </p>
            </div>
            <div>
              <p className="mb-4">
                We operate as a remote-first, engineering-led organization. We do not maintain theatrical corporate offices in DIFC or Silicon Oasis just to justify inflated consulting fees.
              </p>
              <p>
                Instead, our clients receive direct, low-latency access to the developers writing their software, working across Gulf Standard Time (GST) and Indian Standard Time (IST).
              </p>
            </div>
          </div>
        </div>

        {/* Engineering Tenets Grid */}
        <div className="mb-20">
          <div className="mb-10 max-w-2xl">
            <span className="mono-label text-[10px] text-olive uppercase">CORE TENETS</span>
            <h2 className="font-display font-medium text-3xl text-charcoal mt-2">
              How We Approach Engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRINCIPLES.map((p, idx) => (
              <div key={idx} className="p-8 border border-stone bg-white space-y-3">
                <span className="mono-label text-[10px] text-olive uppercase">{p.tag}</span>
                <h3 className="font-display font-medium text-xl text-charcoal">{p.title}</h3>
                <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible, Practical AI Governance */}
        <div className="border border-stone bg-white p-8 md:p-12 mb-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal font-semibold">
            <ShieldCheck className="w-4 h-4 text-charcoal" />
            <span>RESPONSIBLE & PRACTICAL AI GOVERNANCE</span>
          </div>
          <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans max-w-3xl">
            Large language models are probabilistic engines. We engineer deterministic wrappers around foundation models: enforcing rigid JSON schemas, validating foreign keys, evaluating business thresholds, and providing clear human intervention paths whenever uncertainty exceeds tolerance limits.
          </p>
        </div>

        {/* Bottom CTA Block */}
        <div className="border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">START A CONVERSATION</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Ready to eliminate operational busywork?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              Tell us about your processes and systems. We’ll help you determine whether custom AI automation makes economic sense for your business.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3.5 bg-white text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone transition-colors shrink-0"
          >
            Discuss a Project →
          </Link>
        </div>
      </div>
    </div>
  );
}
