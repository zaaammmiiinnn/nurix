import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service — NeuralWaves",
  description:
    "The terms of service governing engagement, fixed-price sprints, code handover, and use of NeuralWaves website.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

const LAST_UPDATED = "12 October 2026";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <div className="container-editorial max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">TERMS OF SERVICE</span>
        </nav>

        <div className="border border-stone bg-white p-8 md:p-14 space-y-10">
          <div className="border-b border-stone/70 pb-6">
            <span className="mono-label text-[10px] text-olive uppercase block mb-2">
              COMMERCIAL GOVERNANCE // TERMS OF SERVICE
            </span>
            <h1 className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight mb-2">
              Terms of Service
            </h1>
            <p className="text-xs font-mono text-olive">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans">
            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">1. Scope of Engagement</h2>
              <p className="text-olive">
                NeuralWaves provides custom AI software engineering, API integration, and automation development. All client projects proceed under a written technical scope document outlining explicit inputs, transformations, deliverables, and acceptance criteria.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">2. Commercial Terms & Payment Milestones</h2>
              <p className="text-olive">
                Standard client projects operate on a fixed-fee milestone schedule: 50% deposit payable upon sprint kickoff to secure engineering allocation, and the remaining 50% payable upon completion and staging acceptance sign-off. We do not bill open-ended hourly rates.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">3. Intellectual Property Handover</h2>
              <p className="text-olive">
                Upon settlement of the final project milestone invoice, 100% of custom application code, database structures, prompts, and deployment runbooks created specifically for the project transfer completely to the client. NeuralWaves retains no ownership or residual licensing claims over custom client deliverables.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">4. Third-Party Infrastructure & API Charges</h2>
              <p className="text-olive">
                Clients maintain direct accounts with infrastructure providers (including Meta WhatsApp Cloud API, OpenAI, Anthropic, Supabase, and cloud hosting). All recurring third-party token consumption, hosting fees, and phone number subscriptions are billed directly to the client at cost.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">5. Warranty & Post-Launch Support</h2>
              <p className="text-olive">
                All delivered systems include a 30-day post-launch defect warranty covering bug fixes and prompt calibration to ensure production stability according to the agreed specification.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
