import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  href?: string;
  theme?: "light" | "dark" | "auto";
}

export function NeuralWavesIcon({
  className,
  size = 28,
  glow = false,
}: {
  className?: string;
  size?: number;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="8"
        fill="#222320"
        stroke="#DCDAD2"
        strokeWidth="1"
      />
      {/* Wave Sine Path */}
      <path
        d="M 8 20 C 13 10, 15 30, 20 20 C 25 10, 27 30, 32 20"
        stroke="#F5F3ED"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Precision Micro Nodes */}
      <circle cx="8" cy="20" r="1.5" fill="#F5F3ED" />
      <circle cx="20" cy="20" r="1.5" fill="#F5F3ED" />
      <circle cx="32" cy="20" r="1.5" fill="#F5F3ED" />
    </svg>
  );
}

export function Logo({
  className,
  iconOnly = false,
  size = "md",
  glow = false,
  href = "/",
  theme = "auto",
}: LogoProps) {
  const iconPixelSize = {
    sm: 22,
    md: 28,
    lg: 34,
    xl: 42,
  }[size];

  const textClasses = {
    sm: "text-sm tracking-[-0.03em]",
    md: "text-base tracking-[-0.03em]",
    lg: "text-lg tracking-[-0.04em]",
    xl: "text-xl tracking-[-0.04em]",
  }[size];

  const textColorClass =
    theme === "light"
      ? "text-[#222320]"
      : theme === "dark"
      ? "text-white"
      : "text-[#222320]";

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 font-medium select-none group", className)}>
      <NeuralWavesIcon
        size={iconPixelSize}
        glow={glow}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      {!iconOnly && (
        <span className={cn("font-display font-medium leading-none tracking-tight flex items-center gap-1", textClasses, textColorClass)}>
          <span>NeuralWaves</span>
          <span className="font-mono text-[9px] text-[#73766D] border border-[#DCDAD2] px-1 py-0.2 rounded uppercase ml-1">
            LABS
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none" aria-label="NeuralWaves Home">
        {content}
      </Link>
    );
  }

  return content;
}
