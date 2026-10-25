"use client";

import React, { useMemo, useState } from "react";
import {
  Stamp,
  SectionPlate,
  ProjectPlate,
  GitHubLedger,
  StampButton,
} from "@/components/kb";
import { FLAGSHIPS, SELECTED, PROFILE, type Flagship } from "@/lib/projects";

/* Discipline filter strip. "All" is the default; the rest map 1:1 onto the
   flagships' disciplines. An empty match degrades to an honest mono note rather
   than a blank page. */
const FILTERS: { key: "All" | Flagship["discipline"]; label: string }[] = [
  { key: "All", label: "All" },
  { key: "FPGA", label: "FPGA" },
  { key: "Embedded", label: "Embedded" },
  { key: "Applied AI", label: "Applied AI" },
  { key: "ML", label: "ML" },
  { key: "Music", label: "Music" },
  { key: "Graphics", label: "Graphics" },
  { key: "Systems", label: "Systems" },
];

export default function ProjectsPage() {
  const [active, setActive] = useState<"All" | Flagship["discipline"]>("All");

  const shown = useMemo(
    () => (active === "All" ? FLAGSHIPS : FLAGSHIPS.filter((p) => p.discipline === active)),
    [active],
  );

  return (
    <main className="pt-14">
      {/* ============ MASTHEAD / INDEX OF WORKS ============ */}
      <SectionPlate
        ground="bone"
        title="Projects"
        intro="Every featured build, with source or a live demo. Below, smaller builds, then everything on GitHub."
        wide
      >
        {/* discipline filter strip */}
        <div
          role="group"
          aria-label="Filter projects by discipline"
          className="flex flex-wrap items-stretch border-2 border-[var(--color-ink)] w-fit"
        >
          {FILTERS.map((f, i) => {
            const on = f.key === active;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                aria-pressed={on}
                className={`min-h-[44px] px-4 font-mono text-[0.8rem] uppercase tracking-[0.16em] transition-colors ${
                  i > 0 ? "border-l-2 border-[var(--color-ink)]" : ""
                } ${
                  on
                    ? "bg-[var(--color-oxide)] text-[var(--color-paper)]"
                    : "bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* result count - mono metadata */}
        <p className="mt-4 font-mono text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">
          {shown.length} of {FLAGSHIPS.length} project{FLAGSHIPS.length === 1 ? "" : "s"}
          {active !== "All" ? ` · ${active}` : ""}
        </p>

        {shown.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {shown.map((p) => (
              <ProjectPlate key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] px-5 py-6">
            <p className="text-[1.125rem] leading-relaxed text-[var(--color-ink)]/80">
              No featured project under{" "}
              <span className="text-[var(--color-oxide-dark)]">{active}</span> yet, that work is in
              the GitHub feed below, or reset the filter to see them all.
            </p>
            <div className="mt-4">
              <StampButton onClick={() => setActive("All")} variant="secondary">
                Show all →
              </StampButton>
            </div>
          </div>
        )}
      </SectionPlate>

      {/* ============ SELECTED WORK ============ */}
      <SectionPlate
        ground="concrete"
        title="Selected work"
        intro="Smaller builds across the stack: a resume-site builder, an LMMS MCP plugin, a compiler, combinatorics research, graphics, an RL agent, and everyday math tooling."
        texture
        wide
      >
        <div className="border-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
          {SELECTED.map((s, i) => (
            <div
              key={s.name}
              className={`grid gap-x-8 gap-y-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.7fr)_auto] items-start px-5 py-6 ${
                i > 0 ? "border-t-2 border-[var(--color-ink)]" : ""
              }`}
            >
              <div>
                <h3 className="display-plate text-[1.5rem] text-[var(--color-ink)]">{s.name}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="font-mono text-[0.72rem] px-2 py-0.5 border border-[var(--color-ink)]/40 text-[var(--color-ink)]/70"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[1.125rem] leading-relaxed text-[var(--color-ink)]/85">{s.blurb}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end font-mono text-[0.8rem] uppercase tracking-[0.16em]">
                {s.demo && (
                  <a
                    href={s.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-oxide-dark)] border-b-2 border-current pb-0.5 h-fit"
                  >
                    Demo ↗
                  </a>
                )}
                <a
                  href={s.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-oxide-dark)] border-b-2 border-current pb-0.5 h-fit"
                >
                  Source ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </SectionPlate>

      {/* ============ LIVE FROM GITHUB ============ */}
      <SectionPlate
        ground="charcoal"
        title="Live from GitHub"
        intro={
          <>
            Pulled live from{" "}
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-cyan)] underline underline-offset-4"
            >
              {PROFILE.githubHandle}
            </a>
            .
          </>
        }
        wide
      >
        <GitHubLedger />
      </SectionPlate>
    </main>
  );
}
