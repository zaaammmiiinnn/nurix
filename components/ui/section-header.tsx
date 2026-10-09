"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string; // e.g., "01 / SERVICES"
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /**
   * Applied to the <h2>. Sections reference this via aria-labelledby, which was
   * previously pointing at ids that were never rendered — six dangling
   * references across the site, so assistive tech could not name those regions.
   */
  id?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className = "",
  id,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`mb-16 md:mb-20 ${isCenter ? "text-center max-w-3xl mx-auto" : "max-w-3xl"} ${className}`}
    >
      {/* Monospace label with 24px violet line */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        <span
          className="w-6 h-[1px] bg-violet-500/40 inline-block"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          {label}
        </span>
      </div>

      {/* Title */}
      <h2
        id={id}
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-zinc-100 leading-[1.08] mb-4"
      >
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
