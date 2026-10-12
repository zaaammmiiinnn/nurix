import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { WhatsAppSimulator } from "@/components/services/whatsapp-simulator";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Chatbots & WhatsApp Automation — NeuralWaves",
  description:
    "Turn conversations into completed work. Production-grade WhatsApp bots, bilingual Arabic/English NLP, and automated CRM sync for businesses in UAE & India.",
  alternates: {
    canonical: `${SITE_URL}/services/ai-chatbots`,
  },
};

const DELIVERABLES = [
  "Official Meta WhatsApp Business Cloud API setup (zero per-message broker markup)",
  "Bilingual Arabic (MSA & Khaleeji dialects) and English NLP intent routing",
  "Automated lead qualification and real-time CRM insertion (HubSpot, Salesforce, Zoho)",
  "Cal.com and Google Calendar synchronization for instant viewing/appointment bookings",
  "Deterministic guardrails with instant human takeover escalation protocol",
  "Staging sandbox environment with 100+ edge-case test dialog simulations",
];

const INTEGRATIONS = [
  "Meta WhatsApp Cloud API",
  "OpenAI GPT-4o / Anthropic Claude 3.5",
  "Supabase PostgreSQL",
  "HubSpot & Zoho CRM",
  "Cal.com & Google Calendar",
  "Custom REST Webhooks & Zapier",
];

export default function AiChatbotsPage() {
  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <div className="container-editorial">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <Link href="/services" className="hover:text-charcoal transition-colors">
            SERVICES
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">AI CHATBOTS</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              CONVERSATIONAL AUTOMATION · META CLOUD API
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            Turn conversations into completed work.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed font-sans max-w-2xl">
            In the UAE and India, high-value commerce begins on WhatsApp. We design and deploy autonomous assistants that qualify prospective clients, schedule meetings, and write verified records into your database 24/7.
          </p>
        </div>

        {/* Interactive WhatsApp Simulator */}
        <div className="mb-20 md:mb-28">
          <WhatsAppSimulator />
        </div>

        {/* Practical Applications & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-stone/80 pt-16 mb-20">
          <div className="lg:col-span-5 space-y-4">
            <span className="mono-label text-[10px] text-olive uppercase">PRACTICAL SCOPE</span>
            <h2 className="font-display font-medium text-3xl text-charcoal">
              Production Capabilities
            </h2>
            <p className="text-sm text-olive leading-relaxed font-sans">
              Unlike generic chatbot builders with monthly seat licenses, we engineer bespoke code directly connected to your official Meta WhatsApp Business Cloud account.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DELIVERABLES.map((item, idx) => (
              <div key={idx} className="p-4 border border-stone bg-white flex items-start gap-3">
                <Check className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                <span className="text-xs text-charcoal font-sans leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Integrations Strip */}
        <div className="border border-stone bg-white p-8 mb-20">
          <span className="mono-label block text-[10px] text-olive uppercase mb-4">
            VERIFIED INTEGRATION STACK
          </span>
          <div className="flex flex-wrap gap-3">
            {INTEGRATIONS.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs font-mono bg-canvas border border-stone text-charcoal"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Guidance & CTA Card */}
        <div className="border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">COMMERCIAL SPRINT</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Ready to automate your WhatsApp inquiries?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              Standard conversational deployments range from AED 2,500 to AED 3,500 with guaranteed 5–7 day delivery and 30-day post-launch warranty.
            </p>
          </div>

          <Link
            href="/contact?service=chatbots"
            className="px-6 py-3.5 bg-white text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone transition-colors shrink-0"
          >
            Discuss Chatbot Sprint →
          </Link>
        </div>
      </div>
    </div>
  );
}
