"use client";

import React from "react";
import {
  StampButton,
  Stamp,
  SectionPlate,
  StatLedger,
  ProjectPlate,
  GitHubLedger,
  ContactColophon,
} from "@/components/kb";
import { FEATURED, STATS, STACK, PROFILE } from "@/lib/projects";

const NOW = [
  { label: "Helion", detail: "FPGA CAD in Rust, toward Vivado-level QoR" },
  { label: "SHIELD Lab", detail: "nRF52840 / Zephyr 10-sensor telemetry firmware" },
  { label: "AeroLot.ai", detail: "GenAI dealership platform, in production" },
];

export default function Home() {
  return (
    <main className="pt-14">
      {/* ============ HERO ============ */}
      <section className="relative bg-[var(--color-bone)] overflow-hidden">
        <div aria-hidden className="kb-grid kb-grid-fade pointer-events-none absolute inset-0" />
        <div aria-hidden className="kb-spotlight absolute inset-0" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase bg-[var(--color-oxide)] text-[var(--color-paper)] px-2 py-1">
              Graduating May 2027 · open to new-grad roles
            </span>
            <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-ink)]/50">
              Computer Engineering · Tampa, FL
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 items-start">
            <div className="order-1">
              <h1 className="display-hero text-[clamp(2.6rem,8vw,5.5rem)] text-[var(--color-ink)]">
                Saksham
                <br />
                Srivastava
              </h1>
              <p className="mt-6 max-w-xl text-[1.25rem] leading-relaxed text-[var(--color-ink)]">
                I build FPGA tooling, embedded firmware, and applied AI.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <StampButton href="/projects" variant="primary">
                  View projects
                </StampButton>
                <StampButton href="/about" variant="secondary">
                  About me
                </StampButton>
                <StampButton href="/contact" variant="secondary">
                  Contact
                </StampButton>
              </div>
            </div>

            <div className="order-2">
              <Stamp>
                <figure className="relative w-full overflow-hidden border border-[var(--color-rule)] bg-[var(--color-concrete)]">
                  <div className="relative w-full min-h-[320px] md:min-h-[420px]" style={{ aspectRatio: "3 / 4" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/saksham.webp"
                      alt="Saksham Srivastava on the Tampa riverwalk"
                      className="absolute inset-0 h-full w-full object-cover object-bottom"
                    />
                  </div>
                  <figcaption className="relative bg-[var(--color-concrete)] px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-ink)]/70 border-t border-[var(--color-rule)]">
                    Tampa, FL
                  </figcaption>
                </figure>
              </Stamp>
            </div>
          </div>

          <div className="mt-14 border-2 border-[var(--color-rule)] bg-[var(--color-concrete)]">
            <div className="px-4 py-2 border-b-2 border-[var(--color-rule)] font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink)]/60">
              Right now
            </div>
            <div className="grid md:grid-cols-3">
              {NOW.map((n, i) => (
                <div key={n.label} className={`px-4 py-4 ${i > 0 ? "border-t-2 md:border-t-0 md:border-l-2 border-[var(--color-rule)]" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="live-dot w-2 h-2 bg-[var(--color-oxide)]" />
                    <span className="font-mono text-[0.8rem] uppercase tracking-[0.14em] text-[var(--color-ink)]">{n.label}</span>
                  </div>
                  <p className="mt-1 text-[1rem] leading-snug text-[var(--color-ink)]/70">{n.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROJECTS ============ */}
      <SectionPlate
        id="projects"
        ground="bone"
        title="Projects"
        intro="The full list, with source or a live demo for each, is on the projects page."
        wide
      >
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURED.map((p) => (
            <ProjectPlate key={p.slug} p={p} />
          ))}
        </div>
        <div className="mt-10">
          <StampButton href="/projects" variant="secondary">
            Full index of works
          </StampButton>
        </div>
      </SectionPlate>

      {/* ============ NUMBERS ============ */}
      <SectionPlate id="numbers" ground="concrete" title="By the numbers" texture>
        <StatLedger items={STATS} />
      </SectionPlate>

      {/* ============ ABOUT, IN FIRST PERSON ============ */}
      <SectionPlate id="about" ground="bone" title="About">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-[1.25rem] leading-relaxed text-[var(--color-ink)]/85 max-w-2xl">
            <p>
              I am Saksham Srivastava. I am a computer engineering student at the University of
              South Florida. I graduate in May 2027.
            </p>
            <p>
              I am passionate and curiosity driven. I like to understand how things work, from
              hardware to software, and then build them myself.
            </p>
            <p>
              I am an undergraduate researcher in the Bellini College of AI, in the SHIELD Lab and
              the AICC Lab. I also work as a software engineering intern at AeroLot.ai.
            </p>
          </div>
          <div className="border-2 border-[var(--color-ink)] divide-y-2 divide-[var(--color-ink)] self-start w-full font-mono">
            {[
              ["Education", "USF · CompEng B.S. May 2027 · Math minor"],
              ["Research", "SHIELD Lab · AICC Lab, Bellini College of AI"],
              ["Based", "Tampa, FL"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(84px,0.4fr)_1fr]">
                <span className="px-3 py-2.5 text-[0.68rem] uppercase tracking-[0.1em] text-[var(--color-ink)]/55 border-r-2 border-[var(--color-ink)]">
                  {k}
                </span>
                <span className="px-3 py-2.5 text-[0.82rem] text-[var(--color-ink)]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionPlate>

      {/* ============ STACK ============ */}
      <SectionPlate id="stack" ground="bone" title="What I build with" intro="The stack I work in day to day.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((grp) => (
            <div key={grp.group} className="border-2 border-[var(--color-ink)] micro-card">
              <div className="bg-[var(--color-ink)] text-[var(--color-bone)] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
                {grp.group}
              </div>
              <ul className="divide-y divide-[var(--color-ink)]/15">
                {grp.items.map((it) => (
                  <li key={it} className="px-4 py-2.5 font-mono text-[0.9rem] text-[var(--color-ink)]/85">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionPlate>

      {/* ============ GITHUB ============ */}
      <SectionPlate id="github" ground="charcoal" title="Live from GitHub" intro="Pulled live from github.com/saksham-45." wide>
        <GitHubLedger />
      </SectionPlate>

      {/* ============ CONTACT ============ */}
      <SectionPlate id="contact" ground="charcoal" className="border-t-2">
        <ContactColophon />
      </SectionPlate>
    </main>
  );
}
