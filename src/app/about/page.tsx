"use client";

import React from "react";
import Link from "next/link";
import { Reveal, ScaleIn } from "@/components/site/motion";
import { ContactBlock } from "@/components/site/Contact";

const STORY = [
  {
    year: "2020",
    hue: "#30d158",
    title: "I interned at Greenpeace.",
    text: "I ran the digital side of Greenpeace’s Towards a Green Recovery campaign across 3 countries. It gathered more than 50,000 petition signatures and helped stop an illegal forest clearing.",
  },
  {
    year: "2021",
    hue: "#ff453a",
    title: "I started COVID-HELP.",
    text: "When India’s second COVID wave hit, I built a site that showed where ICU beds and oxygen were available, pulling from more than 50 hospital and community feeds. Over 40,000 people used it, and it stayed up through traffic spikes 10 times the usual load. I led a team of 15 volunteers and kept it running until 2023.",
  },
  {
    year: "2023",
    hue: "#bf5af2",
    title: "I started at USF.",
    text: "I started my computer engineering degree at the University of South Florida in Tampa, with a math minor, as a Green & Gold Presidential Scholar.",
  },
  {
    year: "2025",
    hue: "#ffd60a",
    title: "I got into math research.",
    text: "I worked with Dr. Barrientos in USF’s math department on counting problems, replacing brute-force search with exact methods. My code computes an answer about 602,000 digits long in under 3 seconds. That year I also built AutoMix and MoodScope (a top project at Health Hacks @ USF) and started contributing fixes to other people’s open-source projects.",
  },
  {
    year: "2026",
    hue: "#ff9f0a",
    title: "I joined two labs and released Helion.",
    text: "In the AICC Lab with Dr. Topsakal, I built an interactive concept map and long-term memory for the AI tutor that more than 20,000 USF students have access to. In the SHIELD Lab with Dr. Templeton, I write firmware for a mouthguard sensor and train models that predict injury outcomes. I also released Helion, my FPGA toolchain, which is now 360,000+ lines of Rust with over 1,900 tests. And my fix to docker-android, a project with more than 7,000 stars, got merged.",
  },
  {
    year: "2027",
    hue: "#3ddc84",
    title: "I graduate in May.",
    text: "I’m looking for a full-time job working close to the hardware: FPGA and EDA tools, compilers, or infrastructure.",
  },
];

const SCHOOL = [
  { value: "3.89", label: "GPA" },
  { value: "May 2027", label: "when I graduate" },
  { value: "Math", label: "my minor" },
];

const LABS = [
  {
    hue: "#30d158",
    name: "SHIELD Lab",
    with: "with Dr. Templeton",
    text: "I write the firmware for a mouthguard sensor that measures impacts.",
    href: "/projects/shield-nrf52840",
  },
  {
    hue: "#2997ff",
    name: "AICC Lab",
    with: "with Dr. Topsakal",
    text: "I work on USF’s AI tutor and built its long-term memory.",
    href: "/projects/aicc-tutor",
  },
];

const section = "mx-auto max-w-[1200px] px-5 sm:px-8 py-20 md:py-28";
const body = "max-w-[52ch] text-[clamp(1.2rem,1.7vw,1.4rem)] leading-relaxed text-muted";

export default function About() {
  return (
    <main>
      {/* ============ INTRO ============ */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 pt-32 sm:px-8 md:pt-44 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
        <div>
          <Reveal now blur>
            <h1 className="t-h1">About me.</h1>
          </Reveal>
          <Reveal now delay={0.1}>
            <p className="t-lead mt-7 max-w-[40ch]">
              I&rsquo;m <strong>Saksham Srivastava</strong>, a computer engineering student at the University of South Florida.
              I graduate in May 2027.
            </p>
          </Reveal>
          <Reveal now delay={0.18}>
            <p className="t-lead mt-5 max-w-[40ch]">
              I like understanding a system all the way down, from the chip up to the app, and then building my own version of it.
            </p>
          </Reveal>
        </div>
        <ScaleIn>
          <figure className="card aspect-[4/5] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/saksham.webp" alt="Saksham Srivastava on the Tampa riverwalk at night" className="h-full w-full object-cover object-bottom" />
          </figure>
        </ScaleIn>
      </section>

      {/* ============ STORY ============ */}
      <section className={section}>
        <Reveal blur>
          <h2 className="t-h2">My story so far.</h2>
        </Reveal>
        <ol className="mt-12 md:mt-16">
          {STORY.map((t, i) => (
            <Reveal as="li" key={t.year} className="grid grid-cols-[20px_1fr] gap-x-5 md:grid-cols-[120px_20px_1fr] md:gap-x-8">
              <p className="hue-text col-start-2 mb-1 text-[1.0625rem] font-semibold md:col-start-1 md:row-start-1 md:mb-0 md:pt-1 md:text-right" style={{ "--hue": t.hue } as React.CSSProperties}>
                {t.year}
              </p>
              {/* rail: a dot per stop, a line down to the next one */}
              <div aria-hidden className="relative col-start-1 row-span-2 row-start-1 flex justify-center md:col-start-2 md:row-span-1">
                <span className="mt-1.5 h-4 w-4 rounded-full border-[4px] bg-bg" style={{ borderColor: t.hue, boxShadow: `0 0 0 5px color-mix(in oklab, ${t.hue} 20%, transparent)` }} />
                {i < STORY.length - 1 && <span className="absolute bottom-0 top-8 w-px bg-line" />}
              </div>
              <div className="col-start-2 pb-12 md:col-start-3 md:row-start-1 md:pb-16">
                <h3 className="t-h3">{t.title}</h3>
                <p className={`${body} mt-3`}>{t.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ============ SCHOOL ============ */}
      <section className={section}>
        <Reveal blur>
          <h2 className="t-h2">School.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={`${body} mt-6`}>
            I&rsquo;m doing a B.S. in Computer Engineering at USF in Tampa as a Green &amp; Gold Presidential Scholar.
          </p>
        </Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-3 md:gap-6">
          {SCHOOL.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 0.06}>
              <div className="card p-7 sm:p-8">
                <p className="t-num text-[clamp(2.4rem,4.6vw,3.75rem)] leading-none">{s.value}</p>
                <p className="mt-3 text-[1.0625rem] text-muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.1}>
          <p className={`${body} mt-10`}>
            A few classes I&rsquo;ve taken: Algorithms, Computer Architecture, CMOS VLSI Design, FPGA Design, Linear
            Algebra, and Probability &amp; Statistics.
          </p>
        </Reveal>
      </section>

      {/* ============ RESEARCH ============ */}
      <section className={section}>
        <Reveal blur>
          <h2 className="t-h2">Research.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={`${body} mt-6`}>I do undergrad research in two labs in USF&rsquo;s Bellini College of AI, Cybersecurity &amp; Computing.</p>
        </Reveal>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
          {LABS.map((l, i) => (
            <Reveal as="li" key={l.name} delay={i * 0.06} className="h-full">
              <div className="card card-glow pressable h-full p-7 sm:p-9" style={{ "--hue": l.hue } as React.CSSProperties}>
                <h3 className="t-h3 relative z-[1]">
                  <Link href={l.href} className="after:absolute after:inset-0 after:z-[2]">
                    {l.name}
                  </Link>
                </h3>
                <p className="eyebrow relative z-[1] mt-1">{l.with}</p>
                <p className="relative z-[1] mt-4 max-w-[36ch] text-[1.25rem] leading-snug text-muted">{l.text}</p>
                <span aria-hidden className="link relative z-[1] mt-6">
                  Read about it
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ============ OUTSIDE ============ */}
      <section className={section}>
        <Reveal blur>
          <h2 className="t-h2">Outside of class.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={`${body} mt-6`}>
            I&rsquo;m the tech lead at White Hatters and have placed runner-up at the HacktheBay CTF twice. I also write for
            Globull, where my articles have reached more than 5,000 readers, and I gave a talk at the USF Math Club on the math
            behind BitLocker and AES.
          </p>
        </Reveal>
      </section>

      <ContactBlock />
    </main>
  );
}
