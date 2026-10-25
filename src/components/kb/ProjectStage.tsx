"use client";

import React from "react";
import type { Flagship } from "@/lib/projects";

/* Project image area. No animated visualizer, no canvas demo in the card.
   Either a real screenshot, or a static flow diagram that says what the
   system does. The label states which one it is, so a diagram is never
   presented as a screenshot. */

function Diagram({ p }: { p: Flagship }) {
  const steps = p.flow ?? [p.name];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--color-concrete)] px-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span aria-hidden className="text-[var(--color-oxide)] font-mono">→</span>}
            <span className="border border-[var(--color-rule)] bg-[var(--color-bone)] px-3 py-2 font-mono text-[0.8rem] text-[var(--color-ink)]">
              {s}
            </span>
          </React.Fragment>
        ))}
      </div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-ink)]/50">
        Diagram, not a screenshot
      </p>
    </div>
  );
}

export function ProjectStage({
  p,
  minH = "min-h-[240px]",
  ratio = "16 / 9",
  className = "",
}: {
  p: Flagship;
  minH?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure
      className={`relative overflow-hidden border border-[var(--color-rule)] bg-[var(--color-concrete)] ${className}`}
    >
      <div className={`relative w-full ${minH}`} style={{ aspectRatio: ratio }}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.imageLabel ?? p.name}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <Diagram p={p} />
        )}
      </div>
      {p.imageLabel && (
        <figcaption className="absolute bottom-0 inset-x-0 bg-[var(--color-bone)]/90 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink)]/70">
          {p.imageKind === "screenshot" ? "Screenshot" : "Diagram"} · {p.imageLabel.replace(/^(Screenshot|Diagram) · /, "")}
        </figcaption>
      )}
    </figure>
  );
}
