"use client";

import React, { useEffect, useState } from "react";
import type { ProcessedProject } from "@/types/github";
import { formatRelativeTime, getLanguageColor } from "@/lib/utils";
import { PROFILE } from "@/lib/projects";

/* Live public-repo feed. Loading, empty, and error each get their own row,
   so a failed fetch never leaves a hole in the page. */
export function GitHubFeed({ limit = 8 }: { limit?: number }) {
  const [repos, setRepos] = useState<ProcessedProject[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "empty" | "error">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/github/repos");
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (!alive) return;
        const list: ProcessedProject[] = data.projects || [];
        setRepos(list);
        setState(list.length ? "ok" : "empty");
      } catch {
        if (alive) setState("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const note = "px-6 py-10 text-[1.0625rem] text-muted sm:px-8";

  return (
    <div className="card">
      {state === "loading" && (
        <div className="animate-pulse space-y-px" aria-label="Loading repositories">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5 sm:px-8">
              <span className="h-4 w-40 rounded-full bg-ink/10" />
              <span className="ml-auto h-4 w-20 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
      )}
      {state === "error" && (
        <p className={note}>
          The live feed is unavailable right now. Everything is at{" "}
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="link link-ext">
            {PROFILE.githubHandle}
          </a>
        </p>
      )}
      {state === "empty" && <p className={note}>No public repositories to show right now.</p>}
      {state === "ok" && (
        <ul className="divide-y divide-line">
          {repos.slice(0, limit).map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 px-6 py-4 transition-colors hover:bg-ink/[0.05] sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_3rem] sm:px-8"
              >
                <span className="truncate text-[1.0625rem] font-semibold tracking-[-0.015em]">{r.name}</span>
                <span className="hidden items-center gap-2 truncate text-[0.9375rem] text-muted sm:flex">
                  {r.language && <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: getLanguageColor(r.language) }} />}
                  {r.language || "—"}
                </span>
                <span className="hidden text-right text-[0.9375rem] text-muted sm:block">{formatRelativeTime(r.updatedAt)}</span>
                <span className="flex items-center justify-end gap-1 text-[0.9375rem] tabular-nums text-muted">
                  {r.stars > 0 && (
                    <>
                      <span aria-hidden>★</span>
                      <span aria-label={`${r.stars} stars`}>{r.stars}</span>
                    </>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
