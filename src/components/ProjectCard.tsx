"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProcessedProject } from "@/types/github";
import { getLanguageColor, formatRelativeTime, truncate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: ProcessedProject;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const languageColor = getLanguageColor(project.language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      <div
        className="relative h-full rounded-xl p-6 surface-card overflow-hidden cursor-pointer transition-all duration-200 hover:border-[var(--accent-border)] hover:bg-[rgba(18,20,26,0.9)]"
        onClick={() => router.push(`/projects/${project.slug}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/projects/${project.slug}`);
          }
        }}
        role="link"
        tabIndex={0}
      >
        {project.language && (
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            <span className="text-xs text-[var(--muted)] font-mono">
              {project.language}
            </span>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)] tracking-tight">
          {project.name}
        </h3>

        <p className="text-[var(--muted)] mb-4 text-sm leading-relaxed">
          {truncate(project.description, 120)}
        </p>

        {project.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 text-[11px] font-mono text-[var(--muted)] rounded-md border border-white/[0.08] bg-white/[0.03]"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-4 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{project.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path
                fillRule="evenodd"
                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v1a1 1 0 11-2 0v-1A5 5 0 0011 9H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{project.forks}</span>
          </div>
          <span className="text-[var(--muted)]/80">
            {formatRelativeTime(project.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-white text-sm font-mono flex items-center gap-1 transition-colors"
          >
            GitHub
            <motion.svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 2 : 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </motion.svg>
          </Link>
          {project.homepage && (
            <Link
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--foreground)] text-sm font-mono transition-colors"
            >
              Live
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
