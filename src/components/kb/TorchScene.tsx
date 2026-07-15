"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/* A traced-SVG scene revealed by a cursor torch - the same mechanism as the
   pupsik contact cat (color-traced SVG + a radial "flashlight" mask driven by
   --mx/--my + a parallax layer), generalized so any traced scene can drop into
   a dossier slot. Every scene carries a small cameo of the pupsik cat in a
   corner that meows when clicked. Light: one lazy <img> + one cached cat badge
   + a CSS gradient. No canvas, no per-frame React state. */

type Corner = "br" | "bl" | "tr" | "tl";

const CORNER_POS: Record<Corner, string> = {
  br: "right-3 bottom-3",
  bl: "left-3 bottom-3",
  tr: "right-3 top-3",
  tl: "left-3 top-3",
};

/* ---- the meowing cat cameo (reused across every scene) ---- */
function SceneCat({ corner = "br" }: { corner?: Corner }) {
  const [meow, setMeow] = useState<string | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const ci = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const calls = ["meow", "meow!", "mrrp", "prrr", "pss pss?"];
  const baseShadow = "drop-shadow(0 8px 11px rgba(0,0,0,.6))";

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMeow(calls[ci.current++ % calls.length]);
    const el = catRef.current;
    if (el) {
      el.style.filter = baseShadow + " brightness(1.22)";
      setTimeout(() => { if (el) el.style.filter = baseShadow; }, 200);
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMeow(null), 1100);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Pet the cat"
      className={`absolute ${CORNER_POS[corner]} z-30 cursor-pointer`}
    >
      <div
        ref={catRef}
        className="relative w-[92px] h-[146px] sm:w-[106px] sm:h-[168px] transition-transform hover:scale-[1.06] active:scale-95"
        style={{ filter: baseShadow }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* self-contained sprite: transparent bg, glowing eyes baked in at the right spot */}
        <img
          src="/scenes/cat-sprite.png"
          alt="A small ginger cat"
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
      </div>
      {meow && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap border px-2 py-1 font-mono text-[0.7rem]"
          style={{
            background: "rgba(20,26,18,.92)",
            borderColor: "rgba(200,220,180,.4)",
            color: "#eaf0e2",
          }}
        >
          {meow}
        </span>
      )}
    </button>
  );
}

export function TorchScene({
  src,
  alt = "",
  label,
  ratio = "4 / 3",
  minH = "min-h-[280px]",
  torch = 210,
  parallax = 12,
  dim = 0.82,
  cat = true,
  catCorner = "br",
  className = "",
}: {
  /** traced scene, e.g. "/scenes/charminar.svg" */
  src: string;
  alt?: string;
  /** mono frame caption */
  label?: string;
  ratio?: string;
  minH?: string;
  /** reveal radius in px */
  torch?: number;
  /** parallax travel in px */
  parallax?: number;
  /** outer darkness alpha 0..1 (lower = brighter resting scene) */
  dim?: number;
  cat?: boolean;
  catCorner?: Corner;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      if (darkRef.current) {
        darkRef.current.style.setProperty("--mx", px * 100 + "%");
        darkRef.current.style.setProperty("--my", py * 100 + "%");
      }
      if (layerRef.current) {
        layerRef.current.style.transform = `translate(${(px - 0.5) * -parallax}px, ${
          (py - 0.5) * -parallax
        }px) scale(1.06)`;
      }
    };
    const onLeave = () => {
      if (darkRef.current) {
        darkRef.current.style.setProperty("--mx", "50%");
        darkRef.current.style.setProperty("--my", "44%");
      }
      if (layerRef.current) layerRef.current.style.transform = "translate(0px,0px) scale(1.06)";
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, parallax]);

  return (
    <div
      ref={stageRef}
      className={`relative w-full overflow-hidden border-2 border-[var(--color-ink)] bg-[#0b0e09] cursor-crosshair select-none ${minH} ${className}`}
      style={{ aspectRatio: ratio, boxShadow: "inset 0 0 120px rgba(0,0,0,.55)" }}
    >
      {/* scene layer (parallax) */}
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.06)", transition: "transform .12s ease-out" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || label || ""}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(1.06) contrast(1.05)" }}
          draggable={false}
        />
      </div>

      {/* torch / darkness - a resting pool of light at center, revealing under the cursor */}
      {!reduce && (
        <div
          ref={darkRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle " +
              torch +
              "px at var(--mx,50%) var(--my,44%), rgba(0,0,0,0) 0%, rgba(4,7,3,.05) 52%, rgba(3,5,2," +
              dim +
              ") 100%)",
          }}
        />
      )}

      {cat && <SceneCat corner={catCorner} />}
    </div>
  );
}
