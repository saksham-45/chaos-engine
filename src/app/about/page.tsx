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
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-green-400 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-green-400/60 mb-4">
            computer engineer · full-stack · embedded ml
          </p>
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-4 text-green-100 matrix-font"
            style={{ textShadow: "0 0 24px rgba(0,255,100,0.35)" }}
          >
            Saksham Srivastava
          </h1>
          <p className="text-green-100/70 max-w-2xl leading-relaxed">
            Full-stack Computer Engineering student (B.S. &rsquo;27) who designs, codes, tests and ships —
            from on-device real-time ML to high-availability web platforms. I&rsquo;m happiest where math
            meets the machine, and I care about the parts users never see: the schema, the pipeline, the
            uptime.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm text-green-300 mt-5">
            <a href="mailto:saksham146053@gmail.com" className="hover:text-green-200 underline transition-colors">Email</a>
            <span className="text-green-700">•</span>
            <a href="https://linkedin.com/in/sakshamsriv" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 underline transition-colors">LinkedIn</a>
            <span className="text-green-700">•</span>
            <a href="https://github.com/saksham-45" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 underline transition-colors">GitHub</a>
          </div>
        </motion.header>

        {/* Impact stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="border border-green-700/40 rounded-xl bg-black/45 backdrop-blur-md p-5 text-center"
            >
              <div
                className="text-2xl md:text-3xl font-bold text-green-300 matrix-font mb-1"
                style={{ textShadow: "0 0 14px rgba(0,255,100,0.4)" }}
              >
                {s.value}
              </div>
              <div className="text-[11px] text-green-200/60 leading-snug">{s.label}</div>
            </div>
          ))}
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-200 matrix-font border-b border-green-800/50 pb-3">
            Experience
          </h2>
          <Timeline />
        </motion.section>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-200 matrix-font border-b border-green-800/50 pb-3">
            Toolkit
          </h2>
          <SkillsVisualization />
        </motion.section>

        {/* Quick links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-green-200/70 mb-5">See it in the code, or say hello.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/projects"
              className="px-7 py-3 rounded-full bg-green-400 text-black font-semibold transition-all hover:bg-green-300 hover:shadow-[0_0_24px_rgba(0,255,100,0.45)]"
            >
              View Projects →
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full border border-green-400/30 text-green-100/90 transition-all hover:border-green-400/70 hover:text-white"
            >
              Get In Touch
            </Link>
          </div>
        </motion.section>
      </main>
    </>
  );
};

export default AboutPage;
