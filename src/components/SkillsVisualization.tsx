"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SkillGroup {
  label: string;
  hint: string;
  items: string[];
}

// Straight from the resume — grouped, honest, no invented proficiency bars.
const groups: SkillGroup[] = [
  {
    label: "Languages",
    hint: "day-to-day",
    items: ["Python", "C / C++", "JavaScript", "TypeScript", "PHP", "SQL", "Bash", "HTML / CSS", "JSON"],
  },
  {
    label: "Web & Frameworks",
    hint: "full-stack",
    items: ["React", "Next.js", "Node.js", "REST APIs", "AWS", "CI/CD", "Git / GitHub"],
  },
  {
    label: "Machine Learning & Data",
    hint: "models & pipelines",
    items: ["PyTorch", "TensorFlow", "TensorFlow Lite", "OpenCV", "scikit-learn", "NumPy", "pandas", "SymPy", "Librosa"],
  },
  {
    label: "Systems & Embedded",
    hint: "close to the metal",
    items: ["Embedded Linux", "ARM", "Docker", "CUDA", "Raspberry Pi", "KVM / QEMU", "Linux"],
  },
  {
    label: "Databases & Practice",
    hint: "how I ship",
    items: ["MySQL", "SQLite", "Unit Testing", "OOP", "Data Structures & Algorithms", "Agile / Scrum", "Version Control"],
  },
];

export function SkillsVisualization() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="space-y-8">
      {groups.map((group, gi) => (
        <motion.div
          key={group.label}
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: gi * 0.12, duration: 0.5 }}
          className="border border-green-700/40 rounded-xl bg-black/45 backdrop-blur-md p-5"
        >
          <div className="flex items-baseline justify-between mb-4">
            {/* clean bold, not the MATRIX display font — its glyph set drops "&" and "/" */}
            <h3 className="text-lg font-bold text-green-300 tracking-wide">{group.label}</h3>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-green-500/50">
              {group.hint}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: gi * 0.12 + i * 0.035 + 0.15, duration: 0.3 }}
                className="group relative px-3 py-1.5 text-sm font-mono text-green-200 border border-green-700/40 rounded-md bg-green-500/[0.04] transition-all duration-200 hover:text-black hover:bg-green-400 hover:border-green-400 hover:shadow-[0_0_16px_rgba(0,255,100,0.4)] cursor-default"
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
