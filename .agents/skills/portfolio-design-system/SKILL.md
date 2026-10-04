---
name: portfolio-design-system
description: Design language for vatsalsaglani.pages.dev. Load before adding or changing any section, component, animation, color, typography or copy in this repo. Covers tokens, type scale, layout rhythm, motion rules, interaction patterns, content voice and the QA checklist.
---

# Portfolio design system

The site is an editorial, dark-first single page with a print-ready resume route. Think lab notebook meets magazine: oversized serif headlines, mono labels, hairline rules, one orange accent, a little film grain. It must feel considered and calm, never like a template or a dashboard.

Read `references/tokens.md` when you need exact values, and `references/components.md` for the catalogue of existing parts before building a new one.

## 1. Colors

All colors are CSS variables defined in `src/app/globals.css` as space-separated RGB channels, exposed through Tailwind as token classes. Never write a hex value in a component.

| Token class | Role | Dark | Light |
| --- | --- | --- | --- |
| `bg-bg` | page | near-black ink `11 11 14` | warm paper `245 242 234` |
| `bg-surface` | cards, panels | `17 17 22` | `250 248 243` |
| `bg-raised` | resume sheet, inputs | `24 24 30` | `255 255 255` |
| `text-fg` | primary text | warm off-white `243 239 230` | `20 19 18` |
| `text-muted` | secondary text | `154 150 140` | `101 97 89` |
| `border-line/10` | hairlines (always low alpha) | fg channels | fg channels |
| `text-accent` / `bg-accent` | the one accent, signal orange | `255 92 42` | `229 70 26` |
| `text-accent-fg` | text on accent | ink | white |
| `text-signal` | availability / success green | `74 222 128` | `22 163 74` |

Rules:
- One accent. Use it for the emphasised italic word, section numbers, the current timeline node, hover glows and the caret. Never for large fills except the primary button hover.
- Hairlines are `border-line/10` to `/15`. On hover they may rise to `/40`. Never solid borders.
- Light theme is not an afterthought. Every change is checked in both themes. The theme is `data-theme="dark|light"` on `<html>`; `useTheme()` from `ThemeProvider.js` toggles it.
- Canvas components read colors at runtime with `getComputedStyle(document.documentElement).getPropertyValue("--accent")` and re-read on a `data-theme` mutation (see `FieldCanvas.js`, `PortraitCanvas.js`).

## 2. Typography

Fonts are loaded in `src/app/layout.js` via `next/font/google` and exposed as `font-serif` (Instrument Serif 400 + italic), `font-sans` (Geist), `font-mono` (Geist Mono).

| Use | Classes |
| --- | --- |
| Hero headline | `font-serif text-display-xl` (clamp 3rem to 8.5rem, line-height 0.92) |
| Footer name, big statements | `font-serif text-display-lg` |
| Section titles | `font-serif text-display-md` via `SectionHeading` |
| Card / row titles | `font-serif text-2xl` to `text-3xl` |
| Body | `font-sans text-base` or `text-lg`, `leading-relaxed`, `text-muted` for secondary |
| Labels, meta, numbers | `.eyebrow` (mono, 11px, uppercase, 0.18em tracking) or `font-mono text-xs` |

Rules:
- Every section title has exactly one emphasised word in `<em>` (italic serif). Example: "Things I have <em>shipped</em>".
- Serif is never used for body paragraphs or UI controls. Mono is never used for paragraphs.
- Headlines use `text-wrap: balance` (global). Do not add manual `<br>` except in the hero.
- Numbers in tables use `tabular-nums`.

## 3. Layout and rhythm

- Container: `.wrap` (max 80rem, fluid gutters). Sections are full-width `<section id="…" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">` with `.wrap` inside.
- Section header: always `SectionHeading` with `index` ("01" to "06"), `eyebrow`, `title`, optional `lede` and `action`. Numbers are sequential in page order: Systems 01, Open source 02, Experience 03, Writing 04, About 05, Contact 06. Renumber if you insert a section, and add it to `nav` in `profile.js`.
- Grids: 12 columns at `lg`, asymmetric spans for featured content (7/5, then 4/4/4). Dense lists are hairline-divided rows, not cards.
- Cards: `.card` (rounded-xl2, hairline, `shadow-card`). Keep padding generous (`p-6` to `p-8`).
- Mobile first. Everything must hold at 375px with no horizontal scroll. Hide tertiary columns rather than shrinking type below 12px.
- Fixed nav is 64px; sections use `scroll-mt-24`.

## 4. Motion

Import from `src/lib/motion.js`: `EASE = [0.22, 1, 0.36, 1]`, `fadeUp`, `fade`, `stagger(step, delay)`, `viewportOnce`.

| Pattern | How |
| --- | --- |
| Scroll reveal | `<motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>`; parents use `stagger(0.05–0.08)`. Reveal once, never re-hide. |
| Duration | 0.5s to 0.7s for reveals, 0.3s to 0.4s for state changes, 0.6s for the rotating word. Nothing under 0.2s except micro hovers. |
| Hover | Physical, not bouncy. Springs around `{ stiffness: 220, damping: 22, mass: 0.6 }`. Translate 2–4px, scale ≤ 1.02, tilt ≤ 5°. Arrows nudge up-right. |
| Layout changes | framer `layout` / `layoutId` for filter pills and the nav underline; `AnimatePresence` with height or opacity for expanders. |
| Continuous | Marquee (CSS `animate-marquee`), pulsing dot (`animate-pulseDot`), caret (`animate-caret`), canvases. Every continuous animation pauses off-screen and when the tab is hidden. |
| Reduced motion | `useReducedMotion()` from framer, or the global CSS media query. Under reduced motion: no continuous motion, no parallax, no tilt, reveals become fades or static. Canvases draw one frame. |

Do not add: bounce easings, spinning loaders, parallax on text, animations on page load longer than the hero word reveal, or anything that moves while the user is reading body text.

## 5. Interaction patterns already in place

- Command palette (`CommandPalette.js`): opens on ⌘K / Ctrl K, `/`, or the `open-command-palette` window event. New navigable things should be added there too.
- Theme toggle (`ThemeToggle.js`), persisted in `localStorage("theme")`, pre-paint script in `layout.js` prevents flash.
- Hero flow field (`FieldCanvas.js`) and halftone portrait (`PortraitCanvas.js`): pointer-reactive canvases, DPR capped at 2, adaptive particle counts.
- Expandable rows (Systems, Experience highlights) use `aria-expanded` and `aria-controls`.
- Whole cards and rows are links. The arrow icon is decorative; the text is the label.

## 6. Icons and imagery

- Inline SVG only, 24×24 viewBox, stroke 1.5, `currentColor`. Shared sets: `Icons.js` (shell) and `SectionIcons.js` (content). No emoji, no icon fonts, no external icon CDNs.
- Photos go through a treatment (currently the halftone canvas). Never place a raw photograph in a rounded box.
- `public/assets/og.png` is the social preview (1200×630), generated from an HTML template; regenerate it if the positioning line changes.

## 7. Content voice

- First person, plain language, short sentences. Say what the system does, then optionally name the product. Translate internal names.
- Verbs are precise: built, led, architected, prototyped, maintain. Team work says "led" or "with", not "I".
- No superlatives, no invented numbers, no client names. Maturity is stated honestly (shipped / architected / prototype / in progress).
- Section titles are short with one italic word. Ledes are one or two sentences in `text-muted`.
- Company name is always "QyrusAI" linked to https://qyrus.ai; in prose use `linkCompany()` from `src/lib/linkify.js`.
- Copy lives in `src/data`. If you find yourself typing a sentence in JSX, stop and move it.

## 8. QA checklist before committing

1. `npx next lint` clean, `npm run build` succeeds (static export).
2. Screenshots at 1440×900 and 390×844, dark and light. Nothing overflows horizontally.
3. Scroll the page with reduced motion enabled; nothing should move continuously.
4. Keyboard: every interactive element reachable, visible focus ring (global), Escape closes overlays.
5. Both themes read well with the grain overlay on (`.grain`, mounted in layout).
6. If the change is visible, run `npm run publish:gh` and push the mirror repo as well.

## 9. Adding a new section (recipe)

1. Add data to a new `src/data/<name>.js`.
2. Create `src/components/<Name>.js`: `"use client"` if animated, `<section id="<name>" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">`, `SectionHeading` with the next index, content built from the data with `fadeUp` / `stagger`.
3. Mount it in `src/app/page.js` in page order, renumber later sections, add `{ id, label }` to `nav` in `profile.js` (the palette and nav underline pick it up automatically).
4. Run the QA checklist.
