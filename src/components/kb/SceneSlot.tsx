"use client";

import React, { useEffect, useState } from "react";
import { TorchScene } from "./TorchScene";
import { ReservedPanel } from "./ReservedPanel";

/* Drop-in for the reserved dossier slots. Probes for a traced scene at
   /scenes/<slug>.svg: while it's missing (not traced yet) it renders the quiet
   ReservedPanel, and the moment the SVG exists it swaps in the interactive
   TorchScene (torch reveal + parallax + meowing cat). So the page never shows a
   broken image, and slots light up automatically once scenes are traced. */

type Ground = "bone" | "concrete" | "charcoal" | "ink";
type Corner = "br" | "bl" | "tr" | "tl";

export function SceneSlot({
  slug,
  label = "Figure",
  ratio = "4 / 3",
  minH = "min-h-[280px]",
  ground = "charcoal",
  torch = 210,
  dim = 0.82,
  catCorner = "br",
  className = "",
}: {
  slug: string;
  label?: string;
  ratio?: string;
  minH?: string;
  ground?: Ground;
  torch?: number;
  dim?: number;
  catCorner?: Corner;
  className?: string;
}) {
  const src = `/scenes/${slug}.svg`;
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    const img = new Image();
    img.onload = () => alive && setStatus("ok");
    img.onerror = () => alive && setStatus("missing");
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);

  if (status !== "ok") {
    return (
      <ReservedPanel ground={ground} minH={minH} ratio={ratio} label={label} className={className} />
    );
  }

  return (
    <TorchScene
      src={src}
      alt={label}
      label={label}
      ratio={ratio}
      minH={minH}
      torch={torch}
      dim={dim}
      catCorner={catCorner}
      className={className}
    />
  );
}
