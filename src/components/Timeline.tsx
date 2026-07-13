"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface TimelineItem {
  title: string;
  organization: string;
  period: string;
  description: string[];
  type: "education" | "experience";
}

const timelineItems: TimelineItem[] = [
  {
    title: "Undergraduate Research Assistant",
    organization: "USF Bellini College of AI",
    period: "May 2026 – Present",
    description: [
      "Designed REST APIs and relational MySQL schemas serving on-demand course summaries and contextual help as JSON APIs for interactive mind-maps.",
      "Built full-stack AI Course Companion features in C++, PHP, JavaScript and HTML/CSS, integrating the Gemini API for automated content summarization.",
      "Shipped features via Git/GitHub code review and Agile; documented API behavior and test procedures for maintainability and handoff.",
    ],
    type: "experience",
  },
  {
    title: "Undergraduate Research Assistant",
    organization: "USF Mathematics & Statistics",
    period: "Apr 2025 – Mar 2026",
    description: [
      "Developed Python (NumPy, SymPy) algorithms replacing brute-force enumeration with efficient counting, letting graph-isomorphism analysis scale to arbitrary input sizes.",
      "Shipped a reproducible analysis pipeline with unit tests and Git version control for repeatable experiments.",
      "Modularized code and documented test cases to accelerate follow-on research.",
    ],
    type: "experience",
  },
  {
    title: "Open-Source Software Engineer",
    organization: "Independent Contributor",
    period: "Apr 2024 – Present",
    description: [
      "Authored and merged 21 pull requests into 12+ production repositories — 8 bug fixes, 3 security hardenings, 10 features — via GitHub review and CI/CD.",
      "Built an LMMS voice/text agent in C++ (OOP) that normalizes noisy speech into reliable DAW commands via regex normalization, intent mapping, and unit-tested core modules.",
      "Contributed container-security improvements and automated test integrations across Python libraries and voice agents.",
    ],
    type: "experience",
  },
  {
    title: "Founder & Lead Developer",
    organization: "COVID-HELP · India",
    period: "Feb 2021 – Aug 2023",
    description: [
      "Founded and led a real-time full-stack platform (HTML/CSS/JS, REST APIs, SQL) connecting 40,000+ users to live ICU-bed and oxygen availability during India’s second COVID wave.",
      "Led a volunteer engineering team using Agile and Git, sustaining ~99.9% uptime through extreme traffic spikes and coordinating incident response.",
      "Implemented monitoring, scaling and real-time data collection; documented operational runbooks for volunteers.",
    ],
    type: "experience",
  },
  {
    title: "B.S. Computer Engineering, Minor in Mathematics",
    organization: "University of South Florida",
    period: "Aug 2023 – May 2027",
    description: [
      "GPA 3.89 · Green & Gold Presidential Scholar.",
      "Coursework across systems, embedded software, algorithms, and applied mathematics.",
    ],
    type: "education",
  },
];

export function Timeline() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08]" />

      <div className="space-y-10">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -24 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className="relative pl-20"
          >
            <div className="absolute left-6 top-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] border-2 border-[var(--background)] shadow-[0_0_0_3px_rgba(61,214,198,0.15)]" />
            </div>

            <div className="surface-card rounded-xl p-6 transition-colors hover:border-[var(--accent-border)]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[var(--accent)] font-mono text-sm">
                    {item.organization}
                  </p>
                </div>
                <span className="self-start px-2.5 py-1 text-[11px] font-mono text-[var(--muted)] rounded-md border border-white/[0.08] bg-white/[0.03] whitespace-nowrap">
                  {item.period}
                </span>
              </div>
              <ul className="space-y-2">
                {item.description.map((desc, i) => (
                  <li
                    key={i}
                    className="text-[var(--muted)] text-sm flex items-start gap-2 leading-relaxed"
                  >
                    <span className="text-[var(--accent)] mt-1.5 shrink-0 text-[10px]">
                      ●
                    </span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
