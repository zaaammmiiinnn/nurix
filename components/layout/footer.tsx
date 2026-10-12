"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useSiteConfig, toDialable } from "@/lib/hooks/use-site-config";

const SERVICES_LINKS = [
  { href: "/services/ai-chatbots", label: "AI Chatbots & WhatsApp Automation" },
  { href: "/services/ai-agents", label: "AI Agents & Autonomous Workflows" },
  { href: "/services/web-apps", label: "Web Applications & Admin Portals" },
  { href: "/services", label: "All Capabilities" },
];

const COMPANY_LINKS = [
  { href: "/work", label: "Selected Work" },
  { href: "/pricing", label: "Pricing & Scope" },
  { href: "/about", label: "About Studio" },
  { href: "/contact", label: "Project Inquiry" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function Footer() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig({
    whatsappNumber: "918840936715",
    email: "support@neuralwaves.in",
    phone: "+91-8840936715",
    calendarUrl: "https://cal.com/neuralwaves/15min",
    address: "",
    linkedin: "",
  });
  const waUrl = `https://wa.me/${toDialable(siteConfig.whatsappNumber)}?text=Hi%20NeuralWaves%2C%20I%20want%20to%20discuss%20a%20project`;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[#DCDAD2] bg-[#F5F3ED] text-[#222320]">
      <div className="container-editorial py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#DCDAD2]">
          {/* Brand & Studio Philosophy */}
          <div className="lg:col-span-5 space-y-4">
            <Logo size="md" theme="light" />
            <p className="text-sm text-[#73766D] leading-relaxed max-w-sm">
              We design and deploy production-grade AI systems, intelligent workflows, and custom software that help businesses in India and the UAE eliminate operational friction.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#73766D]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Available for Q4 sprints · UAE &amp; India</span>
            </div>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3">
            <p className="mono-label text-[#73766D]">Capabilities</p>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#222320]/80 hover:text-[#222320] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation & Company */}
          <div className="lg:col-span-2 space-y-3">
            <p className="mono-label text-[#73766D]">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#222320]/80 hover:text-[#222320] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Engagement */}
          <div className="lg:col-span-2 space-y-3">
            <p className="mono-label text-[#73766D]">Direct Contact</p>
            <div className="space-y-2 text-xs">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-[#222320] hover:underline"
              >
                <Mail size={13} className="text-[#73766D]" />
                <span className="truncate">{siteConfig.email}</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#222320] hover:underline"
              >
                <MessageCircle size={13} className="text-[#73766D]" />
                <span>WhatsApp Desk</span>
                <ArrowUpRight size={11} className="text-[#73766D]" />
              </a>

              <div className="pt-3">
                <Link
                  href="/contact"
                  className="btn-editorial-primary text-xs w-full justify-center py-2"
                >
                  Discuss Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Meta Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#73766D]">
          <div>
            © {new Date().getFullYear()} NeuralWaves AI Studio. Built with engineering discipline.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#222320]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#222320]">
              Terms
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-[#222320] flex items-center gap-1 opacity-70 hover:opacity-100"
            >
              <ShieldCheck size={12} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
