"use client";

import React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  y = 24,
  scale = 1,
  stagger = false,
  staggerDelay = 0.08,
}: RevealProps) {
  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: staggerDelay, delayChildren: delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

import type { Variants } from "framer-motion";

export const revealChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function RevealChild({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={revealChildVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (inView) {
      animate(motionValue, value, {
        duration,
        ease: "easeOut",
      });
    }
  }, [inView, value, duration, motionValue]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
  }, [rounded, prefix, suffix]);

  // Render the FINAL value in the server output.
  //
  // This previously rendered `${prefix}0${suffix}`, so crawlers and visitors
  // without JS saw "0+ projects shipped / 0-day avg delivery" in the hero. The
  // animation still starts from 0 on the client (motionValue is initialised to 0),
  // so the count-up plays for anyone with JS, but the no-JS fallback is now the
  // real figure rather than a zero.
  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
