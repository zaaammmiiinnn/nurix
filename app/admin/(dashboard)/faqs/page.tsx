import React from "react";
import { HelpCircle, Plus } from "lucide-react";
import { FAQS_DATA } from "@/lib/data/site-data";

export default function AdminFaqsPage() {
  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Content · Frequently Asked Questions
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            FAQs &amp; Objection Handling
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Standard studio answers for fixed pricing, delivery timeframes, IP ownership, and integrations
          </p>
        </div>

        <button
          type="button"
          className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md opacity-90 cursor-default self-start sm:self-auto"
        >
          <Plus size={14} />
          Add Question
        </button>
      </div>

      {/* ── FAQs Table / Accordion List ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Live FAQ Items</h2>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {FAQS_DATA.length} questions live
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {FAQS_DATA.map((faq, index) => (
            <div key={index} className="p-6 hover:bg-white/[0.01] transition-colors space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-violet-400 shrink-0 mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {faq.question}
                  </h3>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-zinc-400 border border-white/[0.08] shrink-0">
                  {faq.category}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
