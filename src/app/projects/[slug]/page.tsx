"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlasmaBackground } from '@/components/PlasmaBackground';
import { ProcessedProject } from '@/types/github';
import { getLanguageColor, formatRelativeTime } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProcessedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch('/api/github/repos');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        const foundProject = data.projects?.find((p: ProcessedProject) => p.slug === slug);
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
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
        <PlasmaBackground />
        <main className="relative z-10 min-h-screen bg-black text-green-400 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin text-green-400 text-4xl mb-4">⟳</div>
            <p className="text-green-200">Loading project...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <PlasmaBackground />
        <main className="relative z-10 min-h-screen bg-black text-green-400 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Project not found'}</p>
            <Link
              href="/projects"
              className="px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded hover:bg-green-500/30 transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </main>
      </>
    );
  }

  const languageColor = getLanguageColor(project.language);
  const languageEntries = Object.entries(project.languages || {}).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PlasmaBackground />
      <main className="relative z-10 min-h-screen bg-black text-green-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-green-300/70">
            <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/projects" className="hover:text-green-400 transition-colors">Projects</Link>
            <span className="mx-2">/</span>
            <span className="text-green-400">{project.name}</span>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 matrix-font" style={{
                  textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
                }}>
                  {project.name}
                </h1>
                <p className="text-xl text-green-200 mb-4">{project.description}</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {project.language && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: languageColor }}
                  />
                  <span className="text-green-300 font-mono">{project.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-green-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{project.stars} stars</span>
              </div>
              <div className="flex items-center gap-1 text-green-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v1a1 1 0 11-2 0v-1A5 5 0 0011 9H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{project.forks} forks</span>
              </div>
              <span className="text-green-400/70 text-sm">
                Updated {formatRelativeTime(project.updatedAt)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 hover:border-green-400 transition-colors matrix-font"
              >
                View on GitHub →
              </motion.a>
              {project.homepage && (
                <motion.a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 hover:border-green-400 transition-colors matrix-font"
                >
                  Live Demo →
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Topics */}
          {project.topics.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 text-green-300 matrix-font">Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 text-sm font-mono"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Languages Breakdown */}
          {languageEntries.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 text-green-300 matrix-font">Language Breakdown</h2>
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
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-green-200 font-mono">{lang}</span>
                        </div>
                        <span className="text-green-400">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-black border border-green-700/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.4, duration: 1 }}
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 10px ${color}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Project Stats */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-green-300 matrix-font">Project Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-green-700/50 rounded-lg p-4 bg-black/40">
                <div className="text-3xl font-bold text-green-400 mb-1">{project.stars}</div>
                <div className="text-sm text-green-300">Stars</div>
              </div>
              <div className="border border-green-700/50 rounded-lg p-4 bg-black/40">
                <div className="text-3xl font-bold text-green-400 mb-1">{project.forks}</div>
                <div className="text-sm text-green-300">Forks</div>
              </div>
              <div className="border border-green-700/50 rounded-lg p-4 bg-black/40">
                <div className="text-3xl font-bold text-green-400 mb-1">{languageEntries.length}</div>
                <div className="text-sm text-green-300">Languages</div>
              </div>
              <div className="border border-green-700/50 rounded-lg p-4 bg-black/40">
                <div className="text-3xl font-bold text-green-400 mb-1">{project.topics.length}</div>
                <div className="text-sm text-green-300">Topics</div>
              </div>
            </div>
          </motion.section>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 hover:border-green-400 transition-colors matrix-font"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}

