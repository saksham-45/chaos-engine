"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Reveal, ScaleIn, SPRING, spotlight } from "@/components/site/motion";
import { ProjectArt } from "@/components/site/ProjectArt";
import { CopyButton } from "@/components/site/Contact";
import { FlowScene } from "@/components/site/FlowScene";
import { FLAGSHIPS, getFlagship, PROFILE, type Flagship } from "@/lib/projects";
import type { ProcessedProject } from "@/types/github";
import { formatRelativeTime } from "@/lib/utils";

/* /projects/[slug]: a flagship renders its full write-up from
   @/lib/projects; any other slug falls back to the live GitHub repo. */

export default function ProjectDetailPage() {
  const params = useParams();
  const raw = params?.slug;
  const slug = Array.isArray(raw) ? raw[0] : raw ?? "";
  const flagship = getFlagship(slug);
  return flagship ? <ProjectDetail p={flagship} /> : <RepoDetail slug={slug} />;
}

function BackLink() {
  return (
    <Link href="/projects" className="inline-flex items-center gap-1 text-[1.0625rem] font-medium text-muted transition-colors hover:text-ink">
      <span aria-hidden>‹</span> All projects
    </Link>
  );
}

const wrap = "mx-auto max-w-[1200px] px-5 sm:px-8";

function Tile({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card p-6 sm:p-7 ${className}`}>
      <p className="t-mono uppercase tracking-[0.1em] text-muted">{label}</p>
      <div className="mt-2 text-[1.1875rem] font-medium leading-snug tracking-[-0.015em]">{children}</div>
    </div>
  );
}

/* ========================= FLAGSHIP ========================= */
function ProjectDetail({ p }: { p: Flagship }) {
  const idx = FLAGSHIPS.findIndex((f) => f.slug === p.slug);
  const next = FLAGSHIPS[(idx + 1) % FLAGSHIPS.length];
  const story = [
    { label: "What it is", text: p.what },
    { label: "Why I built it", text: p.why },
    { label: "How I built it", text: p.how },
  ].filter((r) => r.text);

  return (
    <main style={{ "--hue": p.hue } as React.CSSProperties}>
      {/* ============ TITLE ============ */}
      <section className={`${wrap} pt-32 text-center md:pt-40`}>
        <Reveal now>
          <BackLink />
        </Reveal>
        <Reveal now delay={0.05}>
          <p className="eyebrow mt-8">{p.tag}</p>
        </Reveal>
        <Reveal now blur delay={0.1}>
          <h1 className="t-hero mt-2">{p.name}</h1>
        </Reveal>
        <Reveal now delay={0.2}>
          <p className="t-lead mx-auto mt-6 max-w-[30ch]">{p.tagline}</p>
        </Reveal>
        {(p.demo || p.repo) && (
          <Reveal now delay={0.28} className="mt-8 flex flex-wrap justify-center gap-3">
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {p.demoLabel ?? "Live demo"} <span aria-hidden>↗</span>
              </a>
            )}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className={`btn ${p.demo ? "btn-quiet" : "btn-primary"}`}>
                Source <span aria-hidden>↗</span>
              </a>
            )}
            {p.repo && <CopyButton value={p.repo} label="Copy repo link" />}
          </Reveal>
        )}
      </section>

      {/* ============ THE VISUAL ============ */}
      <section className={`${wrap} mt-14 md:mt-20`}>
        <ScaleIn>
          <figure className={`card card-glow ${p.video ? "aspect-video" : p.imageCover ? "aspect-[4/5] sm:aspect-[16/9]" : p.image ? "" : "aspect-[4/3] sm:aspect-[16/9]"}`}>
            <div className={`relative z-[1] h-full ${p.image && !p.imageCover && !p.video ? "pt-4 sm:pt-10" : ""}`}>
              <ProjectArt p={p} />
            </div>
          </figure>
        </ScaleIn>
      </section>

      {/* ============ FACTS ============ */}
      <section className={`${wrap} mt-5 grid gap-5 md:mt-6 md:grid-cols-[1.4fr_1fr_1fr] md:gap-6`}>
        <Reveal className="h-full">
          <div className="card card-glow h-full p-6 sm:p-7">
            <p className="hue-text t-num relative z-[1] text-[clamp(3rem,6.4vw,5rem)] leading-none">{p.headline.value}</p>
            <p className="relative z-[1] mt-3 text-[1.0625rem] leading-snug text-muted">{p.headline.label}</p>
          </div>
        </Reveal>
        <Reveal delay={0.06} className="h-full">
          <Tile label="My role" className="h-full">
            {p.role}
          </Tile>
        </Reveal>
        <Reveal delay={0.12} className="h-full">
          <Tile label="When" className="h-full">
            {p.period}
          </Tile>
        </Reveal>
      </section>

      {/* ============ THE STORY ============ */}
      <section className={`${wrap} py-20 md:py-28`}>
        <div className="divide-y divide-line border-y border-line">
          {story.map((s) => (
            <div key={s.label} className="grid gap-3 py-10 md:grid-cols-[260px_1fr] md:gap-10 md:py-14">
              <Reveal>
                <h2 className="eyebrow md:sticky md:top-24">{s.label}</h2>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="max-w-[38ch] text-[clamp(1.3rem,2.3vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.022em] text-pretty">{s.text}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS, SCROLLED ============ */}
      {p.flow && <FlowScene title="From code to bitstream." steps={p.flow} />}

      {/* ============ HIGHLIGHTS ============ */}
      {p.highlights && (
        <section className={`${wrap} pb-20 md:pb-28 ${p.flow ? "pt-20 md:pt-28" : ""}`}>
          <Reveal blur>
            <h2 className="t-h2">What it can do.</h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {p.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={(i % 3) * 0.06} className="h-full">
                <div onPointerMove={spotlight} className="card card-glow h-full p-7 sm:p-8">
                  <h3 className="hue-text relative z-[1] text-[1.625rem] font-semibold leading-tight tracking-[-0.028em]">{h.title}</h3>
                  <p className="relative z-[1] mt-3 text-[1.125rem] leading-relaxed text-muted">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* ============ BENCHMARKS ============ */}
      {p.compare && (
        <section className={`${wrap} pb-20 md:pb-28`}>
          <Reveal blur>
            <h2 className="t-h2">Benchmarks.</h2>
          </Reveal>
          <div className="card mt-10 p-7 sm:p-10">
            <ul className="space-y-9">
              {p.compare.rows.map((r) => {
                const max = Math.max(r.mine, r.other);
                const bars = [
                  { name: p.name, v: r.mine, mine: true },
                  { name: r.otherName, v: r.other, mine: false },
                ];
                return (
                  <li key={r.label}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em]">{r.label}</h3>
                      <p className="hue-text t-num text-[1.5rem] leading-none">{(r.other / r.mine).toFixed(r.other / r.mine < 10 ? 1 : 0)}× faster</p>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {bars.map((b) => (
                        <div key={b.name} className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-3 text-[0.9375rem]">
                          <span className={`truncate ${b.mine ? "font-semibold text-ink" : "text-muted"}`}>{b.name}</span>
                          <div className="h-3 overflow-hidden rounded-full bg-ink/[0.07]">
                            {/* width is the real ratio; the bar grows in when it scrolls into view */}
                            <motion.div
                              className="h-full origin-left rounded-full"
                              style={{ width: `${Math.max(0.8, (b.v / max) * 100)}%`, background: b.mine ? "var(--hue)" : "var(--color-muted)" }}
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true, margin: "-10% 0px" }}
                              transition={{ ...SPRING, duration: 1.3 }}
                            />
                          </div>
                          <span className="t-num w-[4.5rem] text-right text-[1.0625rem]">
                            {b.v} {r.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-9 max-w-[70ch] border-t border-line pt-6 text-[1rem] leading-relaxed text-muted">{p.compare.note}</p>
          </div>
        </section>
      )}

      {/* ============ SPEC ============ */}
      <section className={`${wrap} pb-20 md:pb-28`}>
        <Reveal blur>
          <h2 className="t-h2">Technical details.</h2>
        </Reveal>
        <dl className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {p.spec.map((r, i) => (
            <Reveal key={r.label} delay={(i % 3) * 0.05} className="h-full">
              <div className="card h-full p-6 sm:p-7">
                <dt className="t-mono uppercase tracking-[0.1em] text-muted">{r.label}</dt>
                <dd className="mt-2 text-[1.1875rem] font-medium leading-snug tracking-[-0.015em]">{r.value}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
        <Reveal className="mt-8">
          <h3 className="t-mono uppercase tracking-[0.1em] text-muted">What I used</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ============ GALLERY, only for projects with real screenshots ============ */}
      {p.gallery && (
        <section className="pb-20 md:pb-28">
          <div className={wrap}>
            <Reveal blur>
              <h2 className="t-h2">Screenshots.</h2>
            </Reveal>
          </div>
          <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-8 xl:px-[max(2rem,calc((100vw-1200px)/2+2rem))]">
            {p.gallery.map((g) => (
              <li key={g.src} className={`shrink-0 snap-center ${p.galleryWide ? "w-[86vw] max-w-[880px]" : "w-[72vw] max-w-[340px]"}`}>
                <figure>
                  <div className="card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.src} alt={g.label} loading="lazy" className={p.galleryWide ? "block w-full" : "aspect-[3/4] w-full object-cover object-top"} />
                  </div>
                  <figcaption className="mt-3 px-1 text-[1rem] text-muted">{g.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ NEXT ============ */}
      <section className={`${wrap} pb-24 md:pb-32`}>
        <ScaleIn>
          <Link
            href={`/projects/${next.slug}`}
            onPointerMove={spotlight}
            style={{ "--hue": next.hue } as React.CSSProperties}
            className="card card-glow pressable group block p-8 text-center sm:p-14"
          >
            <p className="relative z-[1] text-[1.0625rem] font-medium text-muted">Next project</p>
            <p className="t-h1 relative z-[1] mt-2">{next.name}</p>
            <p className="t-lead relative z-[1] mx-auto mt-4 max-w-[32ch]">{next.tagline}</p>
            <span aria-hidden className="link relative z-[1] mt-6 text-[1.25rem]">
              Read more
            </span>
          </Link>
        </ScaleIn>
      </section>
    </main>
  );
}

/* ========================= GITHUB FALLBACK ========================= */
type FetchState = "loading" | "ok" | "notfound" | "error";

function RepoDetail({ slug }: { slug: string }) {
  const [repo, setRepo] = useState<ProcessedProject | null>(null);
  const [state, setState] = useState<FetchState>("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/github/repos");
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (!alive) return;
        const list: ProcessedProject[] = data.projects || [];
        const match = list.find((r) => r.slug === slug || r.name.toLowerCase() === slug.toLowerCase());
        setRepo(match ?? null);
        setState(match ? "ok" : "notfound");
      } catch {
        if (alive) setState("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <main className={`${wrap} min-h-[80svh] pb-24 pt-32 md:pt-40`}>
      <BackLink />

      {state === "loading" && <p className="t-lead mt-10 animate-pulse">Looking up {slug} on GitHub…</p>}

      {state === "error" && (
        <div className="mt-10">
          <h1 className="t-h2">The GitHub feed is unavailable right now.</h1>
          <p className="t-lead mt-5">
            You can browse everything directly at{" "}
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="link link-ext">
              {PROFILE.githubHandle}
            </a>
          </p>
        </div>
      )}

      {state === "notfound" && (
        <div className="mt-10">
          <h1 className="t-h2">There&rsquo;s no project called &ldquo;{slug}&rdquo;.</h1>
          <p className="t-lead mt-5 max-w-[40ch]">It may have been renamed or archived. All of my projects are on the projects page.</p>
          <Link href="/projects" className="btn btn-primary mt-8">
            See all projects
          </Link>
        </div>
      )}

      {state === "ok" && repo && (
        <div className="mt-8">
          <p className="eyebrow">GitHub repository</p>
          <h1 className="t-h1 mt-2 break-words">{repo.name}</h1>
          <p className="t-lead mt-6 max-w-[44ch]">{repo.description}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Tile label="Language">{repo.language || "—"}</Tile>
            <Tile label="Stars">{repo.stars}</Tile>
            <Tile label="Forks">{repo.forks}</Tile>
            <Tile label="Updated">{formatRelativeTime(repo.updatedAt)}</Tile>
          </div>
          {repo.topics.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {repo.topics.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          )}
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10">
            View on GitHub <span aria-hidden>↗</span>
          </a>
        </div>
      )}
    </main>
  );
}
