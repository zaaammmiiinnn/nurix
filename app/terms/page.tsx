import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply to using the NeuralWaves website and engaging us for project work.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

const LAST_UPDATED = "9 October 2026";

/**
 * NOTE FOR THE OPERATOR: this is a plain-language starting point that matches how
 * you currently describe your commercial terms (fixed price, 50/50 payment,
 * delivery windows, code handover). It is not legal advice. Have a qualified
 * adviser review it — especially the liability, IP and governing-law clauses —
 * before you rely on it for a client engagement.
 */
export default function TermsPage() {
  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400 mb-4">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-zinc-500 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-zinc-300 leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Using this website</h2>
            <p>
              This site describes our services and lets you contact us. You may not use it to
              submit unlawful, misleading or abusive content, to attempt to gain unauthorised
              access to any part of it, or to interfere with its operation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Quotes and pricing</h2>
            <p>
              Prices shown on this site are indicative starting points for fixed-scope
              packages and are quoted in UAE dirhams (AED). A binding price is the one we
              confirm in writing for your specific scope. Where a package description and a
              written quote differ, the written quote applies.
            </p>
            <p>
              Our standard commercial terms are a fixed project fee with 50% payable to begin
              the engagement and 50% payable on acceptance of delivery. We do not bill hourly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Delivery timelines</h2>
            <p>
              Delivery windows shown on this site (for example &ldquo;3–5 days&rdquo; or
              &ldquo;7–10 days&rdquo;) are estimates for the packages described and assume
              timely access to the information, accounts and approvals we need from you. The
              binding date for your project is the one agreed in writing. Delays caused by
              awaiting your input, third-party platform review (including Meta&rsquo;s
              verification processes), or events outside our control extend the timeline
              accordingly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Demonstrations</h2>
            <p>
              Some case studies on this site are labelled as demos. Those are demonstration
              builds created to show an approach or capability. They are not client
              deployments, and any figures shown for them are illustrative rather than
              measured client outcomes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Intellectual property</h2>
            <p>
              On final payment for a project, the code and configuration we build specifically
              for you are handed over to you, along with the relevant repository access and
              deployment accounts, as set out in your agreement. Third-party components,
              libraries and platforms remain subject to their own licences. We may reference
              non-confidential aspects of delivered work in our portfolio unless you ask us in
              writing not to.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Third-party platforms</h2>
            <p>
              Delivered systems often depend on services we do not control, such as Meta&rsquo;s
              WhatsApp Business Platform, Supabase, Cloudflare or payment providers. Their
              availability, pricing and policies are theirs to change, and we are not
              responsible for outages or decisions on their side. Where a platform requires
              verification or approval, that process is outside our control.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Liability</h2>
            <p>
              We provide this website as-is and make no warranty that it will be uninterrupted
              or error-free. To the extent permitted by law, our total liability arising from
              your use of this website is limited to the amount you have paid us for the
              relevant engagement, and we are not liable for indirect or consequential loss.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Governing law</h2>
            <p>
              These terms are governed by the laws of the United Arab Emirates, and the courts
              of Dubai have jurisdiction, unless your separate written agreement with us says
              otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a className="text-violet-400 hover:text-violet-300" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-wrap gap-6 text-sm font-mono">
          <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-zinc-400 hover:text-white">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
