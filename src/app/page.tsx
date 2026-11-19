"use client";

import React, { useCallback, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Fabric } from "@/components/site/Fabric";
import { Reveal, ScaleIn } from "@/components/site/motion";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Stats } from "@/components/site/Stats";
import { Repos } from "@/components/site/Repos";
import { Contributions } from "@/components/site/Contributions";
import { ContactBlock } from "@/components/site/Contact";
import { FEATURED, STATS, STACK, PROFILE } from "@/lib/projects";

const NOW = [
  { label: "Helion", detail: "Building an open-source FPGA toolchain in Rust.", hue: "#ff9f0a" },
  { label: "SHIELD Lab", detail: "Writing firmware for a sensor that lives inside a mouthguard.", hue: "#30d158" },
];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const hud = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);
  // clicking the name blows it apart; let the cells get going, then bring the projects up
  const toProjects = useCallback(() => {
    window.setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), reduce ? 0 : 650);
  }, [reduce]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-clip">
      {/* the word is drawn by the canvas; this is the same thing for everyone else */}
      <h1 className="sr-only">Hi, I&rsquo;m Saksham Srivastava.</h1>

      <motion.div aria-hidden className="absolute inset-0" style={reduce ? undefined : { scale: artScale, opacity: artOpacity }}>
        <Fabric text="SAKSHAM" centerY={0.44} hudRef={hud} onShatter={toProjects} className="h-full w-full" />
        {/* text sits on --name-top / --name-bottom, which the canvas publishes here */}
        <p className="t-lead absolute inset-x-0 text-center text-ink" style={{ top: "calc(var(--name-top, 30svh) - 2.6em)" }}>
          Hi, I&rsquo;m
        </p>
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <motion.div className="pointer-events-none absolute inset-0 px-5 text-center sm:px-8" style={reduce ? undefined : { opacity: textOpacity, y: textY }}>
        <Reveal now blur className="absolute inset-x-0 top-[max(5.5rem,11svh)] flex justify-center">
          <span className="glass inline-flex min-h-[36px] items-center gap-2.5 rounded-full px-4 text-[0.9375rem] font-medium text-ink">
            <span className="live-dot text-accent" />
            Open to new-grad roles · May 2027
          </span>
        </Reveal>

        <div className="pointer-events-auto absolute inset-x-5 sm:inset-x-8" style={{ top: "calc(var(--name-bottom, 54svh) + 2.6rem)" }}>
          <Reveal now delay={0.9}>
            <p className="t-lead mx-auto max-w-[36ch]">
              I&rsquo;m a computer engineering student at USF, and I build <strong>software that sits close to the hardware</strong>.
              Right now that&rsquo;s Helion, my own <strong>FPGA toolchain</strong>.
            </p>
          </Reveal>
          <Reveal now delay={1.02} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/projects" className="btn btn-primary">
              See my projects
            </Link>
            <Link href="/contact" className="btn btn-quiet">
              Get in touch
            </Link>
          </Reveal>
        </div>

        <p ref={hud} aria-hidden className="t-mono absolute inset-x-0 bottom-5 whitespace-pre text-center leading-relaxed text-muted max-sm:text-[0.6875rem]" />
      </motion.div>
    </section>
  );
}

function SectionHead({ title, lead }: { title: React.ReactNode; lead?: React.ReactNode }) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal blur>
        <h2 className="t-h2 max-w-[18ch]">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.08}>
          <p className="t-lead mt-5 max-w-[46ch]">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

const section = "mx-auto max-w-[1200px] px-5 sm:px-8 py-20 md:py-28";
const CHIP_HUES = ["#3ddc84", "#ffb224", "#38bdf8"];

/* A group of tools drawn as a chip: the group is the package, each tool is a pin. */
function Chip({ name, pins, hue }: { name: string; pins: string[]; hue: string }) {
  const half = Math.ceil(pins.length / 2);
  const side = (items: string[], right: boolean) => (
    <ul className="flex flex-col justify-around gap-1 py-3">
      {items.map((p) => (
        <li key={p} className={`flex min-h-9 items-center gap-2 text-[0.875rem] leading-tight [overflow-wrap:anywhere] ${right ? "" : "flex-row-reverse text-right"}`}>
          <span aria-hidden className="h-[3px] w-3.5 shrink-0 rounded-full" style={{ background: hue }} />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="card h-full p-5 sm:p-6">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-stretch">
        {side(pins.slice(0, half), false)}
        <div className="relative flex w-[6.75rem] items-center justify-center rounded-[14px] bg-raised px-2.5 text-center ring-1 ring-line">
          <span aria-hidden className="absolute left-2.5 top-2.5 h-2 w-2 rounded-full" style={{ background: hue }} />
          <h3 className="text-[1.0625rem] font-semibold leading-tight tracking-[-0.02em]">{name}</h3>
        </div>
        {side(pins.slice(half), true)}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />

      {/* ============ NUMBERS ============ */}
      <section className="mx-auto max-w-[1200px] px-5 pb-10 sm:px-8 md:pb-16">
        <Reveal>
          <Stats items={STATS} />
        </Reveal>
      </section>

      {/* ============ WORK ============ */}
      <section id="work" className={section}>
        <SectionHead
          title="My projects."
          lead="The four I’m proudest of. Each one has its own page on what it does, why I built it, and how it works."
        />
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {FEATURED.map((p, i) => {
            const wide = i === 0;
            return (
              <ScaleIn key={p.slug} className={wide || i === 3 ? "md:col-span-2" : ""}>
                <ProjectCard p={p} wide={wide || i === 3} />
              </ScaleIn>
            );
          })}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/projects" className="link text-[1.25rem]">
            See all my projects
          </Link>
        </Reveal>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className={section}>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <ScaleIn>
            <figure className="card aspect-[4/5] max-h-[640px] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/saksham.webp" alt="Saksham Srivastava on the Tampa riverwalk at night" loading="lazy" className="h-full w-full object-cover object-bottom" />
            </figure>
          </ScaleIn>
          <div>
            <Reveal blur>
              <h2 className="t-h2">About me.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="t-lead mt-6">
                I&rsquo;m Saksham. I study computer engineering at USF, graduate in <strong>May 2027</strong>, and do research in
                two labs on campus. I like understanding a system all the way down, from the chip up to the app, and then building
                my own version of it.
              </p>
            </Reveal>

            <Reveal delay={0.14} className="mt-9">
              <h3 className="text-[1.0625rem] font-semibold text-muted">What I&rsquo;m working on now</h3>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {NOW.map((n) => (
                  <li key={n.label} className="flex items-baseline gap-3 py-4">
                    <span className="live-dot translate-y-[-1px]" style={{ color: n.hue }} />
                    <p className="text-[1.125rem] leading-snug">
                      <span className="font-semibold">{n.label}.</span>
                      <span className="text-muted"> {n.detail}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2} className="mt-8">
              <Link href="/about" className="link text-[1.25rem]">
                More about me
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ TOOLKIT ============ */}
      <section id="stack" className={section}>
        <SectionHead title="Tools I use." />
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {STACK.map((grp, i) => (
            <Reveal key={grp.group} delay={i * 0.07} className="h-full">
              <Chip name={grp.group} pins={grp.items} hue={CHIP_HUES[i % CHIP_HUES.length]} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ GITHUB ============ */}
      <section id="github" className={section}>
        <SectionHead
          title="My GitHub."
          lead={
            <>
              Most of what I build is public. Here’s my past year of commits, and the repos I’d start with. Everything else is on{" "}
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="link link-ext">
                {PROFILE.githubHandle}
              </a>
            </>
          }
        />
        <Reveal>
          <Contributions />
        </Reveal>
        <Reveal className="mt-6">
          <Repos limit={6} />
        </Reveal>
      </section>

      <ContactBlock />
    </main>
  );
}
