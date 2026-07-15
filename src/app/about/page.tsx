"use client";

import React from "react";
import {
  SectionPlate,
  StampButton,
  SpecTable,
  SceneSlot,
  Stamp,
  BlackSquareAnchor,
} from "@/components/kb";
import { PROFILE } from "@/lib/projects";

const EDUCATION = [
  { label: "Institution", value: "University of South Florida · Tampa, FL" },
  { label: "Degree", value: "B.S. Computer Engineering · Aug 2023 - May 2027" },
  { label: "Minor", value: "Mathematics" },
  { label: "Honors", value: "Green & Gold Presidential Scholar" },
  { label: "College", value: "USF Bellini College of AI, Cybersecurity & Computing" },
  { label: "Coursework", value: "Algorithms, Linear Algebra, Diff. Equations, OS, Hardware for ML, Statistics" },
  { label: "Research", value: "Undergrad researcher · Bellini College of AI & Math / Stats" },
];

export default function About() {
  return (
    <main className="pt-14">
      {/* ============ 00 · MASTHEAD ============ */}
      <SectionPlate
        id="s00"
        ground="bone"
        plateNo="00"
        title="About me"
      >
        <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14 items-start">
          <div className="max-w-2xl">
            <p className="text-[1.25rem] leading-relaxed text-[var(--color-ink)]">
              I&rsquo;m a full-stack developer and computer engineering student at USF. I build
              complete applications:{" "}
              <span className="bg-[var(--color-oxide)] text-[var(--color-paper)] px-1.5">
                backend, data, ML, and the interface
              </span>
              , and I work best where those layers meet.
            </p>
          </div>
          <div className="flex items-start gap-3 self-center">
            <span aria-hidden className="mt-1.5 w-3 h-3 shrink-0 bg-[var(--color-oxide)]" />
            <p className="font-mono text-[0.85rem] uppercase tracking-[0.12em] text-[var(--color-ink)]/70 leading-relaxed">
              {PROFILE.role}
              <br />
              {PROFILE.research}
              <br />
              {PROFILE.location}
            </p>
          </div>
        </div>
      </SectionPlate>

      {/* ============ 01 · BIO BRIEF ============ */}
      <SectionPlate
        id="s01"
        ground="bone"
        plateNo="01"
        title="How I work"
      >
        <div className="space-y-6 text-[1.25rem] leading-relaxed text-[var(--color-ink)]/85 max-w-[68ch]">
          <p>
            I&rsquo;m a computer engineering student at USF (B.S. &rsquo;27, {PROFILE.scholar})
            with a {PROFILE.mathMinor}, and an undergraduate researcher at USF&rsquo;s Bellini
            College of AI. I work full-stack: on most projects I&rsquo;ve built the backend, the
            data pipeline, the model, and the UI myself.
          </p>
          <p>
            MoodScope runs emotion detection on-device on a Raspberry Pi. AutoMix beat-matches and
            mixes tracks with a learned model. Visualizzer turns live audio into real-time graphics.
            Each one spans ML, systems, and a frontend, which is the kind of end-to-end build I like.
          </p>
          <p>
            The one I&rsquo;m proudest of is the least flashy. During India&rsquo;s second COVID
            wave I founded and led COVID-HELP, a platform that connected 10,000+ people to live ICU
            beds and oxygen at ~99.9% uptime, aggregating 50+ live sources with a 15+ person volunteer
            team. It held up under real load when it mattered.
          </p>
        </div>
      </SectionPlate>

      {/* ============ 02 · EDUCATION & HONORS LEDGER ============ */}
      <SectionPlate
        id="s02"
        ground="concrete"
        plateNo="02"
        title="Education"
        intro="The facts, nothing invented."
        texture
      >
        <div className="max-w-3xl">
          <SpecTable rows={EDUCATION} caption="ACADEMIC RECORD" />
        </div>
      </SectionPlate>

      {/* ============ 03 · DISCIPLINES ============ */}
      <SectionPlate
        id="s03"
        ground="ink"
        plateNo="03"
        title="Across the stack"
        intro="The layers I move between, from backend and data to models and graphics."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <SceneSlot slug="taj" ground="charcoal" minH="min-h-[280px] md:min-h-[340px]" ratio="4 / 3" label="Diagram" torch={240} dim={0.78} catCorner="bl" className="w-full" />
          </div>
          <div className="order-1 lg:order-2 relative">
            <BlackSquareAnchor
              size={36}
              className="absolute -top-4 -right-2 hidden lg:block"
              color="var(--color-oxide)"
            />
            <p className="text-[1.125rem] leading-relaxed text-[var(--color-bone)]/85 max-w-[46ch]">
              Building the whole stack, from API and data to model and UI, means the constraints of
              one layer keep the others honest: latency and memory from embedded, perception from
              audio, and the math underneath all of it.
            </p>
          </div>
        </div>
      </SectionPlate>

      {/* ============ 04 · CONTACT ROW ============ */}
      <SectionPlate
        id="s04"
        ground="charcoal"
        plateNo="04"
        title="Get in touch"
        intro="My contact details and availability are on the contact page. Start there, or browse the projects."
      >
        <div className="flex flex-wrap gap-4">
          <StampButton href="/contact" variant="primary">
            Contact →
          </StampButton>
          <StampButton href="/projects" variant="ghost">
            View projects
          </StampButton>
          <StampButton href={PROFILE.github} variant="ghost" external>
            GitHub · {PROFILE.githubHandle}
          </StampButton>
        </div>
      </SectionPlate>
    </main>
  );
}
