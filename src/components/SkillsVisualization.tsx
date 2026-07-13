"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SkillGroup {
  label: string;
  hint: string;
  items: string[];
}

const groups: SkillGroup[] = [
  {
    label: "Languages",
    hint: "day-to-day",
    items: [
      "Python",
      "C / C++",
      "JavaScript",
      "TypeScript",
      "PHP",
      "SQL",
      "Bash",
      "HTML / CSS",
      "JSON",
    ],
  },
  {
    label: "Web & Frameworks",
    hint: "full-stack",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "AWS",
      "CI/CD",
      "Git / GitHub",
    ],
  },
  {
    label: "Machine Learning & Data",
    hint: "models & pipelines",
    items: [
      "PyTorch",
      "TensorFlow",
      "TensorFlow Lite",
      "OpenCV",
      "scikit-learn",
      "NumPy",
      "pandas",
      "SymPy",
      "Librosa",
    ],
  },
  {
    label: "Systems & Embedded",
    hint: "close to the metal",
    items: [
      "Embedded Linux",
      "ARM",
      "Docker",
      "CUDA",
      "Raspberry Pi",
      "KVM / QEMU",
      "Linux",
    ],
  },
  {
    label: "Databases & Practice",
    hint: "how I ship",
    items: [
      "MySQL",
      "SQLite",
      "Unit Testing",
      "OOP",
      "Data Structures & Algorithms",
      "Agile / Scrum",
      "Version Control",
    ],
  },
];

export function SkillsVisualization() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="space-y-6">
      {groups.map((group, gi) => (
        <motion.div
          key={group.label}
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: gi * 0.08, duration: 0.4 }}
          className="surface-card rounded-xl p-5"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--foreground)] tracking-tight">
              {group.label}
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)]">
              {group.hint}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: gi * 0.08 + i * 0.02 + 0.1, duration: 0.25 }}
                className="px-3 py-1.5 text-sm font-mono text-[var(--muted)] border border-white/[0.08] rounded-md bg-white/[0.02] transition-all duration-150 hover:text-[var(--background)] hover:bg-[var(--accent)] hover:border-[var(--accent)] cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
