"use client";

import React from "react";
import { CurveStage } from "./CurveStage";
import { getCurve } from "@/lib/curves";

/* Bordered blueprint-navy wrapper for ALL generative art. Caption rides a docked
   solid ink bar at the panel edge - body copy is NEVER placed on the navy field. */
export function SchematicPanel({
  figNo,
  caption,
  equation,
  curveId,
  interactive = false,
  children,
  className = "",
  minH = "min-h-[300px]",
  captionRu,
}: {
  figNo?: string;
  caption?: string;
  equation?: string;
  curveId?: string;
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
  minH?: string;
  captionRu?: string;
}) {
  const spec = curveId ? getCurve(curveId) : null;
  const eq = equation ?? spec?.equation;
  const cap = caption ?? spec?.caption;
  const title = spec?.name;

  return (
    <figure
      className={`kb-plate bg-[var(--color-navy)] p-0 overflow-hidden ${className}`}
    >
      {/* top registration strip */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b-2 border-[var(--color-bone)]/20 bg-[var(--color-navy)]">
        <span className="font-mono text-[0.72rem] tracking-[0.2em] text-[var(--color-cyan)]">
          {figNo ? `FIG. ${figNo}` : "FIG."} {title && <span className="text-[var(--color-bone)]/60">· {title}</span>}
        </span>
        <span aria-hidden className="font-mono text-[0.72rem] text-[var(--color-bone)]/40">
          FIG.{figNo ?? ""}
        </span>
      </div>

      {/* the quarantined art field - always has a defined height so canvases fill */}
      <div className={`relative w-full ${minH}`} style={{ aspectRatio: children ? "16 / 10" : "4 / 3" }}>
        {curveId ? (
          <CurveStage curveId={curveId} interactive={interactive} className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0">{children}</div>
        )}
      </div>

      {/* docked solid caption bar (ink ground → bone text, always legible) */}
      {(eq || cap) && (
        <figcaption className="bg-[var(--color-ink)] text-[var(--color-bone)] px-4 py-3 border-t-2 border-[var(--color-bone)]/20">
          {captionRu && (
            <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-cyan)] block mb-1">
              {captionRu}
            </span>
          )}
          {eq && (
            <pre className="font-mono text-[0.8rem] leading-relaxed text-[var(--color-cyan)] whitespace-pre-wrap mb-1.5">
              {eq}
            </pre>
          )}
          {cap && (
            <p className="font-mono text-[0.78rem] leading-relaxed text-[var(--color-bone)]/75">
              {cap}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
