# Refined engineer redesign — chaos-engine portfolio

**Date:** 2026-07-13  
**Repo:** saksham-45/chaos-engine (local: `/home/david/chaos-engine`)  
**Status:** Design approved in chat; ready for implementation after spec sign-off  

## Goal

Restyle Saksham Srivastava’s Next.js portfolio from Matrix/cyberpunk neon into a **professional “refined engineer”** look: dark, technical, recruiter-scannable, with the interactive Earth retained as the signature craft piece.

## Non-goals

- New project content or résumé rewriting  
- New backend/auth/features  
- Full IA rebuild into multi-section marketing home (Approach 2)  
- Vercel project creation or production deploy unless explicitly requested  

## Approach

**Approach 1 (token + polish pass)** with a light IA touch:

- Keep routes, copy, NeuralEarth interaction, featured projects, GitHub feed, blog, contact form, mystery math page  
- Replace visual system end-to-end (palette, type, nav, surfaces, CTAs, plasma/glow treatment)  
- Demote Mystery in primary nav (e.g. “Lab” or quieter treatment / footer-adjacent feel)  
- Soft-gate or remove custom cursor if it fights professionalism  

## Visual system

| Token | Value / rule |
| --- | --- |
| Page background | `#0a0b0d` (not pure black) |
| Elevated surface | `#12141a` |
| Text primary | `#e8eaed` |
| Text secondary | `#9aa0a6` (body contrast ≥ 4.5:1 on bg) |
| Accent | Single cool teal `#3dd6c6` (no neon matrix green) |
| Borders | `rgba(255,255,255,0.08)` |
| Display type | Geist Sans (or existing Geist) — **retire MATRIX font from product UI** |
| Mono | Geist Mono for labels, stats, chips only |
| Motion | Keep Framer + Earth; quieter, shorter; honor `prefers-reduced-motion` |
| Glow | No multi-layer green text-shadow; accent used sparingly (focus, hover, primary CTA) |

### Explicit bans

- Matrix green (`#00ff00` family) as brand  
- MATRIX display font on marketing/product UI  
- Purple/rainbow gradients, emoji-as-icons  
- Heavy plasma that obscures content  
- Terminal `>` brand as primary logo (optional monogram only if quiet)  

## Surfaces to change

1. **`src/app/globals.css`** — CSS variables, scrollbar, selection, focus, drop matrix/glow utilities; new utility classes if needed  
2. **`src/app/layout.tsx`** — body classes, fonts, metadata tone; cursor policy  
3. **`src/components/Navigation.tsx`** — solid bar on scroll, clear active state, Mystery demoted  
4. **`src/app/page.tsx` (Home)** — professional type hierarchy; one primary CTA; Earth chrome restyled  
5. **`src/components/NeuralEarth.tsx`** — particle/UI colors to new accent; story cards as clean glass panels  
6. **About / Projects / Blog / Contact / Mystery pages** — same structure; plasma → subtle static/mesh or very quiet animated backdrop; cards/stats scannable  
7. **Supporting components** — ProjectCard, Timeline, SkillsVisualization, PlasmaBackground, MatrixEffects, CustomCursor  

## Information architecture (minimal change)

| Route | Role after redesign |
| --- | --- |
| `/` | Hero + Earth; primary CTA → Projects |
| `/about` | Story, stats, timeline, skills |
| `/projects` | Featured work + live GitHub feed |
| `/blog` | Posts list/detail (visual only) |
| `/contact` | Contact form + links |
| `/mystery` | Lab / math playground; not primary nav emphasis |

## Success criteria

- Site reads as a serious CE / full-stack portfolio in a 5-second scan  
- Accent and type are consistent across all pages  
- Earth interaction still works; story beats still readable  
- No matrix green or MATRIX font in primary UI  
- Interactive controls have hover + focus-visible states  
- `npm run build` succeeds  

## Working copy

Local path: `/home/david/chaos-engine`  
Branch: `redesign/refined-engineer`  
Push/PR to upstream only if the owner (or David acting for them) requests it.

## Implementation order (preview)

1. Design tokens + globals + layout  
2. Navigation + shared components (cards, timeline, skills, plasma)  
3. Home + NeuralEarth restyle  
4. Inner pages (about, projects, blog, contact, mystery)  
5. Cursor policy + reduced-motion + polish pass  
6. Build verify  
