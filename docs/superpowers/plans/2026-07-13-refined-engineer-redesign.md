# Refined Engineer Redesign — Implementation Plan

> **For agentic workers:** Inline execution (user said go). Checkbox tracking below.

**Goal:** Restyle chaos-engine from Matrix neon to refined dark engineer portfolio while keeping NeuralEarth and content.

**Architecture:** Replace design tokens in globals + restyle all surfaces via Tailwind class swaps and Plasma theme tuning. No new features.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, Framer Motion, Three.js

## Global Constraints

- Accent: `#3dd6c6` only (no matrix green)
- BG: `#0a0b0d`, elevated `#12141a`, text `#e8eaed` / `#9aa0a6`
- Retire MATRIX font from product UI
- Keep routes and copy
- Demote Mystery → "Lab" in nav
- `npm run build` must pass

### Task 1: Tokens + layout
- [x] globals.css tokens
- [x] layout.tsx body/metadata; remove custom cursor

### Task 2: Shared components
- [x] Navigation, ProjectCard, Timeline, Skills, Plasma themes

### Task 3: Pages + NeuralEarth
- [x] Home, About, Projects, Blog, Contact, Mystery, NeuralEarth colors

### Task 4: Verify
- [x] npm run build
