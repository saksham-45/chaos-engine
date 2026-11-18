"use client";

import React, { useState } from "react";
import { Reveal } from "./motion";
import { Attractor } from "./Attractor";
import { PROFILE } from "@/lib/projects";

/* Copy with a confirmed state. The button itself is the feedback. */
export function CopyButton({ value, label, className = "btn btn-quiet" }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? "Copied ✓" : label}
    </button>
  );
}

/* The closing call to action, shared by the home and about pages. */
export function ContactBlock() {
  return (
    <section id="contact" className="relative isolate overflow-clip px-5 py-28 text-center sm:px-8 md:py-44">
      {/* the site is called Chaos Engine: a Lorenz attractor runs behind the sign-off */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
        <Attractor className="h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_24%_at_50%_50%,var(--color-bg)_0%,transparent_100%)]" />
      </div>
      <Reveal blur>
        <h2 className="t-h1">
          Get in <span className="hl">touch.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="t-lead mx-auto mt-6 max-w-[34ch]">
          I graduate in May 2027 and I&rsquo;m looking for a full-time role working on <strong>FPGA and EDA tools, compilers, or systems</strong>. If that&rsquo;s your team, let&rsquo;s talk.
        </p>
      </Reveal>
      <Reveal delay={0.16} className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={`mailto:${PROFILE.email}`} className="btn btn-primary">
          Email me
        </a>
        <CopyButton value={PROFILE.email} label="Copy email" />
      </Reveal>
      <Reveal delay={0.22} className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[1.0625rem]">
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="link link-ext">
          GitHub
        </a>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="link link-ext">
          LinkedIn
        </a>
        <a href={PROFILE.phoneHref} className="link">
          {PROFILE.phone}
        </a>
      </Reveal>
    </section>
  );
}
