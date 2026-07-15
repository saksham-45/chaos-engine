---
name: КБ-14 — Bureau of One
description: The technical dossier of a one-person design-and-engineering bureau; Soviet-constructivist and brutally legible.
colors:
  bone: "#e7e3da"
  ink: "#15140f"
  oxide: "#c8331f"
  oxide-dark: "#9e2417"
  concrete: "#b4b0a6"
  blueprint-navy: "#0c2a3a"
  cyan: "#4fc3e8"
  charcoal: "#201e18"
  paper: "#fbf9f4"
typography:
  display:
    fontFamily: "Oswald, 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.8rem, 9vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Oswald, 'Arial Narrow', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Oswald, 'Arial Narrow', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'IBM Plex Sans', -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-lg:
    fontFamily: "'IBM Plex Sans', -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2em"
  micro:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.2em"
rounded:
  none: "0"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  2xl: "104px"
  3xl: "168px"
components:
  button-primary:
    backgroundColor: "{colors.oxide}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.oxide}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  plate:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  schematic-panel:
    backgroundColor: "{colors.blueprint-navy}"
    textColor: "{colors.cyan}"
    rounded: "{rounded.none}"
  stat-callout:
    backgroundColor: "{colors.oxide}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "24px"
  nav:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "56px"
---

# Design System: КБ-14 — Bureau of One

## 1. Overview

**Creative North Star: "Bureau of One"**

The whole site is the output of a one-person design-and-engineering bureau, presented as a
stamped technical dossier. Soviet Constructivism (Rodchenko / El Lissitzky poster dynamism)
meets brutalist architecture (béton brut: raw concrete, monolithic massing, exposed
structure). Every project is a numbered plate, every statistic a monospace ledger row, and
the math is a live "figures appendix." It is an homage to the art movement and the
architecture only; there is no political iconography, and no Cyrillic or Russian text anywhere
in the UI.

The system commits hard to identity while staying ruthlessly readable. Text always sits on a
solid color field; all generative art is quarantined inside bordered blueprint panels so
nothing ever competes with reading. Depth comes only from hard, zero-blur offset shadows (the
rubber-stamp look), and corners are square everywhere. The palette is disciplined: a warm
concrete "bone" ground, near-black "ink," and one charged constructivist oxide-red, with a
blueprint navy-and-cyan family reserved exclusively for the schematic art panels.

This system explicitly rejects the muted, interchangeable SaaS-template look the portfolio was
rebuilt away from, and it never trades legibility for cleverness. Warmth and personality are
carried by the type, the oxide accent, and the monumental scale, never by a soft, safe,
warm-gray wash.

**Key Characteristics:**
- Numbered "plate" dossier structure; monospace apparatus (ledgers, spec tables, plate tabs).
- One oxide-red accent used as solid blocks; blueprint navy + cyan for art panels only.
- Zero border-radius; hard offset "stamp" shadows the only source of depth.
- Monumental condensed display type over a documentary-grade body face.
- Readability floors are non-negotiable: solid text fields, ≥18px body, WCAG AA contrast.

## 2. Colors

A warm-concrete-and-ink base with a single constructivist red, plus a navy/cyan family fenced
off for schematics; disciplined, high-contrast, never washed out.

### Primary
- **Oxide Red** (#c8331f): the one constructivist accent. Used as solid blocks: active nav
  tabs, plate number tags, the primary CTA fill, the recurring diagonal bar, and one hero stat
  callout. White or bone text sits on it (≥5:1). Never used as small body text on light.
- **Oxide Dark** (#9e2417): the AA-safe red-as-text variant for links, figure numbers, and
  small red labels on bone or concrete, where the brighter oxide would fail body contrast.

### Secondary
Reserved for generative/schematic art panels only; never carries body copy.
- **Blueprint Navy** (#0c2a3a): the field behind every canvas/SVG schematic (hero assembly
  drawing, Lab curves, project thumbnails). Also the ground of the contact night scene.
- **Cyan** (#4fc3e8): schematic linework only; curve strokes, grid ticks, dimension lines, the
  glowing draw-head, and mono labels on navy. On bone it is a line/underline color, never text.

### Neutral
- **Bone** (#e7e3da): the dossier paper; dominant page background and the ground for ~70% of
  body text.
- **Ink** (#15140f): primary text on light fields, 2px structural rules, the stamp-shadow
  color, the black-square anchor motif, and inverted dark section fields.
- **Concrete** (#b4b0a6): raw-formwork mid-grey for stamped header bands, spec-table label
  columns, chips, and hairlines. Only ink text sits on it (8.7:1).
- **Charcoal** (#201e18): the lifted béton slab; the inverted dark ground for the live GitHub
  ledger and the home colophon.
- **Paper** (#fbf9f4): near-white for text on oxide and dark fields.

### Named Rules
**The Solid-Field Rule.** Every text run sits inside an opaque rectangle of exactly one palette
ground. Text never floats over the diagonal bar, the concrete texture, or any canvas.

**The Art-Quarantine Rule.** Blueprint navy and cyan appear only inside bordered schematic
panels. Captions ride a docked solid ink bar at the panel edge; body-length copy is never set
on navy.

**The Red-As-Text Rule.** Red text on light is always oxide-dark (#9e2417), never the brighter
oxide (#c8331f); oxide is for large display and solid blocks only.

## 3. Typography

**Display Font:** Oswald (with Arial Narrow, sans-serif)
**Body Font:** IBM Plex Sans (with system-ui, sans-serif)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace)

**Character:** A condensed poster grotesque in the Rodchenko agit-poster lineage, monumental
and béton-heavy under uppercase, set against a documentary-grade humanist body face that reads
like a real technical manual. The mono carries all the bureau apparatus. All three have full
Latin coverage; the system uses English labels only.

### Hierarchy
- **Display** (Oswald 700, clamp(2.8rem, 9vw, 7rem), lh 0.92, -0.02em, uppercase): the masthead
  nameplate and full-page headers (e.g. "LET'S BUILD").
- **Headline** (Oswald 600, clamp(2rem, 5vw, 3.5rem), lh 0.98, -0.01em, uppercase): plate titles
  ("THE RECORD, IN NUMBERS", "WHO IS BEHIND THE BUREAU").
- **Title** (Oswald 600, ~1.5rem, lh 1.1, uppercase): project names and sub-plate headings.
- **Body** (IBM Plex Sans 400, 1.125rem / 18px, lh 1.6): every recruiter-facing paragraph.
  Measure capped at ~65-75ch.
- **Body-lg** (IBM Plex Sans 400, 1.25rem / 20px, lh 1.5): lead paragraphs and section standfirsts.
- **Label** (IBM Plex Mono 500, 0.875rem, 0.2em tracking, uppercase): the primary mono label;
  spec-table columns, ledger rows, section eyebrows.
- **Micro** (IBM Plex Mono 500, 0.72rem, 0.2em tracking, uppercase): the small apparatus
  labels; plate tabs, nav codes, stat units, figure captions, reserved-slot markers.

### Named Rules
**The Display-Is-Headings-Only Rule.** Oswald never sets a paragraph and never runs as body or
all-caps prose. Paragraphs are always IBM Plex Sans.

**The 18px Floor.** Running copy is never smaller than 1.125rem (18px). Mono at 0.875rem is
permitted for non-prose metadata only, and still meets AA.

## 4. Elevation

The system is flat by decree, with depth expressed only through hard, zero-blur offset shadows
that read like a rubber stamp or stacked concrete formwork. There are no soft or blurred
shadows anywhere in the core dossier, no gradients (except the cyan draw-head glow inside a
schematic panel), and no glassmorphism. Border-radius is 0 everywhere, enforced globally.

### Shadow Vocabulary
- **Stamp** (`box-shadow: 6px 6px 0 #15140f`): the resting state of every plate, card, index
  rail, and stat cell. Pairs with a 2px ink border.
- **Stamp-lifted** (`box-shadow: 10px 10px 0 #15140f` + `translate(-2px, -2px)`): hover state
  for interactive plates (project cards); the block presses further off the page.

### Named Rules
**The Stamp-Shadow Rule.** The only shadow in the dossier is the hard ink offset (zero blur).
If a surface needs depth, it stamps; it never glows or blurs.

**The Zero-Radius Rule.** Every corner is square. `border-radius: 0` is enforced globally with
`!important`; the single exception is the round glowing cat eyes in the contact night scene.

## 5. Components

Components are heavy, flat, stamped blocks: a 2px ink border plus the single hard offset
shadow. The register is monumental and structural, never soft.

### Buttons
The `StampButton`: 2px border, square corners, min-height 48px, monospace uppercase label with
0.16em tracking. Depth from the hard border; the hover is a color fill that wipes in from the
left with no soft easing.
- **Shape:** square (0 radius), 2px border.
- **Primary:** oxide fill (#c8331f) with paper text; on hover an ink layer wipes in from the
  left and the label inverts to bone.
- **Secondary:** ink outline on transparent with ink text; on hover an oxide layer wipes in and
  the label inverts to paper.
- **Ghost:** for dark grounds; bone outline and text, oxide fill-swipe on hover.
- **Focus:** 3px oxide focus-visible ring, 2px offset (global rule).

### Cards / Containers (Plates)
- **Corner Style:** square (0 radius).
- **Background:** bone, concrete, ink, or charcoal ground per section; navy is art-only.
- **Shadow Strategy:** the Stamp shadow (see Elevation); project plates use Stamp-lifted on hover.
- **Border:** 2px solid ink (or bone/25 on dark grounds).
- **Internal Padding:** 24-36px (`spacing.md`-plus).
- Plates carry apparatus: a corner registration crosshair, a mono plate-number tab, and an
  optional solid ink black-square anchor in a consistent corner.

### Spec Table
Monospace technical table: a concrete label column beside a value column, 1px ink hairline rows,
zebra striping, and a caption band. Used for project specs and the stack "materials schedule."
Never uses fake percentage bars.

### Stat Ledger
A bordered grid of stat cells; each value counts up once on view (respecting reduced motion),
with a monospace unit and label. Exactly one cell may take the oxide callout treatment
(#c8331f with paper text) to spotlight the headline number.

### Inputs / Fields
- **Style:** 2px border, square, on a solid ground; monospace uppercase labels in oxide-dark
  (light) or cyan (dark). Body-size (18px) input text.
- **Focus:** border shifts to oxide plus the global oxide focus-visible ring. No glow.

### Navigation
Fixed 56px bone bar with a 2px ink bottom border. Monospace uppercase links, each with a small
2-letter index code; the active route is a solid oxide tab, hover fills ink. Collapses to a
stamped mobile drawer under 768px. A fixed left "index rail" (a stamped plate) mirrors the home
dossier's numbered contents and scroll-tracks the active section on wide screens.

### Schematic Panel (signature)
The bordered blueprint container for all generative art: a navy field with cyan canvas-2D
linework, a top registration strip, and a docked solid ink caption bar carrying the figure
number, raw equation, and plain-language caption. Powers the hero General Assembly Drawing, the
eight-figure Lab, and each project's thumbnail. Handles self-draw, reduced-motion static frames,
off-screen pausing, and context-loss fallback.

### Contact Night Scene (deliberate art-directed exception)
The `/contact` page intentionally departs from the light dossier: a full-page dark night ground
(#0a0d09) with falling snow, and an interactive cat scene (glowing cursor-tracking eyes, a local
flashlight, parallax, click-to-meow). Contact content sits on solid dark panels beside/below the
cat so the art is never overlaid and text stays AA-legible (bone on charcoal/near-black). This
is the one place soft shadows, a radial flashlight gradient, and round shapes (the eyes) are
allowed. Treat it as a one-off, not a second system mode.

## 6. Do's and Don'ts

### Do:
- **Do** keep every text run on a solid palette field (bone / ink / concrete / charcoal / oxide);
  quarantine all generative art inside bordered navy schematic panels with docked ink captions.
- **Do** set body copy in IBM Plex Sans at ≥18px / 1.6 and verify WCAG AA (≥4.5:1 body, ≥3:1
  large); use oxide-dark (#9e2417) for red text on light, never the brighter oxide.
- **Do** express depth only with the hard offset Stamp shadow (`6px 6px 0 #15140f`, zero blur)
  and a 2px ink border; keep every corner square.
- **Do** reserve Oswald for headings and the oxide accent for solid blocks; carry the apparatus
  (plate numbers, ledgers, spec tables, units) in IBM Plex Mono.
- **Do** provide a `prefers-reduced-motion` fallback for every animation (count-ups, self-draws,
  stamps): static final values and a single composed frame.

### Don't:
- **Don't** let the site drift back into the muted, interchangeable SaaS-template look it was
  rebuilt away from; committed identity beats safe restraint here.
- **Don't** ship text that is hard to read or overdesigned; cleverness never costs legibility
  (the one explicit brand "never"). No muted-gray body text on a tinted ground.
- **Don't** use any Cyrillic / Russian text, em dashes, or GPA figures anywhere in the UI.
- **Don't** use soft or blurred shadows, gradients, glassmorphism, or any `border-radius > 0` in
  the core dossier (the contact night scene is the sole documented exception).
- **Don't** use gradient text, side-stripe borders (`border-left`/`right` > 1px as a colored
  accent), the hero-metric SaaS template, or identical repeating card grids.
- **Don't** set Oswald as paragraph text or use all-caps body copy.
