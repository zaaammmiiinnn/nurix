// Server Component: static markup with no state, hooks or event handlers.
// It was marked "use client", which pulled it and its imports into the
// client bundle for no benefit.
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  href?: string;
}

export function NeuralWavesIcon({
  className,
  size = 28,
  glow = true,
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
      <defs>
        {/* Core Wave Gradient: Violet to Electric Cyan */}
        <linearGradient id="nw-wave-grad" x1="4" y1="36" x2="36" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Synapse Connection Line Gradient */}
        <linearGradient id="nw-synapse-grad" x1="8" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#67E8F9" />
        </linearGradient>

        {/* Ambient Glow Filter */}
        {glow && (
          <filter id="nw-glow-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Subtle outer container ring */}
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="10"
        fill="#07070A"
        fillOpacity="0.8"
        stroke="url(#nw-wave-grad)"
        strokeWidth="1"
        strokeOpacity="0.25"
      />

      {/* Main Flowing Waveform (Harmonic N to W curve) */}
      <path
        d="M 8 28 C 8 16, 13 10, 16 10 C 19 10, 20 23, 23 23 C 26 23, 27 12, 31 12 C 33 12, 33 26, 30 29"
        stroke="url(#nw-wave-grad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? "url(#nw-glow-filter)" : undefined}
      />

      {/* Interwoven Neural Synapse Track */}
      <path
        d="M 12 24 L 16 12 L 20 22 L 24 16 L 28 26"
        stroke="url(#nw-synapse-grad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 3"
        strokeOpacity="0.85"
      />

      {/* Neural Synapse Nodes */}
      {/* Node 1: Left foundation */}
      <circle cx="8" cy="28" r="2.2" fill="#8B5CF6" />
      <circle cx="8" cy="28" r="1" fill="#FFFFFF" />

      {/* Node 2: Peak N crest */}
      <circle cx="16" cy="11" r="2.4" fill="#A78BFA" />
      <circle cx="16" cy="11" r="1.1" fill="#FFFFFF" />

      {/* Node 3: Valley inflection */}
      <circle cx="21" cy="22" r="2" fill="#6366F1" />
      <circle cx="21" cy="22" r="0.9" fill="#FFFFFF" />

      {/* Node 4: Peak W crest */}
      <circle cx="27" cy="14" r="2.2" fill="#38BDF8" />
      <circle cx="27" cy="14" r="1" fill="#FFFFFF" />

      {/* Node 5: Right tail terminal */}
      <circle cx="30" cy="29" r="2.4" fill="#22D3EE" />
      <circle cx="30" cy="29" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

export function Logo({
  className,
  iconOnly = false,
  size = "md",
  glow = true,
  href = "/",
}: LogoProps) {
  const iconPixelSize = {
    sm: 22,
    md: 28,
    lg: 36,
    xl: 44,
  }[size];

  const textClasses = {
    sm: "text-base tracking-[-0.03em]",
    md: "text-lg tracking-[-0.03em]",
    lg: "text-xl tracking-[-0.04em]",
    xl: "text-2xl tracking-[-0.04em]",
  }[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 font-bold select-none group", className)}>
      <NeuralWavesIcon
        size={iconPixelSize}
        glow={glow}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      {!iconOnly && (
        <span className={cn("text-white flex items-baseline font-bold tracking-tight", textClasses)}>
          <span>Neural</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 group-hover:to-cyan-300 transition-colors">
            Waves
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="NeuralWaves home" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
