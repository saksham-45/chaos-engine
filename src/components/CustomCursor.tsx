"use client";

import { useEffect } from "react";

// Elements that make the cursor "open up" on hover.
const INTERACTIVE = "a,button,input,textarea,select,.interactive,[role='button']";

/**
 * The bAIyo signature cursor, ported for the matrix portfolio: a dot with
 * mix-blend-difference that grows over interactive elements, plus a trailing
 * ring that eases toward the pointer. Skipped on touch devices.
 *
 * Tracking notes:
 *  - The dot is applied 1:1 in the handler (no lerp) so it sits exactly on the
 *    pointer. The ring lerps in a rAF loop for a liquid trail.
 *  - Listeners are capture-phase so drag handlers that stopPropagation (e.g.
 *    the globe) can't freeze the cursor mid-drag.
 */
export default function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const wrap = document.createElement("div");
    wrap.id = "cursor-wrapper";
    const dot = document.createElement("div");
    dot.id = "cursor-dot";
    const ring = document.createElement("div");
    ring.id = "cursor-ring";
    wrap.appendChild(dot);
    document.body.appendChild(wrap);
    document.body.appendChild(ring);
    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      wrap.style.opacity = "1";
      ring.style.opacity = "1";
      wrap.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };
    const onDocLeave = () => { wrap.style.opacity = "0"; ring.style.opacity = "0"; };
    const onDocEnter = () => { wrap.style.opacity = "1"; ring.style.opacity = "1"; };
    const onOver = (e: Event) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) {
        wrap.classList.add("cursor-hover");
        ring.classList.add("cursor-hover");
      }
    };
    const onOut = (e: Event) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) {
        wrap.classList.remove("cursor-hover");
        ring.classList.remove("cursor-hover");
      }
    };
    const onDown = () => ring.classList.add("cursor-down");
    const onUp = () => ring.classList.remove("cursor-down");

    document.addEventListener("pointermove", move, true);
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
      document.body.classList.remove("has-custom-cursor");
      wrap.remove();
      ring.remove();
    };
  }, []);

  return null;
}
