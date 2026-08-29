"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const NAVY = "#0c0c0e";
const CYAN = "#d4d4d8";
const BONE = "#f4f4f5";
const OXIDE = "#fafafa";

export type ArchId = "automix" | "covid" | "lmms" | "stack";

type Node = { id: string; x: number; y: number; w: number; h: number; title: string; sub?: string; hot?: boolean };
type Edge = { a: string; b: string };
type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };

const DIAGRAMS: Record<
  ArchId,
  { title: string; nodes: Node[]; edges: Edge[]; note: string }
> = {
  automix: {
    title: "AUTOMIX · DUAL-STAGE MIXER",
    note: "DecisionNN picks the blend · CurveLSTM writes the automation",
    nodes: [
      { id: "a", x: 0.06, y: 0.18, w: 0.18, h: 0.16, title: "TRACK A", sub: "librosa" },
      { id: "b", x: 0.06, y: 0.48, w: 0.18, h: 0.16, title: "TRACK B", sub: "demucs stems" },
      { id: "feat", x: 0.32, y: 0.30, w: 0.20, h: 0.22, title: "FEATURES", sub: "100+ MIR" },
      { id: "nn", x: 0.58, y: 0.16, w: 0.18, h: 0.18, title: "DecisionNN", sub: "technique", hot: true },
      { id: "lstm", x: 0.58, y: 0.48, w: 0.18, h: 0.18, title: "CurveLSTM", sub: "fader / EQ" },
      { id: "out", x: 0.82, y: 0.30, w: 0.13, h: 0.22, title: "MIX", sub: "17 strategies" },
    ],
    edges: [
      { a: "a", b: "feat" },
      { a: "b", b: "feat" },
      { a: "feat", b: "nn" },
      { a: "feat", b: "lstm" },
      { a: "nn", b: "out" },
      { a: "lstm", b: "out" },
    ],
  },
  covid: {
    title: "COVID-HELP · CRISIS INGEST",
    note: "50+ live sources · Firebase · 10,000+ people · ~99.9% uptime",
    nodes: [
      { id: "s1", x: 0.05, y: 0.14, w: 0.20, h: 0.12, title: "ICU FEEDS" },
      { id: "s2", x: 0.05, y: 0.36, w: 0.20, h: 0.12, title: "O2 / BEDS" },
      { id: "s3", x: 0.05, y: 0.58, w: 0.20, h: 0.12, title: "HOSPITAL APIs" },
      { id: "agg", x: 0.34, y: 0.30, w: 0.22, h: 0.24, title: "INGEST", sub: "Node.js", hot: true },
      { id: "fb", x: 0.62, y: 0.30, w: 0.16, h: 0.24, title: "FIREBASE", sub: "realtime" },
      { id: "cl", x: 0.82, y: 0.30, w: 0.13, h: 0.24, title: "CLIENTS", sub: "10k+" },
    ],
    edges: [
      { a: "s1", b: "agg" },
      { a: "s2", b: "agg" },
      { a: "s3", b: "agg" },
      { a: "agg", b: "fb" },
      { a: "fb", b: "cl" },
    ],
  },
  lmms: {
    title: "LMMS · AGENTCONTROL + MCP",
    note: "MCP tools drive the DAW through a local daemon — my plugin, my server",
    nodes: [
      { id: "llm", x: 0.05, y: 0.32, w: 0.16, h: 0.22, title: "LLM", sub: "MCP client" },
      { id: "mcp", x: 0.26, y: 0.32, w: 0.20, h: 0.22, title: "MCP SERVER", sub: "tools", hot: true },
      { id: "d", x: 0.51, y: 0.32, w: 0.18, h: 0.22, title: "lmms-agentd", sub: "daemon" },
      { id: "p", x: 0.74, y: 0.14, w: 0.21, h: 0.18, title: "AgentControl", sub: "Qt plugin" },
      { id: "daw", x: 0.74, y: 0.48, w: 0.21, h: 0.22, title: "DAW CORE", sub: "Song / Track / FX" },
    ],
    edges: [
      { a: "llm", b: "mcp" },
      { a: "mcp", b: "d" },
      { a: "d", b: "p" },
      { a: "p", b: "daw" },
    ],
  },
  stack: {
    title: "END TO END · ONE BUREAU",
    note: "Edge ML · audio models · systems · the interface — same person",
    nodes: [
      { id: "edge", x: 0.06, y: 0.22, w: 0.20, h: 0.40, title: "EDGE", sub: "TFLite INT8\nPi 4 · OpenCV" },
      { id: "audio", x: 0.30, y: 0.22, w: 0.20, h: 0.40, title: "AUDIO", sub: "PyTorch LSTM\nMCP · DAW" },
      { id: "sys", x: 0.54, y: 0.22, w: 0.20, h: 0.40, title: "SYSTEMS", sub: "Node · Firebase\nreal-time" },
      { id: "ui", x: 0.78, y: 0.22, w: 0.16, h: 0.40, title: "UI", sub: "WebGL2\ncanvas", hot: true },
    ],
    edges: [
      { a: "edge", b: "audio" },
      { a: "audio", b: "sys" },
      { a: "sys", b: "ui" },
    ],
  },
};

function box(n: Node, W: number, H: number): Box {
  return { x: n.x * W, y: n.y * H, w: n.w * W, h: n.h * H, cx: (n.x + n.w / 2) * W, cy: (n.y + n.h / 2) * H };
}

export function ArchCanvas({
  diagram,
  className = "",
}: {
  diagram: ArchId;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const spec = DIAGRAMS[diagram];
    let W = 0,
      H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = (t: number) => {
      if (W === 0 || H === 0) return;
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(212,212,216,0.10)";
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const boxes: Record<string, Box> = {};
      for (const n of spec.nodes) boxes[n.id] = box(n, W, H);
      const pulse = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 2);

      ctx.lineWidth = 1.5;
      for (const e of spec.edges) {
        const A = boxes[e.a];
        const B = boxes[e.b];
        if (!A || !B) continue;
        ctx.strokeStyle = `rgba(212,212,216,${0.45 + 0.25 * pulse})`;
        ctx.beginPath();
        ctx.moveTo(A.x + A.w, A.cy);
        ctx.lineTo(B.x, B.cy);
        ctx.stroke();
        ctx.fillStyle = CYAN;
        ctx.beginPath();
        ctx.moveTo(B.x, B.cy);
        ctx.lineTo(B.x - 8, B.cy - 4);
        ctx.lineTo(B.x - 8, B.cy + 4);
        ctx.closePath();
        ctx.fill();
      }

      ctx.font = "600 11px 'IBM Plex Mono', ui-monospace, monospace";
      for (const n of spec.nodes) {
        const r = boxes[n.id];
        if (!r) continue;
        ctx.fillStyle = n.hot ? "rgba(250,250,250,0.12)" : "rgba(12,12,14,0.9)";
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = n.hot ? OXIDE : CYAN;
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = n.hot ? OXIDE : CYAN;
        ctx.font = "600 12px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.fillText(n.title, r.x + 10, r.y + 22);
        if (n.sub) {
          ctx.fillStyle = "rgba(231,227,218,0.7)";
          ctx.font = "400 11px 'IBM Plex Sans', sans-serif";
          const lines = n.sub.split("\n");
          lines.forEach((line, i) => ctx.fillText(line, r.x + 10, r.y + 40 + i * 14));
        }
      }

      ctx.fillStyle = BONE;
      ctx.font = "600 11px 'IBM Plex Mono', ui-monospace, monospace";
      ctx.fillText(spec.title, 14, 18);
      ctx.fillStyle = "rgba(231,227,218,0.55)";
      ctx.font = "400 11px 'IBM Plex Sans', sans-serif";
      ctx.fillText(spec.note, 14, H - 12);
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(1.2);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduce) return () => ro.disconnect();

    let raf = 0,
      last = 0,
      t = 0,
      visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.02 });
    io.observe(canvas);
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || ts - last < 1000 / 24) return;
      last = ts;
      t += 1 / 24;
      draw(t);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [diagram, reduce]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />;
}
