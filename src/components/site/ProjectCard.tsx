"use client";

import React from "react";
import Link from "next/link";
import { ProjectArt } from "./ProjectArt";
import { spotlight } from "./motion";
import type { Flagship } from "@/lib/projects";

/* One project. The title link stretches over the whole card, so the card
   is one big target; demo and source sit above it as their own links. */
export function ProjectCard({ p, wide = false }: { p: Flagship; wide?: boolean }) {
  const cover = p.imageCover || !!p.video;
  return (
    <article
      onPointerMove={spotlight}
      style={{ "--hue": p.hue } as React.CSSProperties}
      className={`card card-glow pressable group flex h-full flex-col ${wide ? "lg:grid lg:grid-cols-[0.82fr_1.18fr]" : ""}`}
    >
      <div className={`relative z-[1] flex flex-col p-7 sm:p-9 ${wide ? "lg:py-12 lg:pl-12" : ""}`}>
        <p className="eyebrow">{p.tag}</p>
        <h3 className={`mt-2 ${wide ? "t-h2" : "t-h3"}`}>
          <Link href={`/projects/${p.slug}`} className="outline-none after:absolute after:inset-0 after:z-[2] after:rounded-[28px] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-accent">
            {p.name}
          </Link>
        </h3>
        <p className="mt-3 max-w-[30ch] text-[1.25rem] font-medium leading-snug tracking-[-0.015em] text-muted">{p.tagline}</p>

        <div className="mt-7 flex items-baseline gap-3">
          <span className="hue-text t-num shrink-0 whitespace-nowrap text-[clamp(2.4rem,4.2vw,3.5rem)] leading-none">{p.headline.value}</span>
          <span className="max-w-[22ch] text-[0.9375rem] leading-snug text-muted">{p.headline.label}</span>
        </div>

        <div className="relative z-[4] mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-8 text-[1.0625rem]">
          <span aria-hidden className="link transition-transform group-hover:translate-x-0.5">
            Read more
          </span>
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="link link-ext">
              {p.demoLabel ?? "Live demo"}
            </a>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="link link-ext">
              Source
            </a>
          )}
        </div>
      </div>

      <div className={`relative z-[1] ${wide ? "min-h-[280px] lg:min-h-[520px]" : "min-h-[240px] flex-1 sm:min-h-[320px]"} ${cover ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5"}`}>
        <div className="absolute inset-0 overflow-hidden">
          <ProjectArt p={p} className={cover ? "transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" : ""} />
        </div>
      </div>
    </article>
  );
}
