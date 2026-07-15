"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { getCurve, project, type Vec3 } from "@/lib/curves";

const NAVY = "#0c2a3a";
const CYAN = "#4fc3e8";

/* One live parametric figure, cyan-on-navy, canvas-2D. Points are precomputed
   once; each frame just re-projects them under a slow rotation. A full static
   frame is painted on init/resize so the panel is NEVER blank (off-screen or
   pre-visible); the rAF loop only runs while on-screen. */
export function CurveStage({
  curveId,
  interactive = false,
  speed = 1,
  className = "",
}: {
  curveId: string;
  interactive?: boolean;
  speed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const spec = getCurve(curveId);

    // ---- precompute figure geometry once ----
    const figures: { pts: Vec3[] }[] = [];
    if (spec.kind === "lorenz") {
      const s = { x: 0.1, y: 0, z: 0 };
      const dt = 0.006,
        sigma = 10,
        rho = 28,
        beta = 8 / 3;
      const pts: Vec3[] = [];
      for (let i = 0; i < 2600; i++) {
        s.x += sigma * (s.y - s.x) * dt;
        s.y += (s.x * (rho - s.z) - s.y) * dt;
        s.z += (s.x * s.y - beta * s.z) * dt;
        if (i > 60) pts.push([s.x, s.y, s.z - 25]);
      }
      figures.push({ pts });
    } else if (spec.curves) {
      for (const sc of spec.curves) {
        const pts: Vec3[] = [];
        for (let i = 0; i <= sc.points; i++) {
          const [x, y, z] = sc.sample(i / sc.points, 0);
          pts.push([x * sc.worldScale, y * sc.worldScale, z * sc.worldScale]);
        }
        figures.push({ pts });
      }
    }

    let W = 0,
      H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = (t: number) => {
      if (W === 0 || H === 0) return;
      const mx = interactive ? mouse.current.x : 0.5;
      const my = interactive ? mouse.current.y : 0.5;
      const ax = t * 0.14 * speed + (my - 0.5) * 1.0;
      const ay = t * 0.11 * speed + (mx - 0.5) * 1.4;
      const ox = W / 2,
        oy = H / 2;
      const scale =
        spec.kind === "lorenz" ? Math.min(W, H) / 62 : Math.min(W, H) * spec.fit * 0.5;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 1.75;
      ctx.strokeStyle = CYAN;
      ctx.shadowColor = CYAN;
      ctx.shadowBlur = 12;

      for (const f of figures) {
        ctx.beginPath();
        for (let i = 0; i < f.pts.length; i++) {
          const [x, y, z] = f.pts[i];
          const [sx, sy] = project(x, y, z, ax, ay, scale, ox, oy);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        // glowing draw-head at the end of the path
        const last = f.pts[f.pts.length - 1];
        if (last) {
          const [hx, hy] = project(last[0], last[1], last[2], ax, ay, scale, ox, oy);
          const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 13);
          g.addColorStop(0, "rgba(255,255,255,0.95)");
          g.addColorStop(0.4, "rgba(79,195,232,0.8)");
          g.addColorStop(1, "rgba(12,42,58,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(hx, hy, 13, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
    };

    let t = reduce ? 2.4 : 0;
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(t); // always keep a valid frame after any size change
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduce) {
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
      t += 0.016 * speed;
      draw(t);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width;
      mouse.current.y = (e.clientY - r.top) / r.height;
    };
    if (interactive) window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (interactive) window.removeEventListener("pointermove", onMove);
    };
  }, [curveId, interactive, speed, reduce]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} />;
}
