"use client";

import React from "react";
import { SectionPlate, SchematicPanel, Stamp, StampButton } from "@/components/kb";
import { CURVES } from "@/lib/curves";

/* FIGURES APPENDIX - the figures appendix. All eight equations, drawn live,
   each quarantined to a bordered blueprint panel with its raw equation on a
   docked solid caption bar. Migrated from /mystery. */
export default function LabPage() {
  return (
    <main className="pt-14 bg-[var(--color-ink)] min-h-screen">
      <SectionPlate
        ground="ink"
        title="The Lab"
        intro={
          <>
            Everything I build starts as an equation. Here are eight of them, drawn live from their
            raw parametric definitions. Drag, and give them a second to breathe.
          </>
        }
        wide
      >
        <div className="grid gap-6 md:grid-cols-2">
          {CURVES.map((c, i) => (
            <Stamp key={c.id} delay={(i % 2) * 0.05}>
              <SchematicPanel
                curveId={c.id}
                figNo={String(i + 1).padStart(2, "0")}
                minH="min-h-[300px]"
              />
            </Stamp>
          ))}
        </div>

        <div className="mt-14 border-t-2 border-[var(--color-rule)] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="max-w-lg text-[1.125rem] leading-relaxed text-[var(--color-ink)]/80">
            The same math shows up everywhere I work: scoring audio features in AutoMix, driving the
            visualizers around this site, running the models in MoodScope. It&rsquo;s the common thread.
          </p>
          <div className="flex gap-4 shrink-0">
            <StampButton href="/projects" variant="ghost">
              See it used →
            </StampButton>
            <StampButton href="/" variant="ghost">
              Back home
            </StampButton>
          </div>
        </div>
      </SectionPlate>
    </main>
  );
}
