"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/* House spring: critically damped, no overshoot. Nothing here was thrown
   by the user, so nothing bounces. */
export const SPRING = { type: "spring", bounce: 0, duration: 0.9 } as const;

/* Rise and sharpen into place. `now` plays on mount (hero); otherwise it
   plays once when scrolled into view. Reduced motion gets a plain fade. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  blur = false,
  now = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  now?: boolean;
  as?: "div" | "li" | "p" | "span" | "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  const hidden = { opacity: 0, y: reduce ? 0 : y, filter: blur && !reduce ? "blur(12px)" : "blur(0px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  return (
    <M
      className={className}
      initial={hidden}
      {...(now ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: "-8% 0px" } })}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </M>
  );
}

/* Headline that arrives one word at a time. */
export function Words({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: reduce ? 0 : "0.35em", filter: reduce ? "blur(0px)" : "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...SPRING, duration: 1.1, delay: delay + i * 0.07 }}
        >
          {w + " "}
        </motion.span>
      ))}
    </span>
  );
}

/* Cards grow into place as they scroll in, tied to scroll position so the
   motion can be scrubbed and reversed. */
export function ScaleIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.62"] });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.9, 1]), { stiffness: 260, damping: 34 });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.25, 1]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { scale, opacity }}>
      {children}
    </motion.div>
  );
}

/* How far down the page you are, drawn as a row of bits along the top edge. */
export function BitProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
      style={{ scaleX, background: "repeating-linear-gradient(90deg, var(--color-accent) 0 7px, transparent 7px 10px, var(--color-accent) 10px 13px, transparent 13px 18px)" }}
    />
  );
}

/* Feeds the pointer position to .card-glow so its highlight follows. */
export function spotlight(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
