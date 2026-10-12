"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { useSiteConfig, toDialable } from "@/lib/hooks/use-site-config";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const siteConfig = useSiteConfig({
    whatsappNumber: "918840936715",
    email: "support@neuralwaves.in",
    phone: "+91-8840936715",
    calendarUrl: "https://cal.com/neuralwaves/15min",
    address: "",
    linkedin: "",
  });
  const waUrl = `https://wa.me/${toDialable(siteConfig.whatsappNumber)}?text=Hi%20NeuralWaves%2C%20I%20want%20to%20discuss%20a%20project`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Close mobile nav on route change or escape
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Do not render marketing navigation on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#F5F3ED]/90 backdrop-blur-md border-b border-[#DCDAD2] py-3.5 shadow-[0_1px_3px_rgba(34,35,32,0.02)]"
            : "bg-transparent border-b border-transparent py-5"
        )}
      >
        <div className="container-editorial flex items-center justify-between">
          {/* Left: Brand Wordmark */}
          <Logo size="md" theme="light" />

          {/* Center: Editorial Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1.5 bg-[#FFFFFF]/70 border border-[#DCDAD2] rounded-full px-3 py-1 shadow-sm"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-150",
                    isActive
                      ? "bg-[#222320] text-[#F5F3ED]"
                      : "text-[#73766D] hover:text-[#222320] hover:bg-[#F5F3ED]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Primary CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="btn-editorial-primary text-xs tracking-tight"
            >
              <span>Discuss a Project</span>
              <ArrowUpRight size={13} className="opacity-80" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#222320] hover:bg-[#FFFFFF] border border-[#DCDAD2] rounded-lg transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 bg-[#F5F3ED] flex flex-col justify-between pt-24 pb-8 px-6 md:hidden animate-in fade-in duration-200"
        >
          {/* Navigation Links */}
          <div className="space-y-6">
            <div className="mono-label text-[#73766D] border-b border-[#DCDAD2] pb-3">
              Index
            </div>
            <nav className="flex flex-col space-y-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, idx) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between py-2 text-2xl font-serif tracking-tight border-b border-[#DCDAD2]/50",
                      isActive ? "text-[#222320] font-medium" : "text-[#73766D]"
                    )}
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-[#73766D]">
                      0{idx + 1}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-6 border-t border-[#DCDAD2]">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full btn-editorial-primary justify-center py-3.5 text-sm"
            >
              <span>Discuss a Project</span>
              <ArrowUpRight size={14} />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-editorial-secondary justify-center py-3.5 text-sm"
            >
              <span>WhatsApp Direct</span>
              <ArrowUpRight size={14} />
            </a>

            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-[#73766D]">
              <span>UAE & INDIA ENGINEERING STUDIO</span>
              <span>support@neuralwaves.in</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
