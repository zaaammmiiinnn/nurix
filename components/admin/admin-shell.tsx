"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Cpu,
  Tag,
  MessageSquare,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  Menu,
  X,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AdminUserNav } from "@/components/admin/admin-user-nav";

interface AdminShellProps {
  children: React.ReactNode;
  adminEmail: string;
  isClerkAuth?: boolean;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/chats", label: "Chats", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Cpu },
  { href: "/admin/pricing", label: "Pricing", icon: Tag },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, adminEmail, isClerkAuth }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute active title
  const activeItem = NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );
  const pageTitle = activeItem ? activeItem.label : "Admin";

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 flex flex-col md:flex-row select-none">
      {/* ── Sidebar Desktop (240px) ── */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/[0.08] bg-[#0A0A0F] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Logo size="sm" href="/admin" />
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300">
              Ops
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Site"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/15 border border-violet-500/30 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-violet-400" : "text-zinc-500"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile & sign out */}
        <div className="p-3 border-t border-white/[0.08]">
          <AdminUserNav adminEmail={adminEmail} isClerkAuth={isClerkAuth} />
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-white/[0.08] bg-[#0A0A0F] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo size="sm" href="/admin" />
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300">
            Admin
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg border border-white/[0.08]"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-[#0A0A0F]/95 backdrop-blur-xl z-30 p-4 flex flex-col justify-between">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-violet-600/20 text-white border border-violet-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors"
            >
              <ArrowLeft size={14} className="text-violet-400" />
              <span>Back to Live Website</span>
            </Link>
            <AdminUserNav adminEmail={adminEmail} isClerkAuth={isClerkAuth} />
          </div>
        </div>
      )}

      {/* ── Main View Container ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 border-b border-white/[0.08] bg-[#07070A]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <h1 className="text-base font-medium text-white">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full">
              {adminEmail}
            </span>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-violet-500/30 transition-all shadow-sm"
            >
              <ArrowLeft size={13} className="text-violet-400" />
              <span>Live Website</span>
            </Link>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
