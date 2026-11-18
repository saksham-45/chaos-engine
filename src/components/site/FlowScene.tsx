"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

/* A scroll-driven walk through what an FPGA toolchain does. One canvas, 192
   logic cells, six stages: the cells start as a loose netlist, get packed
   eight to a block, land on the chip's grid, get wired, have their slowest
   path found, and finally turn into bits. Scrolling back reverses it, since
   every cell just springs toward wherever the current stage puts it. */

const DARK = { cell: "#3ddc84", net: "#ffb224", hot: "#ffffff", edge: "rgba(255,255,255,0.13)", site: "rgba(255,255,255,0.09)", text: "rgba(245,245,247,0.5)" };
const LIGHT = { cell: "#0a8f4c", net: "#b45309", hot: "#111111", edge: "rgba(0,0,0,0.16)", site: "rgba(0,0,0,0.1)", text: "rgba(29,29,31,0.55)" };
const COLS = 6;
const ROWS = 4;
const PER = 8; // logic cells per block
const N = COLS * ROWS * PER;
const STIFF = 60;
const DAMP = 2 * Math.sqrt(STIFF);

// deterministic "random", so the layout is the same on every visit
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface Cell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number[][]; // target per layout: netlist, packed, placed
}

function FlowCanvas({ stage, className = "" }: { stage: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let u = 8;
    let cells: Cell[] = [];
    let nets: number[][][] = [];
    let sites: number[][] = [];
    const edges = Array.from({ length: 70 }, (_, e) => [Math.floor(rnd(500 + e) * N), Math.floor(rnd(700 + e) * N)]);
    let edgeA = 1;
    let siteA = 0;
    let netF = 0;
    let hotA = 0;
    let bitA = 0;
    let time = 0;
    let last = 0;
    let raf = 0;
    let visible = true;

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gx = Math.min((w * 0.9) / COLS, ((h * 0.86) / ROWS) * 1.5);
      const gy = Math.min(gx * 0.72, (h * 0.86) / ROWS);
      u = Math.min(gx / 5.6, gy / 3.2);
      const ox = (w - gx * COLS) / 2;
      const oy = (h - gy * ROWS) / 2;
      const old = cells;
      cells = [];
      sites = [];
      const centre: number[][] = [];
      for (let b = 0; b < COLS * ROWS; b++) {
        const cx = ox + gx * ((b % COLS) + 0.5);
        const cy = oy + gy * (Math.floor(b / COLS) + 0.5);
        centre.push([cx, cy]);
        sites.push([cx - u * 2.3, cy - u * 1.3, u * 4.6, u * 2.6]);
        const px = cx + (rnd(b * 3) - 0.5) * gx * 0.55;
        const py = cy + (rnd(b * 3 + 1) - 0.5) * gy * 0.55;
        for (let k = 0; k < PER; k++) {
          const i = b * PER + k;
          const dx = ((k % 4) - 1.5) * u;
          const dy = (Math.floor(k / 4) - 0.5) * u;
          const n = [w * (0.06 + 0.88 * rnd(i * 2)), h * (0.08 + 0.84 * rnd(i * 2 + 1))];
          const prev = old[i];
          cells.push({ x: prev ? prev.x : n[0], y: prev ? prev.y : n[1], vx: 0, vy: 0, t: [n, [px + dx, py + dy], [cx + dx, cy + dy]] });
        }
      }
      // nets run in the channels between blocks: out to the side, along, then in
      nets = [];
      for (let j = 0; j < 34; j++) {
        const a = Math.floor(rnd(900 + j) * COLS * ROWS);
        const b = (a + 1 + Math.floor(rnd(950 + j) * 9)) % (COLS * ROWS);
        const o = ((j % 5) - 2) * Math.max(1.5, u * 0.22);
        const [ax, ay] = centre[a];
        const [bx, by] = centre[b];
        nets.push([[ax, ay], [ax + gx / 2 + o, ay], [ax + gx / 2 + o, by + gy / 2 + o], [bx, by + gy / 2 + o], [bx, by]]);
      }
    };

    const path = (pts: number[][], f: number) => {
      let total = 0;
      for (let k = 1; k < pts.length; k++) total += Math.abs(pts[k][0] - pts[k - 1][0]) + Math.abs(pts[k][1] - pts[k - 1][1]);
      let left = total * f;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      let end = pts[0];
      for (let k = 1; k < pts.length && left > 0; k++) {
        const dx = pts[k][0] - pts[k - 1][0];
        const dy = pts[k][1] - pts[k - 1][1];
        const seg = Math.abs(dx) + Math.abs(dy);
        const g = seg === 0 ? 1 : Math.min(1, left / seg);
        end = [pts[k - 1][0] + dx * g, pts[k - 1][1] + dy * g];
        ctx.lineTo(end[0], end[1]);
        left -= seg;
      }
      ctx.stroke();
      return end;
    };

    const draw = (dt: number) => {
      const pal = document.documentElement.dataset.theme === "light" ? LIGHT : DARK;
      const st = stageRef.current;
      const ease = (cur: number, to: number, rate: number) => (reduce ? to : cur + (to - cur) * Math.min(1, dt * rate));
      edgeA = ease(edgeA, st <= 1 ? 1 : 0, 5);
      siteA = ease(siteA, st >= 2 ? 1 : 0, 5);
      netF = ease(netF, st >= 3 ? 1 : 0, 2.6);
      hotA = ease(hotA, st === 4 ? 1 : 0, 5);
      bitA = ease(bitA, st >= 5 ? 1 : 0, 5);
      const which = Math.min(2, st);

      ctx.clearRect(0, 0, w, h);
      for (const c of cells) {
        const [tx, ty] = c.t[which];
        if (reduce) {
          c.x = tx;
          c.y = ty;
        } else {
          c.vx += ((tx - c.x) * STIFF - c.vx * DAMP) * dt;
          c.vy += ((ty - c.y) * STIFF - c.vy * DAMP) * dt;
          c.x += c.vx * dt;
          c.y += c.vy * dt;
        }
      }

      // netlist connections, before anything has a place
      if (edgeA > 0.01) {
        ctx.globalAlpha = edgeA;
        ctx.strokeStyle = pal.edge;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const [a, b] of edges) {
          ctx.moveTo(cells[a].x, cells[a].y);
          ctx.lineTo(cells[b].x, cells[b].y);
        }
        ctx.stroke();
      }
      // the chip's block sites
      if (siteA > 0.01) {
        ctx.globalAlpha = siteA;
        ctx.strokeStyle = pal.site;
        ctx.lineWidth = 1;
        for (const [x, y, sw, sh] of sites) ctx.strokeRect(x, y, sw, sh);
      }
      // wires
      if (netF > 0.005) {
        ctx.lineJoin = "round";
        nets.forEach((n, j) => {
          const hot = j < 3;
          ctx.globalAlpha = hot ? 0.75 + 0.25 * hotA : 0.7 - 0.45 * hotA;
          ctx.strokeStyle = hot && hotA > 0.5 ? pal.hot : pal.net;
          ctx.lineWidth = hot ? 1.4 + 1.6 * hotA : 1.3;
          const end = path(n, netF);
          if (hot && hotA > 0.5 && !reduce) {
            // a signal running the slowest path
            ctx.globalAlpha = 1;
            ctx.fillStyle = pal.hot;
            const tip = path(n, (time * 0.7 + j * 0.33) % 1);
            ctx.fillRect(tip[0] - 3, tip[1] - 3, 6, 6);
          } else if (netF < 0.98) {
            ctx.fillStyle = pal.net;
            ctx.fillRect(end[0] - 1.5, end[1] - 1.5, 3, 3);
          }
        });
      }
      // cells; in the last stage they flicker as the bits that program them
      const s = u * (which === 0 ? 0.5 : 0.78);
      cells.forEach((c, i) => {
        const on = bitA > 0.5 && (Math.floor(time * 7) + i * 7) % 3 === 0;
        ctx.globalAlpha = which === 0 ? 0.85 : 1;
        ctx.fillStyle = on ? pal.hot : pal.cell;
        ctx.fillRect(c.x - s / 2, c.y - s / 2, s, s);
      });
      if (bitA > 0.01) {
        ctx.globalAlpha = bitA;
        ctx.fillStyle = pal.text;
        ctx.font = `600 ${Math.max(11, Math.min(15, w / 60))}px ui-monospace, Menlo, monospace`;
        const cw = ctx.measureText("0").width * 1.6;
        const count = Math.ceil(w / cw) + 2;
        const shift = reduce ? 0 : Math.floor(time * 9);
        for (let k = 0; k < count; k++) ctx.fillText(rnd(k + shift) > 0.5 ? "1" : "0", k * cw, h - 6);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      time += dt;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    layout();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      if (canvas.clientWidth !== w || canvas.clientHeight !== h) layout();
    });
    ro.observe(canvas);
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

export function FlowScene({ title, steps }: { title: string; steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))));

  return (
    <section ref={ref} className="relative" style={{ height: `${steps.length * 80 + 20}svh` }}>
      <div className="sticky top-0 mx-auto flex h-[100svh] max-w-[1200px] flex-col px-5 pb-8 pt-24 sm:px-8">
        <h2 className="t-h2">{title}</h2>
        <div className="relative my-4 min-h-0 flex-1">
          <FlowCanvas stage={stage} className="absolute inset-0 h-full w-full" />
        </div>
        <ol aria-hidden className="flex gap-1.5">
          {steps.map((s, i) => (
            <li key={s.title} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= stage ? "bg-accent" : "bg-ink/15"}`} />
          ))}
        </ol>
        <div className="mt-5 min-h-[8.5rem] sm:min-h-[7rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <p className="t-mono text-muted">
                Step {stage + 1} of {steps.length}
              </p>
              <h3 className="t-h3 mt-1">{steps[stage].title}</h3>
              <p className="mt-2 max-w-[52ch] text-[1.1875rem] leading-snug text-muted">{steps[stage].text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* the same six steps as plain text, for anyone not watching the canvas */}
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s.title}>
              {s.title}: {s.text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
