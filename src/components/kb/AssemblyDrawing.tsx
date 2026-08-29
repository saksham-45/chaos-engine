"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CURVES, project } from "@/lib/curves";

const NAVY = "#0c0c0e";
const CYAN = "#d4d4d8";
const BONE = "#f4f4f5";
const OXIDE = "#fafafa";

/* "General Assembly Drawing."
   One imaginary machine drafted from Saksham's three disciplines:
   a neural-net graph (ML), a beat-grid / waveform (music), and a live Lab curve
   (generative art), tied together with dimension lines and a title block.
   canvas-2D only (single context, sidesteps WebGL context-loss); self-draws,
   then idles; mouse drives an oxide crosshair; click cycles the seed curve. */
export function AssemblyDrawing({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, active: false });
  // seed with a parametric curve (Lorenz has no curves[] member to draw here)
  const FIRST = Math.max(0, CURVES.findIndex((c) => c.id === "butterfly"));
  const curveIdx = useRef(FIRST);
  const reduce = useReducedMotion();
  const [seedName, setSeedName] = useState(CURVES[FIRST].name);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // deterministic neural graph layout (no Math.random at layout time)
    const layers = [3, 4, 3, 2];
    const nodes: { lx: number; ln: number; count: number }[] = [];
    layers.forEach((count, lx) => {
      for (let ln = 0; ln < count; ln++) nodes.push({ lx, ln, count });
    });

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const seg = (r: number, a: number, b: number) => clamp01((r - a) / (b - a));

    const label = (text: string, x: number, y: number, color = CYAN, size = 11) => {
      ctx.font = `${size}px 'IBM Plex Mono', ui-monospace, monospace`;
      ctx.fillStyle = color;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, x, y);
    };

    const leader = (x1: number, y1: number, x2: number, y2: number, alpha: number) => {
      ctx.strokeStyle = `rgba(230,227,218,${0.35 * alpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const renderFrame = (reveal: number, t: number) => {
      const px = mouse.current.active ? (mouse.current.x - 0.5) : 0;
      const py = mouse.current.active ? (mouse.current.y - 0.5) : 0;
      const par = 8; // parallax px

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, W, H);

      // faint blueprint grid
      ctx.strokeStyle = "rgba(79,195,232,0.07)";
      ctx.lineWidth = 1;
      const gs = 28;
      for (let x = 0; x <= W; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      /* ---------- MEMBER A · neural graph (top-left) ---------- */
      const gx = W * 0.06 + px * par,
        gy = H * 0.1 + py * par,
        gw = W * 0.4,
        gh = H * 0.4;
      const nodePos = (n: { lx: number; ln: number; count: number }) => {
        const x = gx + (n.lx / (layers.length - 1)) * gw;
        const y = gy + ((n.ln + 0.5) / n.count) * gh;
        return [x, y] as [number, number];
      };
      const rEdges = seg(reveal, 0.05, 0.4);
      ctx.strokeStyle = `rgba(79,195,232,${0.5 * rEdges})`;
      ctx.lineWidth = 1;
      for (const a of nodes) {
        if (a.lx >= layers.length - 1) continue;
        const [ax, ay] = nodePos(a);
        for (const b of nodes) {
          if (b.lx !== a.lx + 1) continue;
          const [bx, by] = nodePos(b);
          const prog = seg(reveal, 0.08, 0.4);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + (bx - ax) * prog, ay + (by - ay) * prog);
          ctx.stroke();
        }
      }
      const rNodes = seg(reveal, 0.15, 0.45);
      nodes.forEach((n, i) => {
        const [x, y] = nodePos(n);
        const pulse = reveal >= 1 ? 1 + 0.18 * Math.sin(t * 2 + i) : 1;
        const rad = 3.2 * rNodes * pulse;
        ctx.fillStyle = CYAN;
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 8 * rNodes;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0, rad), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      if (reveal > 0.42) label("NEURAL NET / FIG.01", gx, gy - 10, CYAN, 11);

      /* ---------- MEMBER B · beat-grid + waveform (bottom band) ---------- */
      const by0 = H * 0.72 + py * par;
      const bx0 = W * 0.06 + px * par;
      const bw = W * 0.88;
      const rWave = seg(reveal, 0.28, 0.72);
      // beat grid ticks
      ctx.strokeStyle = `rgba(230,227,218,${0.28 * rWave})`;
      ctx.lineWidth = 1;
      const bars = 16;
      for (let i = 0; i <= bars * rWave; i++) {
        const x = bx0 + (i / bars) * bw;
        const tall = i % 4 === 0;
        ctx.beginPath();
        ctx.moveTo(x, by0 - (tall ? 16 : 8));
        ctx.lineTo(x, by0 + (tall ? 16 : 8));
        ctx.stroke();
      }
      // waveform
      ctx.strokeStyle = `rgba(79,195,232,${rWave})`;
      ctx.lineWidth = 1.75;
      ctx.shadowColor = CYAN;
      ctx.shadowBlur = 8 * rWave;
      ctx.beginPath();
      const wn = Math.floor(220 * rWave);
      for (let i = 0; i <= wn; i++) {
        const u = i / 220;
        const x = bx0 + u * bw;
        let y = 0;
        for (let k = 1; k <= 6; k++) y += (1 / k) * Math.sin(u * 40 * k + t * 1.5 * (reveal >= 1 ? 1 : 0));
        y = by0 + y * 9;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (reveal > 0.6) label("BEAT GRID / FIG.02", bx0, by0 + 40, CYAN, 11);

      /* ---------- MEMBER C · live Lab curve (center-right) ---------- */
      const cx = W * 0.68 + px * par * 1.5,
        cy = H * 0.4 + py * par * 1.5;
      const cScale = Math.min(W, H) * 0.2;
      const rCurve = seg(reveal, 0.5, 1);
      const spec = CURVES[curveIdx.current];
      const subs = spec.curves ?? [];
      const ax = (reveal >= 1 ? t * 0.15 : 0.4) + py * 0.8;
      const ay = (reveal >= 1 ? t * 0.12 : 0.6) + px * 1.0;
      ctx.globalCompositeOperation = "lighter";
      for (const sc of subs) {
        const n = sc.points;
        const count = Math.floor(rCurve * n);
        ctx.strokeStyle = CYAN;
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i <= count; i++) {
          const [x, y, z] = sc.sample(i / n, t);
          const [sx, sy] = project(
            x * sc.worldScale,
            y * sc.worldScale,
            z * sc.worldScale,
            ax,
            ay,
            cScale,
            cx,
            cy
          );
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
      if (spec.kind === "lorenz" && rCurve > 0) {
        // lorenz has no curves[]; draw a short signature spiral placeholder handled elsewhere
      }
      if (reveal > 0.85) {
        label(`CURVE · ${spec.name.toUpperCase()} / FIG.03`, cx - cScale, cy + cScale + 22, CYAN, 11);
      }

      /* ---------- connectors between members ---------- */
      const rConn = seg(reveal, 0.7, 1);
      if (rConn > 0) {
        leader(gx + gw, gy + gh * 0.5, cx - cScale * 0.8, cy - cScale * 0.4, rConn);
        leader(cx, cy + cScale, bx0 + bw * 0.7, by0 - 18, rConn);
        leader(gx + gw * 0.4, gy + gh, bx0 + bw * 0.15, by0 - 18, rConn);
      }

      /* ---------- title block (bottom-right) ---------- */
      if (reveal > 0.8) {
        const tw = 176,
          th = 40;
        const tx = W - tw - 14,
          ty = H - th - 14;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tx, ty, tw, th);
        ctx.beginPath();
        ctx.moveTo(tx, ty + 18);
        ctx.lineTo(tx + tw, ty + 18);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tx + tw * 0.62, ty);
        ctx.lineTo(tx + tw * 0.62, ty + th);
        ctx.stroke();
        label("ASSEMBLY DRAWING", tx + 6, ty + 13, BONE, 9);
        label("FIG. 00", tx + tw * 0.62 + 6, ty + 13, CYAN, 9);
        label("GEN. ASSEMBLY", tx + 6, ty + 32, "rgba(230,227,218,0.6)", 9);
        label("KB-14", tx + tw * 0.62 + 6, ty + 32, "rgba(230,227,218,0.6)", 9);
      }

      /* ---------- oxide registration crosshair (mouse) ---------- */
      if (mouse.current.active && reveal >= 1) {
        const mxp = mouse.current.x * W,
          myp = mouse.current.y * H;
        ctx.strokeStyle = OXIDE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mxp - 12, myp);
        ctx.lineTo(mxp + 12, myp);
        ctx.moveTo(mxp, myp - 12);
        ctx.lineTo(mxp, myp + 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(mxp, myp, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    if (reduce) {
      renderFrame(1, 2.2);
      return () => ro.disconnect();
    }

    let raf = 0,
      reveal = 0,
      t = 0,
      last = 0,
      startTs = 0,
      visible = true;
    const FRAME = 1000 / 30;
    const DURATION = 1600; // ms for the full self-draw
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.05 });
    io.observe(canvas);

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = ts;
        return;
      }
      if (ts - last < FRAME) return;
      last = ts;
      // time-based reveal so it completes even if frames are dropped/throttled
      if (!startTs) startTs = ts;
      reveal = Math.min(1, (ts - startTs) / DURATION);
      renderFrame(reveal, t);
      t += 0.016;
    };
    // paint an immediate full structural frame so the panel is never blank navy
    renderFrame(0.9, 0);
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width;
      mouse.current.y = (e.clientY - r.top) / r.height;
      mouse.current.active =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onLeave = () => (mouse.current.active = false);
    const onClick = () => {
      let next = (curveIdx.current + 1) % CURVES.length;
      // skip lorenz for the hero member (it has no curves[])
      if (CURVES[next].kind === "lorenz") next = (next + 1) % CURVES.length;
      curveIdx.current = next;
      setSeedName(CURVES[next].name);
    };
    window.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [reduce]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[0.68rem] tracking-[0.15em] text-[var(--color-bone)]/45">
        CLICK → cycle seed · {seedName}
      </span>
    </div>
  );
}
