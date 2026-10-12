import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, Smartphone, Lock } from "lucide-react";
import { DashboardSimulator } from "@/components/services/dashboard-simulator";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Web Applications & Admin Dashboards — NeuralWaves",
  description:
    "Replace scattered tools with one clear view. Custom operational portals, real-time dashboards, and secure internal tools built on Next.js & PostgreSQL.",
  alternates: {
    canonical: `${SITE_URL}/services/web-apps`,
  },
};

const FEATURES = [
  {
    icon: Lock,
    title: "Authentication & Role-Based Access (RBAC)",
    desc: "Granular permission layers ensuring managers, field staff, and clients only see data strictly relevant to their specific role.",
  },
  {
    icon: Database,
    title: "PostgreSQL & Low-Latency WebSockets",
    desc: "High-performance data models on Supabase PostgreSQL with real-time reactive streaming without manual page refreshes.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Engineered Viewports",
    desc: "Engineered specifically for busy managers on iPhones and iPads as well as desktop operations monitoring suites.",
  },
  {
    icon: ShieldCheck,
    title: "Automated Testing & 100% IP Handover",
    desc: "Unit tested, TypeScript verified, and deployed to your own Cloudflare/Vercel and AWS/Supabase tenants with zero lock-in.",
  },
];

export default function WebAppsPage() {
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
          <span className="text-charcoal uppercase">WEB APPS & DASHBOARDS</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              OPERATIONAL INTERFACES · NEXT.JS & SUPABASE
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            Replace scattered tools with one clear view.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed font-sans max-w-2xl">
            Spreadsheets break as your team scales. We replace ad-hoc tables and bloated third-party SaaS subscriptions with bespoke web applications that give leadership instant visibility into live operations.
          </p>
        </div>

        {/* Interactive Dashboard Demonstration */}
        <div className="mb-20 md:mb-28">
          <DashboardSimulator />
        </div>

        {/* Technical Architecture Pillars */}
        <div className="border-t border-stone/80 pt-16 mb-20">
          <div className="mb-10 max-w-2xl">
            <span className="mono-label text-[10px] text-olive uppercase">ENGINEERING STANDARDS</span>
            <h2 className="font-display font-medium text-3xl text-charcoal mt-2">
              Built on Modern Enterprise Foundations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-8 border border-stone bg-white space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-stone/60">
                    <span className="mono-label text-[10px] text-olive uppercase">SYSTEM SPEC 0{idx + 1}</span>
                    <Icon className="w-4 h-4 text-charcoal" />
                  </div>
                  <h3 className="font-display font-medium text-xl text-charcoal">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Guidance & CTA Card */}
        <div className="border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">APPLICATION SPRINT</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Ready to unify your internal operations?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              Custom dashboards ship in 1 to 2 weeks starting from AED 7,500. Fully documented and delivered with 100% intellectual property ownership.
            </p>
          </div>

          <Link
            href="/contact?service=dashboards"
            className="px-6 py-3.5 bg-white text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone transition-colors shrink-0"
          >
            Discuss Dashboard Sprint →
          </Link>
        </div>
      </div>
    </div>
  );
}
