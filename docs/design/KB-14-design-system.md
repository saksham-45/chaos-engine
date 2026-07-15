# КБ-14 — Bureau of One / The Technical Dossier

Locked design system for Saksham Srivastava's portfolio. **This is the single source of
truth.** Soviet-constructivist × brutalist-architecture *homage* (art & architecture only —
no political iconography, slogans, or regime imagery). The site is framed as a one-person
engineering **design bureau**: every project a numbered *plate*, every stat a mono *ledger*
row, the math Lab the *figures appendix*.

## Non-negotiable rules

1. **Text only on solid fields.** Every text run sits inside an opaque rectangle of exactly
   one palette ground (bone / concrete / ink / charcoal / oxide). NEVER over the diagonal
   bar, the concrete texture, or any canvas.
2. **All generative/animated art is quarantined** inside bordered `SchematicPanel`s on
   blueprint-navy. Captions ride a docked solid ink/concrete bar at the panel edge. Body copy
   is NEVER on navy.
3. **Body ≥ 18px** (IBM Plex Sans, line-height 1.6). Oswald is headings-only — never a
   paragraph, never body. Mono ≥14px for non-prose metadata only.
4. **WCAG AA everywhere** (≥4.5:1 body, ≥3:1 large). Red-as-text uses `--oxide-dark` on bone;
   `--oxide` red is for large display/blocks only. Cyan is a LINE color on bone, never text.
5. **border-radius: 0 everywhere.** Depth ONLY from hard offset shadows (`6px 6px 0 ink`,
   zero blur). No gradients (except the cyan draw-head glow inside a panel), no glass, no soft
   shadows.
6. **prefers-reduced-motion** must keep the site fully legible: no draw-ons/count-ups/stamps,
   numerals show final values, canvases render one static high-contrast frame.
7. **Recruiter payload lives on `/` alone** — a recruiter gets identity, 4 stats, 3 flagship
   projects, the stack, live GitHub, and every contact channel from the home scroll.

## Palette (Tailwind v4 `@theme` tokens → `bg-bone`, `text-ink`, …)

| token | hex | role | safe text on this ground |
|---|---|---|---|
| `--color-bone` | `#E7E3DA` | dossier paper — dominant bg, ~70% of body text | ink (14.8:1), oxide-dark (5.9:1), oxide LARGE-only |
| `--color-ink` | `#15140F` | béton noir — primary text on light, rules, stamp-shadow, black-square, dark fields | bone (14.8:1), white, cyan (labels) |
| `--color-oxide` | `#C8331F` | THE accent — active tabs, crosshairs, diagonal bar, primary CTA fill | white (5.3:1), bone (~5:1); ink LARGE-only |
| `--color-oxide-dark` | `#9E2417` | red-as-TEXT variant (links, figure nos.) on bone/concrete | bone/white sit on it ~7:1 |
| `--color-concrete` | `#B4B0A6` | raw-formwork grey — header bands, table label cols, chips, hairlines | ink only (8.7:1) |
| `--color-navy` | `#0C2A3A` | blueprint — art panels ONLY, never body text | bone/cyan labels only |
| `--color-cyan` | `#4FC3E8` | schematic linework only (strokes, ticks, draw-head) | line color; text only on navy, large |
| `--color-charcoal` | `#201E18` | lifted béton slab — GitHub ledger + contact/colophon fields | bone (13.5:1), white |
| `--color-paper` | `#FBF9F4` | near-white for text on dark/oxide | — |

## Type

- **Display** — Oswald (500/600/700, `subsets:['latin','cyrillic']`), UPPERCASE, tracking
  -0.01→-0.02em. Nameplate, plate titles, ПРОЕКТ №, stat numerals. Never paragraphs.
- **Body** — IBM Plex Sans (400/500/600, latin+cyrillic). Every recruiter-facing paragraph.
  Min 1.125rem / lh 1.6.
- **Mono** — IBM Plex Mono (400/500/600, latin+cyrillic). Ledgers, spec tables, plate indices
  (ПЛАСТ №01), captions (ФИГ. 03 / FIG. 03), units.
- **Scale (rem):** hero `clamp(3,→,8)`, plate-title `clamp(2.25,→,4.5)`, h2 `2`, h3 `1.5`,
  body-lg `1.25`, body `1.125` (HARD MIN), mono-meta `0.875` (metadata only). lh: display
  0.95–1.0, body 1.6. Baseline/spacing ladder: 8/16/24/40/64/104/168px.

## CSS utilities available in `globals.css`

- `.kb-plate` — 2px ink border + `6px 6px 0` ink offset shadow, radius 0.
- `.kb-plate-hover` — on hover lifts shadow to `10px 10px 0` and translates `-2px,-2px`.
- `.kb-hairline` — 1px concrete/ink rule.
- `.kb-texture` — board-formed concrete micro-texture ≤4% opacity (decorative, never under text; apply to empty grounds only).
- `.label-mono` — mono, uppercase, 0.875rem, tracking 0.2em, oxide-dark on light.
- `.font-display` / `.font-mono` — font-family helpers (also Tailwind `font-display`, `font-mono`).

## Shared components — `@/components/kb` (all already built; DO NOT modify)

- `PlateFrame` — core container. Props: `ground` (`'bone'|'concrete'|'ink'|'charcoal'|'oxide'`),
  `plateNo` (e.g. `"01"`), `titleRu`, `title`, `index` (rail id), `className`, `children`,
  `anchor` (bool → black square), `crosshair` (bool). Renders corner registration + plate tab.
  Never accepts a `navy` ground (that's art-only).
- `SectionPlate` — a full-width `<section>` wrapper w/ id, ground, and inner max-width, used by home + inner pages for the numbered plates.
- `StampButton` — `href`/`onClick`, `variant` (`'primary'|'secondary'`), oxide fill-swipe on
  hover, ≥44px, focus-visible oxide ring. Renders `<Link>` for internal, `<a>` for external/mailto.
- `SpecTable` — props `rows: {label, value}[]`, optional `caption`. Mono, hairline rows, zebra.
- `StatLedgerRow` / `StatLedger` — `items:{value,unit,label,callout?}[]`, count-up on view
  (reduced-motion → final). One item may be `callout` (oxide).
- `SchematicPanel` — bordered navy wrapper for ANY canvas/SVG art. Props: `caption`, `figNo`,
  `children` (the canvas) OR `curveId` to render a shared `CurveStage`. Handles reduced-motion
  static frame + IntersectionObserver pause + context-loss fallback. Caption on docked solid bar.
- `CurveStage` — canvas renderer for one of the eight curves. Prop `curveId` (see `@/lib/curves`),
  `interactive?`. Cyan-on-navy, ~30fps, static reduced-motion frame.
- `AssemblyDrawing` — the hero "General Assembly Drawing" canvas (self-contained). Prop `className`.
- `GitHubLedger` — live feed from `/api/github/repos`, mono rows on charcoal, explicit
  loading/empty/error states.
- `ContactColophon` — closing contact plate (mailto, phone, github, linkedin) with stamped sign-off.
- `ProjectPlate` — flagship card: role tag + headline metric + cyan schematic thumb + `SpecTable`,
  links to `/projects/[slug]`. Props from `@/lib/projects` `Flagship` type.
- `IndexRail` — fixed left contents nav 00–08, scroll-driven active oxide tab; collapses < 768px.
- `RegistrationMark`, `DiagonalBar`, `BlackSquareAnchor` — decorative apparatus, `aria-hidden`.

## Shared data — `@/lib/projects`

`FLAGSHIPS: Flagship[]` — MoodScope, AutoMix, COVID-HELP (name, slug, no, role, period, tagline,
thesis, headlineMetric{value,label}, spec rows, stack, curveId for the schematic thumb, links).
Use this everywhere; do not re-type project copy.

## Labels — English only (updated 2026-07-13)

The dossier apparatus uses ENGLISH labels only: LEDGER, PROJECT No., PLATE, SPECIFICATION,
FIGURE / FIG., JOURNAL, FIGURES APPENDIX, EXPLANATORY NOTE, CONTACT, ABOUT THE AUTHOR, etc.
Per the owner's request, NO Cyrillic / Russian text anywhere on the site, and NO em dashes
(use hyphens or restructure). Keep it that way in future edits.

## Page plan (routes)

- `/` — full dossier, sections 00→08 (masthead, hero assembly drawing, stat ledger, identity
  brief, flagship projects ×3, spec/stack, figures-appendix teaser → /lab, live GitHub ledger,
  colophon/contact).
- `/about` — principal's personnel file: bio brief, education & honors ledger, research strip,
  disciplines overlap schematic, contact row.
- `/projects` — index of all plates: masthead, discipline filter strip, ProjectPlate grid
  (flagships) + live GitHub cross-reference.
- `/projects/[slug]` — one project as a full assembly sheet: plate header, project-specific
  SchematicPanel, overview brief, SpecTable, role ledger, prev/next nav. Flagships use
  `@/lib/projects`; unknown slugs fall back to the live GitHub repo data (keep existing fetch).
- `/blog` — bureau journal (ЖУРНАЛ): ledger-row entry list, honest empty state as ledger rows.
- `/blog/[slug]` — article as readable plate: prose on bone ≥18px/1.6 ~68ch, figures in panels.
- `/contact` — night scene: the interactive "pupsik" cat background (`PupsikAmbient` +
  `PupsikCat`, cat SVG at `public/pupsik-cat.svg`), with contact content (header, rails, mailto
  form) on solid dark panels to the left/below so the cat is never overlaid. Dark-themed page.
- `/lab` — figures appendix (migrated from `/mystery`): grid of eight SchematicPanels via
  CurveStage, docked equation captions, note tying to hero.

## Facts (only these; never fabricate)

- Saksham Srivastava · Computer Engineering B.S. '27 · USF · Math minor · Green & Gold
  Presidential Scholar · undergraduate researcher, USF Bellini College of AI · Tampa, FL.
  (Do NOT mention GPA anywhere - owner's request.)
- Stats: 40,000+ users served in production · ~99.9% uptime · 21 merged open-source PRs · ~30 ms/frame on-device inference.
- MoodScope (Software Lead) — real-time facial emotion recognition ENTIRELY on a Raspberry Pi 4,
  TFLite INT8 ~30ms/frame, local Llama 3.2, no data leaves device.
- AutoMix — AI DJ; PyTorch decision network + LSTM, 17 blend strategies, 100+ audio features
  (Camelot key, beat phase, spectral masking), Monte Carlo cut-point search avoiding vocal clashes.
- COVID-HELP (Founder & Lead Dev, 2021–2023) — routed 40,000+ people to live ICU beds & oxygen in
  India's 2nd COVID wave, ~99.9% uptime, led a volunteer eng team on Agile.
- Stack: Python · C/C++ · React · Next.js · TensorFlow Lite · PyTorch · Embedded Linux · SQL · REST APIs.
- Links: github.com/saksham-45 · linkedin.com/in/sakshamsriv · saksham146053@gmail.com · (813) 860-8506.
