"use client";

import React from "react";
import {
  IndexRail,
  type RailItem,
  StampButton,
  Stamp,
  SectionPlate,
  StatLedger,
  SceneSlot,
  ProjectPlate,
  GitHubLedger,
  ContactColophon,
  DiagonalBar,
  BlackSquareAnchor,
} from "@/components/kb";
import { FLAGSHIPS, STATS, STACK, PROFILE } from "@/lib/projects";

const RAIL: RailItem[] = [
  { id: "s00", no: "00", label: "Intro" },
  { id: "s01", no: "01", label: "Numbers" },
  { id: "s02", no: "02", label: "About" },
  { id: "s03", no: "03", label: "Projects" },
  { id: "s04", no: "04", label: "Tools" },
  { id: "s05", no: "05", label: "Lab" },
  { id: "s06", no: "06", label: "GitHub" },
  { id: "s07", no: "07", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <IndexRail items={RAIL} />

      <main className="pt-14">
        {/* ============ 00 · MASTHEAD + GENERAL ASSEMBLY ============ */}
        <section id="s00" className="relative bg-[var(--color-bone)] overflow-hidden">
          <div className="mx-auto max-w-[1400px] pl-5 sm:pl-8 lg:pl-12 xl:pl-[248px] pr-5 sm:pr-8 lg:pr-12 py-14 md:py-20">
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase bg-[var(--color-oxide)] text-[var(--color-paper)] px-2 py-1">
                Open to full-time software or ML engineering roles
              </span>
              <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-ink)]/50">
                Full-stack Developer · Tampa, FL
              </span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-center">
              {/* title block (order-2 on mobile so art stacks above) */}
              <div className="order-2 lg:order-1 relative">
                <DiagonalBar className="-left-12 top-6 hidden lg:block" length={200} thickness={26} />
                <h1 className="display-hero text-[clamp(2.8rem,9vw,7rem)] text-[var(--color-ink)]">
                  Saksham
                  <br />
                  Srivastava
                </h1>
                <div className="mt-6 flex items-start gap-3">
                  <span aria-hidden className="mt-1.5 w-3 h-3 shrink-0 bg-[var(--color-oxide)]" />
                  <p className="font-mono text-[0.85rem] uppercase tracking-[0.12em] text-[var(--color-ink)]/70 leading-relaxed">
                    Computer Engineering B.S. &rsquo;27 · USF
                    <br />
                    Undergraduate researcher · Bellini College of AI
                    <br />
                    Tampa, FL
                  </p>
                </div>
                <p className="mt-6 max-w-xl text-[1.25rem] leading-relaxed text-[var(--color-ink)]">
                  Full-stack developer and researcher at USF. I build{" "}
                  <span className="bg-[var(--color-oxide)] text-[var(--color-paper)] px-1.5">
                    end to end: backend, data, ML, and the interface
                  </span>
                  , with a strong foundation in ML.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <StampButton href="/projects" variant="primary">
                    View Projects →
                  </StampButton>
                  <StampButton href="/contact" variant="secondary">
                    Contact
                  </StampButton>
                  <StampButton href="/lab" variant="secondary">
                    Enter the Lab
                  </StampButton>
                </div>
              </div>

              {/* hero scene: torch-revealed, brighter resting light so it invites */}
              <div className="order-1 lg:order-2 relative">
                <Stamp>
                  <SceneSlot
                    slug="canyon"
                    ground="concrete"
                    minH="min-h-[340px] md:min-h-[420px]"
                    ratio="16 / 10"
                    label="Assembly"
                    torch={330}
                    dim={0.55}
                    catCorner="br"
                    className="w-full"
                  />
                </Stamp>
                <BlackSquareAnchor size={40} className="absolute -bottom-4 -right-4 hidden md:block" color="var(--color-ink)" />
              </div>
            </div>
          </div>
        </section>

        {/* ============ 01 · LEDGER (stats) ============ */}
        <SectionPlate
          railGutter
          id="s01"
          ground="concrete"
          plateNo="01"
          title="By the numbers"
          texture
        >
          <StatLedger items={STATS} />
        </SectionPlate>

        {/* ============ 02 · BRIEF (identity) ============ */}
        <SectionPlate
          railGutter
          id="s02"
          ground="bone"
          plateNo="02"
          title="About me"
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5 text-[1.25rem] leading-relaxed text-[var(--color-ink)]/85 max-w-2xl">
              <p>
                I&rsquo;m a computer engineering student at the University of South Florida (B.S. &rsquo;27,
                {" "}{PROFILE.scholar}) with a {PROFILE.mathMinor}, and an undergraduate researcher at
                USF&rsquo;s Bellini College of AI.
              </p>
              <p>
                I work end to end, from the backend and data layer to the model and the interface.
                I&rsquo;ve shipped on-device ML on a $35 board, an automatic DJ, and a crisis platform
                that stayed up at ~99.9% for over ten thousand people. The math behind the work is in the Lab.
              </p>
            </div>
            <div className="border-2 border-[var(--color-ink)] divide-y-2 divide-[var(--color-ink)] self-start w-full font-mono">
              {[
                ["Discipline", "ML · Embedded · Music · Systems"],
                ["Education", "USF · CompEng B.S. '27 · Math minor"],
                ["Honors", "Green & Gold Presidential Scholar"],
                ["Research", "USF Bellini College of AI"],
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

        {/* ============ 03 · PROJECTS ============ */}
        <SectionPlate
          railGutter
          id="s03"
          ground="bone"
          plateNo="03"
          title="Featured projects"
          intro="Four builds, each with a live demo or source. The full list and my GitHub are on the projects page."
          wide
        >
          <div className="space-y-8">
            {FLAGSHIPS.map((p, i) => (
              <Stamp key={p.slug}>
                <ProjectPlate
                  p={p}
                  ground={i % 2 === 1 ? "concrete" : "bone"}
                  scene={["starfield", "taj", "oldcity", "canyon"][i % 4]}
                />
              </Stamp>
            ))}
          </div>
          <div className="mt-10">
            <StampButton href="/projects" variant="secondary">
              Full index of works →
            </StampButton>
          </div>
        </SectionPlate>

        {/* ============ 04 · SPEC (stack) ============ */}
        <SectionPlate
          railGutter
          id="s04"
          ground="bone"
          plateNo="04"
          title="What I build with"
          intro="The stack I work in day to day."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STACK.map((grp) => (
              <div key={grp.group} className="border-2 border-[var(--color-ink)]">
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

        {/* ============ 05 · FIGURES (lab teaser) ============ */}
        <SectionPlate
          railGutter
          id="s05"
          ground="ink"
          plateNo="05"
          title="Math, drawn live"
          intro={
            <>
              Eight equations pulled from the work, rendered live in the Lab.
            </>
          }
          wide
        >
          <Stamp>
            <SceneSlot slug="ghat" ground="charcoal" minH="min-h-[220px]" ratio="21 / 9" label="Figures" torch={260} dim={0.7} catCorner="bl" className="w-full" />
          </Stamp>
          <div className="mt-10">
            <StampButton href="/lab" variant="ghost">
              Enter the Lab →
            </StampButton>
          </div>
        </SectionPlate>

        {/* ============ 06 · GITHUB (live ledger) ============ */}
        <SectionPlate
          railGutter
          id="s06"
          ground="charcoal"
          plateNo="06"
          title="Live from GitHub"
          intro="Pulled live from github.com/saksham-45."
          wide
        >
          <GitHubLedger />
        </SectionPlate>

        {/* ============ 07 · CONTACT (colophon) ============ */}
        <SectionPlate id="s07" railGutter ground="charcoal" className="border-t-2">
          <ContactColophon />
        </SectionPlate>
      </main>
    </>
  );
}
