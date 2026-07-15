"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/* An interactive night scene - a ginger cat by a graffitied wall, glowing eyes
   that track the cursor, a local flashlight, falling snow, click-to-meow.
   Adapted from the standalone pupsik page into the КБ contact background.
   Split into an ambient full-page layer (dark base + snow) and the cat stage,
   so nothing on the page ever overlays the cat and page text is never dimmed. */

const NIGHT = "#0a0d09";

/* ---- full-page ambient: night base + falling snow (behind everything) ---- */
export function PupsikAmbient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0,
      H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const flakes = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.6,
      s: Math.random() * 0.6 + 0.3,
      d: Math.random() * 0.4 - 0.2,
      o: Math.random() * 0.5 + 0.3,
    }));

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        ctx.beginPath();
        ctx.arc(f.x * W, f.y * H, f.r, 0, 6.283);
        ctx.fillStyle = `rgba(226,235,214,${f.o})`;
        ctx.fill();
      }
    };

    if (reduce) {
      drawStatic();
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0,
      last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 60) / 16.67;
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.y += (f.s * dt) / 1000;
        f.x += (f.d * dt) / 1000;
        if (f.y > 1) {
          f.y = -0.02;
          f.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(f.x * W, f.y * H, f.r, 0, 6.283);
        ctx.fillStyle = `rgba(226,235,214,${f.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: NIGHT }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* soft global vignette so the night reads as a scene, not a flat fill */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 70% 40%, rgba(0,0,0,0) 40%, rgba(2,6,3,0.55) 100%)",
        }}
      />
    </div>
  );
}

/* ---- the interactive cat stage (place it where you want the cat) ---- */
export function PupsikCat({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const eyeLRef = useRef<HTMLSpanElement>(null);
  const eyeRRef = useRef<HTMLSpanElement>(null);
  const [meow, setMeow] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      if (darkRef.current) {
        darkRef.current.style.setProperty("--mx", px * 100 + "%");
        darkRef.current.style.setProperty("--my", py * 100 + "%");
      }
      if (layerRef.current) {
        layerRef.current.style.transform = `translate(${(px - 0.5) * -14}px, ${
          (py - 0.5) * -14
        }px) scale(1.04)`;
      }
      const gx = (px - 0.657) * 6,
        gy = (py - 0.593) * 4;
      [eyeLRef.current, eyeRRef.current].forEach((el) => {
        if (el) {
          el.style.marginLeft = gx + "px";
          el.style.marginTop = gy + "px";
        }
      });
    };
    stage.addEventListener("pointermove", onMove);
    return () => stage.removeEventListener("pointermove", onMove);
  }, [reduce]);

  const calls = ["meow", "meow!", "mrrp", "prrr", "pss pss?"];
  const ci = useRef(0);
  const meowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onClick = () => {
    setMeow(calls[ci.current++ % calls.length]);
    [eyeLRef.current, eyeRRef.current].forEach((el) => {
      if (!el) return;
      el.style.filter = "brightness(2.2)";
      setTimeout(() => (el.style.filter = ""), 220);
    });
    if (meowTimer.current) clearTimeout(meowTimer.current);
    meowTimer.current = setTimeout(() => setMeow(null), 1100);
  };

  return (
    <div
      ref={stageRef}
      onClick={onClick}
      className={`relative aspect-square w-full overflow-hidden border-2 border-[var(--color-bone)]/15 bg-[#10160f] cursor-crosshair select-none ${className}`}
      style={{ boxShadow: "0 24px 80px rgba(0,0,0,.7), inset 0 0 120px rgba(0,0,0,.5)" }}
    >
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={{ transition: "transform .12s ease-out" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pupsik-cat.svg"
          alt="Night scene of a ginger cat by a graffitied wall"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(1.1) contrast(1.05) brightness(1.18)" }}
          draggable={false}
        />
        <span ref={eyeLRef} className="pupsik-eye" style={{ left: "63.4%", top: "59.4%" }} />
        <span ref={eyeRRef} className="pupsik-eye" style={{ left: "66.7%", top: "59.2%" }} />
      </div>

      {/* local flashlight / darkness - confined to the cat, so page text is never dimmed */}
      {!reduce && (
        <div
          ref={darkRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle 230px at var(--mx,60%) var(--my,60%), rgba(0,0,0,0) 0%, rgba(2,6,3,.06) 55%, rgba(2,6,3,.72) 100%)",
          }}
        />
      )}

      {meow && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-none border px-3 py-1.5 font-mono text-sm"
          style={{
            left: "66%",
            top: "52%",
            background: "rgba(20,26,18,.9)",
            borderColor: "rgba(200,220,180,.35)",
            color: "#eaf0e2",
          }}
        >
          {meow}
        </span>
      )}
    </div>
  );
}
