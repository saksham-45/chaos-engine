"use client";

import React from "react";
import { SectionPlate, Stamp, StampButton } from "@/components/kb";
import { PROFILE } from "@/lib/projects";

/* FIELD NOTES - the bureau journal.
   Honest empty state: no posts yet, so the "ledger" holds the planned entries as
   mono rows with a SOON tag, styled after GitHubLedger but on a charcoal field. */

const PLANNED: { topic: string; source: string }[] = [
  {
    topic: "Sampling a beat-grid into cut points: how AutoMix avoids vocal clashes",
    source: "AutoMix",
  },
  {
    topic: "Running an emotion model fully on-device with a local LLM (MoodScope)",
    source: "MoodScope",
  },
  {
    topic: "Keeping ~99.9% uptime when traffic is a crisis, not a curve (COVID-HELP)",
    source: "COVID-HELP",
  },
];

export default function BlogPage() {
  return (
    <main className="pt-14">
      <SectionPlate
        id="journal"
        ground="bone"
        title="Field notes"
        intro="Build logs and deep dives on the things I make: how they were engineered, and where they nearly broke. The first one's in the oven."
        wide
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 items-start">
          {/* honest framing - body copy on bone */}
          <div className="space-y-5 text-[1.25rem] leading-relaxed text-[var(--color-ink)]/85 max-w-2xl">
            <p>
              Nothing published yet - I&rsquo;d rather ship none than filler. What&rsquo;s on
              the drafting table is drawn straight from real work: three write-ups queued
              behind the projects that earned them.
            </p>
            <p>
              Until then, the code speaks for itself. The projects page has the full list, and
              every commit is on GitHub, the receipts, not the highlight reel.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <StampButton href="/projects" variant="primary">
                See the work →
              </StampButton>
              <StampButton href={PROFILE.github} variant="secondary" external>
                {PROFILE.githubHandle}
              </StampButton>
            </div>
          </div>

          {/* planned-entries ledger - mono rows on charcoal, GitHubLedger idiom */}
          <Stamp>
            <div className="border-2 border-[var(--color-bone)]/25 bg-[var(--color-charcoal)] text-[var(--color-bone)]">
              {/* header row */}
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 px-4 py-2.5 border-b-2 border-[var(--color-bone)]/25 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-bone)]/55">
                <span className="tabular-nums">#</span>
                <span>Draft</span>
                <span className="text-right">status</span>
              </div>

              {PLANNED.map((p, i) => (
                <div
                  key={p.topic}
                  className={`grid grid-cols-[auto_1fr_auto] gap-x-4 px-4 py-4 items-start ${
                    i > 0 ? "border-t border-[var(--color-bone)]/15" : ""
                  }`}
                >
                  <span className="font-mono text-[0.9rem] tabular-nums text-[var(--color-bone)]/60 leading-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.9rem] leading-6 text-[var(--color-bone)]/90">
                    {p.topic}
                    <span className="block mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-bone)]/60">
                      {p.source}
                    </span>
                  </span>
                  <span className="shrink-0 self-start font-mono text-[0.68rem] uppercase tracking-[0.18em] bg-[var(--color-oxide)] text-[var(--color-paper)] px-2 py-1">
                    Soon
                  </span>
                </div>
              ))}

              {/* footer tally - honest count */}
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 px-4 py-2.5 border-t-2 border-[var(--color-bone)]/25 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-bone)]/60">
                <span className="tabular-nums">Σ</span>
                <span>{PLANNED.length} planned</span>
                <span className="text-right tabular-nums">0 published</span>
              </div>
            </div>
          </Stamp>
        </div>
      </SectionPlate>
    </main>
  );
}
