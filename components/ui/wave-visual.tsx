"use client";

import React, { useEffect, useRef } from "react";

interface WaveVisualProps {
  className?: string;
}

export function WaveVisual({ className = "" }: WaveVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Pointer target and current position for smooth inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isHovering = false;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = (e.clientY - rect.top) / rect.height;
      isHovering = true;
    };

    const handlePointerLeave = () => {
      isHovering = false;
      targetMouseX = 0.5;
      targetMouseY = 0.5;
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    // Initial mouse center
    mouseX = 0.5;
    mouseY = 0.5;
    targetMouseX = 0.5;
    targetMouseY = 0.5;

    // Wave parameters: 5 harmonic layered wave tracks
    const waves = [
      { frequency: 0.008, speed: 0.015, amplitude: 38, phase: 0, opacity: 0.55, width: 1.25 },
      { frequency: 0.012, speed: -0.018, amplitude: 26, phase: 1.2, opacity: 0.35, width: 1.0 },
      { frequency: 0.006, speed: 0.009, amplitude: 44, phase: 2.8, opacity: 0.25, width: 1.0 },
      { frequency: 0.015, speed: -0.012, amplitude: 18, phase: 4.1, opacity: 0.18, width: 0.75 },
      { frequency: 0.02, speed: 0.022, amplitude: 14, phase: 5.5, opacity: 0.12, width: 0.75 },
    ];

    // Discrete nodes along the primary wave
    const nodeCount = 7;

    const render = () => {
      // Smooth dampening of mouse coords
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      time += prefersReducedMotion ? 0.002 : 0.018;

      ctx.clearRect(0, 0, width, height);

      // Subtle architectural grid backdrop lines
      const gridSpacing = 48;
      ctx.strokeStyle = "rgba(220, 218, 210, 0.45)"; // Stone hairline
      ctx.lineWidth = 0.5;

      // Vertical grid lines
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      const centerY = height * 0.52;
      const mouseInfluenceY = (mouseY - 0.5) * 50;

      // Draw harmonic wave ribbons
      waves.forEach((wave, waveIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34, 35, 32, ${wave.opacity})`; // Charcoal with alpha
        ctx.lineWidth = wave.width;

        const points: { x: number; y: number }[] = [];
        const step = 4;

        for (let x = 0; x <= width; x += step) {
          const normalizedX = x / width;
          // Gaussian envelope so waves taper gracefully at edges
          const envelope = Math.sin(normalizedX * Math.PI);

          // Interaction influence: distance from mouseX
          const distToMouse = Math.abs(normalizedX - mouseX);
          const cursorBulge = isHovering
            ? Math.exp(-distToMouse * 6) * mouseInfluenceY * 0.8
            : 0;

          const y =
            centerY +
            Math.sin(x * wave.frequency + time * wave.speed * 20 + wave.phase) *
              wave.amplitude *
              envelope +
            Math.cos(x * (wave.frequency * 0.6) - time * 0.4 + waveIdx) *
              (wave.amplitude * 0.35) *
              envelope +
            cursorBulge;

          points.push({ x, y });
        }

        if (points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }

        // Connect primary and secondary waves with delicate vertical interconnect ribs
        if (waveIdx === 0) {
          ctx.strokeStyle = "rgba(115, 118, 109, 0.22)"; // Olive grey
          ctx.lineWidth = 0.5;

          const ribCount = 14;
          for (let r = 1; r < ribCount; r++) {
            const rx = (width / ribCount) * r;
            const normX = rx / width;
            const env = Math.sin(normX * Math.PI);
            const y1 =
              centerY +
              Math.sin(rx * waves[0].frequency + time * waves[0].speed * 20 + waves[0].phase) *
                waves[0].amplitude *
                env;
            const y2 =
              centerY +
              Math.sin(rx * waves[1].frequency + time * waves[1].speed * 20 + waves[1].phase) *
                waves[1].amplitude *
                env;

            ctx.beginPath();
            ctx.moveTo(rx, y1);
            ctx.lineTo(rx, y2);
            ctx.stroke();
          }
        }
      });

      // Render interactive nodes with telemetry pins along main wave
      for (let i = 0; i < nodeCount; i++) {
        const normX = (i + 1) / (nodeCount + 1);
        const nx = normX * width;
        const env = Math.sin(normX * Math.PI);
        const ny =
          centerY +
          Math.sin(nx * waves[0].frequency + time * waves[0].speed * 20 + waves[0].phase) *
            waves[0].amplitude *
            env;

        // Node outer ring
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#F5F3ED"; // Warm ivory fill
        ctx.fill();
        ctx.strokeStyle = "#222320"; // Charcoal border
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node center core
        ctx.beginPath();
        ctx.arc(nx, ny, 1.25, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#222320" : "#73766D";
        ctx.fill();

        // Technical coordinate marker for first and last nodes
        if (i === 1 || i === 4) {
          ctx.font = "9px 'IBM Plex Mono', 'Geist Mono', monospace";
          ctx.fillStyle = "#73766D"; // Olive grey
          const label = i === 1 ? "NODE_01 // 12ms" : "NODE_04 // SYNCHRONIZED";
          ctx.fillText(label, nx + 8, ny - 8);

          // Hairline bracket
          ctx.strokeStyle = "rgba(115, 118, 109, 0.4)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nx + 4, ny - 4);
          ctx.lineTo(nx + 8, ny - 8);
          ctx.stroke();
        }
      }

      // Architectural crosshair marks at corners
      const markSize = 7;
      const drawCrosshair = (cx: number, cy: number) => {
        ctx.strokeStyle = "#73766D";
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(cx - markSize, cy);
        ctx.lineTo(cx + markSize, cy);
        ctx.moveTo(cx, cy - markSize);
        ctx.lineTo(cx, cy + markSize);
        ctx.stroke();
      };

      drawCrosshair(32, 32);
      drawCrosshair(width - 32, 32);
      drawCrosshair(32, height - 32);
      drawCrosshair(width - 32, height - 32);

      // Top corner telemetry legend
      ctx.font = "9px 'IBM Plex Mono', 'Geist Mono', monospace";
      ctx.fillStyle = "#73766D";
      ctx.fillText("NEURALWAVES · SYS_GRAPH v2.4", 48, 35);
      ctx.fillText("LATENCY: <35MS · UAE/IN REGION", width - 200, 35);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full aspect-[4/3] md:aspect-[16/11] border border-stone/80 bg-white/60 backdrop-blur-sm overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      {/* Bottom corner architectural metadata */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-olive tracking-wider uppercase pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-charcoal animate-pulse inline-block" />
          ACTIVE FLUID PIPELINE
        </span>
        <span>ARCHITECTURAL AI FABRIC</span>
      </div>
    </div>
  );
}
