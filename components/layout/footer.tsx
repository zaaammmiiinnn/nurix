"use client";

import Link from "next/link";
import { useSiteConfig, toDialable } from "@/lib/hooks/use-site-config";
import { SITE_CONFIG } from "@/lib/data/site-data";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const SERVICES_LINKS = [
  { href: "/services/chatbots", label: "AI Chatbots & WhatsApp" },
  { href: "/services/dashboards", label: "Web & Admin Dashboards" },
  { href: "/services/agents", label: "AI Agents for Business" },
];

const COMPANY_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin Portal" },
];

// Admin-controlled WhatsApp number, resolved at runtime so edits in the
// admin panel take effect. This was a hardcoded literal in seven files.
const FALLBACK_WA_NUMBER = "918840936715";

export function Footer() {
  // Static defaults so the footer never renders blank while /api/site-config
  // resolves; the runtime values then override them.
  const siteConfig = useSiteConfig({
    whatsappNumber: FALLBACK_WA_NUMBER,
    email: SITE_CONFIG.contact.email,
    phone: SITE_CONFIG.contact.phone,
    calendarUrl: SITE_CONFIG.contact.calUrl,
    address: "",
    linkedin: "",
  });
  const waUrl = `https://wa.me/${toDialable(siteConfig.whatsappNumber)}?text=Hi%20NeuralWaves%2C%20I%20need%20help%20with%20automation`;
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-white/[0.06] bg-signal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-signal-muted leading-relaxed">
              AI that ships.
              <br />
              Fast, fixed-price AI &amp; automation
              <br />
              for UAE businesses.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-signal-muted">
              <MapPin size={14} className="text-signal-violet shrink-0" />
              <span>Dubai, UAE</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="mono-label mb-4">Services</p>
            <ul className="space-y-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-signal-muted hover:text-signal-text transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mono-label mb-4">Company</p>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-signal-muted hover:text-signal-text transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mono-label mb-4">Get in touch</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-signal-muted hover:text-signal-text transition-colors duration-150 group"
                >
                  <MessageCircle
                    size={14}
                    className="text-signal-violet group-hover:text-signal-cyan transition-colors"
                  />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-sm text-signal-muted hover:text-signal-text transition-colors duration-150 group"
                >
                  <Mail size={14} className="text-signal-violet" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${toDialable(siteConfig.phone)}`}
                  className="text-sm text-signal-muted hover:text-signal-text transition-colors duration-150"
                >
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-signal-muted">
            © {new Date().getFullYear()} NeuralWaves. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {/* Required disclosures: the site collects enquiry and chat data and
                sets a chat identifier, so these must be reachable from every page. */}
            <Link
              href="/privacy"
              className="mono-label text-[0.65rem] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="mono-label text-[0.65rem] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/admin"
              className="mono-label text-[0.65rem] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <ShieldCheck size={11} className="text-violet-400" />
              <span>Admin Ops</span>
            </Link>
            <p className="mono-label text-[0.6rem]">
              {/* Positioning agreed with the operator: engineering delivered from
                  India for clients across the UAE — stated plainly rather than
                  implied by a "Made in Dubai" badge contradicted by a +91 number. */}
              Engineered in India · Serving the UAE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
