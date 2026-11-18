"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export interface Stat {
  value: string; // "40,000", "~30", "50"
  unit?: string;
  label: string;
}

/* Count up once when scrolled into view. Handles thousands separators,
   decimals, and a leading "~". Reduced motion shows the final value. */
function useCountUp(target: string, run: boolean) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(target);
  const started = useRef(false);

  useEffect(() => {
    if (!run || reduce || started.current) return;
    started.current = true;
    const prefix = target.startsWith("~") ? "~" : "";
    const raw = target.replace("~", "");
    const hadComma = raw.includes(",");
    const num = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(num)) return;
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const dur = 1400;
    let startTs = 0;
    let raf = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / dur);
      const cur = (num * (1 - Math.pow(1 - t, 4))).toFixed(decimals);
      setText(
        prefix +
          (hadComma
            ? Number(cur).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
            : cur),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else setText(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, target]);

  return text;
}

function Cell({ s, run }: { s: Stat; run: boolean }) {
  const shown = useCountUp(s.value, run);
  return (
    <div className="py-7 sm:py-2 lg:px-8 lg:first:pl-0">
      <div className="flex items-baseline">
        <span className="t-num shrink-0 text-[clamp(2.4rem,3.7vw,3.1rem)] leading-none">{shown}</span>
        {s.unit && <span className="t-num ml-1.5 shrink-0 text-[clamp(1.4rem,2.2vw,1.9rem)] text-accent">{s.unit}</span>}
      </div>
      <p className="mt-3 max-w-[22ch] text-[1.0625rem] leading-snug text-muted">{s.label}</p>
    </div>
  );
}

export function Stats({ items }: { items: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <div ref={ref} className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 sm:divide-y-0 lg:grid-cols-4 lg:gap-x-0 lg:divide-x">
      {items.map((s) => (
        <Cell key={s.label} s={s} run={inView} />
      ))}
    </div>
  );
}
