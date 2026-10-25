"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  SectionPlate,
  Stamp,
  StampButton,
  SpecTable,
  ProjectStage,
  CopyLinkButton,
  DiagonalBar,
  BlackSquareAnchor,
} from "@/components/kb";
import { FLAGSHIPS, getFlagship, type Flagship } from "@/lib/projects";
import type { ProcessedProject } from "@/types/github";
import { formatRelativeTime } from "@/lib/utils";

/* =========================================================================
   /projects/[slug] - one project as a full detail page.
   Flagships (moodscope / automix / covid-help) render the full dossier from
   @/lib/projects; any other slug falls back to the live GitHub repo feed.
   ========================================================================= */

export default function ProjectDetailPage() {
  const params = useParams();
  const raw = params?.slug;
  const slug = Array.isArray(raw) ? raw[0] : raw ?? "";
  const flagship = getFlagship(slug);

  if (flagship) return <ProjectDetail p={flagship} />;
  return <RepoDetail slug={slug} />;
}

/* ---------- shared breadcrumb (mono, on bone) ---------- */
function Breadcrumb({ name }: { name: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-mono text-[0.78rem] tracking-[0.14em] uppercase text-[var(--color-ink)]/60 flex flex-wrap items-center gap-2"
    >
      <Link
        href="/"
        className="text-[var(--color-oxide-dark)] hover:underline underline-offset-4"
      >
        Home
      </Link>
      <span aria-hidden className="text-[var(--color-ink)]/35">
        /
      </span>
      <Link
        href="/projects"
        className="text-[var(--color-oxide-dark)] hover:underline underline-offset-4"
      >
        Projects
      </Link>
      <span aria-hidden className="text-[var(--color-ink)]/35">
        /
      </span>
      <span className="text-[var(--color-ink)]">{name}</span>
    </nav>
  );
}

/* ========================= FLAGSHIP DETAIL ========================= */
function ProjectDetail({ p }: { p: Flagship }) {
  const idx = FLAGSHIPS.findIndex((f) => f.slug === p.slug);
  const n = FLAGSHIPS.length;
  const prev = FLAGSHIPS[(idx - 1 + n) % n];
  const next = FLAGSHIPS[(idx + 1) % n];

  return (
    <main className="pt-14">
      {/* breadcrumb band */}
      <section className="bg-[var(--color-bone)]">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-10">
          <Breadcrumb name={p.name} />
        </div>
      </section>

      {/* ============ HEADER ============ */}
      <section className="relative bg-[var(--color-bone)] overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-14 md:py-20">
          {/* plate tab row */}
          <div className="flex items-center gap-3 mb-7 flex-wrap">
            <span className="font-mono text-[0.8rem] tracking-[0.2em] px-2 py-1 bg-[var(--color-ink)] text-[var(--color-bone)]">
              {p.no}
            </span>
            <span className="font-mono text-[0.8rem] tracking-[0.22em] uppercase text-[var(--color-oxide-dark)]">
              {p.tag}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-start">
            {/* copy column (order-2 on mobile so art stacks above) */}
            <div className="order-2 lg:order-1 relative">
              <DiagonalBar className="-left-12 top-4 hidden lg:block" length={190} thickness={24} />
              <h1 className="display-hero text-[clamp(2.6rem,7vw,5.5rem)] text-[var(--color-ink)] leading-[0.95]">
                {p.name}
              </h1>

              <div className="mt-6 flex items-start gap-3">
                <span aria-hidden className="mt-1.5 w-3 h-3 shrink-0 bg-[var(--color-oxide)]" />
                <div>
                  <p className="font-mono text-[0.85rem] uppercase tracking-[0.12em] text-[var(--color-ink)]/70 leading-relaxed">
                    {p.role} · {p.period}
                  </p>
                  <p className="mt-2 text-[1.25rem] leading-snug text-[var(--color-ink)]">
                    {p.tagline}
                  </p>
                </div>
              </div>

              {/* headline metric */}
              <div className="mt-8 bg-[var(--color-ink)] text-[var(--color-bone)] px-5 py-4 max-w-full">
                <div className="display-plate text-[clamp(1.8rem,8vw,3rem)] leading-none break-words">
                  {p.headline.value}
                </div>
                <div className="mt-2 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-[var(--color-bone)]/70 leading-snug">
                  {p.headline.label}
                </div>
              </div>

              <div className="mt-8 max-w-2xl space-y-4 text-[1.25rem] leading-relaxed text-[var(--color-ink)]">
                <p><span className="font-mono text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">What </span>{p.what}</p>
                <p><span className="font-mono text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">Why </span>{p.why}</p>
                <p><span className="font-mono text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-oxide-dark)]">How </span>{p.how}</p>
              </div>

              {/* stack chip row */}
              <div className="mt-8">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-oxide-dark)] block mb-3">
                  Stack
                </span>
                <ul className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[0.82rem] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-concrete)] text-[var(--color-ink)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* real links */}
              {(p.demo || p.repo) && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {p.demo && (
                    <StampButton href={p.demo} variant="primary" external>
                      {p.demoLabel ?? "Live demo"} ↗
                    </StampButton>
                  )}
                  {p.repo && (
                    <StampButton href={p.repo} variant="secondary" external>
                      Source ↗
                    </StampButton>
                  )}
                  {p.repo && <CopyLinkButton url={p.repo} label="Copy repo link" />}
                </div>
              )}
            </div>

            {/* live demo, screenshot, or architecture */}
            <div className="order-1 lg:order-2 relative">
              <Stamp>
                <ProjectStage
                  p={p}
                  minH="min-h-[340px] md:min-h-[420px]"
                  ratio="4 / 3"
                  className="w-full"
                />
              </Stamp>
              <BlackSquareAnchor
                size={40}
                className="absolute -bottom-4 -right-4 hidden md:block"
                color="var(--color-ink)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPECIFICATION + RESPONSIBILITIES ============ */}
      <SectionPlate
        ground="concrete"
        plateNo={p.no}
        title="Specification"
        texture
        wide
      >
        <div className="max-w-3xl">
          <Stamp>
            <SpecTable rows={p.spec} caption="SPECIFICATION" />
          </Stamp>

        </div>
      </SectionPlate>

      {/* ============ GALLERY, only if this project has real screenshots ============ */}
      {p.gallery && (
        <SectionPlate ground="bone" title="Screenshots" wide>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {p.gallery.map((g) => (
              <figure key={g.src} className="border border-[var(--color-rule)] bg-[var(--color-concrete)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.label} className="w-full aspect-[3/4] object-cover object-top" />
                <figcaption className="px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink)]/70">
                  {g.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </SectionPlate>
      )}

      {/* ============ PREV / NEXT NAV ============ */}
      <SectionPlate
        ground="bone"
        title="More projects"
        wide
      >
        <div className="grid gap-6 md:grid-cols-2">
          <PlateNavCard dir="prev" p={prev} />
          <PlateNavCard dir="next" p={next} />
        </div>
        <div className="mt-10">
          <StampButton href="/projects" variant="secondary">
            ← Back to all projects
          </StampButton>
        </div>
      </SectionPlate>
    </main>
  );
}

function PlateNavCard({ dir, p }: { dir: "prev" | "next"; p: Flagship }) {
  const isPrev = dir === "prev";
  return (
    <Link
      href={`/projects/${p.slug}`}
      className={`group kb-plate kb-plate-hover bg-[var(--color-bone)] text-[var(--color-ink)] block px-6 py-6 ${
        isPrev ? "text-left" : "md:text-right"
      }`}
    >
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-oxide-dark)] block">
        {isPrev ? "← Previous" : "Next →"}
      </span>
      <span className="font-mono text-[0.78rem] tracking-[0.14em] text-[var(--color-ink)]/55 block mt-3">
        {p.tag}
      </span>
      <span className="display-plate text-[clamp(1.75rem,4vw,2.75rem)] block mt-1 leading-none">
        {p.name}
      </span>
      <span className="text-[1.125rem] leading-relaxed text-[var(--color-ink)]/80 block mt-3">
        {p.tagline}
      </span>
    </Link>
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
        const match = list.find(
          (r) => r.slug === slug || r.name.toLowerCase() === slug.toLowerCase()
        );
        if (match) {
          setRepo(match);
          setState("ok");
        } else {
          setState("notfound");
        }
      } catch {
        if (alive) setState("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <main className="pt-14">
      {/* breadcrumb band */}
      <section className="bg-[var(--color-bone)]">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-10">
          <Breadcrumb name={repo?.name ?? slug} />
        </div>
      </section>

      {state !== "ok" && <RepoMessage state={state} slug={slug} />}

      {state === "ok" && repo && (
        <section className="relative bg-[var(--color-bone)] overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-14 md:py-20">
            <div className="flex items-center gap-3 mb-7 flex-wrap">
              <span className="font-mono text-[0.8rem] tracking-[0.2em] px-2 py-1 bg-[var(--color-ink)] text-[var(--color-bone)]">
                REPO
              </span>
              <span className="font-mono text-[0.8rem] tracking-[0.22em] uppercase text-[var(--color-oxide-dark)]">
                Cross-reference · github.com/saksham-45
              </span>
            </div>

            <div className="relative">
              <DiagonalBar className="-left-12 top-4 hidden lg:block" length={180} thickness={22} />
              <h1 className="display-hero text-[clamp(2.4rem,7vw,5rem)] text-[var(--color-ink)] leading-[0.95] break-words">
                {repo.name}
              </h1>
            </div>

            <p className="mt-7 max-w-2xl text-[1.25rem] leading-relaxed text-[var(--color-ink)]">
              {repo.description}
            </p>

            <div className="mt-9 max-w-2xl">
              <SpecTable
                caption="REPOSITORY"
                rows={[
                  { label: "Language", value: repo.language || "-" },
                  { label: "Stars", value: <span className="tabular-nums">{repo.stars}</span> },
                  { label: "Forks", value: <span className="tabular-nums">{repo.forks}</span> },
                  { label: "Updated", value: formatRelativeTime(repo.updatedAt) },
                ]}
              />
            </div>

            {repo.topics.length > 0 && (
              <div className="mt-8">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-oxide-dark)] block mb-3">
                  Topics
                </span>
                <ul className="flex flex-wrap gap-2">
                  {repo.topics.map((t) => (
                    <li
                      key={t}
                      className="font-mono text-[0.82rem] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-concrete)] text-[var(--color-ink)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <StampButton href={repo.url} variant="primary" external>
                View on GitHub →
              </StampButton>
              <StampButton href="/projects" variant="secondary">
                ← Back to all projects
              </StampButton>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function RepoMessage({ state, slug }: { state: Exclude<FetchState, "ok">; slug: string }) {
  return (
    <section className="bg-[var(--color-bone)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="border-2 border-[var(--color-ink)] bg-[var(--color-charcoal)] text-[var(--color-bone)] px-6 py-10">
          {state === "loading" && (
            <p className="font-mono text-[0.9rem] text-[var(--color-bone)]/75">
              <span className="inline-block h-3 w-3 border-2 border-[var(--color-cyan)] border-t-transparent animate-spin mr-3 align-middle" />
              pulling <span className="text-[var(--color-cyan)]">{slug}</span> from
              github.com/saksham-45 …
            </p>
          )}

          {state === "error" && (
            <div className="font-mono text-[0.9rem] text-[var(--color-bone)]/80 space-y-4">
              <p>
                <span className="text-[var(--color-cyan)]">ERR ·</span> the live repository feed is
                unavailable right now.
              </p>
              <p>
                Browse the source directly at{" "}
                <a
                  href="https://github.com/saksham-45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-cyan)] underline underline-offset-4"
                >
                  github.com/saksham-45
                </a>
                .
              </p>
              <div className="pt-2">
                <StampButton href="/projects" variant="ghost">
                  ← Back to all projects
                </StampButton>
              </div>
            </div>
          )}

          {state === "notfound" && (
            <div className="font-mono text-[0.9rem] text-[var(--color-bone)]/80 space-y-4">
              <p>
                <span className="text-[var(--color-cyan)]">404 ·</span> no plate or repository filed
                under <span className="text-[var(--color-cyan)]">{slug}</span>.
              </p>
              <p className="text-[var(--color-bone)]/60">
                It may have been renamed or archived. The flagship plates and the live repo
                index are on the Projects page.
              </p>
              <div className="pt-2">
                <StampButton href="/projects" variant="ghost">
                  ← Back to all projects
                </StampButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
