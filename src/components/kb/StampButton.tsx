"use client";

import React from "react";
import Link from "next/link";

/* Stamp button: 2px ink border, hard oxide fill-swipe on hover (bg wipes in from
   left, text inverts to paper). No soft easing. >=44px target, focus-visible ring. */

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden border-2 px-6 min-h-[48px] font-mono text-[0.8rem] uppercase tracking-[0.16em] font-medium select-none";

const variants: Record<Variant, string> = {
  // oxide fill by default, inverts to ink-outline on hover
  primary:
    "border-[var(--color-oxide)] bg-[var(--color-oxide)] text-[var(--color-paper)]",
  // ink outline on bone, fills oxide on hover
  secondary:
    "border-[var(--color-ink)] bg-transparent text-[var(--color-ink)]",
  // for dark grounds: bone outline, fills oxide on hover
  ghost:
    "border-[var(--color-bone)] bg-transparent text-[var(--color-bone)]",
};

function Inner({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  // the swipe layer wipes in from the left on hover
  const swipe =
    variant === "primary"
      ? "bg-[var(--color-ink)]"
      : "bg-[var(--color-oxide)]";
  const hoverText =
    variant === "primary"
      ? "group-hover:text-[var(--color-bone)]"
      : "group-hover:text-[var(--color-paper)]";
  return (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none ${swipe}`}
      />
      <span className={`relative z-10 inline-flex items-center gap-2 transition-colors duration-150 ${hoverText}`}>
        {children}
      </span>
    </>
  );
}

export function StampButton({
  children,
  href,
  onClick,
  variant = "primary",
  external = false,
  type = "button",
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  external?: boolean;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const isExternal = external || href?.startsWith("http") || href?.startsWith("mailto:") || href?.startsWith("tel:");

  if (href && isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={cls}
        aria-label={ariaLabel}
      >
        <Inner variant={variant}>{children}</Inner>
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        <Inner variant={variant}>{children}</Inner>
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}
