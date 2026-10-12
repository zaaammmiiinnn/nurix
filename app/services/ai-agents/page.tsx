import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AgentWorkflowVisualizer } from "@/components/services/agent-workflow-visualizer";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Agents & Autonomous Workflows — NeuralWaves",
  description:
    "From repetitive tasks to intelligent workflows. Autonomous background workers for document extraction, compliance validation, and CRM reconciliation.",
  alternates: {
    canonical: `${SITE_URL}/services/ai-agents`,
  },
};

const AGENT_CAPABILITIES = [
  {
    title: "Document & Invoice Processing",
    desc: "Extract structured line items from PDFs, scanned trade licenses, and supplier receipts directly into your database with 99%+ accuracy.",
  },
  {
    title: "Market & Competitor Research",
    desc: "Autonomous bots tracking government tenders, port tariffs, or competitor catalogs with daily structured briefing summaries on WhatsApp.",
  },
  {
    title: "Multi-Step CRM & ERP Sync",
    desc: "Automatically enrich incoming prospects, verify business email authenticity, and synchronize account profiles across fragmented systems.",
  },
  {
    title: "Human Approval Checkpoints",
    desc: "Deterministic policy evaluation: actions exceeding predefined budget thresholds require instant 1-click human executive authorization.",
  },
];

export default function AiAgentsPage() {
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
          <span className="text-charcoal uppercase">AI AGENTS</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              AUTONOMOUS WORKFLOWS · DETERMINISTIC AGENTS
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            From repetitive tasks to intelligent workflows.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed font-sans max-w-2xl">
            Free your high-cost knowledge workers from copying spreadsheet data and verifying scanned invoices. We build deterministic AI agents that gather data, enforce business rules, and safely update your production systems.
          </p>
        </div>

        {/* Visual 5-Stage Workflow Pipeline */}
        <div className="mb-20 md:mb-28">
          <AgentWorkflowVisualizer />
        </div>

        {/* Practical Capabilities Grid */}
        <div className="border-t border-stone/80 pt-16 mb-20">
          <div className="mb-10 max-w-2xl">
            <span className="mono-label text-[10px] text-olive uppercase">SYSTEM DOMAINS</span>
            <h2 className="font-display font-medium text-3xl text-charcoal mt-2">
              Where AI Agents Deliver Measurable ROI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AGENT_CAPABILITIES.map((cap, idx) => (
              <div key={idx} className="p-8 border border-stone bg-white space-y-3">
                <span className="mono-label text-[10px] text-olive uppercase">0{idx + 1} {"//"} CAPABILITY</span>
                <h3 className="font-display font-medium text-xl text-charcoal">{cap.title}</h3>
                <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Honest Limitations & Governance Notice */}
        <div className="border border-stone bg-white p-8 md:p-10 mb-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal font-semibold">
            <ShieldCheck className="w-4 h-4 text-charcoal" />
            <span>HONEST GOVERNANCE & REAL LIMITATIONS</span>
          </div>
          <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">
            We do not believe in unchecked autonomy. Autonomous agents should never commit financial disbursements, execute legal signatures, or modify production databases without verified schema constraints. NeuralWaves implements immutable audit logs, rate limiters, and human approval gates on all critical endpoints.
          </p>
        </div>

        {/* Pricing Guidance & CTA Card */}
        <div className="border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">AUTONOMOUS SPRINT</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Ready to automate your back-office pipeline?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              Agent deployments start from AED 7,500 with complete architecture blueprint, staging sandboxes, and full code handover.
            </p>
          </div>

          <Link
            href="/contact?service=agents"
            className="px-6 py-3.5 bg-white text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone transition-colors shrink-0"
          >
            Discuss Agent Workflow →
          </Link>
        </div>
      </div>
    </div>
  );
}
