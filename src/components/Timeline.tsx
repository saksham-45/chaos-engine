"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface TimelineItem {
  title: string;
  organization: string;
  period: string;
  description: string[];
  type: 'education' | 'experience';
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Undergraduate Research Assistant',
    organization: 'USF Bellini College of AI',
    period: 'May 2026 – Present',
    description: [
      'Designed REST APIs and relational MySQL schemas serving on-demand course summaries and contextual help as JSON APIs for interactive mind-maps.',
      'Built full-stack AI Course Companion features in C++, PHP, JavaScript and HTML/CSS, integrating the Gemini API for automated content summarization.',
      'Shipped features via Git/GitHub code review and Agile; documented API behavior and test procedures for maintainability and handoff.',
    ],
    type: 'experience',
  },
  {
    title: 'Undergraduate Research Assistant',
    organization: 'USF Mathematics & Statistics',
    period: 'Apr 2025 – Mar 2026',
    description: [
      'Developed Python (NumPy, SymPy) algorithms replacing brute-force enumeration with efficient counting, letting graph-isomorphism analysis scale to arbitrary input sizes.',
      'Shipped a reproducible analysis pipeline with unit tests and Git version control for repeatable experiments.',
      'Modularized code and documented test cases to accelerate follow-on research.',
    ],
    type: 'experience',
  },
  {
    title: 'Open-Source Software Engineer',
    organization: 'Independent Contributor',
    period: 'Apr 2024 – Present',
    description: [
      'Authored and merged 21 pull requests into 12+ production repositories — 8 bug fixes, 3 security hardenings, 10 features — via GitHub review and CI/CD.',
      'Built an LMMS voice/text agent in C++ (OOP) that normalizes noisy speech into reliable DAW commands via regex normalization, intent mapping, and unit-tested core modules.',
      'Contributed container-security improvements and automated test integrations across Python libraries and voice agents.',
    ],
    type: 'experience',
  },
  {
    title: 'Founder & Lead Developer',
    organization: 'COVID-HELP · India',
    period: 'Feb 2021 – Aug 2023',
    description: [
      'Founded and led a real-time full-stack platform (HTML/CSS/JS, REST APIs, SQL) connecting 40,000+ users to live ICU-bed and oxygen availability during India’s second COVID wave.',
      'Led a volunteer engineering team using Agile and Git, sustaining ~99.9% uptime through extreme traffic spikes and coordinating incident response.',
      'Implemented monitoring, scaling and real-time data collection; documented operational runbooks for volunteers.',
    ],
    type: 'experience',
  },
  {
    title: 'B.S. Computer Engineering, Minor in Mathematics',
    organization: 'University of South Florida',
    period: 'Aug 2023 – May 2027',
    description: [
      'GPA 3.89 · Green & Gold Presidential Scholar.',
      'Coursework across systems, embedded software, algorithms, and applied mathematics.',
    ],
    type: 'education',
  },
];

export function Timeline() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="relative">
      {/* Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-700/50" />

      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 }}
            className="relative pl-20"
          >
            {/* Timeline dot */}
            <div className="absolute left-6 top-2">
              <motion.div
                className="w-4 h-4 rounded-full bg-green-400 border-2 border-black"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.3 }}
                style={{
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.8)',
                }}
              />
            </div>

            {/* Content card */}
            <motion.div
              className="border border-green-700/50 rounded-lg p-6 bg-black/55 backdrop-blur-md"
              whileHover={{ borderColor: '#00ff00', boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-green-200 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-green-400 font-mono text-sm">{item.organization}</p>
                </div>
                <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30 whitespace-nowrap">
                  {item.period}
                </span>
              </div>
              <ul className="space-y-2">
                {item.description.map((desc, i) => (
                  <li key={i} className="text-green-200 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-1">▸</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

