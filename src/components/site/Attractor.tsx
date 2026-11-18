"use client";

import React, { useEffect, useRef } from "react";

/* The site's namesake: a Lorenz attractor, integrated live. A few dozen
   points start a hair apart and diverge, which is what chaos means. It
   leans toward the pointer, pauses offscreen, and draws a single still
   frame under reduced motion. */

const COLORS = ["#ff9f0a", "#ff375f", "#bf5af2", "#2997ff"];
const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;
const DT = 0.005;

interface P {
  x: number;
  y: number;
  z: number;
  c: string;
}

function step(p: P) {
  const dx = SIGMA * (p.y - p.x);
  const dy = p.x * (RHO - p.z) - p.y;
  const dz = p.x * p.y - BETA * p.z;
  p.x += dx * DT;
  p.y += dy * DT;
  p.z += dz * DT;
}

export function Attractor({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pts: P[] = Array.from({ length: 150 }, (_, i) => {
      const p = { x: 0.1 + i * 0.013, y: 0, z: 24, c: COLORS[i % COLORS.length] };
      for (let k = 0; k < 600 + i * 37; k++) step(p); // spread them around the attractor
      return p;
    });

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let t = 0;
    let lean = 0;
    let leanTarget = 0;
    let tilt = 0;
    let tiltTarget = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (p: P) => {
      // -45deg faces the two wings; sway around it so it never turns edge-on
      const a = -Math.PI / 4 + Math.sin(t) * 0.45 + lean;
      const X = p.x * Math.cos(a) - p.y * Math.sin(a);
      const depth = p.x * Math.sin(a) + p.y * Math.cos(a);
      const s = Math.min(w / 62, h / 54);
      return [w / 2 + X * s, h / 2 - (p.z - 25) * s + depth * tilt * s] as const;
    };

    const draw = (fade: boolean) => {
      const light = document.documentElement.dataset.theme === "light";
      if (fade) {
        // erase toward transparent so the page colour shows through in both themes
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(0,0,0,0.035)";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      ctx.globalAlpha = light ? 0.45 : 0.6;
      ctx.lineWidth = 1.25;
      ctx.lineCap = "round";
      for (const p of pts) {
        const [x0, y0] = project(p);
        ctx.strokeStyle = p.c;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (let k = 0; k < 3; k++) {
          step(p);
          const [x, y] = project(p);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const frame = () => {
      raf = 0;
      if (!visible) return;
      t += 0.0022;
      lean += (leanTarget - lean) * 0.04;
      tilt += (tiltTarget - tilt) * 0.04;
      draw(true);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      leanTarget = (e.clientX / window.innerWidth - 0.5) * 0.9;
      tiltTarget = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    const onResize = () => {
      resize();
      if (reduce) still();
    };
    const still = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < 420; i++) draw(false);
    };

    resize();
    if (reduce) still();
    else for (let i = 0; i < 90; i++) draw(true);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%)",
      }}
    />
  );
}
