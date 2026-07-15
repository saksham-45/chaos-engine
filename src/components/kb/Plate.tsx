"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ---- ground → color mapping (text always lands on a solid field) ---- */
export type Ground = "bone" | "concrete" | "ink" | "charcoal" | "oxide";

export const GROUND: Record<Ground, string> = {
  bone: "bg-[var(--color-bone)] text-[var(--color-ink)]",
  concrete: "bg-[var(--color-concrete)] text-[var(--color-ink)]",
  ink: "bg-[var(--color-ink)] text-[var(--color-bone)]",
  charcoal: "bg-[var(--color-charcoal)] text-[var(--color-bone)]",
  oxide: "bg-[var(--color-oxide)] text-[var(--color-paper)]",
};

const isDark = (g: Ground) => g === "ink" || g === "charcoal" || g === "oxide";

/* ========================= Stamp (entrance) ========================= */
/* Plates STAMP onto the page: opacity 0→1 + scale 1.03→1, firm ease-out.
   Disabled under prefers-reduced-motion (plain fade / instant). */
export function Stamp({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  const variants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, scale: 1.03 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1], delay },
        },
      };
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

/* ===================== decorative apparatus ===================== */
export function RegistrationMark({
  className = "",
  color = "var(--color-ink)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${className}`}
      style={{ color }}
    >
      <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function BlackSquareAnchor({
  size = 56,
  className = "",
  color = "var(--color-ink)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: "block", width: size, height: size, background: color }}
    />
  );
}

/* the single recurring oxide diagonal bar - gutter/margin zones only, never over text */
export function DiagonalBar({
  className = "",
  thickness = 32,
  length = 260,
  angle = -4,
}: {
  className?: string;
  thickness?: number;
  length?: number;
  angle?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute origin-left ${className}`}
      style={{
        width: length,
        height: thickness,
        background: "var(--color-oxide)",
        rotate: `${angle}deg`,
      }}
      initial={reduce ? { opacity: 1 } : { scaleX: 0 }}
      whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/* ===================== plate number tab ===================== */
export function PlateTab({
  plateNo,
  active = false,
  className = "",
}: {
  plateNo: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[0.75rem] tracking-[0.18em] px-2 py-1 border-2 border-[var(--color-ink)] ${
        active
          ? "bg-[var(--color-oxide)] text-[var(--color-paper)] border-[var(--color-oxide)]"
          : "bg-[var(--color-bone)] text-[var(--color-oxide-dark)]"
      } ${className}`}
    >
      PLATE {plateNo}
    </span>
  );
}

/* ===================== SectionPlate (full-width band) ===================== */
export function SectionPlate({
  id,
  ground = "bone",
  plateNo,
  titleRu,
  title,
  intro,
  children,
  className = "",
  texture = false,
  wide = false,
  railGutter = false,
}: {
  id?: string;
  ground?: Ground;
  plateNo?: string;
  titleRu?: string;
  title?: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  texture?: boolean;
  wide?: boolean;
  railGutter?: boolean;
}) {
  const dark = isDark(ground);
  return (
    <section
      id={id}
      className={`relative ${GROUND[ground]} ${
        texture ? "kb-texture" : ""
      } border-t-2 border-[var(--color-ink)] ${className}`}
    >
      <div
        className={`relative mx-auto pr-5 sm:pr-8 lg:pr-12 pl-5 sm:pl-8 lg:pl-12 py-16 md:py-24 ${
          railGutter ? "xl:pl-[248px]" : ""
        } ${wide ? "max-w-[1400px]" : "max-w-[1200px]"}`}
      >
        {(plateNo || title) && (
          <Stamp className="mb-10 md:mb-14">
            <div className="flex items-baseline gap-4 flex-wrap">
              {plateNo && (
                <span
                  className={`font-mono text-[0.8rem] tracking-[0.2em] px-2 py-1 ${
                    dark
                      ? "bg-[var(--color-oxide)] text-[var(--color-paper)]"
                      : "bg-[var(--color-ink)] text-[var(--color-bone)]"
                  }`}
                >
                  {plateNo}
                </span>
              )}
              {titleRu && (
                <span
                  className={`font-mono text-[0.8rem] tracking-[0.22em] uppercase ${
                    dark ? "text-[var(--color-cyan)]" : "text-[var(--color-oxide-dark)]"
                  }`}
                >
                  {titleRu}
                </span>
              )}
            </div>
            {title && (
              <h2 className="display-plate text-[clamp(2rem,5vw,3.5rem)] mt-3">{title}</h2>
            )}
            {intro && (
              <div
                className={`mt-4 max-w-2xl text-[1.125rem] leading-relaxed ${
                  dark ? "text-[var(--color-bone)]/85" : "text-[var(--color-ink)]/80"
                }`}
              >
                {intro}
              </div>
            )}
          </Stamp>
        )}
        {children}
      </div>
    </section>
  );
}

/* ===================== PlateFrame (bordered card block) ===================== */
export function PlateFrame({
  ground = "bone",
  className = "",
  children,
  hover = false,
  anchor = false,
  crosshair = false,
  as = "div",
}: {
  ground?: Ground;
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  anchor?: boolean;
  crosshair?: boolean;
  as?: "div" | "article" | "li";
}) {
  const Tag = as;
  const dark = isDark(ground);
  return (
    <Tag
      className={`relative kb-plate ${GROUND[ground]} ${hover ? "kb-plate-hover" : ""} ${className}`}
    >
      {crosshair && (
        <RegistrationMark
          className="absolute top-2 right-2"
          color={dark ? "var(--color-bone)" : "var(--color-ink)"}
        />
      )}
      {children}
      {anchor && (
        <BlackSquareAnchor
          size={40}
          className="absolute -bottom-3 -left-3"
          color={dark ? "var(--color-oxide)" : "var(--color-ink)"}
        />
      )}
    </Tag>
  );
}
