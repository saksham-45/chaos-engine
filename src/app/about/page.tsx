"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlasmaBackground } from "@/components/PlasmaBackground";
import { SkillsVisualization } from "@/components/SkillsVisualization";
import { Timeline } from "@/components/Timeline";

const STATS = [
  { value: "40,000+", label: "users served in production" },
  { value: "3.89", label: "GPA · CompEng + Math" },
  { value: "21", label: "merged open-source PRs" },
  { value: "~30 ms", label: "per-frame on-device inference" },
];

const AboutPage = () => {
  return (
    <>
      <PlasmaBackground theme="azure" />
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-[var(--foreground)] min-h-screen">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <p className="label-mono mb-4">
            computer engineer · full-stack · embedded ml
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 text-white">
            Saksham Srivastava
          </h1>
          <p className="text-[var(--muted)] max-w-2xl leading-relaxed">
            Full-stack Computer Engineering student (B.S. &rsquo;27) who designs, codes, tests and ships —
            from on-device real-time ML to high-availability web platforms. I&rsquo;m happiest where math
            meets the machine, and I care about the parts users never see: the schema, the pipeline, the
            uptime.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm text-[var(--muted)] mt-5">
            <a href="mailto:saksham146053@gmail.com" className="hover:text-[var(--accent)] underline underline-offset-4 transition-colors">
              Email
            </a>
            <span className="text-white/20">•</span>
            <a
              href="https://linkedin.com/in/sakshamsriv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] underline underline-offset-4 transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-white/20">•</span>
            <a
              href="https://github.com/saksham-45"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] underline underline-offset-4 transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s) => (
            <div key={s.label} className="surface-card rounded-xl p-5 text-center">
              <div className="text-2xl md:text-3xl font-semibold text-[var(--accent)] mb-1 tracking-tight">
                {s.value}
              </div>
              <div className="text-[11px] text-[var(--muted)] leading-snug">{s.label}</div>
            </div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white tracking-tight border-b border-white/[0.08] pb-3">
            Experience
          </h2>
          <Timeline />
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white tracking-tight border-b border-white/[0.08] pb-3">
            Toolkit
          </h2>
          <SkillsVisualization />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[var(--muted)] mb-5">See it in the code, or say hello.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/projects" className="btn-primary">
              View Projects →
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get In Touch
            </Link>
          </div>
        </motion.section>
      </main>
    </>
  );
};

export default AboutPage;
