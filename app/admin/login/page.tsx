"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { sendMagicLink, loginAsDemoAdmin } from "./actions";
import { Logo } from "@/components/ui/logo";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const rejectedEmail = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await sendMagicLink(email, window.location.origin);
      if (res.success) {
        setMagicLinkSent(true);
        toast.success(res.message);
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

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <Logo size="lg" />
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
              Admin
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Internal Operations Portal
          </p>
        </div>

        {/* Not Authorized Alert */}
        {errorParam === "not_authorized" && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert size={16} className="text-rose-400 shrink-0" />
              Not Authorized
            </div>
            <p className="text-rose-200/80 leading-relaxed">
              {rejectedEmail ? `Account (${rejectedEmail})` : "Your account"} is not listed in the <code className="bg-black/30 px-1 py-0.5 rounded font-mono">admins</code> table. Please run the promotion SQL query in Supabase to grant access.
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 shadow-2xl space-y-6">
          {magicLinkSent ? (
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
          )}

          {/* Dev demo bypass button */}
          <div className="pt-4 border-t border-white/[0.06] text-center space-y-3">
            <p className="text-[11px] font-mono text-zinc-500">
              Developer Mode / Local Preview
            </p>
            <button
              type="button"
              onClick={() => loginAsDemoAdmin()}
              className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/30 text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles size={14} className="text-violet-400" />
              1-Click Demo Login (zaminaskari.work@gmail.com)
            </button>
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
