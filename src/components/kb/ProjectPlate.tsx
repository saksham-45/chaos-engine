"use client";

import React from "react";
import Link from "next/link";
import { ProjectStage } from "./ProjectStage";
import type { Flagship } from "@/lib/projects";

/* Project card: image on top, then facts. No large plate, no hard shadow,
   no animated visualizer. The card is a catalog entry, not a poster. */
export function ProjectPlate({ p }: { p: Flagship }) {
  return (
    <article className="micro-card flex flex-col border border-[var(--color-rule)] bg-[var(--color-bone)] text-[var(--color-ink)]">
      <ProjectStage p={p} minH="min-h-[200px]" ratio="16 / 9" className="w-full" />
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[0.72rem] tracking-[0.16em] px-2 py-1 bg-[var(--color-oxide)] text-[var(--color-paper)]">
            {p.tag}
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-ink)]/60">
            {p.role} · {p.period}
          </span>
        </div>

        <h3 className="display-plate text-[clamp(1.6rem,3.5vw,2.25rem)] mt-3 leading-none">{p.name}</h3>
        <p className="mt-1 text-[1rem] text-[var(--color-ink)]/70">{p.tagline}</p>

        <div className="mt-4 border-t border-[var(--color-rule)] pt-4 flex items-baseline gap-3">
          <span className="display-plate text-[clamp(1.8rem,4vw,2.5rem)] leading-none text-[var(--color-oxide)]">
            {p.headline.value}
          </span>
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.06em] leading-snug text-[var(--color-ink)]/60">
            {p.headline.label}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-[1.05rem] leading-relaxed text-[var(--color-ink)]/85">
          <p><span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">What </span>{p.what}</p>
          <p><span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">Why </span>{p.why}</p>
          <p><span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">How </span>{p.how}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[0.7rem] px-2 py-1 border border-[var(--color-rule)] text-[var(--color-ink)]/70"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[0.78rem] uppercase tracking-[0.14em]">
          <Link href={`/projects/${p.slug}`} className="text-[var(--color-oxide-dark)] border-b border-current pb-0.5">
            Details
          </Link>
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-[var(--color-oxide-dark)] border-b border-current pb-0.5">
              {p.demoLabel ?? "Live demo"} ↗
            </a>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-[var(--color-ink)]/70 border-b border-current/40 pb-0.5">
              Source ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
