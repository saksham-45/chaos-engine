"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NeuralEarth, type EarthMode, type StoryBeat } from "@/components/NeuralEarth";
import { useTypingEffect } from "@/hooks/useTypingEffect";

// The 8 beats revealed after the globe shatters — my story, one card at a time.
const STORY: StoryBeat[] = [
  { t: "That planet was 25,000 particles", d: "Continents sampled from satellite data. Tectonic plates from spherical Voronoi. A molten core underneath. All placed by code." },
  { t: "And you just shattered it", d: "A shockwave rippled node-to-node from the exact point you clicked. I can't help building details like that." },
  { t: "I'm Saksham", d: "Computer Engineering @ USF, Math minor, 3.89 GPA, Presidential Scholar. Full-stack by habit, embedded by curiosity." },
  { t: "I've shipped to 40,000+ people", d: "During India's second COVID wave I founded a platform routing 40K+ users to live ICU beds and oxygen — at ~99.9% uptime." },
  { t: "And squeezed ML onto a $35 board", d: "MoodScope reads emotion from a face at ~30 ms/frame, entirely on a Raspberry Pi — no data ever leaves the device." },
  { t: "Math isn't decoration here", d: "Lorenz attractors, Fourier series, rose curves — there's a hidden page where I animate them all from raw equations. Go find the ???." },
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
        className={`relative z-10 min-h-screen flex flex-col items-center justify-between text-white px-4 transition-opacity duration-700 ${
          heroHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Soft vignette so the hero copy stays readable over the planet */}
        <div
          className="fixed inset-0 pointer-events-none -z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 60% 42% at 50% 48%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Top spacer (nav lives above) */}
        <div className="h-24" />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl select-none"
        >
          <p className="font-mono text-[11px] md:text-xs tracking-[0.35em] uppercase text-green-400/70 mb-5">
            computer engineering · math · usf
          </p>

          <h1 className="matrix-font text-5xl md:text-7xl mb-5 text-green-50" style={{ textShadow: "0 0 24px rgba(0,255,100,0.35)" }}>
            {displayedName}
            {isTypingName && <span className="animate-pulse text-green-400">|</span>}
          </h1>

          <p className="text-base md:text-lg text-green-100/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Computer engineer building where math meets the machine — from
            on-device ML to full-stack platforms that have served 40,000+ users.
          </p>

          {/* Actions — one primary, two quiet, socials as a whisper */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="px-7 py-3 rounded-full bg-green-400 text-black font-semibold text-sm md:text-base transition-all hover:bg-green-300 hover:shadow-[0_0_28px_rgba(0,255,100,0.45)]"
              >
                View Projects →
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-full border border-green-400/30 text-green-100/90 text-sm md:text-base backdrop-blur-sm transition-all hover:border-green-400/70 hover:text-white hover:shadow-[0_0_18px_rgba(0,255,100,0.2)]"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-green-400/30 text-green-100/90 text-sm md:text-base backdrop-blur-sm transition-all hover:border-green-400/70 hover:text-white hover:shadow-[0_0_18px_rgba(0,255,100,0.2)]"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-5 text-xs font-mono text-green-200/50">
              <a href="https://github.com/saksham-45" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition-colors">
                github
              </a>
              <span className="text-green-500/30">/</span>
              <a href="https://linkedin.com/in/sakshamsriv" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition-colors">
                linkedin
              </a>
              <span className="text-green-500/30">/</span>
              <Link href="/mystery" className="hover:text-green-300 transition-colors">
                ???
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="pb-8 font-mono text-[11px] tracking-[0.25em] uppercase text-green-200/40"
        >
          drag to spin · click the planet
        </motion.p>
      </main>
    </>
  );
}
