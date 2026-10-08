"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, MapPin } from "lucide-react";

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
];

const WA_URL =
  "https://wa.me/971000000000?text=Hi%20Nurix%2C%20I%20need%20help%20with%20automation";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-white/[0.06] bg-signal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-0.5 font-bold text-xl tracking-[-0.04em] text-signal-text"
            >
              nur
              <span className="relative inline-flex items-center justify-center">
                i
                <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-signal-violet" />
              </span>
              x
            </Link>
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
                  href={WA_URL}
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
                  href="mailto:hello@nurix.ae"
                  className="flex items-center gap-2 text-sm text-signal-muted hover:text-signal-text transition-colors duration-150 group"
                >
                  <Mail size={14} className="text-signal-violet" />
                  {/* TODO: Replace with real email */}
                  hello@nurix.ae
                </a>
              </li>
              <li>
                <a
                  href="tel:+971000000000"
                  className="text-sm text-signal-muted hover:text-signal-text transition-colors duration-150"
                >
                  {/* TODO: Replace with real UAE phone */}
                  +971 00 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-signal-muted">
            © {new Date().getFullYear()} Nurix. All rights reserved.
          </p>
          <p className="mono-label text-[0.6rem]">Made in Dubai 🇦🇪</p>
        </div>
      </div>
    </footer>
  );
}
