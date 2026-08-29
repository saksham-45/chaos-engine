import React from "react";

/* Mono technical table - concrete label column + value column, 1px hairline rows,
   zebra. Used for project specs and the stack "materials schedule". No fake bars. */

export interface Row {
  label: string;
  value: React.ReactNode;
}

export function SpecTable({
  rows,
  caption,
  dark = false,
  className = "",
}: {
  rows: Row[];
  caption?: string;
  dark?: boolean;
  className?: string;
}) {
  const border = "border-[var(--color-rule)]";
  const labelText = "text-[var(--color-ink)]/55";
  const valueText = "text-[var(--color-ink)]";
  const zebra = "bg-[var(--color-ink)]/[0.04]";

  return (
    <div className={`border-2 border-[var(--color-rule)] ${className}`}>
      {caption && (
        <div className="font-mono text-[0.75rem] uppercase tracking-[0.2em] px-4 py-2 border-b-2 border-[var(--color-rule)] text-[var(--color-oxide-dark)]">
          {caption}
        </div>
      )}
      <dl className="font-mono text-[0.9rem]">
        {rows.map((r, i) => (
          <div
            key={r.label + i}
            className={`grid grid-cols-[minmax(96px,0.42fr)_1fr] ${
              i > 0 ? `border-t ${border}` : ""
            } ${i % 2 === 1 ? zebra : ""}`}
          >
            <dt
              className={`px-4 py-2.5 uppercase tracking-[0.08em] text-[0.72rem] leading-relaxed ${labelText} border-r ${border}`}
            >
              {r.label}
            </dt>
            <dd className={`px-4 py-2.5 leading-relaxed ${valueText}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
