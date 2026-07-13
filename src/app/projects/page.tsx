"use client";

import React, { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { PlasmaBackground } from "@/components/PlasmaBackground";
import { ProcessedProject } from "@/types/github";
import { motion } from "framer-motion";

interface Featured {
  name: string;
  tagline: string;
  role: string;
  period: string;
  blurb: string;
  highlights: string[];
  stack: string[];
  href?: string;
}

const FEATURED: Featured[] = [
  {
    name: "MoodScope",
    tagline: "Real-time emotion recognition on the edge",
    role: "Software Lead",
    period: "Embedded ML",
    blurb:
      "A CNN that reads emotion from a face at ~30 ms/frame — running entirely on a Raspberry Pi 4, with no data ever leaving the device.",
    highlights: [
      "TensorFlow Lite INT8 quantization → ~30 ms/frame on embedded Linux",
      "Local Llama 3.2 for on-device insights — privacy-preserving by design",
      "Custom 3D-printed enclosure; documented for reproducible builds",
    ],
    stack: ["TensorFlow Lite", "CNN", "Llama 3.2", "Raspberry Pi 4", "Embedded Linux", "Python"],
  },
  {
    name: "AutoMix",
    tagline: "An AI DJ that mixes like a human",
    role: "Software Engineering",
    period: "Applied ML research",
    blurb:
      "Decision networks + an LSTM that automate DJ transitions across 17 blend strategies, choosing cut points that dodge vocal clashes.",
    highlights: [
      "PyTorch decision network + LSTM across 17 blend strategies",
      "Scored 100+ audio features (Camelot key, beat phase, spectral masking)",
      "Monte Carlo search picks cut points that avoid vocal collisions",
    ],
    stack: ["PyTorch", "LSTM", "Librosa", "scikit-learn", "Monte Carlo", "Signal Processing"],
  },
  {
    name: "COVID-HELP",
    tagline: "40,000+ people to live ICU beds & oxygen",
    role: "Founder & Lead Developer",
    period: "2021 – 2023",
    blurb:
      "A real-time platform I founded during India's second COVID wave — connecting tens of thousands to live ICU-bed and oxygen availability at ~99.9% uptime.",
    highlights: [
      "40,000+ users on a real-time full-stack platform (REST APIs, SQL)",
      "~99.9% uptime through extreme, unpredictable traffic spikes",
      "Led a volunteer eng team on Agile; wrote the operational runbooks",
    ],
    stack: ["JavaScript", "REST APIs", "SQL", "Monitoring", "Incident Response"],
  },
];

function FeaturedCard({ p, index }: { p: Featured; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative surface-card rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-[var(--accent-border)]"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[var(--accent)]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent)] border border-[var(--accent-border)] rounded px-2 py-0.5">
          {p.role}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)]">
          {p.period}
        </span>
      </div>

      <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1">
        {p.name}
      </h3>
      <p className="text-[var(--accent)]/90 text-sm mb-4">{p.tagline}</p>
      <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">{p.blurb}</p>

      <ul className="space-y-2 mb-5">
        {p.highlights.map((h) => (
          <li key={h} className="text-[var(--muted)] text-sm flex items-start gap-2">
            <span className="text-[var(--accent)] mt-0.5 shrink-0">▹</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span
            key={s}
            className="text-[11px] font-mono text-[var(--muted)] border border-white/[0.08] rounded px-2 py-0.5 bg-white/[0.03]"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProcessedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/github/repos");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <>
      <PlasmaBackground theme="teal" />
      <main className="relative z-10 min-h-screen text-[var(--foreground)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="label-mono mb-4">things i&rsquo;ve actually shipped</p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 text-white">
              Projects
            </h1>
            <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Three I&rsquo;m proud of up top — then everything I&rsquo;ve pushed, pulled live from GitHub.
            </p>
          </motion.div>

          <section className="mb-20">
            <h2 className="text-sm font-mono uppercase tracking-[0.25em] text-[var(--muted)] mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-white/15" /> Featured
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {FEATURED.map((p, i) => (
                <FeaturedCard key={p.name} p={p} index={i} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.25em] text-[var(--muted)] mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-white/15" /> Live from GitHub
              {!loading && !error && (
                <span className="text-[var(--muted)]/70 normal-case tracking-normal">
                  · {projects.length} {projects.length === 1 ? "repo" : "repos"}
                </span>
              )}
            </h2>

            {loading && (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                <p className="mt-4 text-[var(--muted)]">Pulling repos from GitHub…</p>
              </div>
            )}

            {error && (
              <div className="text-center py-16">
                <p className="text-red-400 mb-4">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}

            {!loading && !error && projects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[var(--muted)]">No public repos to show right now.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
