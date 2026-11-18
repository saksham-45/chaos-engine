"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Day } from "@/lib/contributions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVEL = ["bg-ink/[0.07]", "bg-accent/30", "bg-accent/55", "bg-accent/80", "bg-accent shadow-[0_0_10px_var(--color-accent)]"];

/* A year of commits drawn as a grid of cells. It lights up week by week the
   first time it scrolls into view. Hidden entirely if GitHub can't be reached. */
export function Contributions() {
  const [data, setData] = useState<{ total: number; days: Day[] } | null>(null);
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/github/contributions")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && d?.days && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [data]);

  if (!data) return null;
  const weeks = Math.max(...data.days.map((x) => x.c)) + 1;
  const months: { c: number; m: string }[] = [];
  for (const x of data.days) {
    if (x.r !== 0) continue;
    const m = MONTHS[+x.d.slice(5, 7) - 1];
    if (x.c > 0 && x.c < weeks - 2 && months.at(-1)?.m !== m) months.push({ c: x.c, m });
  }

  return (
    <div ref={ref} className="card p-6 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <p className="flex items-baseline gap-3">
          <span className="t-num text-[clamp(2.4rem,4.4vw,3.4rem)] leading-none text-accent">{data.total.toLocaleString("en-US")}</span>
          <span className="text-[1.0625rem] text-muted">contributions in the last year</span>
        </p>
        <p aria-hidden className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
          Less
          {LEVEL.map((c, i) => (
            <span key={i} className={`h-3 w-3 rounded-[3px] ${c.split(" ")[0]}`} />
          ))}
          More
        </p>
      </div>
      {/* phones scroll sideways, starting at the latest week */}
      <div
        ref={(el) => {
          if (el) el.scrollLeft = el.scrollWidth;
        }}
        className="-mx-6 mt-8 overflow-x-auto px-6 sm:mx-0 sm:px-0"
      >
        <div
          role="img"
          aria-label={`${data.total.toLocaleString("en-US")} GitHub contributions in the last year`}
          className={`contrib grid min-w-[640px] gap-[2px] sm:gap-[3px] lg:gap-1 ${on ? "is-on" : ""}`}
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
        >
          {months.map((x) => (
            <span key={x.c} className="pb-2 text-[0.75rem] text-muted" style={{ gridRow: 1, gridColumn: `${x.c + 1} / span 3` }}>
              {x.m}
            </span>
          ))}
          {data.days.map((x) => (
            <span
              key={x.d}
              title={`${x.n} on ${x.d}`}
              className={`aspect-square rounded-[2px] sm:rounded-[3px] ${LEVEL[x.l] ?? LEVEL[0]}`}
              style={
                {
                  gridRow: x.r + 2,
                  gridColumn: x.c + 1,
                  "--i": x.c,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
