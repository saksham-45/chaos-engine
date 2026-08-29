"use client";

import React from "react";
import Link from "next/link";
import { ProjectStage } from "./ProjectStage";
import type { Flagship } from "@/lib/projects";
import type { Ground } from "./Plate";

/* Flagship project plate: role tag + plate no + headline metric pulled large,
   a live demo / screenshot / architecture preview, real demo/repo links, and a
   link to the full assembly sheet at /projects/[slug]. */
export function ProjectPlate({
  p,
  ground = "bone",
  reversed = false,
}: {
  p: Flagship;
  ground?: Ground;
  reversed?: boolean;
}) {
  const text = "text-[var(--color-ink)]";
  const sub = "text-[var(--color-ink)]/70";
  const line = "border-[var(--color-rule)]";
  const accent = "text-[var(--color-oxide-dark)]";

  return (
    <article
      className={`kb-plate ${
        ground === "concrete" ? "bg-[var(--color-concrete)]" : "bg-[var(--color-bone)]"
      } ${text}`}
    >
      <div className={`grid gap-0 lg:grid-cols-2 ${reversed ? "lg:[direction:rtl]" : ""}`}>
        {/* copy column */}
        <div className="p-6 md:p-9 [direction:ltr]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[0.75rem] tracking-[0.18em] px-2 py-1 bg-[var(--color-oxide)] text-[var(--color-paper)]">
              {p.tag}
            </span>
            <span className={`font-mono text-[0.72rem] uppercase tracking-[0.16em] ${sub}`}>
              {p.role} · {p.period}
            </span>
          </div>

          <h3 className="display-plate text-[clamp(1.9rem,4.5vw,3rem)] mt-4">{p.name}</h3>
          <p className={`mt-1 text-[1.05rem] ${accent}`}>{p.tagline}</p>

          {/* headline metric, monumental */}
          <div className={`mt-6 border-t-2 ${line} pt-5 flex items-baseline gap-3`}>
            <span className="display-plate text-[clamp(2.4rem,6vw,3.6rem)] leading-none">
              {p.headline.value}
            </span>
            <span className={`font-mono text-[0.8rem] uppercase tracking-[0.08em] leading-snug ${sub}`}>
              {p.headline.label}
            </span>
          </div>

          <p className={`mt-5 text-[1.125rem] leading-relaxed ${sub}`}>{p.thesis}</p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[0.72rem] px-2 py-1 border border-[var(--color-rule)] text-[var(--color-ink)]/75"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[0.8rem] uppercase tracking-[0.16em]">
            <Link href={`/projects/${p.slug}`} className={`group inline-flex items-center gap-2 ${accent}`}>
              <span className="border-b-2 border-current pb-0.5">Assembly sheet</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            {p.demo && (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 ${accent}`}
              >
                <span className="border-b-2 border-current pb-0.5">{p.demoLabel ?? "Live demo"}</span>
                <span className="transition-transform group-hover:translate-x-0.5">↗</span>
              </a>
            )}
            {p.repo && (
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 ${sub} hover:text-[var(--color-ink)]`}
              >
                <span className="border-b-2 border-current/40 pb-0.5">Source</span>
              </a>
            )}
          </div>
        </div>

        {/* live demo, screenshot, or architecture — never a scenic cat */}
        <div className="p-6 md:p-9 [direction:ltr] flex items-center">
          <ProjectStage p={p} minH="min-h-[240px]" ratio="4 / 3" className="w-full" />
        </div>
      </div>
    </article>
  );
}
