"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================================
   THE MATHEMATICS UNDERNEATH
   A cinematic gallery of eight equations, drawn live. Reached via the "???"
   on the home page. Each curve: curated 2-stop gradient, a glowing draw-head,
   mouse-parallax 3D rotation, and a caption tying the math to real work.
   ========================================================================= */

type Vec3 = [number, number, number];

interface SubCurve {
  // u ∈ [0,1] along the path, phase drifts with time so the figure breathes
  sample: (u: number, phase: number) => Vec3;
  points: number;
  palette: [string, string];
  worldScale: number; // multiplied by the responsive fit scale
}

interface Spec {
  id: string;
  name: string;
  equation: string;
  caption: string;
  accent: string; // HUD accent
  kind: "parametric" | "lorenz";
  curves?: SubCurve[];
  fit: number; // fraction of min(viewport) the figure should span
}

/* ---------------- color helpers ---------------- */
function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerpHex(a: string, b: string, t: number) {
  const ca = hexRgb(a), cb = hexRgb(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

/* ---------------- the eight specs ---------------- */
const SPECS: Spec[] = [
  {
    id: "lorenz",
    name: "Lorenz Attractor",
    equation: "ẋ = σ(y − x)\nẏ = x(ρ − z) − y\nż = xy − βz",
    caption: "Deterministic chaos — a system with no randomness that never repeats. Tiny changes in where you start diverge into wildly different futures. It's why long-range weather is fundamentally hard.",
    accent: "#22e0ff",
    kind: "lorenz",
    fit: 0.62,
  },
  {
    id: "lissajous",
    name: "Lissajous Figures",
    equation: "x = A·sin(a·t + δ)\ny = B·sin(b·t)",
    caption: "Two perpendicular oscillations, one closed figure. The exact shape an oscilloscope traces when you feed it two out-of-phase signals — frequency ratios you can see.",
    accent: "#38bdf8",
    kind: "parametric",
    fit: 0.5,
    curves: [
      { points: 1400, palette: ["#22d3ee", "#3b82f6"], worldScale: 1.0, sample: (u, ph) => { const t = u * Math.PI * 2; return [Math.sin(3 * t + ph), Math.sin(2 * t + ph * 0.5), 0.3 * Math.cos(5 * t)]; } },
      { points: 1400, palette: ["#818cf8", "#22d3ee"], worldScale: 0.72, sample: (u, ph) => { const t = u * Math.PI * 2; return [Math.sin(5 * t + ph), Math.sin(4 * t + ph * 0.5), 0.3 * Math.cos(9 * t)]; } },
    ],
  },
  {
    id: "epicycloid",
    name: "Epicycloid",
    equation: "x = (R+r)cos t − r·cos((R+r)/r · t)\ny = (R+r)sin t − r·sin((R+r)/r · t)",
    caption: "The path traced by a point on a circle rolling around another circle. The same geometry behind gears, planetary orbits, and every Spirograph you ever drew.",
    accent: "#34d399",
    kind: "parametric",
    fit: 0.62,
    curves: [
      {
        points: 1600, palette: ["#34d399", "#a3e635"], worldScale: 1.0,
        sample: (u, ph) => {
          const R = 100, r = 30, s = 1 / 260, t = u * Math.PI * 4 + ph * 0.2;
          return [s * ((R + r) * Math.cos(t) - r * Math.cos(((R + r) / r) * t)), s * ((R + r) * Math.sin(t) - r * Math.sin(((R + r) / r) * t)), s * 50 * Math.sin(t * 2)];
        },
      },
    ],
  },
  {
    id: "butterfly",
    name: "Butterfly Curve",
    equation: "r = e^{cos θ} − 2cos 4θ + sin⁵(θ/12)",
    caption: "Six wings from a single transcendental equation, swept over twelve full turns. Proof that one line of math can hold a surprising amount of structure.",
    accent: "#c084fc",
    kind: "parametric",
    fit: 0.5,
    curves: [
      {
        points: 2600, palette: ["#c084fc", "#f472b6"], worldScale: 1.0,
        sample: (u, ph) => {
          const th = u * Math.PI * 12 + ph * 0.1;
          const r = Math.exp(Math.cos(th)) - 2 * Math.cos(4 * th) + Math.pow(Math.sin(th / 12), 5);
          return [0.16 * r * Math.cos(th), 0.16 * r * Math.sin(th), 0.08 * Math.sin(th * 3)];
        },
      },
    ],
  },
  {
    id: "heart",
    name: "Heart Curve",
    equation: "x = 16 sin³ t\ny = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t",
    caption: "Yes — affection has a closed form. A parametric curve that resolves, exactly, into a heart. My favorite reminder that math has a sense of humor.",
    accent: "#fb7185",
    kind: "parametric",
    fit: 0.5,
    curves: [
      {
        points: 1400, palette: ["#fb7185", "#fbbf24"], worldScale: 1.0,
        sample: (u, ph) => {
          const t = u * Math.PI * 2 + ph * 0.15;
          return [0.052 * 16 * Math.pow(Math.sin(t), 3), -0.052 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)), 0.052 * 5 * Math.sin(t * 4)];
        },
      },
    ],
  },
  {
    id: "rose",
    name: "Rose Curves",
    equation: "r = a·cos(k·θ)",
    caption: "A single integer k sets the petal count — odd k gives k petals, even k gives 2k. Dial one number, redesign the whole flower. Symmetry as a parameter.",
    accent: "#e879f9",
    kind: "parametric",
    fit: 0.62,
    curves: [
      { points: 1200, palette: ["#e879f9", "#fbbf24"], worldScale: 1.0, sample: (u, ph) => { const th = u * Math.PI * 2; const r = Math.cos(5 * th) * (1 + 0.25 * Math.sin(ph)); return [r * Math.cos(th), r * Math.sin(th), 0.2 * Math.sin(th * 5)]; } },
      { points: 1200, palette: ["#f472b6", "#a78bfa"], worldScale: 0.66, sample: (u, ph) => { const th = u * Math.PI * 2; const r = Math.cos(4 * th) * (1 + 0.25 * Math.sin(ph)); return [r * Math.cos(th), r * Math.sin(th), 0.2 * Math.sin(th * 4)]; } },
      { points: 1200, palette: ["#c084fc", "#22d3ee"], worldScale: 0.36, sample: (u, ph) => { const th = u * Math.PI * 2; const r = Math.cos(3 * th) * (1 + 0.25 * Math.sin(ph)); return [r * Math.cos(th), r * Math.sin(th), 0.2 * Math.sin(th * 3)]; } },
    ],
  },
  {
    id: "spiral",
    name: "Archimedean Spiral",
    equation: "r = a + b·θ\nx = r·cos θ,  y = r·sin θ",
    caption: "Radius grows in step with angle, so every turn is evenly spaced. The shape of grooves on a record, coiled rope, and the arms of a galaxy.",
    accent: "#fbbf24",
    kind: "parametric",
    fit: 0.62,
    curves: [
      {
        points: 2200, palette: ["#fbbf24", "#f43f5e"], worldScale: 1.0,
        sample: (u, ph) => {
          const turns = 6, t = u * Math.PI * 2 * turns;
          const r = u; // normalized 0..1 → even spacing
          return [r * Math.cos(t + ph * 0.1), r * Math.sin(t + ph * 0.1), 0.12 * Math.sin(t)];
        },
      },
    ],
  },
  {
    id: "fourier",
    name: "Fourier Series",
    equation: "f(x) = Σ aₙ·sin(nx) + bₙ·cos(nx)",
    caption: "Any signal is a sum of sines. Add enough harmonics and you can build any waveform — the exact idea powering the audio-feature engine inside my AutoMix project.",
    accent: "#4ade80",
    kind: "parametric",
    fit: 0.72,
    curves: [
      {
        points: 1600, palette: ["#4ade80", "#22d3ee"], worldScale: 1.0,
        sample: (u, ph) => {
          const x = (u - 0.5) * 4; // spread across
          let y = 0;
          for (let n = 1; n <= 15; n++) y += (0.32 / n) * Math.sin(n * x * 3 + ph * n * 0.5);
          return [x, y, 0.25 * Math.sin(x * 2)];
        },
      },
    ],
  },
];

/* 3D projection */
function project(x: number, y: number, z: number, ax: number, ay: number, scale: number, ox: number, oy: number): [number, number] {
  const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
  const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
  const x2 = x * cy + z1 * sy, y2 = y1;
  return [ox + x2 * scale, oy + y2 * scale];
}

/* ---------------- one live canvas per curve ---------------- */
function CurveStage({ spec, isActive, speed, playing, mouse }: {
  spec: Spec; isActive: boolean; speed: number; playing: boolean; mouse: React.RefObject<{ x: number; y: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0, t = 0;
    let reveal = 0; // 0..1 draw progress
    // Lorenz live state
    const lz = [0, 1, 2].map((i) => ({
      trail: [] as Vec3[],
      s: { x: -20 + 20 * i, y: -10 + 8 * i, z: 12 + 8 * i } as { x: number; y: number; z: number },
      palette: [["#22e0ff", "#c084fc"], ["#38bdf8", "#4ade80"], ["#e879f9", "#22d3ee"]][i] as [string, string],
    }));

    const drawPath = (pts: [number, number][], palette: [string, string], head: number) => {
      const chunks = 9;
      for (let c = 0; c < chunks; c++) {
        const a = Math.floor((c / chunks) * (pts.length - 1));
        const b = Math.floor(((c + 1) / chunks) * (pts.length - 1));
        if (b <= a) continue;
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        for (let i = a + 1; i <= b; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        const col = lerpHex(palette[0], palette[1], c / (chunks - 1));
        ctx.strokeStyle = col;
        ctx.shadowColor = col;
        ctx.stroke();
      }
      // glowing draw-head
      if (head >= 0 && head < pts.length) {
        const [hx, hy] = pts[head];
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 16);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.4, palette[1] + "cc");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(hx, hy, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!playing) return;

      // Lorenz keeps a motion-blur trail; the fully-redrawn parametric curves
      // clear to solid black each frame so additive glow can't haze up.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = spec.kind === "lorenz" ? "rgba(0,0,0,0.16)" : "#000";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 14;

      const mx = mouse.current?.x ?? 0.5, my = mouse.current?.y ?? 0.5;
      const ax = t * 0.16 * speed + (my - 0.5) * 1.2;
      const ay = t * 0.12 * speed + (mx - 0.5) * 1.6;
      const ox = W / 2, oy = H / 2;

      if (spec.kind === "lorenz") {
        const scale = Math.min(W, H) / 62;
        const dt = 0.007 * speed, sigma = 10, rho = 28, beta = 8 / 3;
        lz.forEach((a) => {
          const pts: [number, number][] = a.trail.map((p) => project(p[0], p[1], p[2] - 25, ax, ay, scale, ox, oy));
          if (pts.length > 2) drawPath(pts, a.palette, pts.length - 1);
          for (let step = 0; step < 3; step++) {
            const { x, y, z } = a.s;
            a.s = { x: x + sigma * (y - x) * dt, y: y + (x * (rho - z) - y) * dt, z: z + (x * y - beta * z) * dt };
            a.trail.push([a.s.x, a.s.y, a.s.z]);
          }
          if (a.trail.length > 620) a.trail.splice(0, a.trail.length - 620);
        });
      } else if (spec.curves) {
        reveal = Math.min(1, reveal + 0.02 * speed);
        const scale = Math.min(W, H) * spec.fit * 0.5;
        for (const sc of spec.curves) {
          const n = sc.points;
          const count = Math.floor(reveal * n);
          const pts: [number, number][] = [];
          for (let i = 0; i <= count; i++) {
            const [x, y, z] = sc.sample(i / n, t * speed);
            pts.push(project(x * sc.worldScale, y * sc.worldScale, z * sc.worldScale, ax, ay, scale, ox, oy));
          }
          if (pts.length > 2) drawPath(pts, sc.palette, pts.length - 1);
        }
      }

      t += 0.016 * speed;
    };

    // clear once so switching sections doesn't ghost the previous curve
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isActive, speed, playing, spec, mouse]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ---------------- decrypting text (matrix reveal) ---------------- */
function Decrypt({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    const chars = "01<>/\\{}[]#$%&*+=";
    let frame = 0;
    let started = false;
    const startTimer = setTimeout(() => { started = true; }, delay);
    const id = setInterval(() => {
      if (!started) return;
      frame++;
      const revealed = Math.floor(frame / 2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed || text[i] === " ") s += text[i];
        else s += chars[Math.floor(Math.random() * chars.length)];
      }
      setOut(s);
      if (revealed >= text.length) clearInterval(id);
    }, 40);
    return () => { clearInterval(id); clearTimeout(startTimer); };
  }, [text, delay]);
  return <span className={className}>{out || " "}</span>;
}

/* ============================ page ============================ */
export default function MysteryPage() {
  const [entered, setEntered] = useState(false);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  const TOTAL = SPECS.length;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      const idx = sectionRefs.current.findIndex((ref) => {
        if (!ref) return false;
        const r = ref.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      if (idx !== -1 && idx !== current) setCurrent(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [current]);

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, i));
    sectionRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setCurrent(clamped);
  }, [TOTAL]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!entered) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, current, goTo]);

  const active = SPECS[current];

  return (
    <div className="relative bg-black">
      {/* ===== Entry portal ===== */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="portal"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black cursor-pointer px-6 text-center"
            onClick={() => setEntered(true)}
          >
            <p className="label-mono mb-6">
              you found the lab
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-5">
              <Decrypt text="THE MATHEMATICS UNDERNEATH" />
            </h1>
            <p className="max-w-lg text-[var(--muted)] leading-relaxed mb-10">
              <Decrypt text="Everything I build starts as an equation. Here are eight of them — alive, drawing themselves, one line of math at a time." delay={600} />
            </p>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--accent)]"
            >
              click to descend ↓
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HUD ===== */}
      {entered && (
        <>
          {/* progress bar */}
          <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
            <motion.div
              className="h-full"
              style={{ background: active.accent, boxShadow: `0 0 10px ${active.accent}` }}
              animate={{ width: `${((current + 1) / TOTAL) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* index rail */}
          <motion.nav
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-3"
          >
            {SPECS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className="group flex items-center gap-3 px-2 py-1.5 rounded-lg text-left transition-colors"
                style={{ color: current === i ? s.accent : "rgba(255,255,255,0.4)" }}
              >
                <span className="font-mono text-[10px] tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs font-mono whitespace-nowrap transition-transform group-hover:translate-x-0.5">{s.name}</span>
              </button>
            ))}
          </motion.nav>

          {/* controls */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2"
          >
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors"
              style={{ borderColor: active.accent + "66", color: active.accent }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <input
              type="range" min="0.4" max="2.5" step="0.1" value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 accent-current" style={{ color: active.accent }}
              aria-label="Speed"
            />
            <span className="text-[10px] font-mono w-8 text-right" style={{ color: active.accent }}>{speed.toFixed(1)}×</span>
          </motion.div>

          {/* dot indicator */}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-2">
            {SPECS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={s.name}
                className="h-2 rounded-full transition-all"
                style={{ width: current === i ? 28 : 8, background: current === i ? s.accent : "rgba(255,255,255,0.25)" }}
              />
            ))}
          </div>
        </>
      )}

      {/* ===== curve sections ===== */}
      {SPECS.map((spec, i) => (
        <section
          key={spec.id}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className="relative h-screen w-full overflow-hidden"
        >
          <CurveStage spec={spec} isActive={entered && current === i} speed={speed} playing={playing} mouse={mouse} />

          {/* caption block */}
          <motion.div
            className="absolute left-6 md:left-24 bottom-24 md:bottom-28 z-10 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: current === i ? 1 : 0.25, y: current === i ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: spec.accent }}>
              {String(i + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3 text-white">
              {spec.name}
            </h2>
            <pre className="font-mono text-xs md:text-sm whitespace-pre-line leading-relaxed mb-4 border-l-2 pl-3" style={{ color: spec.accent, borderColor: spec.accent + "66" }}>
              {spec.equation}
            </pre>
            <p className="text-white/60 text-sm leading-relaxed">{spec.caption}</p>
          </motion.div>
        </section>
      ))}

      {/* ===== outro ===== */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="label-mono mb-5">end of gallery</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-5">
            Math, all the way down.
          </h2>
          <p className="max-w-lg mx-auto text-[var(--muted)] leading-relaxed mb-10">
            It&rsquo;s the substrate. The same equations that drew these curves quantize my ML models,
            score audio features, and shape a 25,000-node planet on the home page.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/projects" className="btn-primary">
              See where it&rsquo;s used →
            </Link>
            <Link href="/" className="btn-secondary">
              Back to the planet
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
