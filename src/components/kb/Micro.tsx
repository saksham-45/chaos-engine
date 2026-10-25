"use client";

import React, { useEffect, useState } from "react";
import { PROFILE } from "@/lib/projects";

/* Thin copper scroll progress bar. Fixed at the very top, above the nav.
   It only measures scroll, it never blocks content. */
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-[var(--color-oxide)]"
      style={{ transform: `scaleX(${p})` }}
    />
  );
}

/* Copy-email button with a confirmed state. No toast, no popup, just the
   button itself changing, which is the whole interaction. */
/* Dark / light toggle, persisted in localStorage. Default is dark, the
   site's settled look. One click flips it, and the choice sticks. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      }
    } catch {
      // private mode or no storage: stay dark, no error surface
    }
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("portfolio-theme", next);
    } catch {
      // ignore storage failures
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`micro-lift inline-flex items-center gap-2 border-2 border-[var(--color-rule)] px-3 min-h-[40px] font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-ink)] hover:border-[var(--color-oxide)] ${className}`}
    >
      <span aria-hidden className="w-2 h-2 bg-[var(--color-oxide)]" />
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

/* Copy any link with a confirmed state. Used for repo links on detail pages,
   the EasyUI-style affordance: the action is there, but it does not shout. */
export function CopyLinkButton({ url, label = "Copy link" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="micro-lift inline-flex items-center gap-2 border-2 border-[var(--color-rule)] px-5 min-h-[48px] font-mono text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-ink)] hover:border-[var(--color-oxide)]"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export function CopyEmailButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`micro-lift inline-flex items-center gap-2 border-2 border-[var(--color-rule)] px-5 min-h-[48px] font-mono text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-ink)] hover:border-[var(--color-oxide)] ${className}`}
      aria-live="polite"
    >
      <span aria-hidden className={`w-2 h-2 ${copied ? "bg-[var(--color-oxide)]" : "bg-[var(--color-ink)]/40"}`} />
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
