import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy — NeuralWaves",
  description:
    "How NeuralWaves collects, uses and stores personal data submitted through the website, inquiry forms and WhatsApp.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const LAST_UPDATED = "12 October 2026";

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <div className="container-editorial max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">PRIVACY POLICY</span>
        </nav>

        <div className="border border-stone bg-white p-8 md:p-14 space-y-10">
          <div className="border-b border-stone/70 pb-6">
            <span className="mono-label text-[10px] text-olive uppercase block mb-2">
              LEGAL GOVERNANCE // DATA PRIVACY
            </span>
            <h1 className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-olive">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans">
            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">1. Who We Are</h2>
              <p className="text-olive">
                {BRAND.name} is an AI engineering and custom software studio providing services to clients across India and the United Arab Emirates (UAE). This policy outlines our data processing standards when you submit inquiries or interact with our systems.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">2. Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-olive">
                <li>
                  <strong className="text-charcoal">Project Inquiry Forms:</strong> Your name, work email address, phone/WhatsApp number, company name, selected market, project category, and project brief details.
                </li>
                <li>
                  <strong className="text-charcoal">WhatsApp Communications:</strong> When you initiate contact via WhatsApp, Meta transmits your phone number, display profile name, and conversation text to our secure desk.
                </li>
                <li>
                  <strong className="text-charcoal">Technical Infrastructure Logs:</strong> Basic server access logs (IP address, user agent, timestamps) for performance and anti-abuse monitoring. We do not use intrusive third-party cross-site advertising pixels.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">3. How We Use Data</h2>
              <p className="text-olive">
                Your information is used strictly to evaluate project feasibility, prepare architectural scope proposals, communicate sprint updates, and deliver software. We never sell your personal information or share customer briefs with third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">4. Artificial Intelligence & Client Confidentiality</h2>
              <p className="text-olive">
                We maintain strict data residency protocols. Proprietary client code, operational documents, and customer communications submitted for automation are processed via private API endpoints and are never used to train public foundation models.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-medium text-lg text-charcoal">5. Contact & Data Subject Rights</h2>
              <p className="text-olive">
                To request data deletion, review records, or ask questions regarding our privacy practices, contact our privacy desk directly at{" "}
                <a href="mailto:support@neuralwaves.in" className="text-charcoal underline font-mono">
                  support@neuralwaves.in
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
