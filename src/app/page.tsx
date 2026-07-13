"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NeuralEarth, type EarthMode, type StoryBeat } from "@/components/NeuralEarth";
import { useTypingEffect } from "@/hooks/useTypingEffect";

const STORY: StoryBeat[] = [
  { t: "That planet was 25,000 particles", d: "Continents sampled from satellite data. Tectonic plates from spherical Voronoi. A molten core underneath. All placed by code." },
  { t: "And you just shattered it", d: "A shockwave rippled node-to-node from the exact point you clicked. I can't help building details like that." },
  { t: "I'm Saksham", d: "Computer Engineering @ USF, Math minor, 3.89 GPA, Presidential Scholar. Full-stack by habit, embedded by curiosity." },
  { t: "I've shipped to 40,000+ people", d: "During India's second COVID wave I founded a platform routing 40K+ users to live ICU beds and oxygen — at ~99.9% uptime." },
  { t: "And squeezed ML onto a $35 board", d: "MoodScope reads emotion from a face at ~30 ms/frame, entirely on a Raspberry Pi — no data ever leaves the device." },
  { t: "Math isn't decoration here", d: "Lorenz attractors, Fourier series, rose curves — there's a hidden page where I animate them all from raw equations. Go find the Lab." },
  { t: "Proof over promises", d: "21 merged open-source PRs. A live GitHub feed on the projects page. No templates — every pixel of this site is hand-written." },
  { t: "Let's build something", d: "If any of this made you curious, the work is one click away — and so am I." },
];

export default function Home() {
  const [mode, setMode] = useState<EarthMode>("globe");
  const nameText = "Saksham Srivastava";
  const { displayedText: displayedName, isTyping: isTypingName } = useTypingEffect(nameText, 90);

  const heroHidden = mode !== "globe";

  return (
    <>
      <NeuralEarth story={STORY} ctaHref="/projects" ctaLabel="See my work →" onModeChange={setMode} />

      <main
        className={`relative z-10 min-h-screen flex flex-col items-center justify-between text-[var(--foreground)] px-4 transition-opacity duration-700 ${
          heroHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div
          className="fixed inset-0 pointer-events-none -z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 60% 42% at 50% 48%, rgba(10,11,13,0.72) 0%, rgba(10,11,13,0.35) 55%, rgba(10,11,13,0) 100%)",
          }}
        />
        <div className="h-24" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl select-none"
        >
          <p className="label-mono mb-5">
            computer engineering · math · usf
          </p>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-5 text-white">
            {displayedName}
            {isTypingName && (
              <span className="animate-pulse text-[var(--accent)] font-light">|</span>
            )}
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Computer engineer building where math meets the machine — from
            on-device ML to full-stack platforms that have served 40,000+ users.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/projects" className="btn-primary">
                View Projects →
              </Link>
              <Link href="/about" className="btn-secondary">
                About
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-5 text-xs font-mono text-[var(--muted)]">
              <a
                href="https://github.com/saksham-45"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                github
              </a>
              <span className="text-white/15">/</span>
              <a
                href="https://linkedin.com/in/sakshamsriv"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                linkedin
              </a>
              <span className="text-white/15">/</span>
              <Link href="/mystery" className="hover:text-[var(--accent)] transition-colors">
                lab
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="pb-8 font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]/60"
        >
          drag to spin · click the planet
        </motion.p>
      </main>
    </>
  );
}
