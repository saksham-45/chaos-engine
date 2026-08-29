import React from "react";
import { RegistrationMark } from "./Plate";

/* A blank dossier plate holding the slot where a figure will go. Used wherever
   the generative curve/schematic art was removed (everywhere except /lab), so the
   composition is preserved until a replacement lands. Quiet and clearly reserved:
   solid border, faint board-formed texture, a centered registration mark, and a
   mono caption. No offset shadow so it reads as pending, not final. */

type Ground = "bone" | "concrete" | "charcoal" | "ink";

const BG: Record<Ground, string> = {
  bone: "var(--color-bone)",
  concrete: "var(--color-concrete)",
  charcoal: "var(--color-charcoal)",
  ink: "var(--color-ink)",
};

export function ReservedPanel({
  ground = "concrete",
  minH = "min-h-[280px]",
  ratio = "4 / 3",
  label = "Reserved",
  className = "",
}: {
  ground?: Ground;
  minH?: string;
  ratio?: string;
  label?: string;
  className?: string;
}) {
  const dark = ground === "charcoal" || ground === "ink";
  const borderColor = dark ? "rgba(231,227,218,0.22)" : "var(--color-ink)";
  const markColor = dark ? "rgba(231,227,218,0.5)" : "rgba(21,20,15,0.34)";
  const labelColor = dark ? "rgba(231,227,218,0.72)" : "rgba(21,20,15,0.62)";

  return (
    <div
      aria-hidden
      className={`kb-texture relative w-full ${minH} ${className}`}
      style={{
        aspectRatio: ratio,
        background: BG[ground],
        border: `2px solid ${borderColor}`,
        color: dark ? "#f4f4f5" : "#09090b",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <RegistrationMark color={markColor} className="w-6 h-6" />
        <span
          className="font-mono text-[0.72rem] uppercase tracking-[0.24em]"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
