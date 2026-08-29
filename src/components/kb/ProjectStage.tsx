"use client";

import React from "react";
import { Visualizer } from "./Visualizer";
import { ArchCanvas, type ArchId } from "./ArchCanvas";
import type { Flagship } from "@/lib/projects";
import type { VizMode } from "@/lib/visualizzer";

const BY_SLUG: Record<
  string,
  | { kind: "viz"; mode: VizMode; label: string }
  | { kind: "shot"; src: string; alt: string; label: string }
  | { kind: "arch"; diagram: ArchId; label: string }
> = {
  visualizzer: { kind: "viz", mode: "particleField", label: "Live · Visualizzer · synth 44.1 kHz" },
  moodscope: {
    kind: "shot",
    src: "/projects/moodscope-live.webp",
    alt: "MoodScope live facial-emotion detection on device",
    label: "On-device · ~33 FPS · Pi 4",
  },
  automix: { kind: "arch", diagram: "automix", label: "Architecture · DecisionNN + CurveLSTM" },
  "covid-help": { kind: "arch", diagram: "covid", label: "Architecture · ingest → Firebase → clients" },
};

function Frame({
  label,
  minH,
  ratio,
  className,
  children,
}: {
  label: string;
  minH: string;
  ratio: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <figure
      className={`relative overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-navy)] shadow-[6px_6px_0_var(--color-ink)] ${className}`}
    >
      <div className={`relative w-full ${minH}`} style={{ aspectRatio: ratio }}>
        {children}
      </div>
      <figcaption className="absolute bottom-0 inset-x-0 bg-[var(--color-bone)]/85 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-ink)]/70">
        {label}
      </figcaption>
    </figure>
  );
}

export function ProjectStage({
  p,
  minH = "min-h-[240px]",
  ratio = "4 / 3",
  className = "",
}: {
  p: Flagship;
  minH?: string;
  ratio?: string;
  className?: string;
}) {
  const spec = BY_SLUG[p.slug] ?? { kind: "viz" as const, mode: p.viz, label: p.name };

  if (spec.kind === "viz") {
    return (
      <Visualizer
        mode={spec.mode}
        minH={minH}
        ratio={ratio}
        label={spec.label}
        href={p.demo}
        className={className}
      />
    );
  }

  if (spec.kind === "shot") {
    return (
      <Frame label={spec.label} minH={minH} ratio={ratio} className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spec.src}
          alt={spec.alt}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </Frame>
    );
  }

  return (
    <Frame label={spec.label} minH={minH} ratio={ratio} className={className}>
      <ArchCanvas diagram={spec.diagram} className="absolute inset-0" />
    </Frame>
  );
}


