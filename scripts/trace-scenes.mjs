#!/usr/bin/env node
/* Trace owned reference photos into high-quality color SVGs (the same technique
   behind /public/pupsik-cat.svg), for the TorchScene dossier slots.

   Drop source images in  public/scenes/src/  named by slug (any of
   jpg/jpeg/png/webp), e.g.  charminar.jpg, taj.jpg, starfield.png ...
   Then run:  node scripts/trace-scenes.mjs

   Pipeline per image:
     sharp  -> downscale + gentle grade -> temp PNG
     vtracer-> stacked color spline SVG  -> public/scenes/<slug>.svg
   Also (re)renders public/scenes/cat-sprite.png (the meowing cat cameo).    */

import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, mkdirSync, statSync, rmSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "public/scenes/src");
const OUT = join(ROOT, "public/scenes");
const VTRACER = process.env.VTRACER || join(process.env.HOME || "", ".cargo/bin/vtracer");

// slugs we know how to place in the site (others are traced too, just unwired)
const KNOWN = ["charminar", "taj", "starfield", "procession", "oldcity"];

const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const kb = (n) => (n / 1024).toFixed(0) + " KB";

function vtracer(inPng, outSvg) {
  execFileSync(
    VTRACER,
    [
      "--input", inPng,
      "--output", outSvg,
      "--colormode", "color",
      "--hierarchical", "stacked",
      "--mode", "spline",
      "--filter_speckle", "8",
      "--color_precision", "6",
      "--gradient_step", "22",
      "--corner_threshold", "60",
      "--segment_length", "5",
      "--splice_threshold", "45",
      "--path_precision", "4",
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
}

async function traceOne(file) {
  const slug = basename(file, extname(file)).replace(/^\d+[-_]?/, "");
  const inPath = join(SRC, file);
  const tmp = join(tmpdir(), `scene-${slug}-${process.pid}.png`);
  const outSvg = join(OUT, `${slug}.svg`);

  // downscale to keep the SVG light; gentle grade so torchlight reads well
  await sharp(inPath)
    .resize({ width: 860, height: 860, fit: "inside", withoutEnlargement: true })
    .modulate({ saturation: 1.08 })
    .sharpen()
    .png({ quality: 92 })
    .toFile(tmp);

  vtracer(tmp, outSvg);
  rmSync(tmp, { force: true });

  const size = statSync(outSvg).size;
  const flag = size > 900 * 1024 ? "  ⚠ heavy" : "";
  const known = KNOWN.includes(slug) ? "" : "  (unwired slug)";
  console.log(`  ✓ ${slug}.svg  ${kb(size)}${flag}${known}`);
  return { slug, size };
}

async function catSprite() {
  // the cameo is a self-contained sprite: the background-less cutout cat
  // (public/scenes/cat-source.png, tightly cropped + transparent) with warm
  // glowing eyes BAKED IN at the real eye pixels, so nothing can drift.
  const source = join(OUT, "cat-source.png");
  if (!existsSync(source)) {
    console.log("  – cat-source.png missing; skipping cat-sprite.png");
    return;
  }
  const { width: W = 412, height: H = 654 } = await sharp(source).metadata();
  // eye centres measured on cat-source: ~15% / 30% across, ~13% down
  const eL = { x: Math.round(W * 0.151), y: Math.round(H * 0.13) };
  const eR = { x: Math.round(W * 0.301), y: Math.round(H * 0.121) };
  const glow = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="g" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stop-color="#fff8d4"/>
        <stop offset="30%" stop-color="#ffde84"/>
        <stop offset="62%" stop-color="#d79b34" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#a06e28" stop-opacity="0"/>
      </radialGradient></defs>
      <ellipse cx="${eL.x}" cy="${eL.y}" rx="12" ry="11" fill="url(#g)"/>
      <ellipse cx="${eR.x}" cy="${eR.y}" rx="12" ry="11" fill="url(#g)"/>
    </svg>`
  );
  await sharp(source)
    .composite([{ input: glow, blend: "screen" }])
    .png()
    .toFile(join(OUT, "cat-sprite.png"));
  console.log("  ✓ cat-sprite.png (glowing eyes baked in)");
}

async function main() {
  if (!existsSync(VTRACER)) {
    console.error(`vtracer not found at ${VTRACER}. Install: cargo install vtracer`);
    process.exit(1);
  }
  mkdirSync(SRC, { recursive: true });

  await catSprite();

  const files = existsSync(SRC)
    ? readdirSync(SRC).filter((f) => EXT.has(extname(f).toLowerCase()))
    : [];
  if (!files.length) {
    console.log("\nNo source images in public/scenes/src/ yet — add them and re-run.");
    console.log("Expected slugs:", KNOWN.join(", "));
    return;
  }
  console.log(`\nTracing ${files.length} scene(s):`);
  for (const f of files) await traceOne(f);
  console.log("\nDone. Wire each /scenes/<slug>.svg into a TorchScene.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
