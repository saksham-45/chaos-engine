/* =========================================================================
   THE FIGURES - eight parametric equations, one source of truth.
   Powers BOTH the /lab appendix and the hero General Assembly Drawing, so the
   "creative-technical hybrid" thesis is literal: the same math draws both.
   All rendering is cyan-on-navy canvas-2D (see components/kb/CurveStage).
   ========================================================================= */

export type Vec3 = [number, number, number];

export interface SubCurve {
  /** u in [0,1] along the path; phase drifts with time so the figure breathes */
  sample: (u: number, phase: number) => Vec3;
  points: number;
  worldScale: number;
}

export interface CurveSpec {
  id: string;
  name: string;
  /** raw equation, multi-line */
  equation: string;
  caption: string;
  kind: "parametric" | "lorenz";
  /** fraction of min(viewport) the figure spans */
  fit: number;
  curves?: SubCurve[];
}

export const CURVES: CurveSpec[] = [
  {
    id: "lorenz",
    name: "Lorenz Attractor",
    equation: "ẋ = σ(y − x)\nẏ = x(ρ − z) − y\nż = xy − βz",
    caption:
      "Deterministic chaos - a system with no randomness that never repeats. Tiny changes at the start diverge into wildly different futures. It is why long-range weather is fundamentally hard.",
    kind: "lorenz",
    fit: 0.62,
  },
  {
    id: "lissajous",
    name: "Lissajous Figures",
    equation: "x = A·sin(a·t + δ)\ny = B·sin(b·t)",
    caption:
      "Two perpendicular oscillations, one closed figure - exactly what an oscilloscope traces from two out-of-phase signals. Frequency ratios you can see.",
    kind: "parametric",
    fit: 0.5,
    curves: [
      {
        points: 1400,
        worldScale: 1.0,
        sample: (u, ph) => {
          const t = u * Math.PI * 2;
          return [Math.sin(3 * t + ph), Math.sin(2 * t + ph * 0.5), 0.3 * Math.cos(5 * t)];
        },
      },
      {
        points: 1400,
        worldScale: 0.72,
        sample: (u, ph) => {
          const t = u * Math.PI * 2;
          return [Math.sin(5 * t + ph), Math.sin(4 * t + ph * 0.5), 0.3 * Math.cos(9 * t)];
        },
      },
    ],
  },
  {
    id: "epicycloid",
    name: "Epicycloid",
    equation: "x = (R+r)cos t − r·cos((R+r)/r · t)\ny = (R+r)sin t − r·sin((R+r)/r · t)",
    caption:
      "The path of a point on a circle rolling around another circle - the geometry behind gears, planetary orbits, and every Spirograph you ever drew.",
    kind: "parametric",
    fit: 0.62,
    curves: [
      {
        points: 1600,
        worldScale: 1.0,
        sample: (u, ph) => {
          const R = 100,
            r = 30,
            s = 1 / 260,
            t = u * Math.PI * 4 + ph * 0.2;
          return [
            s * ((R + r) * Math.cos(t) - r * Math.cos(((R + r) / r) * t)),
            s * ((R + r) * Math.sin(t) - r * Math.sin(((R + r) / r) * t)),
            s * 50 * Math.sin(t * 2),
          ];
        },
      },
    ],
  },
  {
    id: "butterfly",
    name: "Butterfly Curve",
    equation: "r = e^{cos θ} − 2cos 4θ + sin⁵(θ/12)",
    caption:
      "Six wings from a single transcendental equation, swept over twelve full turns. Proof that one line of math can hold a surprising amount of structure.",
    kind: "parametric",
    fit: 0.5,
    curves: [
      {
        points: 2600,
        worldScale: 1.0,
        sample: (u, ph) => {
          const th = u * Math.PI * 12 + ph * 0.1;
          const r =
            Math.exp(Math.cos(th)) - 2 * Math.cos(4 * th) + Math.pow(Math.sin(th / 12), 5);
          return [0.16 * r * Math.cos(th), 0.16 * r * Math.sin(th), 0.08 * Math.sin(th * 3)];
        },
      },
    ],
  },
  {
    id: "heart",
    name: "Heart Curve",
    equation: "x = 16 sin³ t\ny = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t",
    caption:
      "Yes - affection has a closed form. A parametric curve that resolves, exactly, into a heart. My favorite reminder that math has a sense of humor.",
    kind: "parametric",
    fit: 0.5,
    curves: [
      {
        points: 1400,
        worldScale: 1.0,
        sample: (u, ph) => {
          const t = u * Math.PI * 2 + ph * 0.15;
          return [
            0.052 * 16 * Math.pow(Math.sin(t), 3),
            -0.052 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
            0.052 * 5 * Math.sin(t * 4),
          ];
        },
      },
    ],
  },
  {
    id: "rose",
    name: "Rose Curves",
    equation: "r = a·cos(k·θ)",
    caption:
      "A single integer k sets the petal count - odd k gives k petals, even k gives 2k. Dial one number, redesign the whole flower. Symmetry as a parameter.",
    kind: "parametric",
    fit: 0.62,
    curves: [
      {
        points: 1200,
        worldScale: 1.0,
        sample: (u, ph) => {
          const th = u * Math.PI * 2;
          const r = Math.cos(5 * th) * (1 + 0.25 * Math.sin(ph));
          return [r * Math.cos(th), r * Math.sin(th), 0.2 * Math.sin(th * 5)];
        },
      },
      {
        points: 1200,
        worldScale: 0.66,
        sample: (u, ph) => {
          const th = u * Math.PI * 2;
          const r = Math.cos(4 * th) * (1 + 0.25 * Math.sin(ph));
          return [r * Math.cos(th), r * Math.sin(th), 0.2 * Math.sin(th * 4)];
        },
      },
    ],
  },
  {
    id: "spiral",
    name: "Archimedean Spiral",
    equation: "r = a + b·θ\nx = r·cos θ,  y = r·sin θ",
    caption:
      "Radius grows in step with angle, so every turn is evenly spaced - the shape of record grooves, coiled rope, and the arms of a galaxy.",
    kind: "parametric",
    fit: 0.62,
    curves: [
      {
        points: 2200,
        worldScale: 1.0,
        sample: (u, ph) => {
          const turns = 6,
            t = u * Math.PI * 2 * turns;
          const r = u;
          return [r * Math.cos(t + ph * 0.1), r * Math.sin(t + ph * 0.1), 0.12 * Math.sin(t)];
        },
      },
    ],
  },
  {
    id: "fourier",
    name: "Fourier Series",
    equation: "f(x) = Σ aₙ·sin(nx) + bₙ·cos(nx)",
    caption:
      "Any signal is a sum of sines. Add enough harmonics and you can build any waveform - the exact idea powering the audio-feature engine inside AutoMix.",
    kind: "parametric",
    fit: 0.72,
    curves: [
      {
        points: 1600,
        worldScale: 1.0,
        sample: (u, ph) => {
          const x = (u - 0.5) * 4;
          let y = 0;
          for (let n = 1; n <= 15; n++) y += (0.32 / n) * Math.sin(n * x * 3 + ph * n * 0.5);
          return [x, y, 0.25 * Math.sin(x * 2)];
        },
      },
    ],
  },
];

export function getCurve(id: string): CurveSpec {
  return CURVES.find((c) => c.id === id) ?? CURVES[0];
}

/** 3D → 2D projection with two-axis rotation. */
export function project(
  x: number,
  y: number,
  z: number,
  ax: number,
  ay: number,
  scale: number,
  ox: number,
  oy: number
): [number, number] {
  const cx = Math.cos(ax),
    sx = Math.sin(ax),
    cy = Math.cos(ay),
    sy = Math.sin(ay);
  const y1 = y * cx - z * sx,
    z1 = y * sx + z * cx;
  const x2 = x * cy + z1 * sy,
    y2 = y1;
  return [ox + x2 * scale, oy + y2 * scale];
}
