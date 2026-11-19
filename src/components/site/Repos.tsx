import React from "react";
import { REPOS } from "@/lib/projects";
import { getLanguageColor } from "@/lib/utils";

/* The repos and live sites worth opening first. */
export function Repos({ limit = REPOS.length }: { limit?: number }) {
  return (
    <ul className="card divide-y divide-line">
      {REPOS.slice(0, limit).map((r) => (
        <li key={r.href}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[1fr_auto] items-center gap-x-6 px-6 py-4 transition-colors hover:bg-ink/[0.05] sm:px-8 sm:py-5"
          >
            <span className="min-w-0">
              <span className="block truncate text-[1.0625rem] font-semibold tracking-[-0.015em]">
                <span className="hidden font-normal text-muted sm:inline">{r.owner} / </span>
                {r.name}
              </span>
              <span className="mt-0.5 block text-[0.9375rem] leading-snug text-muted">{r.text}</span>
            </span>
            <span className="flex items-center gap-3 text-[0.9375rem] text-muted">
              <span className="hidden items-center gap-2 sm:flex">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: r.live ? "var(--color-accent)" : getLanguageColor(r.lang) }} />
                {r.lang}
              </span>
              <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
