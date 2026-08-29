/**
 * visualizzer.ts
 *
 * Portable, dependency-free port of the REAL canvas-2D visualizers from
 * Saksham's vanilla-JS audio visualizer repo, driven by SYNTHETIC audio.
 *
 * No microphone, no Web Audio, no WebGL, no Three.js, no external imports.
 * The React host owns the render loop (call draw() ~30fps behind an
 * IntersectionObserver). Every draw is O(bufferLength) and allocation-light.
 *
 * Ported algorithms (recolored to the portfolio palette, motion preserved):
 *   - bars           <- visualizers.js  Visualizers.renderBars
 *   - oscilloscope   <- visualizers.js  Visualizers.renderWave
 *   - radialSpectrum <- visualizers.js  Visualizers.renderSpectrumCircle
 *   - particleField  <- visualizers.js  Visualizers.renderParticles
 *   - tunnel         <- meshVisualizers.js MeshVisualizers.renderWarpTunnel
 *   - terrain        <- meshVisualizers.js MeshVisualizers.renderHorizonGrid
 *
 * Synthetic driver ports Visualizers._getSyntheticAudioData +
 * Visualizers._deriveMetadataFromAudioData (bass-heavy spectrum, a moving
 * peak, a periodic beat), so the visuals match the app's own fallback.
 */

/* ------------------------------------------------------------------ */
/* Palette (themed to the portfolio, not the repo's rainbow HSV)       */
/* ------------------------------------------------------------------ */

/** Background. */
const BG = "#0c0c0e";
/** Primary line/fill zinc. */
const CYAN = "#d4d4d8";
const CYAN_RGB = { r: 212, g: 212, b: 216 } as const;
/** Accent white for peaks / beats. */
const RED = "#fafafa";
const RED_RGB = { r: 250, g: 250, b: 250 } as const;
/** Faint grid. */
const GRID = "rgba(212,212,216,0.10)";

/** Interpolate cyan -> oxide-red by `e` (0..1); returns an rgba() string. */
function hot(e: number, alpha: number): string {
  const k = e < 0 ? 0 : e > 1 ? 1 : e;
  const r = (CYAN_RGB.r + (RED_RGB.r - CYAN_RGB.r) * k) | 0;
  const g = (CYAN_RGB.g + (RED_RGB.g - CYAN_RGB.g) * k) | 0;
  const b = (CYAN_RGB.b + (RED_RGB.b - CYAN_RGB.b) * k) | 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

/* ------------------------------------------------------------------ */
/* Public types                                                        */
/* ------------------------------------------------------------------ */

export type VizMode =
  | "bars"
  | "oscilloscope"
  | "radialSpectrum"
  | "particleField"
  | "tunnel"
  | "terrain";

export interface VizMeta {
  amplitude: number;
  bass: number;
  mid: number;
  treble: number;
  centroid: number;
}

export interface VizFrame {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  bufferLength: number;
  meta: VizMeta;
}

export interface VizDef {
  label: string;
  init(w: number, h: number): unknown;
  draw(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    frame: VizFrame,
    t: number,
    state: unknown
  ): void;
}

/* ------------------------------------------------------------------ */
/* Synthetic audio driver                                              */
/* Ported from Visualizers._getSyntheticAudioData /                    */
/*             Visualizers._deriveMetadataFromAudioData                */
/* ------------------------------------------------------------------ */

/**
 * Create a synthetic audio source. Each `step(t)` (t in seconds) refills and
 * returns the SAME reused VizFrame: a bass-heavy spectrum with a slowly moving
 * peak and a periodic beat, plus metadata derived like the repo's fallback.
 * Typed arrays are allocated once and reused across every call.
 */
export function createSynthAudio(
  bufferLength: number = 256
): { step(t: number): VizFrame } {
  const frequencyData = new Uint8Array(bufferLength);
  const timeData = new Uint8Array(bufferLength);
  const meta: VizMeta = {
    amplitude: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    centroid: 0,
  };
  const frame: VizFrame = { frequencyData, timeData, bufferLength, meta };

  // Peak of one band as a 0..1 value (port of _deriveMetadataFromAudioData's
  // bandPeak, keeping only the `peak` we expose).
  function bandPeak(startFrac: number, endFrac: number): number {
    const start = Math.floor(bufferLength * startFrac);
    const end = Math.floor(bufferLength * endFrac);
    let peak = 0;
    for (let i = start; i < end; i++) {
      const v = frequencyData[i] / 255;
      if (v > peak) peak = v;
    }
    return peak;
  }

  function deriveMeta(): void {
    // amplitude: mean absolute deviation of the waveform (repo formula).
    let amp = 0;
    for (let i = 0; i < bufferLength; i += 4) {
      amp += Math.abs((timeData[i] - 128) / 128);
    }
    meta.amplitude = Math.min(1, amp / (bufferLength / 4));

    // energy bands -> peaks (repo split into sub/bass/mid/treble; we merge
    // sub+bass into a single bass and expose the three the contract wants).
    meta.bass = bandPeak(0.0, 0.15);
    meta.mid = bandPeak(0.15, 0.5);
    meta.treble = bandPeak(0.5, 1.0);

    // spectral centroid, normalized to 0..1.
    let num = 0;
    let den = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = frequencyData[i];
      num += i * v;
      den += v;
    }
    meta.centroid = den > 0 ? num / den / bufferLength : 0;
  }

  function step(t: number): VizFrame {
    // Periodic beat pulse (~0.9 Hz), sharpened so hits read as transients.
    const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 0.9)), 6);
    // A peak that slowly sweeps through the low-mid region.
    const peakCenter = 0.18 + 0.12 * Math.sin(t * 0.7);
    const waveEnv = 0.55 + 0.45 * beat;
    const freqEnv = 0.6 + 0.5 * beat;

    for (let i = 0; i < bufferLength; i++) {
      const f = i / bufferLength;
      const phase = f * Math.PI * 2;

      // Waveform: a few detuned harmonics, amplitude-modulated by the beat.
      // (Repo used a single sin; enriched here so the oscilloscope has life.)
      const wave =
        Math.sin(phase * 2 + t * 2) * 0.6 +
        Math.sin(phase * 5 + t * 3.1) * 0.25 +
        Math.sin(phase * 9 - t * 1.7) * 0.15;
      timeData[i] = clampByte(128 + wave * 40 * waveEnv);

      // Spectrum: bass-heavy exponential floor + the moving peak, with a
      // fast wobble so neighbouring bins differ (like real FFT bins).
      const bassShape = Math.exp(-f * 5.5);
      const dp = f - peakCenter;
      const peak = Math.exp(-(dp * dp) / (2 * 0.0016));
      const wobble = 0.55 + 0.45 * Math.sin(f * 38 + t * 4);
      const v = (bassShape * 0.85 + peak * 0.6) * wobble * freqEnv;
      frequencyData[i] = clampByte(v * 255);
    }

    deriveMeta();
    return frame;
  }

  return { step };
}

/* ------------------------------------------------------------------ */
/* Visualizer state shapes (private)                                   */
/* ------------------------------------------------------------------ */

interface BarsState {
  heights: Float32Array;
}
interface ParticleState {
  count: number;
  energy: Float32Array;
}

/* ------------------------------------------------------------------ */
/* Visualizers                                                         */
/* ------------------------------------------------------------------ */

const BAR_COUNT = 48;
const PARTICLE_COUNT = 90;

/**
 * bars — spectrum bars.
 * Port of Visualizers.renderBars. Adds a smoothed rise/fall envelope per bar
 * (fast up, slow down) held in state, a faint cyan baseline grid, and hot-bin
 * recoloring toward oxide-red as a bar approaches full height.
 */
const bars: VizDef = {
  label: "Spectrum Bars",
  init(): BarsState {
    return { heights: new Float32Array(BAR_COUNT) };
  },
  draw(ctx, w, h, frame, _t, state) {
    const s = state as BarsState;
    const { frequencyData, bufferLength } = frame;
    const heights = s.heights;
    const slotW = w / BAR_COUNT;
    const barWidth = slotW * 0.8;
    const gap = slotW * 0.2;

    // Faint baseline grid (a few horizontal rules).
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    for (let g = 1; g <= 4; g++) {
      const y = h - (h * 0.8 * g) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const dataIndex = Math.floor((i / BAR_COUNT) * (bufferLength / 2));
      const target = (frequencyData[dataIndex] / 255) * h * 0.8;
      // Fast attack, slow release.
      const prev = heights[i];
      heights[i] = target > prev ? target : prev + (target - prev) * 0.18;

      const barHeight = heights[i];
      const x = i * (barWidth + gap);
      const y = h - barHeight;
      const e = barHeight / (h * 0.8);

      ctx.fillStyle = hot(e * e, 0.85);
      ctx.fillRect(x, y, barWidth, barHeight);
      // Hot cap on tall bars.
      if (e > 0.75) {
        ctx.fillStyle = hot(1, 0.9);
        ctx.fillRect(x, y, barWidth, 3);
      }
    }
  },
};

/**
 * oscilloscope — time-domain waveform.
 * Port of Visualizers.renderWave. Amplitude scaled by meta.amplitude, colored
 * cyan and flushing toward oxide-red on beats (high amplitude).
 */
const oscilloscope: VizDef = {
  label: "Oscilloscope",
  init(): Record<string, never> {
    return {};
  },
  draw(ctx, w, h, frame, _t, _state) {
    const { timeData, bufferLength, meta } = frame;
    const amplitude = (meta.amplitude || 0.5) * h * 0.4;
    const centerY = h / 2;

    // Faint center line grid.
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = hot(meta.amplitude, 0.9);
    ctx.lineWidth = 3;
    for (let i = 0; i < bufferLength; i++) {
      const x = (i / bufferLength) * w;
      const v = timeData[i] / 128.0 - 1;
      const y = centerY + v * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },
};

/**
 * radialSpectrum — circular spectrum (bars radiating from a ring).
 * Port of Visualizers.renderSpectrumCircle. Bar length + width from per-band
 * energy; recolored cyan->red by energy instead of the original hue sweep.
 */
const radialSpectrum: VizDef = {
  label: "Radial Spectrum",
  init(): Record<string, never> {
    return {};
  },
  draw(ctx, w, h, frame, _t, _state) {
    const { frequencyData, bufferLength } = frame;
    const centerX = w / 2;
    const centerY = h / 2;
    const baseRadius = Math.min(w, h) * 0.15;
    const bands = 64;

    // Faint base ring grid.
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < bands; i++) {
      const dataIndex = Math.floor((i / bands) * (bufferLength / 2));
      const energy = frequencyData[dataIndex] / 255;
      const angle = (i / bands) * Math.PI * 2;
      const barLength = energy * Math.min(w, h) * 0.3;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = centerX + cos * baseRadius;
      const y1 = centerY + sin * baseRadius;
      const x2 = centerX + cos * (baseRadius + barLength);
      const y2 = centerY + sin * (baseRadius + barLength);

      ctx.strokeStyle = hot(energy, 0.7 + energy * 0.3);
      ctx.lineWidth = 3 + energy * 5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  },
};

/**
 * particleField — orbiting particle ring.
 * Port of Visualizers.renderParticles. Positions come from per-band energy on
 * a rotating ring; a persistent per-particle smoothed-energy array (init state)
 * keeps size/brightness from flickering. Rotation driven by time.
 */
const particleField: VizDef = {
  label: "Particle Field",
  init(): ParticleState {
    return { count: PARTICLE_COUNT, energy: new Float32Array(PARTICLE_COUNT) };
  },
  draw(ctx, w, h, frame, t, state) {
    const s = state as ParticleState;
    const { frequencyData, bufferLength } = frame;
    const centerX = w / 2;
    const centerY = h / 2;
    const count = s.count;
    const spin = t * 0.4;

    for (let i = 0; i < count; i++) {
      const dataIndex = Math.floor((i / count) * (bufferLength / 2));
      const target = frequencyData[dataIndex] / 255;
      // Smooth per-particle energy (allocation-free).
      const e = s.energy[i] + (target - s.energy[i]) * 0.2;
      s.energy[i] = e;

      const angle = (i / count) * Math.PI * 2 + spin;
      const distance = w * 0.15 + e * w * 0.25;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = 2 + e * 8;

      ctx.fillStyle = hot(e, 0.5 + e * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

/**
 * Inlined pseudo-perspective projection used by tunnel + terrain. Replaces the
 * repo's CameraController.project (which we deliberately do NOT import). Writes
 * screen coords and a depth `scale` (near = large, far = small) into a single
 * module-level scratch object that is reused across every call — no per-frame
 * allocation even when invoked hundreds of times inside a draw loop. The result
 * is consumed immediately, before the next call overwrites it.
 */
interface Projected {
  x: number;
  y: number;
  scale: number;
}
const _proj: Projected = { x: 0, y: 0, scale: 0 };
function project(
  x3d: number,
  y3d: number,
  z3d: number,
  centerX: number,
  centerY: number,
  zShift: number
): Projected {
  const scale = 400 / (400 + z3d + zShift);
  _proj.x = centerX + x3d * scale;
  _proj.y = centerY + y3d * scale;
  _proj.scale = scale;
  return _proj;
}

/**
 * tunnel — warp-tunnel of concentric rings receding into a glowing core.
 * Port of MeshVisualizers.renderWarpTunnel with the CameraController removed:
 * depth uses the inlined `project`, fastSin/fastCos -> Math, hue sweep -> cyan
 * with oxide-red hot spots on energetic segments.
 */
const tunnel: VizDef = {
  label: "Warp Tunnel",
  init(): Record<string, never> {
    return {};
  },
  draw(ctx, w, h, frame, t, _state) {
    const { frequencyData, timeData, bufferLength, meta } = frame;
    const centerX = w / 2;
    const centerY = h / 2;
    const rings = 25;
    const segments = 36;
    const speed = t * 3.5;
    const maxRadius = Math.max(w, h) * 0.7;

    for (let ring = 0; ring < rings; ring++) {
      const zProgress = ((ring / rings) + speed * 0.2) % 1;
      const z3d = (1 - zProgress) * 800 - 300;

      const freqIndex = Math.floor((ring / rings) * bufferLength);
      const energy = frequencyData[freqIndex] / 255;
      const wave = (timeData[freqIndex] / 128.0 - 1) * 60;
      const baseRadius = 40 + zProgress * maxRadius * (0.9 + energy * 0.4);

      let started = false;
      let scaleSum = 0;
      let scaleN = 0;
      ctx.beginPath();
      for (let seg = 0; seg <= segments; seg++) {
        const angle = (seg / segments) * Math.PI * 2 + t * 0.6 + ring * 0.2;
        const segFreqIndex = Math.floor((seg / segments) * bufferLength);
        const segEnergy = frequencyData[segFreqIndex] / 255;
        const wobble = Math.sin(angle * 4 + t * 5) * 40 * segEnergy;
        const radius = baseRadius + wobble + wave * energy;

        const x3d = Math.cos(angle) * radius;
        const y3d = Math.sin(angle) * radius;
        const p = project(x3d, y3d, z3d, centerX, centerY, 300);
        scaleSum += p.scale;
        scaleN++;
        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      const avgScale = scaleN ? scaleSum / scaleN : 1;
      const alpha = Math.min(1, 0.35 + zProgress * 0.5 + energy * 0.25);
      ctx.strokeStyle = hot(energy, alpha);
      ctx.lineWidth = Math.max(1.5, (2 + energy * 4) * avgScale);
      ctx.stroke();
    }

    // Glowing core (cyan -> red by amplitude).
    const coreEnergy = meta.amplitude;
    const coreSize = 25 + coreEnergy * 70;
    const grad = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      coreSize
    );
    grad.addColorStop(0, hot(coreEnergy, 1));
    grad.addColorStop(0.4, hot(coreEnergy, 0.5));
    grad.addColorStop(1, "rgba(12,42,58,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
    ctx.fill();
  },
};

/**
 * terrain — retro horizon grid: perspective floor lines + vertical rails with a
 * pulsing sun on the horizon.
 * Port of MeshVisualizers.renderHorizonGrid with the CameraController removed
 * (inlined `project` for the depth scale), hue sweep -> cyan, sun -> oxide-red.
 */
const terrain: VizDef = {
  label: "Horizon Grid",
  init(): Record<string, never> {
    return {};
  },
  draw(ctx, w, h, frame, t, _state) {
    const { frequencyData, timeData, bufferLength, meta } = frame;
    const centerX = w / 2;
    const centerY = h / 2;
    const horizonY = h * 0.4;
    const gridLines = 35;
    const verticalLines = 40;
    const speed = t * 2.5;

    // Perspective floor lines (receding toward the horizon).
    for (let i = 0; i < gridLines; i++) {
      const baseZ = ((i / gridLines) * 1000 + ((speed * 60) % 1000)) % 1000;
      const z3d = baseZ - 200;
      const p = project(0, 100, z3d, centerX, centerY, 200);
      if (p.scale <= 0.03) continue;
      const scale = p.scale;

      const freqIndex = Math.floor((i / gridLines) * bufferLength);
      const energy = frequencyData[freqIndex] / 255;
      const wave = (timeData[freqIndex] / 128.0 - 1) * 40;

      const y = horizonY + (1 - scale) * (h - horizonY) * 1.4;
      const xExtent = w * scale * 2.5;
      const x1 = centerX - xExtent;
      const x2 = centerX + xExtent;
      const waveY = y + wave * energy;

      const alpha = Math.min(1, (0.3 + scale * 0.7) * (0.6 + energy * 0.4));
      ctx.strokeStyle = hot(energy, alpha);
      ctx.lineWidth = Math.max(1.5, 4 * scale * (1 + energy));
      ctx.beginPath();
      let started = false;
      for (let x = x1; x <= x2; x += 8) {
        const tt = (x - x1) / (x2 - x1);
        const waveFreq = Math.floor(tt * bufferLength);
        const localEnergy = frequencyData[waveFreq] / 255;
        const localY = waveY + Math.sin(tt * Math.PI * 10 + t * 6) * 20 * localEnergy;
        if (!started) {
          ctx.moveTo(x, localY);
          started = true;
        } else {
          ctx.lineTo(x, localY);
        }
      }
      ctx.stroke();
    }

    // Vertical rails fanning out from the horizon.
    for (let i = 0; i < verticalLines; i++) {
      const xProgress = i / (verticalLines - 1) - 0.5;
      const x1 = centerX + xProgress * w * 2.5;
      const x2 = centerX + xProgress * w * 0.15;
      const freqIndex = Math.floor((i / verticalLines) * bufferLength);
      const energy = frequencyData[freqIndex] / 255;

      ctx.strokeStyle = hot(energy * 0.6, 0.35 + energy * 0.4);
      ctx.lineWidth = 1.5 + energy * 3;
      ctx.beginPath();
      ctx.moveTo(x1, h + 30);
      ctx.lineTo(x2, horizonY);
      ctx.stroke();
    }

    // Pulsing sun on the horizon (oxide-red hot).
    const sunSize = 80 + meta.amplitude * 120 + Math.sin(t * 3) * 25;
    const sunGrad = ctx.createRadialGradient(
      centerX,
      horizonY,
      0,
      centerX,
      horizonY,
      sunSize
    );
    sunGrad.addColorStop(0, hot(0.8, 1));
    sunGrad.addColorStop(0.4, hot(1, 0.7));
    sunGrad.addColorStop(1, "rgba(12,42,58,0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(centerX, horizonY, sunSize, 0, Math.PI * 2);
    ctx.fill();
  },
};

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const VISUALIZERS: Record<VizMode, VizDef> = {
  bars,
  oscilloscope,
  radialSpectrum,
  particleField,
  tunnel,
  terrain,
};

export const VIZ_MODES: VizMode[] = [
  "bars",
  "oscilloscope",
  "radialSpectrum",
  "particleField",
  "tunnel",
  "terrain",
];

/** Palette constants, exported for the host to paint matching backgrounds. */
export const VIZ_PALETTE = { background: BG, primary: CYAN, accent: RED } as const;
