"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Loader2,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { sendMagicLink, loginAsDemoAdmin } from "./actions";
import { Logo } from "@/components/ui/logo";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const rejectedEmail = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showDemoBypass, setShowDemoBypass] = useState(false);

  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = Boolean(
    clerkKey && !clerkKey.includes("YOUR_") && clerkKey.startsWith("pk_")
  );

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await sendMagicLink(email, window.location.origin);
      if (res.success) {
        toast.success(res.message);
        if (res.directLogin) {
          setTimeout(() => {
            window.location.href = "/admin";
          }, 600);
        } else {
          setMagicLinkSent(true);
        }
      } else {
        toast.error(res.message || "Failed to send magic link");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#07070A] relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <Logo size="lg" />
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
              Admin Ops
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Secure Authentication Portal
          </p>
        </div>

        {/* Security / Verification Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] py-1.5 px-3 rounded-full mx-auto w-fit">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Restricted to Verified Administrators Only</span>
        </div>

        {/* Error Alert from redirect */}
        {errorParam === "not_authorized" && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert size={16} className="text-rose-400 shrink-0" />
              Access Denied
            </div>
            <p className="text-rose-200/80 leading-relaxed">
              {rejectedEmail ? `Account (${rejectedEmail})` : "Your account"} is not authorized to access the admin portal.
            </p>
          </div>
        )}

        {/* Card: Clerk or Magic Link */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 shadow-2xl space-y-6">
          {isClerkEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
                <Lock size={14} className="text-violet-400" />
                <span>Clerk Verified Admin Sign In</span>
              </div>

              <div className="flex justify-center w-full">
                <SignIn
                  routing="hash"
                  fallbackRedirectUrl="/admin"
                  forceRedirectUrl="/admin"
                  appearance={{
                    baseTheme: dark,
                    variables: {
                      colorPrimary: "#8B5CF6",
                      colorBackground: "transparent",
                      colorInputBackground: "rgba(255, 255, 255, 0.04)",
                      colorInputText: "#ffffff",
                      colorText: "#ffffff",
                      colorTextSecondary: "#a1a1aa",
                      borderRadius: "0.75rem",
                    },
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none p-0 w-full",
                      headerTitle: "text-white text-base font-semibold",
                      headerSubtitle: "text-zinc-400 text-xs font-mono",
                      socialButtonsBlockButton:
                        "bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white text-xs py-2.5 transition-all",
                      socialButtonsBlockButtonText: "text-zinc-200 font-medium text-xs",
                      formButtonPrimary:
                        "bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-2.5 shadow-lg shadow-violet-600/30 transition-all",
                      formFieldInput:
                        "bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-xl focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60",
                      footerActionLink: "text-violet-400 hover:text-violet-300 text-xs",
                      footer: "hidden",
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            /* Fallback Magic Link */
            magicLinkSent ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-400">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">Check your email</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    We sent a magic sign-in link to <span className="text-white font-mono">{email}</span>. Click the link to log in.
                  </p>
                </div>
                <button
                  onClick={() => setMagicLinkSent(false)}
                  className="text-xs font-mono text-violet-400 hover:underline pt-2 block mx-auto"
                >
                  Use another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="zaminaskari.work@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Magic Link...
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )
          )}

          {/* Dev demo bypass button */}
          <div className="pt-4 border-t border-white/[0.06] text-center space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Developer Preview Mode</span>
              <button
                type="button"
                onClick={() => setShowDemoBypass((v) => !v)}
                className="text-violet-400 hover:underline"
              >
                {showDemoBypass ? "Hide" : "Show Option"}
              </button>
            </div>

            {(showDemoBypass || !isClerkEnabled) && (
              <form action={loginAsDemoAdmin}>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/30 text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles size={14} className="text-violet-400" />
                  1-Click Demo Login (zaminaskari.work@gmail.com)
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to neuralwaves.in
          </Link>
        </div>
      </div>
    </div>
  );
}
