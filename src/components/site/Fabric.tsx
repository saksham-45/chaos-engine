"use client";

import React, { useEffect, useRef } from "react";

/* The hero: an FPGA device view that places and routes a word, the way
   Helion's own device screen shows a design. Each cell starts on a random
   tile and travels along the lattice by a shortest route to the tile it
   belongs on, then nets route between them and signals run along the wires. Move the pointer through it to shove cells off their
   sites. Click the word and the cells shoot back out along the lattice, away from
   the click, and `onShatter` fires (the page scrolls on). When the canvas comes
   back into view they route home again from wherever they ended up.

   The counts in the HUD are this animation's real numbers, not decoration.
   It publishes --name-top / --name-bottom (px) on its section so the page
   can lay text out around the word. Reduced motion draws the finished
   design once. */

const DARK = { cell: "#3ddc84", alt: "#ffb224", net: "#ffb224", io: "#38bdf8", region: "#a78bfa", grid: "rgba(255,255,255,0.06)", pulse: "#ffffff" };
const LIGHT = { cell: "#0a8f4c", alt: "#b45309", net: "#b45309", io: "#0369a1", region: "#7c3aed", grid: "rgba(0,0,0,0.08)", pulse: "#000000" };

const STIFF = 70;
const DAMP = 2 * Math.sqrt(STIFF); // critically damped: cells settle, never bounce

interface Cell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  delay: number;
  alt: boolean;
  path: number[][]; // lattice route home, in tile corners
  len: number;
  dur: number;
  d: number; // px travelled along the route so far
  arrived: boolean;
  glow: number; // 0..1, flashes when a signal passes through
}
interface Net {
  pts: number[][];
  len: number;
  at: number; // seconds after routing starts
  io: boolean;
}

export function Fabric({
  text,
  centerY = 0.4,
  hudRef,
  onShatter,
  className = "",
}: {
  text: string;
  centerY?: number;
  hudRef?: React.RefObject<HTMLElement | null>;
  onShatter?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const shatterCb = useRef(onShatter);
  useEffect(() => {
    shatterCb.current = onShatter;
  }, [onShatter]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.closest("section") ?? canvas?.parentElement; // whoever lays text out around the word
    if (!canvas || !ctx || !host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let c = 12;
    let cells: Cell[] = [];
    let nets: Net[] = [];
    let pads: number[][] = [];
    let box = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let t = 0; // seconds since the current placement began
    let routeAt = 0; // when nets start: once most cells are home
    let last = 0;
    let raf = 0;
    let visible = true;
    let px = -9999;
    let py = -9999;
    let stir = 0; // 0..1, how much the pointer is moving; decays when it rests
    let ux = 1; // direction the pointer is travelling (unit vector), so the cut follows the stroke
    let uy = 0;
    let hud = "";
    let out = false; // true while the word is blown apart (after a click, until it is seen again)
    let away = false; // the reader has scrolled the word mostly off screen since it blew apart
    let at = new Map<number, Cell>(); // tile index -> cell, so signals can light what they cross
    const verb = window.matchMedia("(pointer: coarse)").matches ? "tap" : "click";
    const pulses: { net: number; d: number }[] = [];

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      c = Math.max(5, Math.min(12, Math.round(w / 128)));
      const cols = Math.ceil(w / c);
      const rows = Math.ceil(h / c);

      // rasterize the word at 4x, then keep tiles that are more than half covered
      const K = 4;
      const off = document.createElement("canvas");
      off.width = cols * K;
      off.height = rows * K;
      const o = off.getContext("2d")!;
      const face = '-apple-system, "Helvetica Neue", Arial, sans-serif';
      const sy = Math.min(2.4, Math.max(1, (h / w) * 1.1)); // stretch the word taller on narrow screens
      o.font = `800 100px ${face}`;
      const fs = Math.min((100 * 0.88 * cols * K) / o.measureText(text).width, (rows * K * 0.34) / sy);
      o.font = `800 ${fs}px ${face}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.translate((cols * K) / 2, rows * K * centerY);
      o.scale(1, sy);
      o.fillText(text, 0, 0);
      const img = o.getImageData(0, 0, off.width, off.height).data;

      cells = [];
      let x0 = cols;
      let x1 = 0;
      let y0 = rows;
      let y1 = 0;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let a = 0;
          for (let v = 0; v < K; v++) for (let u = 0; u < K; u++) a += img[((j * K + v) * off.width + i * K + u) * 4 + 3];
          if (a / (K * K) < 128) continue;
          x0 = Math.min(x0, i);
          x1 = Math.max(x1, i);
          y0 = Math.min(y0, j);
          y1 = Math.max(y1, j);
          cells.push({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            tx: i * c,
            ty: j * c,
            delay: 0.15 + (i / cols) * 0.8 + Math.random() * 0.3, // sweeps left to right
            alt: Math.random() < 0.09,
            path: [],
            len: 0,
            dur: 0,
            d: 0,
            arrived: false,
            glow: 0,
          });
        }
      }
      at = new Map(cells.map((p) => [(p.ty / c) * cols + p.tx / c, p]));
      box = { x0: (x0 - 2) * c, y0: (y0 - 2) * c, x1: (x1 + 3) * c, y1: (y1 + 3) * c };
      host.style.setProperty("--name-top", `${box.y0}px`);
      host.style.setProperty("--name-bottom", `${box.y1}px`);

      // I/O pads in a row under the word, and nets as Manhattan routes on tile centres
      pads = [];
      const padY = box.y1 + c;
      for (let x = box.x0 + c; x < box.x1 - c; x += c * 3) pads.push([x, padY]);
      nets = [];
      const mid = (p: Cell) => [p.tx + c / 2, p.ty + c / 2];
      const want = Math.min(130, Math.floor(cells.length / 6));
      for (let n = 0; n < want && cells.length > 1; n++) {
        const a = cells[Math.floor(Math.random() * cells.length)];
        const [ax, ay] = mid(a);
        let pts: number[][];
        const io = n % 7 === 0 && pads.length > 0;
        if (io) {
          const pad = pads.reduce((best, p) => (Math.abs(p[0] - ax) < Math.abs(best[0] - ax) ? p : best));
          pts = [[ax, ay], [pad[0] + c / 2, ay], [pad[0] + c / 2, pad[1] + c / 2]];
        } else {
          let b = a;
          for (let k = 0; k < 14; k++) {
            b = cells[Math.floor(Math.random() * cells.length)];
            const d = (Math.abs(b.tx - a.tx) + Math.abs(b.ty - a.ty)) / c;
            if (d > 3 && d < 30) break;
          }
          const [bx, by] = mid(b);
          const mx = Math.round((ax + (bx - ax) * (0.25 + Math.random() * 0.5)) / c) * c + c / 2;
          pts = [[ax, ay], [mx, ay], [mx, by], [bx, by]];
        }
        let len = 0;
        for (let k = 1; k < pts.length; k++) len += Math.abs(pts[k][0] - pts[k - 1][0]) + Math.abs(pts[k][1] - pts[k - 1][1]);
        nets.push({ pts, len, at: n * 0.022, io });
      }
      scatter();
      if (reduce) {
        for (const p of cells) {
          p.x = p.tx;
          p.y = p.ty;
          p.arrived = true;
        }
        t = 99;
        draw(0);
      }
    };

    // Put every cell on a random tile and give it a shortest lattice route home.
    // No search: on an open grid every shortest route is a staircase, so one
    // random jog column between start and target is all it takes.
    const scatter = (fromHere = false) => {
      const cols = Math.ceil(w / c);
      const rows = Math.ceil(h / c);
      let done = 0;
      out = false;
      for (const p of cells) {
        const sx = fromHere ? Math.round(p.x / c) * c : Math.floor(Math.random() * cols) * c;
        const sy = fromHere ? Math.round(p.y / c) * c : Math.floor(Math.random() * rows) * c;
        const mx = Math.round((sx + (p.tx - sx) * Math.random()) / c) * c;
        p.path = [[sx, sy], [mx, sy], [mx, p.ty], [p.tx, p.ty]];
        p.len = Math.abs(p.tx - sx) + Math.abs(p.ty - sy);
        console.assert(p.len === Math.abs(mx - sx) + Math.abs(p.ty - sy) + Math.abs(p.tx - mx), "route is longer than the shortest path");
        p.dur = 0.4 + p.len / 2400;
        p.x = sx;
        p.y = sy;
        p.vx = p.vy = p.d = 0;
        p.arrived = false;
        done = Math.max(done, p.delay + p.dur);
      }
      routeAt = done * 0.8;
      t = 0;
      pulses.length = 0;
    };

    // Blow the word apart: every cell takes a shortest lattice route from its
    // site to a tile just off screen, heading away from the word's centre. The
    // wave starts at the click, so cells nearest it leave first.
    const shatter = (cx: number, cy: number) => {
      const mx0 = (box.x0 + box.x1) / 2;
      const my0 = (box.y0 + box.y1) / 2;
      const snap = (v: number) => Math.round(v / c) * c;
      out = true;
      away = false;
      for (const p of cells) {
        const sx = snap(p.x);
        const sy = snap(p.y);
        let dx = p.tx - mx0 + (Math.random() - 0.5) * c * 4;
        const dy = p.ty - my0 + (Math.random() - 0.5) * c * 4;
        if (!dx && !dy) dx = 1;
        let ex: number;
        let ey: number;
        if (Math.abs(dx) / w > Math.abs(dy) / h) {
          ex = dx > 0 ? w + c * 2 : -c * 3;
          ey = sy + (dy / Math.abs(dx)) * Math.abs(ex - sx) * 0.6;
        } else {
          ey = dy > 0 ? h + c * 2 : -c * 3;
          ex = sx + (dx / Math.abs(dy)) * Math.abs(ey - sy) * 0.6;
        }
        ex = snap(ex);
        ey = snap(ey);
        const jog = snap(sx + (ex - sx) * Math.random());
        p.path = [[sx, sy], [jog, sy], [jog, ey], [ex, ey]];
        p.len = Math.abs(ex - sx) + Math.abs(ey - sy);
        p.dur = 0.3 + p.len / 3200;
        p.delay = Math.hypot(p.tx - cx, p.ty - cy) / 3000 + Math.random() * 0.06;
        p.vx = p.vy = p.d = 0;
        p.arrived = false;
        p.glow = 0;
      }
      t = 0;
      pulses.length = 0;
    };
    const onWord = (x: number, y: number) => x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1 + c * 2;

    // draw the first `upto` px of a polyline
    const trace = (pts: number[][], upto: number) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      let left = upto;
      for (let k = 1; k < pts.length && left > 0; k++) {
        const dx = pts[k][0] - pts[k - 1][0];
        const dy = pts[k][1] - pts[k - 1][1];
        const seg = Math.abs(dx) + Math.abs(dy);
        const f = seg === 0 ? 1 : Math.min(1, left / seg);
        ctx.lineTo(pts[k - 1][0] + dx * f, pts[k - 1][1] + dy * f);
        left -= seg;
      }
      ctx.stroke();
    };
    const pointAt = (pts: number[][], d: number) => {
      for (let k = 1; k < pts.length; k++) {
        const dx = pts[k][0] - pts[k - 1][0];
        const dy = pts[k][1] - pts[k - 1][1];
        const seg = Math.abs(dx) + Math.abs(dy);
        if (d <= seg) return [pts[k - 1][0] + (dx * d) / (seg || 1), pts[k - 1][1] + (dy * d) / (seg || 1)];
        d -= seg;
      }
      return pts[pts.length - 1];
    };

    const draw = (dt: number) => {
      const pal = document.documentElement.dataset.theme === "light" ? LIGHT : DARK;
      ctx.clearRect(0, 0, w, h);

      // tile grid
      ctx.strokeStyle = pal.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0.5; x < w; x += c) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0.5; y < h; y += c) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // clock regions around the word, like the device view draws them
      ctx.globalAlpha = (out ? Math.max(0, 1 - t / 0.5) : Math.min(1, t / 0.8)) * 0.5;
      ctx.strokeStyle = pal.region;
      ctx.lineWidth = 1.25;
      const bw = box.x1 - box.x0;
      const bh = box.y1 - box.y0;
      ctx.strokeRect(box.x0 + 0.5, box.y0 + 0.5, bw, bh);
      ctx.beginPath();
      ctx.moveTo(box.x0 + Math.round(bw / 2 / c) * c + 0.5, box.y0);
      ctx.lineTo(box.x0 + Math.round(bw / 2 / c) * c + 0.5, box.y1);
      ctx.stroke();

      // cells: ride their route home, then sit on a spring the pointer can shove
      let placed = 0;
      // The pointer cuts like a blade: along the line it just swept, the cells on
      // each side slide apart like cut paper. The edge at the line is hard; the
      // shift fades with distance, so it reads as a clean slit, not a round dent.
      const OPEN = c * 3.2; // how far each side slides at the cut (the slit is twice this)
      const FALL = c * 3.8; // how quickly that shift fades away from the line
      const TRAIL = 340; // how far behind the pointer the slit stays open
      const s = c - Math.max(1.5, c * 0.16);
      for (const p of cells) {
        if (!p.arrived) {
          const u = Math.min(1, Math.max(0, (t - p.delay) / p.dur));
          // in: ease in and out onto the site; out: launch and keep speeding up
          p.d = p.len * (out ? u * u : u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
          [p.x, p.y] = pointAt(p.path, p.d);
          p.arrived = u >= 1;
        } else if (dt > 0 && !out) {
          let fx = (p.tx - p.x) * STIFF - p.vx * DAMP;
          let fy = (p.ty - p.y) * STIFF - p.vy * DAMP;
          const dx = p.tx + c / 2 - px;
          const dy = p.ty + c / 2 - py;
          const along = -(dx * ux + dy * uy); // > 0 behind the pointer
          const side = dx * -uy + dy * ux; // signed distance from the cut line
          if (along > -c && along < TRAIL && Math.abs(side) < FALL * 4) {
            const s = side === 0 ? ((p.tx / c) % 2 ? 1 : -1) : Math.sign(side);
            // spring force that holds the cell at the shifted spot
            const push = STIFF * OPEN * Math.exp(-Math.abs(side) / FALL) * stir * (1 - (Math.max(0, along) / TRAIL) ** 2);
            fx += -uy * s * push;
            fy += ux * s * push;
          }
          p.vx += fx * dt;
          p.vy += fy * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        const settled = Math.abs(p.x - p.tx) < 0.6 && Math.abs(p.y - p.ty) < 0.6;
        if (settled) placed++;
        ctx.globalAlpha = out || p.arrived ? 1 : t < p.delay ? 0.22 : settled ? 1 : 0.7;
        ctx.fillStyle = p.alt ? pal.alt : pal.cell;
        ctx.fillRect(p.x + (c - s) / 2, p.y + (c - s) / 2, s, s);
        if (p.glow > 0.02) {
          ctx.globalAlpha = p.glow * 0.8;
          ctx.fillStyle = pal.pulse;
          ctx.fillRect(p.x + (c - s) / 2, p.y + (c - s) / 2, s, s);
          p.glow *= Math.pow(0.01, dt); // fades in about half a second
        }
      }

      // the route each travelling cell has covered so far
      ctx.save();
      ctx.translate(c / 2, c / 2);
      ctx.globalAlpha = out ? 0.6 : 0.3;
      ctx.strokeStyle = pal.cell;
      ctx.lineWidth = 1;
      for (const p of cells) if (!p.arrived && p.d > 0) trace(p.path, p.d);
      ctx.restore();

      // I/O pads
      ctx.globalAlpha = (out ? Math.max(0, 1 - t / 0.4) : Math.min(1, t / 1.2)) * 0.9;
      ctx.fillStyle = pal.io;
      for (const [x, y] of pads) ctx.fillRect(x + (c - s) / 2, y + (c - s) / 2, s, s);

      // nets route once most cells are down, then carry signals
      const rt = out ? 0 : t - routeAt;
      const netFade = out ? Math.max(0, 1 - t / 0.35) : 1;
      let routed = 0;
      ctx.lineWidth = Math.max(1, c * 0.09);
      ctx.lineJoin = "round";
      for (const n of nets) {
        const f = out ? 1 : Math.min(1, Math.max(0, (rt - n.at) / 0.55));
        if (f <= 0 || netFade <= 0) continue;
        if (f >= 1 && !out) routed++;
        ctx.globalAlpha = 0.62 * netFade;
        ctx.strokeStyle = n.io ? pal.io : pal.net;
        trace(n.pts, n.len * (1 - Math.pow(1 - f, 3)));
      }
      if (routed === nets.length && nets.length && dt > 0) {
        if (pulses.length < 40 && Math.random() < 0.5) pulses.push({ net: Math.floor(Math.random() * nets.length), d: 0 });
        ctx.fillStyle = pal.pulse;
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pu = pulses[k];
          const n = nets[pu.net];
          pu.d += 340 * dt;
          if (pu.d > n.len) {
            pulses.splice(k, 1);
            continue;
          }
          const [x, y] = pointAt(n.pts, pu.d);
          const hit = at.get(Math.floor(y / c) * Math.ceil(w / c) + Math.floor(x / c));
          if (hit) hit.glow = 1;
          ctx.fillStyle = pal.pulse;
          ctx.globalAlpha = 0.95;
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
      ctx.globalAlpha = 1;

      const done = routed === nets.length && nets.length > 0;
      const sep = w < 640 ? "\n" : "   "; // phones stack the counts so nothing is cut off
      const line = `place_design ${placed}/${cells.length} cells${sep}route_design ${routed}/${nets.length} nets${done ? `\n${verb} my name to see my projects` : ""}`;
      if (line !== hud && hudRef?.current) hudRef.current.textContent = hud = line;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      t += dt;
      stir *= Math.pow(0.02, dt); // gone about a second after the pointer stops
      draw(dt);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      if (px > -9000) {
        const mx = nx - px;
        const my = ny - py;
        const m = Math.hypot(mx, my);
        stir = Math.min(1, stir + m / 120);
        if (m > 0.5) {
          // ease the heading so a jittery hand still cuts a clean line
          ux += (mx / m - ux) * 0.5;
          uy += (my / m - uy) * 0.5;
          const u = Math.hypot(ux, uy) || 1;
          ux /= u;
          uy /= u;
        }
      }
      px = nx;
      py = ny;
      const over = !out && onWord(nx, ny) && !(e.target as Element).closest?.("a,button");
      host.style.cursor = over ? "pointer" : "";
    };
    // a click on the word (not on a link or button) blows it apart and moves the page on
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (out || e.clientY > r.bottom || (e.target as Element).closest("a,button") || !onWord(x, y)) return;
      host.style.cursor = "";
      if (!reduce) {
        shatter(x, y);
        start();
      }
      shatterCb.current?.();
    };
    const onLeave = () => {
      px = py = -9999;
    };

    build();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        // re-form only after the reader has scrolled away and come back to the word
        if (out && entry.intersectionRatio < 0.5) away = true;
        if (out && away && entry.intersectionRatio >= 0.5) {
          away = false;
          scatter(true);
        }
        start();
      },
      { threshold: [0, 0.5] },
    );
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      if (canvas.clientWidth !== w || canvas.clientHeight !== h) build();
    });
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [text, centerY, hudRef]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{
        maskImage: "radial-gradient(ellipse 78% 74% at 50% 46%, #000 50%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 78% 74% at 50% 46%, #000 50%, transparent 100%)",
      }}
    />
  );
}
