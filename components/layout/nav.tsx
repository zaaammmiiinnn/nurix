"use client";

import Link from "next/link";
import { useSiteConfig, toDialable } from "@/lib/hooks/use-site-config";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollProgressBar } from "@/components/ui/scroll-progress";
import { Logo } from "@/components/ui/logo";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Admin-controlled WhatsApp number, resolved at runtime so edits in the
// admin panel take effect. This was a hardcoded literal in seven files.
const FALLBACK_WA_NUMBER = "918840936715";

export function Nav() {
  const siteConfig = useSiteConfig({
    whatsappNumber: FALLBACK_WA_NUMBER,
    email: "",
    phone: "",
    calendarUrl: "",
    address: "",
    linkedin: "",
  });
  const waUrl = `https://wa.me/${toDialable(siteConfig.whatsappNumber)}?text=Hi%20NeuralWaves%2C%20I%20need%20help%20with%20automation`;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Escape closes the mobile menu, which is presented as a modal dialog.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <ScrollProgressBar />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-[#07070A]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-0"
            : "bg-transparent border-b border-transparent py-2"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              scrolled ? "h-14" : "h-18"
            )}
          >
            {/* Wordmark & Icon */}
            <Logo size="md" />

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 text-sm rounded-lg transition-all duration-150 font-normal",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-white bg-white/[0.08]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-violet-300 hover:text-white border border-violet-500/30 hover:bg-violet-500/10 transition-all">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-7 h-7 ring-1 ring-violet-500/40",
                    },
                  }}
                />
              </SignedIn>

              <Link
                href="/admin"
                title="Admin Ops Portal"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04] transition-all"
              >
                <Shield size={12} className="text-violet-400" />
                <span>Admin</span>
              </Link>
              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-150 flex items-center gap-1"
              >
                WhatsApp
                <ArrowUpRight size={12} className="opacity-70" />
              </Link>
              <Link
                href="/contact"
                className="btn-glow px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white rounded-lg"
              >
                Book a call
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="mobile-nav"
            className="md:hidden bg-[#0F0F14]/95 backdrop-blur-2xl border-t border-white/[0.08] px-4 pb-6 pt-4 space-y-1 shadow-2xl"
            role="dialog"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2.5 text-sm rounded-lg transition-colors duration-150",
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 text-zinc-400 hover:text-white font-mono"
            >
              <Shield size={14} className="text-violet-400" />
              <span>Admin Ops</span>
            </Link>

            {/* Mobile Auth Controls */}
            <div className="pt-2 pb-1">
              <SignedOut>
                <div className="grid grid-cols-2 gap-2">
                  <SignInButton mode="modal">
                    <button className="w-full py-2 text-xs font-medium text-zinc-200 border border-white/10 rounded-lg hover:bg-white/5 transition-all text-center">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full py-2 text-xs font-medium text-violet-300 border border-violet-500/30 rounded-lg hover:bg-violet-500/10 transition-all text-center">
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                  <span className="text-xs text-zinc-400">Account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-border w-full text-center px-4 py-2.5 text-sm font-medium text-white rounded-lg"
              >
                WhatsApp us
              </Link>
              <Link
                href="/contact"
                className="btn-glow w-full text-center px-4 py-2.5 text-sm font-medium text-white rounded-lg"
              >
                Book a call
              </Link>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}
