"use client";

import React from "react";
import { SectionPlate, StampButton, SpecTable } from "@/components/kb";
import { PROFILE } from "@/lib/projects";

const EDUCATION = [
  { label: "Institution", value: "University of South Florida · Tampa, FL" },
  { label: "Degree", value: "B.S. Computer Engineering · Aug 2023 - May 2027" },
  { label: "GPA", value: "3.89" },
  { label: "Minor", value: "Mathematics" },
  { label: "Honors", value: "Green & Gold Presidential Scholar" },
  { label: "College", value: "USF Bellini College of AI, Cybersecurity & Computing" },
  { label: "Coursework", value: "Algorithms, Computer Architecture, CMOS VLSI Design, FPGA Design, Linear Algebra, Probability & Statistics" },
  { label: "Research", value: "SHIELD Lab (Dr. Templeton) · AICC Lab (Dr. Topsakal)" },
];

const TIMELINE = [
  {
    year: "2021",
    title: "COVID-HELP",
    text: "During India's second COVID wave I founded a platform that connected 40,000+ users to live ICU beds and oxygen at ~99.9% uptime. I learned early that shipping under real load, with real people waiting, is a different standard than a class project.",
  },
  {
    year: "2023 - 2025",
    title: "USF, math, and open source",
    text: "I came to USF for computer engineering and stayed for the math underneath it: combinatorics research, a compiler, on-device ML, and 50+ merged PRs across 20+ repos. I kept choosing projects where I had to understand the layer below the one I was working in.",
  },
  {
    year: "2026",
    title: "Hardware, firmware, and production AI",
    text: "Helion became my main build, alongside SHIELD firmware on the nRF52840, long-term memory for the AICC tutor used by 20,000+ students, and a GenAI platform at AeroLot.ai. The thread is the same: build it, measure it, and do not hide what is unfinished.",
  },
  {
    year: "2027",
    title: "What is next",
    text: "I graduate in May 2027 and I am looking for a new-grad role in FPGA and EDA tooling, hardware-software systems, or applied AI, at Nvidia, AMD, or a comparable top company. I want to work where correctness is the product, not a slide.",
  },
];

export default function About() {
  return (
    <main className="pt-14">
      <SectionPlate id="about" ground="bone" title="About me">
        <div className="max-w-2xl">
          <p className="text-[1.25rem] leading-relaxed text-[var(--color-ink)]">
            I am a computer engineering student who builds across the stack because the interesting
            problems live at the boundaries: between SystemVerilog and a bitstream, between a sensor
            and a phone, between a model and a user who has to trust it.
          </p>
        </div>
      </SectionPlate>

      <SectionPlate id="story" ground="bone" title="How I got here">
        <div className="space-y-0 border-2 border-[var(--color-ink)]">
          {TIMELINE.map((t, i) => (
            <div
              key={t.year}
              className={`grid gap-2 md:grid-cols-[160px_1fr] px-5 py-6 micro-fade hover:bg-[var(--color-concrete)] ${i > 0 ? "border-t-2 border-[var(--color-ink)]" : ""}`}
            >
              <span className="font-mono text-[0.85rem] tracking-[0.14em] text-[var(--color-oxide)]">{t.year}</span>
              <div>
                <h3 className="display-plate text-[1.5rem] text-[var(--color-ink)]">{t.title}</h3>
                <p className="mt-2 max-w-2xl text-[1.125rem] leading-relaxed text-[var(--color-ink)]/85">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionPlate>

      <SectionPlate id="method" ground="bone" title="How I work" titleRu="THE METHOD">
        <div className="border-2 border-[var(--color-ink)]">
          {[
            ["01", "Measure first", "Find the number that matters before I build: timing, latency, users, or a gold value to check against."],
            ["02", "Build the whole thing", "Compiler, firmware, model, or interface, whichever layer the problem actually lives in."],
            ["03", "Verify against something real", "A corpus, a board, a production user, or a published result. Not a screenshot of a pass."],
            ["04", "Ship to real users", "If it only works in a demo, it is not done. Production is where the constraints show up."],
            ["05", "Say what is unfinished", "Every project page says what is not done yet. That is the part I trust most in other people's work, so I do it in mine."],
          ].map(([no, title, text], i) => (
            <div key={no} className={`grid gap-2 md:grid-cols-[64px_220px_1fr] px-5 py-5 micro-fade hover:bg-[var(--color-concrete)] ${i > 0 ? "border-t-2 border-[var(--color-ink)]" : ""}`}>
              <span className="font-mono text-[0.85rem] text-[var(--color-oxide)]">{no}</span>
              <span className="display-plate text-[1.25rem] text-[var(--color-ink)]">{title}</span>
              <span className="text-[1.05rem] leading-relaxed text-[var(--color-ink)]/80">{text}</span>
            </div>
          ))}
        </div>
      </SectionPlate>

      <SectionPlate id="education" ground="concrete" title="Education" intro="The facts, nothing invented." texture>
        <div className="max-w-3xl">
          <SpecTable rows={EDUCATION} caption="ACADEMIC RECORD" />
        </div>
      </SectionPlate>

      <SectionPlate id="outside" ground="bone" title="Outside the build">
        <p className="max-w-2xl text-[1.125rem] leading-relaxed text-[var(--color-ink)]/85">
          White Hatters Tech Lead, 2x HacktheBay CTF runner-up, and Globull author with 5,000+
          readers. I also gave a USF Math Club talk on the math behind BitLocker and AES. The
          through-line is the same as the work: explain the mechanism, not just the result.
        </p>
      </SectionPlate>

      <SectionPlate id="contact" ground="charcoal" title="Get in touch" intro="My contact details are on the contact page. Start there, or browse the projects.">
        <div className="flex flex-wrap gap-4">
          <StampButton href="/contact" variant="primary">
            Contact
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
