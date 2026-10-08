"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);

  // 300ms smooth spring lag
  const springConfig = { damping: 28, stiffness: 140, mass: 0.6 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    // Disable on touch screens or small devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-30 hidden lg:block"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      aria-hidden="true"
    >
      <div
        className="w-[420px] h-[420px] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(34, 211, 238, 0.02) 40%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
