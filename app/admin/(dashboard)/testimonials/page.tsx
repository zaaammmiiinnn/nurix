import React from "react";
import { Star, CheckCircle2, Building, Plus } from "lucide-react";

interface Testimonial {
  clientName: string;
  clientRole: string;
  company: string;
  content: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    clientName: "Tariq Mansour",
    clientRole: "Managing Director",
    company: "Gulf Skyline Real Estate, Dubai",
    content:
      "NeuralWaves delivered our WhatsApp concierge in exactly 5 days. We captured 34 qualified property viewings in our first weekend without our brokers working overtime. Best agency investment we made this year.",
    rating: 5,
    isActive: true,
    sortOrder: 1,
  },
  {
    clientName: "Farah Al Hashimi",
    clientRole: "Head of Operations",
    company: "Karak Express Hospitality, Abu Dhabi",
    content:
      "Replacing our branch reporting spreadsheets with NeuralWaves's custom admin portal saved our ops managers 15 hours every single week. Fast, direct, zero corporate nonsense.",
    rating: 5,
    isActive: true,
    sortOrder: 2,
  },
  {
    clientName: "Vikram Mehta",
    clientRole: "Founder & CEO",
    company: "Apex Courier & Freight, Dubai",
    content:
      "Traditional agencies in Dubai quoted us 3 months and AED 60,000 for what NeuralWaves built in 7 business days for a fixed fee. The system is rock solid and handles all our client inquiries.",
    rating: 5,
    isActive: true,
    sortOrder: 3,
  },
];

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Social Proof · Client Reviews
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Client Testimonials &amp; Quotes
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Verified feedback from UAE founders, ops managers, and business leaders
          </p>
        </div>

        <button
          type="button"
          className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md opacity-90 cursor-default self-start sm:self-auto"
        >
          <Plus size={14} />
          Add Testimonial
        </button>
      </div>

      {/* ── Testimonials Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.clientName}
            className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Active
                </span>
              </div>

              <blockquote className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;{t.content}&rdquo;
              </blockquote>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300 text-sm">
                {t.clientName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold text-white truncate">
                  {t.clientName}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  {t.clientRole}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 truncate flex items-center gap-1">
                  <Building size={10} /> {t.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
