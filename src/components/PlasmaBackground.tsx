"use client";

/*
 * Plasma background — the exact bAIyo / tereliye dashboard shader.
 * Domain-warped fbm flow in deep-navy → violet → cyan, moving continuously on
 * its own (time-driven, no pointer input). Dependency-free WebGL, rendered to a
 * downscaled buffer and CSS-stretched (the field is soft, so it stays crisp).
 * Static single frame for reduced-motion.
 */

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBase;   // deep background
uniform vec3 uMid;    // main plasma body
uniform vec3 uAccent; // bright veins

float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 6; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv; p.x *= uRes.x / uRes.y; p *= 2.4;
  float t = uTime * 0.05;

  // domain warp — two layers of fbm feeding the next, for fluid plasma flow
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 1.1), fbm(p + 3.5 * q + vec2(8.3, 2.8) - t * 0.9));
  float f = fbm(p + 3.5 * r);

  vec3 col = uBase;
  col = mix(col, uMid, clamp(f * 1.15, 0.0, 1.0));
  col = mix(col, uAccent, clamp(pow(max(r.x, 0.0), 1.5) * 1.2 * (0.35 + 0.65 * uv.x), 0.0, 1.0));
  col += uAccent * 0.10 * pow(clamp(f, 0.0, 1.0), 3.0);
  col *= 1.0 - 0.34 * length(uv - vec2(0.5)); // soft vignette
  col *= 0.62;                                // keep it dark — content sits on it

  gl_FragColor = vec4(col, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// Quiet refined-engineer palettes — low chroma, same accent family across pages.
export const PLASMA_THEMES = {
  azure: { base: "#0a0b0d", mid: "#0f2a32", accent: "#1a5c58" },
  teal: { base: "#0a0b0d", mid: "#0d2e2a", accent: "#1f6b62" },
  indigo: { base: "#0a0b0d", mid: "#12182a", accent: "#2a4a58" },
  rose: { base: "#0a0b0d", mid: "#161820", accent: "#2a4540" },
  ember: { base: "#0a0b0d", mid: "#1a1814", accent: "#3a5048" },
} as const;

export type PlasmaTheme = keyof typeof PLASMA_THEMES;

export function PlasmaBackground({
  theme = "azure",
  className = "",
}: {
  theme?: PlasmaTheme;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pal = PLASMA_THEMES[theme];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.6; // render at 60% then CSS-stretch — plasma is soft, looks identical
    let raf = 0;
    let ro: ResizeObserver | null = null;
    const start = performance.now();

    // Full GL setup, re-runnable so a lost context can be rebuilt on restore.
    const init = () => {
      const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
      if (!gl) return;

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "uRes");
      const uTime = gl.getUniformLocation(prog, "uTime");
      gl.uniform3f(gl.getUniformLocation(prog, "uBase"), ...hexToRgb(pal.base));
      gl.uniform3f(gl.getUniformLocation(prog, "uMid"), ...hexToRgb(pal.mid));
      gl.uniform3f(gl.getUniformLocation(prog, "uAccent"), ...hexToRgb(pal.accent));

      const resize = () => {
        const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE));
        const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w; canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
        gl.uniform2f(uRes, w, h);
      };
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
      resize();

      const frame = (now: number) => {
        if (gl.isContextLost()) return;
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(frame);
      };
      if (reduce) { gl.uniform1f(uTime, 8.0); gl.drawArrays(gl.TRIANGLES, 0, 3); }
      else raf = requestAnimationFrame(frame);
    };

    // Resilience: if the GPU drops the context, pause; on restore, rebuild.
    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); ro?.disconnect(); ro = null; };
    const onRestored = () => init();
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);

    init();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      canvas.getContext("webgl")?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [pal.base, pal.mid, pal.accent]);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        className={`fixed inset-0 -z-10 h-full w-full ${className}`}
        style={{ display: "block", background: pal.base }}
      />
      {/* heavy scrim — plasma is atmosphere only, not the visual story */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[var(--background)]/55" />
    </>
  );
}

export default PlasmaBackground;
