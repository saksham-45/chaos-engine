"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  createSynthAudio,
  VISUALIZERS,
  VIZ_PALETTE,
  type VizMode,
} from "@/lib/visualizzer";

export type { VizMode };

/* Runs the real canvas-2D visualizers ported from my Visualizzer project
   (visualizzer.vercel.app), driven by the same synthetic-audio generator the app
   falls back to (no microphone). One cheap 2D canvas per window; the host owns a
   30fps loop, paints the navy field, and calls the ported draw. Paused off-screen
   via IntersectionObserver; a single static frame under reduced motion. */
export function Visualizer({
  mode,
  minH = "min-h-[280px]",
  ratio = "4 / 3",
  label,
  href,
  className = "",
}: {
  mode: VizMode;
  minH?: string;
  ratio?: string;
  label?: string;
  href?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const def = VISUALIZERS[mode];
    const synth = createSynthAudio();
    let W = 0,
      H = 0,
      t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let state = def.init(0, 0);

    const paint = (tt: number) => {
      if (W === 0 || H === 0) return;
      ctx.fillStyle = VIZ_PALETTE.background;
      ctx.fillRect(0, 0, W, H);
      def.draw(ctx, W, H, synth.step(tt), tt, state);
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = def.init(W, H);
      paint(t); // keep a valid frame after any size change (off-screen canvases too)
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduce) {
      t = 1.7;
      paint(t);
      return () => ro.disconnect();
    }

    let raf = 0,
      last = 0,
      visible = true;
    const FRAME = 1000 / 30;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(canvas);

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (ts - last < FRAME) return;
      last = ts;
      t += 1 / 30;
      paint(t);
    };
    paint(0);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [mode, reduce]);

  return (
    <figure
      className={`relative border-2 border-[var(--color-rule)] bg-[var(--color-navy)] overflow-hidden shadow-[6px_6px_0_var(--color-rule)] ${className}`}
    >
      <div className={`relative w-full ${minH}`} style={{ aspectRatio: ratio }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      {(label || href) && (
        <figcaption className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-ink)]/60">
          <span>{label}</span>
          {href && (
            <Link href={href} className="text-[var(--color-cyan)] hover:text-[var(--color-ink)]">
              Visualizzer ↗
            </Link>
          )}
        </figcaption>
      )}
    </figure>
  );
}
