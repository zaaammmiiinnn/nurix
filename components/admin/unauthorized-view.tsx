"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, LogOut, ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { signOutAdmin } from "@/app/admin/login/actions";
import { Logo } from "@/components/ui/logo";

interface UnauthorizedViewProps {
  status: "unverified" | "unauthorized";
  email: string;
  authProvider: "clerk" | "supabase";
  message?: string;
}

export function UnauthorizedView({
  status,
  email,
  authProvider,
  message,
}: UnauthorizedViewProps) {
  const isUnverified = status === "unverified";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#07070A] relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: isUnverified
            ? "radial-gradient(circle, #F59E0B 0%, #EF4444 50%, transparent 70%)"
            : "radial-gradient(circle, #EF4444 0%, #8B5CF6 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <Logo size="lg" />
            <span
              className={`font-mono text-xs uppercase px-2 py-0.5 rounded-full border ${
                isUnverified
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {isUnverified ? "Unverified User" : "Access Denied (403)"}
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Internal Operations Portal · Security Verification
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                isUnverified
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/10"
              }`}
            >
              {isUnverified ? <AlertTriangle size={28} /> : <ShieldAlert size={28} />}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                {isUnverified
                  ? "Email Verification Required"
                  : "Unauthorized Account"}
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                {message ||
                  (isUnverified
                    ? "You have signed in, but your account email address has not been verified. Only verified users can enter the NeuralWaves admin dashboard."
                    : "You are signed in as a verified user, but this email address is not listed in the authorized administrator whitelist.")}
              </p>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Active Account:</span>
              <span className="text-white font-medium truncate max-w-[220px]" title={email}>
                {email}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Verification Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                  isUnverified
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {isUnverified ? (
                  <>
                    <AlertTriangle size={12} />
                    Unverified
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} />
                    Email Verified
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Auth Provider:</span>
              <span className="text-zinc-300 uppercase text-[11px]">
                {authProvider}
              </span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 text-xs space-y-2 text-zinc-400">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-zinc-300">
              <MailCheck size={14} className="text-violet-400 shrink-0" />
              How to resolve access:
            </div>
            {isUnverified ? (
              <p className="leading-relaxed text-zinc-400">
                1. Check your email inbox for the verification link sent by Clerk.
                <br />
                2. Click the link to verify your email address.
                <br />
                3. Return to this page and refresh to access the portal.
              </p>
            ) : (
              <p className="leading-relaxed text-zinc-400">
                Ask an existing administrator to add your address to the{" "}
                <code className="text-violet-300 font-mono">ADMIN_EMAILS</code> environment
                variable or to the <code className="text-violet-300 font-mono">admins</code>{" "}
                database table.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {authProvider === "clerk" ? (
              <SignOutButton redirectUrl="/admin/login">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-rose-600/80 hover:bg-rose-600 border border-rose-500/40 flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20"
                >
                  <LogOut size={14} />
                  Sign Out / Switch Account
                </button>
              </SignOutButton>
            ) : (
              <form action={signOutAdmin}>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-rose-600/80 hover:bg-rose-600 border border-rose-500/40 flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20"
                >
                  <LogOut size={14} />
                  Sign Out / Switch Account
                </button>
              </form>
            )}

            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} />
              Return to neuralwaves.in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
