"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
//  NEURAL EARTH — interactive point-cloud planet
//  ~25k nodes: green land / blue ocean sampled from a specular
//  earth map, extra nodes packed on coastlines + tectonic rifts
//  (real plate boundaries via spherical Voronoi), molten core
//  showing through. Depth fog hides the back hemisphere.
//  Drag to spin (fling inertia + equatorial bulge), hover magnet,
//  click → shockwave shatter → chalk fly-through story.
// ─────────────────────────────────────────────────────────────

export interface StoryBeat {
  t: string;
  d: string;
}

export type EarthMode = "globe" | "explode" | "story";

interface NeuralEarthProps {
  story: StoryBeat[];
  ctaHref?: string;
  ctaLabel?: string;
  onModeChange?: (mode: EarthMode) => void;
}

/* ---------------- Tunables ---------------- */
const BASE_NODES = 10000; // even base distribution
const EDGE_NODES = 15000; // extra nodes packed on coastlines + rifts
const RADIUS = 62; // globe radius (world units)
const CAM_Z = 150; // smaller = bigger globe
const POINT_SIZE = 2.3; // point width
const MAX_CONN = 12; // surface link distance
const SURF_DEG = 4; // links per surface node
const CORE_MADE = 3; // links sampled per core node
const CORE_REACH = 2.5; // core link distance (× MAX_CONN)
const N_SIGS = 300; // travelling signal pulses
const AUTO_ROT = 0.0016;
const MAG_R = 25; // hover magnet radius
const MAG_F = 18; // hover magnet strength
const SURFACE_FRAC = 0.86; // share of BASE nodes on the outer shell
const CRACK_W = 0.075; // rift half-width (radians)
const RIFT_SINK = 0.9; // how deep the hottest rift nodes sit (× RADIUS)
const COAST_EPS = 0.006; // coastline detection width (uv)
const COAST_PRIORITY = 0.5; // chance a rift point is kept vs coasts
const LON_OFFSET = 0; // rotate rifts in longitude (deg)
const PIXEL_CAP = 1.5; // cap devicePixelRatio for fill-rate
const FOG_NEAR = 158; // depth fade start
const FOG_FAR = 212; // depth fade end (back hemisphere gone)
// Spin physics (free-rotate + equatorial bulge)
const AXIAL_TILT = (23.4 * Math.PI) / 180;
const DRAG_SPIN = 0.004; // spin radians per px of horizontal drag
const DRAG_TILT = 0.004; // view tilt per px of vertical drag
const SPIN_FRICTION = 0.96; // spin inertia decay
const TILT_FRICTION = 0.9; // tilt inertia decay
const BULGE_K = 2.2; // equatorial bulge per unit spin speed
const BULGE_MAX = 0.26; // hard cap on bulge
const POLE_FLAT = 0.6; // pole flattening as fraction of bulge

/* ---------------- Plate centroids (lat, lon) -> Voronoi rifts ---------------- */
const PLATES: [number, number][] = [
  [-5, -150], [45, -95], [-20, -60], [52, 90], [50, 12], [2, 20], [-83, 0],
  [-25, 134], [10, 75], [-15, -85], [8, -95], [15, -73], [25, 45], [15, 132],
];

// Chalk sketch art for the story cards (SVG stroke paths, drawn progressively)
const CART = [
  '<circle class="cstroke" stroke-width="2.5" cx="200" cy="30" r="15"/><path class="cstroke" stroke-width="2" d="M193 24 a4 4 0 0 0 6 5 M204 34 a3 3 0 0 0 4 3"/><path class="cstroke" stroke-width="2.5" d="M10 96 H224"/><path class="cstroke" stroke-width="3" d="M14 96 q14 -13 28 0 t28 0 t28 0 t28 0 t28 0 t28 0"/><path class="cstroke" stroke-width="2.5" d="M14 110 q14 -11 28 0 t28 0 t28 0 t28 0 t28 0 t28 0"/><path class="cstroke" stroke-width="3" d="M116 94 V50"/><path class="cstroke" stroke-width="3" d="M105 64 L116 48 L127 64"/><path class="cstroke" stroke-width="2" d="M40 86 h12 M40 78 h12 M40 70 h12"/>',
  '<path class="cstroke" stroke-width="2.5" d="M70 12 h46 v22 h-46 z"/><path class="cstroke" stroke-width="1.6" d="M77 20 h32 M77 27 h22"/><path class="cstroke" stroke-width="2.5" d="M60 36 h66"/><path class="cstroke" stroke-width="3" d="M50 40 H136 L124 80 H62 Z"/><path class="cstroke" stroke-width="2" d="M66 52 h7 M78 52 h7 M90 52 h7 M102 52 h7 M114 52 h7 M70 62 h7 M82 62 h7 M94 62 h7 M106 62 h7"/><path class="cstroke" stroke-width="2.5" d="M76 72 h36"/><path class="cstroke" stroke-width="2.5" d="M146 58 H172"/><path class="cstroke" stroke-width="2.5" d="M164 51 L176 58 L164 65"/><path class="cstroke" stroke-width="2.5" d="M182 46 h42 v28 h-42 z"/><path class="cstroke" stroke-width="1.5" d="M182 55 h42 M182 64 h42 M192 46 v28 M202 46 v28 M212 46 v28"/>',
  '<path class="cstroke" stroke-width="3" d="M18 22 h44 a8 8 0 0 1 8 8 v84 a8 8 0 0 1 -8 8 h-44 a8 8 0 0 1 -8 -8 v-84 a8 8 0 0 1 8 -8 z"/><path class="cstroke" stroke-width="2" d="M26 44 h8 M42 44 h8 M26 58 h8 M42 58 h8 M26 72 h8 M42 72 h8"/><circle class="cstroke" stroke-width="2.5" cx="40" cy="102" r="5"/><path class="cstroke" stroke-width="4" d="M92 60 h22 M92 76 h22"/><path class="cstroke" stroke-width="3" d="M140 42 h54 v54 h-54 z"/><path class="cstroke" stroke-width="2" d="M152 42 v-9 M170 42 v-9 M188 42 v-9 M152 96 v9 M170 96 v9 M188 96 v9 M140 56 h-9 M140 74 h-9 M140 90 h-9 M194 56 h9 M194 74 h9 M194 90 h9"/><circle class="cstroke" stroke-width="2" cx="156" cy="62" r="3"/><circle class="cstroke" stroke-width="2" cx="180" cy="58" r="3"/><circle class="cstroke" stroke-width="2" cx="168" cy="82" r="3"/><path class="cstroke" stroke-width="1.6" d="M156 62 L180 58 M180 58 L168 82 M168 82 L156 62"/>',
  '<path class="cstroke" stroke-width="2.5" d="M24 120 H212"/><path class="cstroke" stroke-width="2.5" d="M24 120 V22"/><path class="cstroke" stroke-width="3" d="M30 112 C 90 106, 150 100, 206 94"/><path class="cstroke" stroke-width="3" d="M30 112 C 92 104, 150 66, 204 26"/><path class="cstroke" stroke-width="2.5" d="M196 38 L204 24 L212 38"/><path class="cstroke" stroke-width="1.5" d="M206 94 V40 M196 94 V52 M186 92 V64 M176 90 V76"/>',
  '<path class="cstroke" stroke-width="3" d="M114 110 L126 86 L138 110 Z"/><path class="cstroke" stroke-width="3" d="M34 116 L208 66"/><path class="cstroke" stroke-width="3" d="M40 116 h34 v22 h-34 z"/><path class="cstroke" stroke-width="1.8" d="M46 123 h22 M46 131 h22"/><path class="cstroke" stroke-width="2.5" d="M196 58 V90"/><path class="cstroke" stroke-width="2.5" d="M188 78 L196 92 L204 78"/><path class="cstroke" stroke-width="2.5" d="M66 106 V80"/><path class="cstroke" stroke-width="2.5" d="M58 92 L66 78 L74 92"/><path class="cstroke" stroke-width="2" d="M154 44 v10 M149 49 h10"/>',
  '<path class="cstroke" stroke-width="3" d="M64 48 L46 70 L64 92"/><path class="cstroke" stroke-width="3" d="M92 48 L110 70 L92 92"/><path class="cstroke" stroke-width="2.5" d="M44 98 L114 42"/><path class="cstroke" stroke-width="2.5" d="M126 70 H154"/><path class="cstroke" stroke-width="2.5" d="M146 63 L158 70 L146 77"/><path class="cstroke" stroke-width="2.5" d="M168 42 h46 a8 8 0 0 1 8 8 v26 a8 8 0 0 1 -8 8 h-28 l-12 13 v-13 h-6 a8 8 0 0 1 -8 -8 v-26 a8 8 0 0 1 8 -8 z"/><path class="cstroke" stroke-width="2" d="M178 58 h30 M178 68 h22"/>',
  '<circle class="cstroke" stroke-width="2" cx="78" cy="34" r="4"/><circle class="cstroke" stroke-width="2" cx="118" cy="24" r="4"/><circle class="cstroke" stroke-width="2" cx="158" cy="34" r="4"/><path class="cstroke" stroke-width="1.6" d="M78 34 L118 24 L158 34 M118 24 V52"/><path class="cstroke" stroke-width="1.6" d="M118 52 L116 74"/><path class="cstroke" stroke-width="3" d="M40 84 C 72 75, 102 75, 116 83 C 130 75, 160 75, 192 84 L192 118 C 160 109, 130 109, 116 117 C 102 109, 72 109, 40 118 Z"/><path class="cstroke" stroke-width="2" d="M116 83 V117"/><path class="cstroke" stroke-width="1.5" d="M52 94 h44 M52 102 h38 M136 94 h44 M136 102 h38"/>',
  '<path class="cstroke" stroke-width="3" d="M10 100 h62 v32 h-62 z"/><path class="cstroke" stroke-width="1.8" d="M16 108 h50 M16 117 h50 M16 126 h50"/><path class="cstroke" stroke-width="3" d="M158 82 h62 v50 h-62 z"/><path class="cstroke" stroke-width="1.8" d="M164 90 h50 M164 99 h50 M164 108 h50"/><path class="cstroke" stroke-width="2.5" d="M78 100 Q118 56 158 82"/><circle class="cstroke" stroke-width="2.5" cx="118" cy="62" r="6"/><path class="cstroke" stroke-width="2.5" d="M118 68 V84 M118 73 l-9 6 M118 73 l9 6 M118 84 l-8 10 M118 84 l8 10"/><path class="cstroke" stroke-width="2.5" d="M208 82 V60 M208 60 h15 v10 h-15"/>',
];

const CSS = `
#cstory{position:fixed;inset:0;z-index:20;opacity:0;pointer-events:none;transition:opacity .6s ease;background:radial-gradient(130% 120% at 50% 38%,#0e1418 0%,#0a0b0d 58%,#070809 100%);perspective:900px;perspective-origin:50% 50%;}
#cstory.on{opacity:1;pointer-events:auto;}
#cworld{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}
.ccard{position:absolute;left:50%;top:50%;width:470px;transform-style:preserve-3d;text-align:center;transition:opacity .5s ease;}
.cbeam{position:absolute;left:50%;top:50%;height:2px;border-radius:2px;transform-origin:0 50%;background:#3dd6c6;box-shadow:0 0 8px rgba(61,214,198,.45);transition:opacity .5s ease;}
.cdia{display:block;margin:0 auto 6px;width:330px;filter:drop-shadow(0 0 4px rgba(61,214,198,.35)) drop-shadow(0 0 12px rgba(61,214,198,.2));}
.cstroke{fill:none;stroke:#c8f5ef;stroke-linecap:round;stroke-linejoin:round;}
.ccopy{transition:opacity .4s ease;}
.chead{font-family:var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:600;font-size:36px;line-height:1.15;letter-spacing:-0.02em;color:#e8eaed;text-shadow:none;}
.cbody{margin-top:10px;font-family:var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#9aa0a6;}
.ccta{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:10px 18px;border-radius:999px;background:#3dd6c6;color:#0a0b0d;font-family:var(--font-geist-sans),-apple-system,sans-serif;font-weight:600;font-size:13.5px;text-decoration:none;box-shadow:0 4px 20px rgba(61,214,198,.25);pointer-events:none;}
@keyframes cdraw{to{stroke-dashoffset:0;}}
@keyframes cwipe{from{clip-path:inset(0 100% 0 0);}to{clip-path:inset(0 0 0 0);}}
@keyframes crise{from{opacity:.9;transform:translate(0,0) scale(1);}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.4);}}
`;

export function NeuralEarth({
  story,
  ctaHref = "/projects",
  ctaLabel = "See my work →",
  onModeChange,
}: NeuralEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onModeChangeRef = useRef(onModeChange);
  onModeChangeRef.current = onModeChange;

  useEffect(() => {
    const maybeContainer = containerRef.current;
    if (!maybeContainer) return;
    const container: HTMLDivElement = maybeContainer;

    // Match the r128-era look (no color management pipeline)
    THREE.ColorManagement.enabled = false;

    /* -------- disposables / cleanup registry -------- */
    let disposed = false;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement,
      ev: string,
      fn: EventListenerOrEventListenerObject,
      opts?: AddEventListenerOptions
    ) => {
      target.addEventListener(ev, fn, opts);
      cleanups.push(() => target.removeEventListener(ev, fn, opts));
    };

    /* ---------------- Voronoi rift metric ---------------- */
    const seedX: number[] = [], seedY: number[] = [], seedZ: number[] = [];
    PLATES.forEach(([lat, lon]) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + LON_OFFSET) * Math.PI) / 180;
      seedX.push(Math.sin(phi) * Math.cos(theta));
      seedY.push(Math.sin(phi) * Math.sin(theta));
      seedZ.push(Math.cos(phi));
    });
    function riftMetric(dx: number, dy: number, dz: number) {
      let a1 = 9, a2 = 9;
      for (let k = 0; k < seedX.length; k++) {
        let dot = dx * seedX[k] + dy * seedY[k] + dz * seedZ[k];
        if (dot > 1) dot = 1; else if (dot < -1) dot = -1;
        const ang = Math.acos(dot);
        if (ang < a1) { a2 = a1; a1 = ang; } else if (ang < a2) { a2 = ang; }
      }
      return a2 - a1;
    }

    /* ---------------- Colours ---------------- */
    // Refined teal land / muted ocean — matches site accent #3dd6c6
    const C_LAND = new THREE.Color(0.24, 0.84, 0.78);
    const C_OCEAN = new THREE.Color(0.12, 0.28, 0.42);
    function coreColor(nR: number) {
      if (nR < 0.25) return new THREE.Color(0.85, 0.85, 0.57);
      if (nR < 0.5) return new THREE.Color(0.9, 0.48, 0.0);
      if (nR < 0.7) return new THREE.Color(0.72, 0.13, 0.035);
      return new THREE.Color(0.27, 0.045, 0.018);
    }
    function magmaColor(t: number) {
      if (t < 0.5) { const k = t / 0.5; return new THREE.Color(1.0, 0.95 - 0.43 * k, 0.5 - 0.45 * k); }
      const k = (t - 0.5) / 0.5;
      return new THREE.Color(1.0 - 0.28 * k, 0.52 - 0.4 * k, 0.05);
    }

    /* ---------------- Scene / renderer ---------------- */
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0b0d, FOG_NEAR, FOG_FAR);
    let W = window.innerWidth, H = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.z = CAM_Z;

    // Fit the globe to any aspect ratio: back the camera off until the sphere
    // (plus breathing room) fits the narrower axis; shift the depth fog with it.
    function fitCamera() {
      const aspect = W / H;
      camera.aspect = aspect;
      const vFov = (55 * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const minHalf = Math.min(vFov, hFov) / 2;
      const dist = Math.max(CAM_Z, (RADIUS * 1.28) / Math.tan(minHalf));
      camera.position.z = dist;
      camera.updateProjectionMatrix();
      (scene.fog as THREE.Fog).near = dist + (FOG_NEAR - CAM_Z);
      (scene.fog as THREE.Fog).far = dist + (FOG_FAR - CAM_Z);
    }
    fitCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_CAP));
    renderer.setClearColor(0x0a0b0d, 0);

    const canvas = renderer.domElement;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);
    cleanups.push(() => { canvas.remove(); renderer.dispose(); });

    const makeGlowTexture = (r: number, g: number, b: number, sz = 32) => {
      const c = document.createElement("canvas");
      c.width = c.height = sz;
      const ctx = c.getContext("2d")!;
      const h = sz / 2;
      const gr = ctx.createRadialGradient(h, h, 0, h, h, h);
      gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
      gr.addColorStop(0.18, `rgba(${r},${g},${b},0.7)`);
      gr.addColorStop(0.5, `rgba(${r},${g},${b},0.1)`);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, sz, sz);
      return new THREE.CanvasTexture(c);
    };

    // Rig holds the fixed tilted axis; earthGrp spins about its pole and bulges via scale.
    const rigGroup = new THREE.Group();
    rigGroup.rotation.x = -Math.PI / 2; // bring geographic pole (geometry +Z) to vertical
    rigGroup.rotation.z = AXIAL_TILT;
    scene.add(rigGroup);
    const earthGrp = new THREE.Group();
    rigGroup.add(earthGrp);

    /* ---------------- Earth map (local texture) ---------------- */
    const img = new Image();
    img.src = "/textures/earth_specular_2048.jpg";
    img.onload = () => {
      if (disposed) return;
      const ic = document.createElement("canvas");
      ic.width = img.width; ic.height = img.height;
      const ictx = ic.getContext("2d", { willReadFrequently: true })!;
      ictx.drawImage(img, 0, 0);
      const idata = ictx.getImageData(0, 0, img.width, img.height).data;
      const isLand = (u: number, v: number) => {
        const x = Math.max(0, Math.min(img.width - 1, Math.floor(u * img.width)));
        const y = Math.max(0, Math.min(img.height - 1, Math.floor(v * img.height)));
        return idata[(y * img.width + x) * 4] <= 100;
      };
      build(isLand);
    };
    img.onerror = () => { if (!disposed) build(null); };

    function build(isLand: ((u: number, v: number) => boolean) | null) {
      const nodeVecs: THREE.Vector3[] = [], currVecs: THREE.Vector3[] = [], nodeDepths: number[] = [];
      const dxs: number[] = [], dys: number[] = [], dzs: number[] = [], colsD: number[] = [];

      function dirToUV(dx: number, dy: number, dz: number): [number, number] {
        const v = Math.acos(Math.max(-1, Math.min(1, dz))) / Math.PI;
        let az = Math.atan2(dy, dx); if (az < 0) az += 2 * Math.PI;
        const u = (az / (2 * Math.PI) + 0.5) % 1.0;
        return [u, v];
      }
      function isCoast(dx: number, dy: number, dz: number) {
        if (!isLand) return false;
        const uv = dirToUV(dx, dy, dz), u = uv[0], v = uv[1], here = isLand(u, v);
        return (
          isLand((u + COAST_EPS) % 1, v) !== here ||
          isLand((u + 1 - COAST_EPS) % 1, v) !== here ||
          isLand(u, Math.min(1, v + COAST_EPS)) !== here ||
          isLand(u, Math.max(0, v - COAST_EPS)) !== here
        );
      }
      function placeNode(dx: number, dy: number, dz: number, surface: boolean) {
        let r: number, col: THREE.Color;
        if (surface) {
          r = RADIUS * (0.85 + 0.15 * Math.random());
          const m = riftMetric(dx, dy, dz);
          if (m < CRACK_W) {
            const t = m / CRACK_W;
            col = magmaColor(t);
            r = RADIUS * (RIFT_SINK + (1 - RIFT_SINK) * t);
          } else if (isLand) {
            const uv = dirToUV(dx, dy, dz);
            col = isLand(uv[0], uv[1]) ? C_LAND : C_OCEAN;
          } else col = C_OCEAN;
        } else {
          r = RADIUS * Math.cbrt(Math.random() * 0.614);
          col = coreColor(r / RADIUS);
        }
        dxs.push(dx); dys.push(dy); dzs.push(dz);
        nodeVecs.push(new THREE.Vector3(dx * r, dy * r, dz * r));
        currVecs.push(new THREE.Vector3(dx * r, dy * r, dz * r));
        nodeDepths.push(r / RADIUS);
        colsD.push(col.r, col.g, col.b);
      }

      // Phase 1 — even base distribution (Fibonacci-ish spiral)
      for (let i = 0; i < BASE_NODES; i++) {
        const phi = Math.acos(-1 + (2 * i) / BASE_NODES);
        const theta = Math.sqrt(BASE_NODES * Math.PI) * phi;
        placeNode(
          Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi),
          Math.random() < SURFACE_FRAC
        );
      }
      // Phase 2 — pack extra nodes onto coastlines + rifts
      let added = 0, att = 0;
      const maxAtt = EDGE_NODES * 60;
      while (added < EDGE_NODES && att < maxAtt) {
        att++;
        const z = Math.random() * 2 - 1, ang = Math.random() * 2 * Math.PI, s = Math.sqrt(1 - z * z);
        const dx = s * Math.cos(ang), dy = s * Math.sin(ang), dz = z;
        if (isCoast(dx, dy, dz)) { placeNode(dx, dy, dz, true); added++; }
        else if (riftMetric(dx, dy, dz) < CRACK_W && Math.random() < COAST_PRIORITY) { placeNode(dx, dy, dz, true); added++; }
      }

      const N = nodeVecs.length;
      const nodeDirX = new Float32Array(N), nodeDirY = new Float32Array(N), nodeDirZ = new Float32Array(N);
      const ptPos = new Float32Array(N * 3), ptColD = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        nodeDirX[i] = dxs[i]; nodeDirY[i] = dys[i]; nodeDirZ[i] = dzs[i];
        ptPos[i * 3] = nodeVecs[i].x; ptPos[i * 3 + 1] = nodeVecs[i].y; ptPos[i * 3 + 2] = nodeVecs[i].z;
        ptColD[i * 3] = colsD[i * 3]; ptColD[i * 3 + 1] = colsD[i * 3 + 1]; ptColD[i * 3 + 2] = colsD[i * 3 + 2];
      }

      const ptGeom = new THREE.BufferGeometry();
      ptGeom.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));
      ptGeom.setAttribute("color", new THREE.BufferAttribute(ptColD, 3));
      const ptMat = new THREE.PointsMaterial({
        size: POINT_SIZE, vertexColors: true, map: makeGlowTexture(255, 255, 255),
        blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
      });
      const earthPointsMesh = new THREE.Points(ptGeom, ptMat);
      earthGrp.add(earthPointsMesh);

      /* ---------------- Connections (spatial grid) ---------------- */
      const lPos: number[] = [], lCol: number[] = [], conns: number[] = [];
      const nodeConns: number[][] = Array.from({ length: N }, () => []);
      const degree = new Int32Array(N);
      const linkSet = new Set<number>();
      function addLink(i: number, j: number, d: number, maxRef: number) {
        const key = i < j ? i * N + j : j * N + i;
        if (linkSet.has(key)) return false;
        linkSet.add(key);
        lPos.push(nodeVecs[i].x, nodeVecs[i].y, nodeVecs[i].z, nodeVecs[j].x, nodeVecs[j].y, nodeVecs[j].z);
        const a = Math.max(0.05, 1 - d / maxRef) * 0.45 * (maxRef === MAX_CONN ? 1 : 0.45);
        lCol.push(
          ptColD[i * 3] * a, ptColD[i * 3 + 1] * a, ptColD[i * 3 + 2] * a,
          ptColD[j * 3] * a, ptColD[j * 3 + 1] * a, ptColD[j * 3 + 2] * a
        );
        const idx = conns.length / 2;
        conns.push(i, j);
        nodeConns[i].push(idx); nodeConns[j].push(idx);
        degree[i]++; degree[j]++;
        return true;
      }

      const surfaceIdx: number[] = [], coreIdx: number[] = [];
      for (let i = 0; i < N; i++) (nodeDepths[i] > 0.85 ? surfaceIdx : coreIdx).push(i);

      const cellOf = (x: number) => Math.floor(x / MAX_CONN);
      const gk = (a: number, b: number, c: number) => a + "_" + b + "_" + c;
      const grid = new Map<string, number[]>();
      for (const i of surfaceIdx) {
        const k = gk(cellOf(nodeVecs[i].x), cellOf(nodeVecs[i].y), cellOf(nodeVecs[i].z));
        let arr = grid.get(k);
        if (!arr) { arr = []; grid.set(k, arr); }
        arr.push(i);
      }
      for (const i of surfaceIdx) {
        if (degree[i] >= SURF_DEG) continue;
        const cx = cellOf(nodeVecs[i].x), cy = cellOf(nodeVecs[i].y), cz = cellOf(nodeVecs[i].z);
        for (let ax = -1; ax <= 1 && degree[i] < SURF_DEG; ax++)
          for (let ay = -1; ay <= 1 && degree[i] < SURF_DEG; ay++)
            for (let az = -1; az <= 1 && degree[i] < SURF_DEG; az++) {
              const arr = grid.get(gk(cx + ax, cy + ay, cz + az));
              if (!arr) continue;
              for (const j of arr) {
                if (j <= i || degree[j] >= SURF_DEG) continue;
                const d = nodeVecs[i].distanceTo(nodeVecs[j]);
                if (d < MAX_CONN) { addLink(i, j, d, MAX_CONN); if (degree[i] >= SURF_DEG) break; }
              }
            }
      }
      const CORE_DIST = MAX_CONN * CORE_REACH;
      for (const i of coreIdx) {
        let made = 0, tries = 0;
        while (made < CORE_MADE && tries < 24) {
          tries++;
          const j = (Math.random() * N) | 0;
          if (j === i) continue;
          const d = nodeVecs[i].distanceTo(nodeVecs[j]);
          if (d < CORE_DIST && addLink(i, j, d, CORE_DIST)) made++;
        }
      }

      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute("position", new THREE.Float32BufferAttribute(lPos, 3));
      lineGeom.setAttribute("color", new THREE.Float32BufferAttribute(lCol, 3));
      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
      });
      const lineMesh = new THREE.LineSegments(lineGeom, lineMat);
      earthGrp.add(lineMesh);
      const lineArr = lineGeom.attributes.position.array as Float32Array;

      /* ---------------- Signals ---------------- */
      const sigPos = new Float32Array(N_SIGS * 3);
      const sigGeom = new THREE.BufferGeometry();
      sigGeom.setAttribute("position", new THREE.BufferAttribute(sigPos, 3));
      const sigMat = new THREE.PointsMaterial({
        size: 2, color: 0xff6600, map: makeGlowTexture(255, 255, 255, 16),
        blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8,
      });
      const sigMesh = new THREE.Points(sigGeom, sigMat);
      earthGrp.add(sigMesh);

      const nConns = conns.length / 2;
      const coreConns: number[] = [];
      for (let i = 0; i < nConns; i++) {
        if (nodeDepths[conns[i * 2]] < 0.6 || nodeDepths[conns[i * 2 + 1]] < 0.6) coreConns.push(i);
      }
      if (coreConns.length === 0) for (let i = 0; i < nConns; i++) coreConns.push(i);

      const sigs = Array.from({ length: N_SIGS }, () => ({
        c: coreConns[(Math.random() * coreConns.length) | 0],
        t: Math.random(),
        s: 0.006 + Math.random() * 0.016,
        d: Math.random() > 0.5 ? 1 : -1,
      }));

      /* ---------------- Interaction (hover magnet + drag spin) ---------------- */
      const raycaster = new THREE.Raycaster();
      raycaster.params.Points.threshold = 5.0;
      const mouseVec = new THREE.Vector2(-1000, -1000);
      let hoveredNode: number | null = null, hasMagnet = false;
      const magLocal = new THREE.Vector3();
      let spinAngle = 0, spinVel = AUTO_ROT, curBulge = 0;
      let userTilt = 0, tiltVel = 0;
      let dragging = false, lastX = 0, lastY = 0;

      let mode: EarthMode = "globe";
      const setMode = (m: EarthMode) => { mode = m; onModeChangeRef.current?.(m); };

      on(window, "mousemove", ((e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }) as EventListener);

      const isInteractive = (t: EventTarget | null) =>
        t instanceof Element && !!t.closest("a, button, input, select, textarea, nav, header");

      let dragMoved = false;
      on(window, "pointerdown", ((e: PointerEvent) => {
        if (mode !== "globe") return;
        if (isInteractive(e.target)) return;
        dragging = true; dragMoved = false; lastX = e.clientX; lastY = e.clientY;
        document.body.classList.add("grabbing");
      }) as EventListener);
      on(window, "pointerup", () => { dragging = false; document.body.classList.remove("grabbing"); });
      on(window, "pointermove", ((e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
        spinAngle += dx * DRAG_SPIN; // 1:1 control while dragging
        spinVel = dx * DRAG_SPIN; // last delta becomes the fling inertia
        tiltVel += -dy * DRAG_TILT;
        lastX = e.clientX; lastY = e.clientY;
      }) as EventListener);
      on(window, "click", ((e: MouseEvent) => {
        if (mode === "story") { if (!isInteractive(e.target)) cgo(1); return; }
        if (mode !== "globe" || dragMoved) return;
        if (isInteractive(e.target)) return;
        // only shatter when the click actually lands on the planet
        const rect = canvas.getBoundingClientRect();
        mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);
        if (raycaster.intersectObject(earthPointsMesh).length) explode();
      }) as EventListener);

      /* ===================== STORY / EXPLODE SEQUENCE ===================== */
      const EXPLODE_DUR = 2.0; // seconds of dust flight + fade
      const SC = Math.min(story.length, CART.length);
      const CD = 225;

      // Chalk fly-through: neon sketches on a dark slate; the camera rides
      // above/behind the chalk as it paints each segment, then settles.
      const cfont = document.createElement("link");
      cfont.rel = "stylesheet";
      cfont.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap";
      document.head.appendChild(cfont);
      cleanups.push(() => cfont.remove());
      const cstyle = document.createElement("style");
      cstyle.textContent = CSS;
      document.head.appendChild(cstyle);
      cleanups.push(() => cstyle.remove());

      const SEG = 740, P_READ = 4, P_FLY = 18, A_READ = 34, A_FLY = 150;
      const cnx = (i: number) => (i % 2 ? 96 : -96), cnz = (i: number) => -i * SEG;
      const cstory = document.createElement("div");
      cstory.id = "cstory";
      cstory.innerHTML =
        '<div id="cworld"></div><div id="cdust" style="position:absolute;inset:0;pointer-events:none;"></div>' +
        '<div id="ccount" style="position:absolute;left:18px;bottom:16px;font-size:11px;letter-spacing:.06em;color:rgba(233,238,233,.45);font-family:-apple-system,BlinkMacSystemFont,sans-serif;"></div>' +
        '<div id="cnavhint" style="position:absolute;right:18px;bottom:16px;font-size:11px;letter-spacing:.06em;color:rgba(233,238,233,.45);font-family:-apple-system,BlinkMacSystemFont,sans-serif;">scroll / click / → to continue · esc to return</div>';
      container.appendChild(cstory);
      cleanups.push(() => cstory.remove());
      const cworld = cstory.querySelector("#cworld") as HTMLElement;
      const cdust = cstory.querySelector("#cdust") as HTMLElement;
      const ccount = cstory.querySelector("#ccount") as HTMLElement;
      const ccards: HTMLElement[] = [], cbeams: HTMLElement[] = [];
      const cdrawn: Record<number, boolean> = {}, cconn: Record<number, boolean> = {};
      let cidx = 0, craf = 0;
      const ctos: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i < SC; i++) {
        const c = document.createElement("div");
        c.className = "ccard"; c.id = "ccard" + i;
        c.style.transform =
          "translate(-50%,-50%) translate3d(" + cnx(i) + "px,0," + cnz(i) + "px) rotateX(" + -P_READ + "deg)";
        c.style.opacity = "0";
        const cta = i === SC - 1
          ? '<a href="' + ctaHref + '" id="cstory-cta" class="ccta">' + ctaLabel + "</a>"
          : "";
        c.innerHTML =
          '<svg class="cdia" viewBox="0 0 230 150" id="cdia' + i + '"></svg>' +
          '<div class="ccopy" id="ccopy' + i + '" style="opacity:0"><div class="chead">' + story[i].t +
          '</div><div class="cbody">' + story[i].d + "</div>" + cta + "</div>";
        cworld.appendChild(c); ccards.push(c);
        if (i < SC - 1) {
          const dx = cnx(i + 1) - cnx(i), L = Math.hypot(dx, SEG), th = Math.atan2(SEG, dx);
          const bm = document.createElement("div");
          bm.className = "cbeam"; bm.style.width = L + "px";
          bm.dataset.base = "translate3d(" + cnx(i) + "px,0," + cnz(i) + "px) rotateY(" + th + "rad) rotateX(90deg)";
          bm.style.transform = bm.dataset.base + " scaleX(0)"; bm.style.opacity = "0";
          cworld.appendChild(bm); cbeams.push(bm);
        }
      }
      const ctaEl = cstory.querySelector("#cstory-cta") as HTMLElement | null;

      let expTime = 0, vel: Float32Array | null = null, delay: Float32Array | null = null;
      const easeIO = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

      function explode() {
        if (mode !== "globe") return;
        setMode("explode"); expTime = 0;
        earthPointsMesh.frustumCulled = false;
        lineMesh.visible = false; sigMesh.visible = false;

        // blast origin = where the user clicked on the globe (local space)
        const blast = new THREE.Vector3();
        raycaster.setFromCamera(mouseVec, camera);
        const hit = raycaster.intersectObject(earthPointsMesh);
        if (hit.length) earthPointsMesh.worldToLocal(blast.copy(hit[0].point));
        else blast.copy(nodeVecs[(Math.random() * N) | 0]);

        vel = new Float32Array(N * 3);
        delay = new Float32Array(N);
        const d = new THREE.Vector3();
        for (let i = 0; i < N; i++) {
          d.set(nodeVecs[i].x - blast.x, nodeVecs[i].y - blast.y, nodeVecs[i].z - blast.z);
          const dist = d.length() || 1;
          d.multiplyScalar(1 / dist);
          const cx = nodeVecs[i].x, cy = nodeVecs[i].y, cz = nodeVecs[i].z, cl = Math.hypot(cx, cy, cz) || 1;
          const dirx = d.x * 0.7 + (cx / cl) * 0.3, diry = d.y * 0.7 + (cy / cl) * 0.3, dirz = d.z * 0.7 + (cz / cl) * 0.3;
          const sp = 60 + Math.random() * 70 + 1500 / (dist + 16); // nearer the blast = faster
          vel[i * 3] = dirx * sp + (Math.random() - 0.5) * 24;
          vel[i * 3 + 1] = diry * sp + (Math.random() - 0.5) * 24;
          vel[i * 3 + 2] = dirz * sp + (Math.random() - 0.5) * 24;
          delay[i] = dist * 0.004 + Math.random() * 0.025; // shockwave ripples outward
        }
      }

      /* ---- chalk camera (CSS-3D) + progressive draw ---- */
      function csetCam(fx: number, fy: number, fz: number, pitch: number, above: number) {
        cworld.style.transform =
          "rotateX(" + pitch + "deg) translate3d(" + -fx + "px," + -(fy - above) + "px," + -(fz + CD) + "px)";
      }
      function cpose(i: number) { csetCam(cnx(i), 0, cnz(i), P_READ, A_READ); }
      function cdepth(dd: number) { return dd < 0 ? 0 : dd === 0 ? 1 : dd === 1 ? 0.55 : dd === 2 ? 0.2 : 0.07; }
      function csetDepth() {
        for (let k = 0; k < SC; k++) {
          ccards[k].style.opacity = String(cdepth(k - cidx));
          const cp = document.getElementById("ccopy" + k);
          if (cp) cp.style.opacity = k === cidx ? "1" : "0";
        }
        for (let b = 0; b < cbeams.length; b++) cbeams[b].style.opacity = cconn[b] ? String(cdepth(b - cidx)) : "0";
        if (ctaEl) ctaEl.style.pointerEvents = cidx === SC - 1 ? "auto" : "none";
      }
      const cEase = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
      function cpuff() {
        const cx = window.innerWidth / 2, cy = window.innerHeight * 0.45;
        for (let i = 0; i < 12; i++) {
          const pt = document.createElement("span");
          const dx = (Math.random() - 0.5) * 130, dy = -30 - Math.random() * 80;
          pt.style.cssText =
            "position:absolute;left:" + cx + "px;top:" + cy + "px;width:" + (3 + Math.random() * 4) +
            "px;height:" + (3 + Math.random() * 4) + "px;border-radius:50%;background:#3dd6c6;opacity:0;--dx:" +
            dx + "px;--dy:" + dy + "px;animation:crise " + (0.8 + Math.random() * 0.7) +
            "s ease-out forwards;animation-delay:" + Math.random() * 0.2 + "s;";
          cdust.appendChild(pt);
        }
        ctos.push(setTimeout(() => { cdust.innerHTML = ""; }, 1800));
      }
      function cwrite(i: number) {
        const dia = document.getElementById("cdia" + i)!;
        if (!cdrawn[i]) {
          cdrawn[i] = true;
          dia.innerHTML = CART[i];
          const st = dia.querySelectorAll(".cstroke");
          for (let k = 0; k < st.length; k++) {
            const s = st[k] as SVGPathElement;
            s.setAttribute("pathLength", "1");
            s.style.strokeDasharray = "1"; s.style.strokeDashoffset = "1";
            s.style.animation = "cdraw 0.5s ease forwards";
            s.style.animationDelay = 0.04 + k * 0.06 + "s";
          }
          cpuff();
        }
        const cp = document.getElementById("ccopy" + i)!;
        const h = cp.querySelector(".chead") as HTMLElement;
        cp.style.opacity = "1";
        h.style.clipPath = "inset(0 100% 0 0)";
        void h.offsetWidth;
        h.style.animation = "cwipe 0.9s ease 0.1s forwards";
        ccount.textContent = "beat " + (i + 1) + " / " + SC;
      }
      function cfly(from: number, to: number, forward: boolean) {
        cancelAnimationFrame(craf);
        ctos.forEach(clearTimeout); ctos.length = 0;
        const fcp = document.getElementById("ccopy" + from);
        if (fcp) fcp.style.opacity = "0";
        const seg = Math.min(from, to);
        if (forward) cconn[seg] = true;
        const t0 = performance.now(), dur = 1400;
        function fr(now: number) {
          const p = Math.min(1, (now - t0) / dur), e = cEase(p), bell = Math.sin(Math.PI * e);
          const fx = cnx(from) + (cnx(to) - cnx(from)) * e, fz = cnz(from) + (cnz(to) - cnz(from)) * e;
          csetCam(fx, 0, fz, P_READ + (P_FLY - P_READ) * bell, A_READ + (A_FLY - A_READ) * bell);
          cbeams[seg].style.opacity = String(cdepth(0));
          cbeams[seg].style.transform = cbeams[seg].dataset.base + " scaleX(" + (forward ? e : 1) + ")";
          if (p < 1) { craf = requestAnimationFrame(fr); }
          else {
            cidx = to; csetDepth();
            if (forward) cwrite(to);
            else {
              const tcp = document.getElementById("ccopy" + to);
              if (tcp) tcp.style.opacity = "1";
              ccount.textContent = "beat " + (to + 1) + " / " + SC;
            }
          }
        }
        craf = requestAnimationFrame(fr);
      }
      cleanups.push(() => { cancelAnimationFrame(craf); ctos.forEach(clearTimeout); });
      function cgo(dir: number) {
        const ni = Math.max(0, Math.min(SC - 1, cidx + dir));
        if (ni === cidx) return;
        cfly(cidx, ni, dir > 0);
      }
      function cReveal() { cstory.classList.add("on"); cidx = 0; cpose(0); csetDepth(); cwrite(0); }

      // Discrete navigation: scroll / Enter / arrows advance one beat at a time
      let navCooldown = 0;
      on(window, "wheel", ((e: WheelEvent) => {
        if (mode !== "story") return;
        const now = performance.now();
        if (now < navCooldown) return;
        navCooldown = now + 1250;
        cgo(e.deltaY > 0 ? 1 : -1);
      }) as EventListener, { passive: true });
      on(window, "keydown", ((e: KeyboardEvent) => {
        if (mode !== "story") return;
        if (e.key === "Enter" || e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); cgo(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); cgo(-1); }
        else if (e.key === "Escape") { cstory.classList.remove("on"); setTimeout(() => window.location.reload(), 350); }
      }) as EventListener);

      function stepStory() {
        const dt = 1 / 60;
        if (mode === "explode" && vel && delay) {
          // realistic debris: shockwave ripple, drag, late fade, shrink
          expTime += dt;
          const k = Math.min(1, expTime / EXPLODE_DUR), drag = 0.96;
          for (let i = 0; i < N; i++) {
            if (expTime < delay[i]) continue; // wave hasn't reached this node yet
            ptPos[i * 3] += vel[i * 3] * dt;
            ptPos[i * 3 + 1] += vel[i * 3 + 1] * dt;
            ptPos[i * 3 + 2] += vel[i * 3 + 2] * dt;
            vel[i * 3] *= drag; vel[i * 3 + 1] *= drag; vel[i * 3 + 2] *= drag;
          }
          ptGeom.attributes.position.needsUpdate = true;
          ptMat.opacity = k < 0.4 ? 1 : 1 - easeIO((k - 0.4) / 0.6);
          ptMat.size = POINT_SIZE * (1 - 0.45 * easeIO(k));
          // dust has flown and faded → hand off to the chalk fly-through story
          if (k >= 1) { setMode("story"); earthPointsMesh.visible = false; cReveal(); }
        }
      }

      /* ---------------- Animation loop ---------------- */
      const displaced = new Set<number>();
      const moved: number[] = [];
      const toRemove: number[] = [];
      let frame = 0;
      let raf = 0;

      function animateGlobe(time: number) {
        if (disposed) return;
        raf = requestAnimationFrame(animateGlobe);
        frame++;
        const t = time * 0.001;

        if (mode !== "globe") { stepStory(); renderer.render(scene, camera); return; }

        // spin about the pole with inertia (drag-fling + auto-rotate baseline)
        if (!dragging) {
          spinVel = AUTO_ROT + (spinVel - AUTO_ROT) * SPIN_FRICTION;
          spinAngle += spinVel;
        }
        earthGrp.rotation.z = spinAngle;

        // equatorial bulge proportional to spin speed (oblate spheroid, hard-capped)
        const targetB = Math.min(BULGE_MAX, BULGE_K * Math.abs(spinVel));
        curBulge += (targetB - curBulge) * 0.08;
        earthGrp.scale.set(1 + curBulge, 1 + curBulge, 1 - curBulge * POLE_FLAT);

        // view tilt (drag up/down to see the poles) with inertia
        userTilt += tiltVel; tiltVel *= TILT_FRICTION;
        if (userTilt > 0.9) userTilt = 0.9; else if (userTilt < -0.9) userTilt = -0.9;
        rigGroup.rotation.x = -Math.PI / 2 + userTilt;

        if ((frame & 1) === 0) {
          raycaster.setFromCamera(mouseVec, camera);
          const hit = raycaster.intersectObject(earthPointsMesh);
          if (hit.length) {
            hoveredNode = hit[0].index ?? null;
            earthGrp.worldToLocal(magLocal.copy(hit[0].point));
            hasMagnet = true;
          } else { hoveredNode = null; hasMagnet = false; }
        }

        if (hasMagnet) {
          const mx = magLocal.x, my = magLocal.y, mz = magLocal.z, R2 = MAG_R * MAG_R;
          for (let i = 0; i < N; i++) {
            const dx = nodeVecs[i].x - mx, dy = nodeVecs[i].y - my, dz = nodeVecs[i].z - mz;
            if (dx * dx + dy * dy + dz * dz < R2) displaced.add(i);
          }
        }

        if (displaced.size) {
          moved.length = 0; toRemove.length = 0;
          for (const i of displaced) {
            const home = nodeVecs[i], curr = currVecs[i];
            let tx = home.x, ty = home.y, tz = home.z, inRange = false;
            if (hasMagnet) {
              const dx = home.x - magLocal.x, dy = home.y - magLocal.y, dz = home.z - magLocal.z;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (dist < MAG_R) {
                inRange = true;
                const f = (1 - dist / MAG_R) * MAG_F;
                tx = home.x + nodeDirX[i] * f; ty = home.y + nodeDirY[i] * f; tz = home.z + nodeDirZ[i] * f;
              }
            }
            curr.x += (tx - curr.x) * 0.2; curr.y += (ty - curr.y) * 0.2; curr.z += (tz - curr.z) * 0.2;
            ptPos[i * 3] = curr.x; ptPos[i * 3 + 1] = curr.y; ptPos[i * 3 + 2] = curr.z;
            moved.push(i);
            if (!inRange) {
              const ex = curr.x - home.x, ey = curr.y - home.y, ez = curr.z - home.z;
              if (ex * ex + ey * ey + ez * ez < 0.02) {
                curr.copy(home);
                ptPos[i * 3] = home.x; ptPos[i * 3 + 1] = home.y; ptPos[i * 3 + 2] = home.z;
                toRemove.push(i);
              }
            }
          }
          for (const i of toRemove) displaced.delete(i);
          ptGeom.attributes.position.needsUpdate = true;
          for (const i of moved) {
            const cl = nodeConns[i];
            for (let k = 0; k < cl.length; k++) {
              const ci = cl[k], cA = conns[ci * 2], cB = conns[ci * 2 + 1];
              lineArr[ci * 6] = currVecs[cA].x; lineArr[ci * 6 + 1] = currVecs[cA].y; lineArr[ci * 6 + 2] = currVecs[cA].z;
              lineArr[ci * 6 + 3] = currVecs[cB].x; lineArr[ci * 6 + 4] = currVecs[cB].y; lineArr[ci * 6 + 5] = currVecs[cB].z;
            }
          }
          lineGeom.attributes.position.needsUpdate = true;
        }

        for (let sN = 0; sN < N_SIGS; sN++) {
          const sg = sigs[sN];
          sg.t += sg.s * sg.d;
          if (sg.t > 1 || sg.t < 0) {
            const reached = sg.d > 0 ? conns[sg.c * 2 + 1] : conns[sg.c * 2];
            let next = -1, nextDir = 1;
            if (hoveredNode !== null) {
              let best = Infinity;
              const opts = nodeConns[reached];
              for (let k = 0; k < opts.length; k++) {
                const cIdx = opts[k], nA = conns[cIdx * 2], nB = conns[cIdx * 2 + 1];
                const other = nA === reached ? nB : nA;
                const dd = nodeVecs[other].distanceToSquared(nodeVecs[hoveredNode]);
                if (dd < best) { best = dd; next = cIdx; nextDir = nA === reached ? 1 : -1; }
              }
            }
            if (next === -1) {
              const opts = nodeConns[reached];
              if (opts && opts.length) { next = opts[(Math.random() * opts.length) | 0]; nextDir = conns[next * 2] === reached ? 1 : -1; }
              else { next = coreConns[(Math.random() * coreConns.length) | 0]; nextDir = Math.random() > 0.5 ? 1 : -1; }
            }
            sg.c = next; sg.d = nextDir; sg.t = nextDir > 0 ? 0 : 1;
            sg.s = 0.006 + Math.random() * 0.018;
            if (hoveredNode !== null) sg.s *= 1.5;
          }
          const a = nodeVecs[conns[sg.c * 2]], b = nodeVecs[conns[sg.c * 2 + 1]];
          sigPos[sN * 3] = a.x + (b.x - a.x) * sg.t;
          sigPos[sN * 3 + 1] = a.y + (b.y - a.y) * sg.t;
          sigPos[sN * 3 + 2] = a.z + (b.z - a.z) * sg.t;
        }
        sigGeom.attributes.position.needsUpdate = true;
        sigMat.size = 1.5 + Math.sin(t * 3.0) * 0.5;

        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(animateGlobe);
      cleanups.push(() => cancelAnimationFrame(raf));
      cleanups.push(() => {
        ptGeom.dispose(); lineGeom.dispose(); sigGeom.dispose();
        ptMat.dispose(); lineMat.dispose(); sigMat.dispose();
      });
    }

    on(window, "resize", () => {
      W = window.innerWidth; H = window.innerHeight;
      fitCamera();
      renderer.setSize(W, H);
    });

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      document.body.classList.remove("grabbing");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0" aria-hidden="true" />;
}
