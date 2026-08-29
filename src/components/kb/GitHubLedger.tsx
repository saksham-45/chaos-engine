"use client";

import React, { useEffect, useState } from "react";
import { ProcessedProject } from "@/types/github";
import { formatRelativeTime } from "@/lib/utils";

/* Live public-repo feed as a mono ledger on charcoal. Explicit loading / empty /
   error row states so a failed fetch never leaves a hole in the recruiter payload. */
export function GitHubLedger({ limit = 12 }: { limit?: number }) {
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

  return (
    <div className="border-2 border-[var(--color-rule)] bg-[var(--color-charcoal)] text-[var(--color-ink)]">
      {/* header row */}
      <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,2fr)_1fr_auto_auto] gap-x-4 px-4 py-2.5 border-b-2 border-[var(--color-rule)] font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-cyan)]">
        <span>repository</span>
        <span className="hidden sm:block">language</span>
        <span className="hidden sm:block text-right">updated</span>
        <span className="text-right">★</span>
      </div>

      {state === "loading" && (
        <div className="px-4 py-8 font-mono text-[0.85rem] text-[var(--color-ink)]/60">
          <span className="inline-block h-3 w-3 border-2 border-[var(--color-cyan)] border-t-transparent animate-spin mr-3 align-middle" />
          pulling repositories from github.com/saksham-45 …
        </div>
      )}

      {state === "error" && (
        <div className="px-4 py-8 font-mono text-[0.85rem] text-[var(--color-ink)]/70">
          feed unavailable - browse directly at{" "}
          <a
            href="https://github.com/saksham-45"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-cyan)] underline underline-offset-4"
          >
            github.com/saksham-45
          </a>
        </div>
      )}

      {state === "empty" && (
        <div className="px-4 py-8 font-mono text-[0.85rem] text-[var(--color-ink)]/60">
          no public repositories to show right now.
        </div>
      )}

      {state === "ok" &&
        repos.slice(0, limit).map((r, i) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,2fr)_1fr_auto_auto] gap-x-4 px-4 py-2.5 font-mono text-[0.85rem] items-center transition-colors hover:bg-[var(--color-oxide)] hover:text-[var(--color-paper)] ${
              i > 0 ? "border-t border-[var(--color-rule)]" : ""
            }`}
          >
            <span className="truncate">
              <span className="text-[var(--color-cyan)] group-hover:text-[var(--color-paper)]">/</span>
              {r.name}
            </span>
            <span className="hidden sm:block truncate opacity-70">{r.language || "-"}</span>
            <span className="hidden sm:block text-right opacity-60 text-[0.78rem]">
              {formatRelativeTime(r.updatedAt)}
            </span>
            <span className="text-right tabular-nums opacity-80">{r.stars}</span>
          </a>
        ))}
    </div>
  );
}
