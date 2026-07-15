"use client";

import React, { useEffect, useState } from "react";

export interface RailItem {
  id: string;
  no: string;
  label: string;
}

/* Fixed left-gutter dossier contents nav. Scroll-driven active oxide tab via
   IntersectionObserver on the section ids. Desktop only (top nav covers mobile). */
export function IndexRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Dossier contents"
      className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-0 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] shadow-[6px_6px_0_var(--color-ink)]"
    >
      <span className="px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.2em] uppercase text-[var(--color-ink)]/50 border-b-2 border-[var(--color-ink)]">
        INDEX
      </span>
      {items.map((it) => {
        const on = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => go(it.id)}
            className={`group flex items-center gap-2 px-3 py-2 text-left transition-colors ${
              on
                ? "bg-[var(--color-oxide)] text-[var(--color-paper)]"
                : "text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5"
            }`}
          >
            <span className="font-mono text-[0.66rem] tabular-nums opacity-80">{it.no}</span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.06em] whitespace-nowrap">
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
