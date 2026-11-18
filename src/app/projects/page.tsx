"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SPRING, spotlight } from "@/components/site/motion";
import { ProjectCard } from "@/components/site/ProjectCard";
import { GitHubFeed } from "@/components/site/GitHubFeed";
import { Contributions } from "@/components/site/Contributions";
import { FLAGSHIPS, SELECTED, PROFILE, type Flagship } from "@/lib/projects";

type Filter = "All" | Flagship["discipline"];
const FILTERS: Filter[] = ["All", "FPGA", "Embedded", "Applied AI", "ML", "Music", "Graphics", "Systems"];

/* column spans for the smaller builds, on a 6-column grid */
const BENTO = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
];
const BENTO_HUES = ["#38bdf8", "#a78bfa", "#ff9f0a", "#bf5af2", "#30d158", "#2997ff", "#ff375f", "#64d2ff", "#ffd60a"];

const section = "mx-auto max-w-[1200px] px-5 sm:px-8 py-20 md:py-28";

export default function ProjectsPage() {
  const [active, setActive] = useState<Filter>("All");
  const shown = useMemo(() => (active === "All" ? FLAGSHIPS : FLAGSHIPS.filter((p) => p.discipline === active)), [active]);

  return (
    <main>
      {/* ============ HEADER ============ */}
      <section className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8 md:pt-44">
        <Reveal now blur>
          <h1 className="t-h1">My projects.</h1>
        </Reveal>
        <Reveal now delay={0.08}>
          <p className="t-lead mt-5 max-w-[44ch]">
            The main things I&rsquo;ve built. Each one has its own page on what it does, why I built it, and how it works.
          </p>
        </Reveal>

        {/* segmented filter: the pill slides to the chosen discipline */}
        <Reveal now delay={0.16} className="mt-10">
          <div
            role="group"
            aria-label="Filter projects by discipline"
            className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {FILTERS.map((f) => {
              const on = f === active;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActive(f)}
                  aria-pressed={on}
                  className={`relative min-h-[44px] shrink-0 rounded-full px-4 text-[1.0625rem] font-medium transition-colors ${on ? "text-bg" : "text-muted hover:text-ink"}`}
                >
                  {on && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ ...SPRING, duration: 0.5 }} />
                  )}
                  <span className="relative">{f}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-8 sm:px-8 md:pb-28">
        <p className="sr-only" aria-live="polite">
          Showing {shown.length} of {FLAGSHIPS.length} projects
        </p>
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => {
              // an odd count would leave the last card alone in its row, so the first one spans both
              const wide = i === 0 && shown.length % 2 === 1;
              return (
                <motion.div
                  key={p.slug}
                  className={wide ? "md:col-span-2" : ""}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ ...SPRING, duration: 0.6 }}
                >
                  <ProjectCard p={p} wide={wide} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ============ SMALLER BUILDS ============ */}
      <section className={section}>
        <Reveal blur>
          <h2 className="t-h2">Other things I&rsquo;ve built.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="t-lead mt-5 max-w-[46ch]">Smaller projects and experiments I’ve picked up along the way.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-6 md:gap-6">
          {SELECTED.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.06} className={BENTO[i % BENTO.length]}>
              <article
                onPointerMove={spotlight}
                style={
                  {
                    "--hue": BENTO_HUES[i % BENTO_HUES.length],
                  } as React.CSSProperties
                }
                className="card card-glow flex h-full flex-col p-7 sm:p-8"
              >
                {s.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image}
                    alt={`${s.name}, live site`}
                    loading="lazy"
                    className="relative z-[1] -mx-7 -mt-7 mb-6 block aspect-[21/9] w-[calc(100%+3.5rem)] max-w-none object-cover object-top sm:-mx-8 sm:-mt-8 sm:w-[calc(100%+4rem)]"
                  />
                )}
                <h3 className="relative z-[1] text-[1.5rem] font-semibold leading-tight tracking-[-0.025em]">{s.name}</h3>
                <p className="relative z-[1] mt-3 text-[1.0625rem] leading-relaxed text-muted">{s.blurb}</p>
                <ul className="relative z-[1] mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="relative z-[1] mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-7 text-[1.0625rem]">
                  {s.demo && (
                    <a href={s.demo} target="_blank" rel="noopener noreferrer" className="link link-ext">
                      Live site
                    </a>
                  )}
                  {s.repo && (
                    <a href={s.repo} target="_blank" rel="noopener noreferrer" className="link link-ext">
                      Source
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ GITHUB ============ */}
      <section className={section}>
        <Reveal blur>
          <h2 className="t-h2">My GitHub.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="t-lead mt-5">
            Most of what I build is public. This is my past year of work and my latest repositories, loaded live from{" "}
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="link link-ext">
              {PROFILE.githubHandle}
            </a>
          </p>
        </Reveal>
        <Reveal className="mt-12">
          <Contributions />
        </Reveal>
        <Reveal className="mt-6">
          <GitHubFeed limit={8} />
        </Reveal>
      </section>
    </main>
  );
}
