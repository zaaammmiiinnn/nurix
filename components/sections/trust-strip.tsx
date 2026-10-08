"use client";

import React from "react";

const EMIRATES = [
  "DUBAI",
  "ABU DHABI",
  "SHARJAH",
  "AJMAN",
  "RAS AL KHAIMAH",
  "FUJAIRAH",
  "UMM AL QUWAIN",
];

export function TrustStrip() {
  return (
    <section
      className="relative border-y border-white/[0.08] bg-[#07070A] py-6 overflow-hidden select-none"
      aria-label="Serving all 7 Emirates"
    >
      {/* Fade mask on left & right edges */}
      <div className="absolute inset-0 pointer-events-none z-10 marquee-mask" aria-hidden="true" />

      {/* Marquee track */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex items-center will-change-transform">
          {/* First loop */}
          <div className="flex items-center gap-8 px-4 shrink-0">
            {EMIRATES.map((emirate, idx) => (
              <React.Fragment key={`e1-${idx}`}>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">
                  {emirate}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-500/60 shrink-0"
                  aria-hidden="true"
                />
              </React.Fragment>
            ))}
          </div>

          {/* Duplicate loop for seamless infinite animation */}
          <div className="flex items-center gap-8 px-4 shrink-0" aria-hidden="true">
            {EMIRATES.map((emirate, idx) => (
              <React.Fragment key={`e2-${idx}`}>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">
                  {emirate}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-500/60 shrink-0"
                  aria-hidden="true"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
