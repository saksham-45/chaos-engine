"use client";

import React from "react";
import { StampButton } from "./StampButton";
import { CopyEmailButton } from "./Micro";
import { PROFILE } from "@/lib/projects";

export function ContactColophon({ heading = "LET'S BUILD" }: { heading?: string }) {
  const rails = [
    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
    { label: "GitHub", value: PROFILE.githubHandle, href: PROFILE.github },
    { label: "LinkedIn", value: PROFILE.linkedinHandle, href: PROFILE.linkedin },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
      <div>
        <span className="font-mono text-[0.8rem] tracking-[0.22em] uppercase text-[var(--color-cyan)]">
          CONTACT
        </span>
        <h2 className="display-hero text-[clamp(2.5rem,8vw,5.5rem)] mt-3 text-[var(--color-ink)]">
          {heading}
        </h2>
        <p className="mt-5 max-w-md text-[1.125rem] leading-relaxed text-[var(--color-ink)]/85">
          Based in {PROFILE.location} · graduating May 2027. For new-grad roles in hardware,
          systems, or applied AI.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <StampButton href={`mailto:${PROFILE.email}`} variant="primary">
            Compose message →
          </StampButton>
          <CopyEmailButton />
          <StampButton href={PROFILE.github} variant="ghost">
            GitHub ↗
          </StampButton>
        </div>
      </div>

      <div className="border-2 border-[var(--color-rule)]">
        {rails.map((r, i) => (
          <a
            key={r.label}
            href={r.href}
            target={r.href.startsWith("http") ? "_blank" : undefined}
            rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`grid grid-cols-[minmax(88px,0.4fr)_1fr] items-center transition-colors hover:bg-[var(--color-oxide)] group ${
              i > 0 ? "border-t border-[var(--color-rule)]" : ""
            }`}
          >
            <span className="px-4 py-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-cyan)] border-r border-[var(--color-rule)] group-hover:text-[var(--color-paper)]">
              {r.label}
            </span>
            <span className="px-4 py-4 font-mono text-[0.95rem] text-[var(--color-ink)] group-hover:text-[var(--color-paper)] truncate">
              {r.value}
            </span>
          </a>
        ))}
        <div className="border-t-2 border-[var(--color-rule)] bg-[var(--color-oxide)] px-4 py-3 text-center">
          <span className="font-mono text-[0.72rem] tracking-[0.24em] uppercase text-[var(--color-paper)]">
            New-grad roles · hardware, systems &amp; applied AI · Tampa, FL · May 2027
          </span>
        </div>
      </div>
    </div>
  );
}
