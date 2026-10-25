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
      } else {
        document.documentElement.dataset.theme = "dark";
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


/* Sun / moon theme button, used in place of the old square logo mark.
   Moon means dark mode is on, sun means light mode is on. One tap flips
   the mode and the icon with it, and the choice persists. */
export function ThemeIconButton({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      } else {
        document.documentElement.dataset.theme = "dark";
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
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`inline-flex items-center justify-center w-10 h-10 shrink-0 border-2 border-[var(--color-rule)] text-[var(--color-oxide)] hover:border-[var(--color-oxide)] ${className}`}
    >
      {theme === "dark" ? (
        <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        </svg>
      ) : (
        <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.9" y1="4.9" x2="6.3" y2="6.3" />
          <line x1="17.7" y1="17.7" x2="19.1" y2="19.1" />
          <line x1="19.1" y1="4.9" x2="17.7" y2="6.3" />
          <line x1="6.3" y1="17.7" x2="4.9" y2="19.1" />
        </svg>
      )}
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
