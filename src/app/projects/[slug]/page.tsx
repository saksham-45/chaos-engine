"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlasmaBackground } from "@/components/PlasmaBackground";
import { ProcessedProject } from "@/types/github";
import { getLanguageColor, formatRelativeTime } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProcessedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch("/api/github/repos");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        const foundProject = data.projects?.find(
          (p: ProcessedProject) => p.slug === slug
        );
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <PlasmaBackground theme="teal" />
        <main className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mb-4" />
            <p className="text-[var(--muted)]">Loading project...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <PlasmaBackground theme="teal" />
        <main className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || "Project not found"}</p>
            <Link href="/projects" className="btn-secondary">
              Back to Projects
            </Link>
          </div>
        </main>
      </>
    );
  }

  const languageColor = getLanguageColor(project.language);
  const languageEntries = Object.entries(project.languages || {}).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <>
      <PlasmaBackground theme="teal" />
      <main className="relative z-10 min-h-screen text-[var(--foreground)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <nav className="mb-8 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/projects" className="hover:text-[var(--accent)] transition-colors">
              Projects
            </Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-[var(--foreground)]">{project.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
              {project.name}
            </h1>
            <p className="text-lg text-[var(--muted)] mb-6">{project.description}</p>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-[var(--muted)]">
              {project.language && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: languageColor }}
                  />
                  <span className="font-mono">{project.language}</span>
                </div>
              )}
              <span>{project.stars} stars</span>
              <span>{project.forks} forks</span>
              <span>Updated {formatRelativeTime(project.updatedAt)}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View on GitHub →
              </a>
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Live Demo →
                </a>
              )}
            </div>
          </motion.div>

          {project.topics.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-12"
            >
              <h2 className="text-xl font-semibold mb-4 text-white">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 text-sm font-mono text-[var(--muted)] rounded-lg border border-white/[0.08] bg-white/[0.03]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {languageEntries.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-xl font-semibold mb-4 text-white">
                Language Breakdown
              </h2>
              <div className="space-y-3">
                {languageEntries.map(([lang, bytes]) => {
                  const totalBytes = languageEntries.reduce((sum, [, b]) => sum + b, 0);
                  const percentage = (bytes / totalBytes) * 100;
                  const color = getLanguageColor(lang);
                  return (
                    <div key={lang} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[var(--muted)] font-mono">{lang}</span>
                        </div>
                        <span className="text-[var(--accent)]">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">
              Project Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: project.stars, label: "Stars" },
                { value: project.forks, label: "Forks" },
                { value: languageEntries.length, label: "Languages" },
                { value: project.topics.length, label: "Topics" },
              ].map((s) => (
                <div key={s.label} className="surface-card rounded-xl p-4">
                  <div className="text-2xl font-semibold text-[var(--accent)] mb-1">
                    {s.value}
                  </div>
                  <div className="text-sm text-[var(--muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Projects
          </Link>
        </div>
      </main>
    </>
  );
}
