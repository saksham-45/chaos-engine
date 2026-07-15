"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SectionPlate, Stamp, StampButton, SpecTable } from "@/components/kb";

/* =========================================================================
   JOURNAL - one entry as a readable plate.
   No posts are filed yet. This route is built so a real data source can slot
   in later without a rewrite: define entries in POSTS keyed by slug and the
   article branch renders them as prose on bone (≥18px / lh 1.6 / ~68ch).
   Until then EVERY slug resolves to the honest "not filed yet" dossier state.
   ========================================================================= */

interface JournalEntry {
  title: string;
  dateFiled: string; // ISO - shown as a ledger row
  readTime?: string;
  tags?: string[];
  /** body as ordered paragraphs; figures ride in SchematicPanels when added */
  body: string[];
}

// Intentionally empty - no fabricated writing. Add real entries here later.
const POSTS: Record<string, JournalEntry> = {};

export default function JournalEntryPage() {
  const params = useParams();
  const raw = params?.slug;
  const slug = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const entry = slug ? POSTS[slug] : undefined;

  /* -------------------- filed entry (future data source) -------------------- */
  if (entry) {
    return (
      <main className="pt-14">
        <SectionPlate ground="bone" title={entry.title}>
          <Stamp>
            <SpecTable
              rows={[
                { label: "Filed", value: entry.dateFiled },
                ...(entry.readTime ? [{ label: "Read", value: entry.readTime }] : []),
                ...(entry.tags?.length
                  ? [{ label: "Tags", value: entry.tags.join(" · ") }]
                  : []),
                { label: "Ref", value: `JR / ${slug}` },
              ]}
              caption="ENTRY RECORD"
            />
            <div className="mt-10 max-w-[68ch] space-y-6 text-[1.125rem] leading-[1.6] text-[var(--color-ink)]">
              {entry.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <StampButton href="/blog" variant="primary">
                ← Back to field notes
              </StampButton>
              <StampButton href="/projects" variant="secondary">
                See the projects
              </StampButton>
            </div>
          </Stamp>
        </SectionPlate>
      </main>
    );
  }

  /* -------------------- not filed yet (default for any slug) -------------------- */
  return (
    <main className="pt-14">
      <SectionPlate ground="bone" title="Nothing filed here yet">
        <Stamp>
          <div className="max-w-[68ch] space-y-6 text-[1.125rem] leading-[1.6] text-[var(--color-ink)]">
            <p>
              There&rsquo;s no post under this link yet. I&rsquo;d rather leave it blank than fill
              it with filler, so nothing here is invented.
            </p>
            <p>
              Build logs and deep dives are coming, drawn straight from the work: running an
              emotion model fully on-device, blending tracks on the beat in AutoMix, and holding
              ~99.9% uptime when traffic is an emergency, not a curve. Until one&rsquo;s written,
              the code speaks for itself.
            </p>
          </div>

          {slug && (
            <div className="mt-8 max-w-[68ch]">
              <SpecTable
                rows={[
                  { label: "Requested ref", value: <span className="break-all">{`JR / ${slug}`}</span> },
                  {
                    label: "Status",
                    value: <span className="text-[var(--color-oxide-dark)]">NOT ON FILE</span>,
                  },
                ]}
                caption="ENTRY RECORD"
              />
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4">
            <StampButton href="/blog" variant="primary">
              ← Back to field notes
            </StampButton>
            <StampButton href="/projects" variant="secondary">
              See the projects
            </StampButton>
          </div>
        </Stamp>
      </SectionPlate>
    </main>
  );
}
