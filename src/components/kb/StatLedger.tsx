"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export interface Stat {
  value: string; // may be numeric-ish ("10,000", "~99.9", "~30", "20,000")
  unit?: string;
  label: string;
  callout?: boolean;
}

/* count-up once on view; reduced-motion → final value immediately. Handles
   thousands separators, decimals, and a leading "~". */
function useCountUp(target: string, run: boolean) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(reduce ? target : startFrom(target));
  const started = useRef(false);

  useEffect(() => {
    if (!run || reduce || started.current) {
      if (reduce) setText(target);
      return;
    }
    started.current = true;
    const prefix = target.startsWith("~") ? "~" : "";
    const raw = target.replace("~", "");
    const hadComma = raw.includes(",");
    const num = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(num)) {
      setText(target);
      return;
    }
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const dur = 1100;
    let startTs = 0;
    let raf = 0;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = num * eased;
      const fixed = cur.toFixed(decimals);
      const formatted = hadComma
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      setText(prefix + formatted);
      if (p < 1) raf = requestAnimationFrame(step);
      else setText(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, target]);

  return text;
}

function startFrom(target: string) {
  const prefix = target.startsWith("~") ? "~" : "";
  const raw = target.replace("~", "");
  if (raw.includes(".")) return prefix + "0." + "0".repeat(raw.split(".")[1].length);
  return prefix + "0";
}

function LedgerCell({ s, run }: { s: Stat; run: boolean }) {
  const shown = useCountUp(s.value, run);
  return (
    <div
      className={`relative p-5 md:p-6 border-2 ${
        s.callout
          ? "bg-[var(--color-oxide)] border-[var(--color-oxide)] text-[var(--color-paper)]"
          : "bg-[var(--color-bone)] border-[var(--color-ink)] text-[var(--color-ink)]"
      }`}
    >
      <div className="flex items-baseline gap-1">
        <span className="display-plate text-[clamp(2.4rem,6vw,3.6rem)] leading-none tabular-nums">
          {shown}
        </span>
        {s.unit && (
          <span className="font-display text-[1.6rem] font-semibold leading-none">{s.unit}</span>
        )}
      </div>
      <div
        className={`mt-3 font-mono text-[0.78rem] leading-snug uppercase tracking-[0.06em] ${
          s.callout ? "text-[var(--color-paper)]/85" : "text-[var(--color-ink)]/65"
        }`}
      >
        {s.label}
      </div>
    </div>
  );
}

export function StatLedger({ items }: { items: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s) => (
        <LedgerCell key={s.label} s={s} run={inView} />
      ))}
    </div>
  );
}
