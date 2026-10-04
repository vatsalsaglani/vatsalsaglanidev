# AGENTS.md — working in vatsalsaglanidev

This is Vatsal Saglani's portfolio: a static Next.js 15 site (App Router, React 19, JavaScript, Tailwind 3.4, framer-motion 12) exported to `out/` and deployed to Cloudflare Pages, with a mirror pushed to `vatsalsaglani/vatsalsaglani.github.io`.

Before touching UI, read the design skill: `.agents/skills/portfolio-design-system/SKILL.md`. It is the source of truth for colors, type, motion, layout and tone. This file covers how the repo works; the skill covers how it should look and feel.

## Positioning (do not drift from this)

- One line: "I build AI agents that test software, and the systems that make them reliable."
- Official title: Data Science Lead, GenAI at QyrusAI (always "QyrusAI", linked to https://qyrus.ai; the legal entity "Qyrus India" appears only in the employer note).
- Lead with the professional systems work (Systems section). Open source is supporting work. Native macOS apps are experiments in agentic development, never his identity.
- Distinguish built, led, architected and prototyped. No invented metrics, client names, rankings or internal codenames (the computer-use model is described generically, never by name).
- Model work matters: he trained and fine-tuned models before LLMs and still does. Do not describe him as "applied only".

## Where things live

| Path | Purpose |
| --- | --- |
| `src/data/*.js` | All content. Edit copy here, never inline in components. `profile.js` holds identity, links, bio, nav, "now" items. |
| `src/data/systems.js` | Professional work, with `maturity` labels (shipped / architected / prototype / in progress). |
| `src/data/experience.js` | Timeline; `formatRange` formats dates. `employerNote` is the Quinnox → Qyrus India transition. |
| `src/data/projects.js` | Open-source list with `featured`, `category`, `stars` snapshot. |
| `src/data/*-snapshot.json` | Optional build-time data from `npm run refresh:data`; merged by `src/lib/data.js`. Keep the empty shape when unused. |
| `src/components/` | One component per file, default export, `"use client"` only when hooks or motion are used. |
| `src/lib/motion.js` | Shared framer-motion presets. Use them. |
| `src/lib/linkify.js` | `linkCompany(text)` wraps "QyrusAI" in prose with its link. Use it for any new prose that mentions the company. |
| `src/app/resume/` | Print-ready resume built from the same data. `public/resume.tex` is the owner's LaTeX, edited by hand only. |
| `scripts/` | `refresh-data.mjs` (GitHub + Medium snapshots), `publish-github-pages.sh` (sync `out/` to the mirror repo). |

## Commands

```bash
npm run dev            # local dev (turbopack)
npm run build          # static export to out/
npx next lint          # must be clean before a commit
npm run refresh:data   # optional; needs network, GITHUB_TOKEN optional
npm run publish:gh     # build + sync into ../vatsalsaglani.github.io (then commit/push there)
```

## Definition of done for any UI change

1. `npx next lint` and `npm run build` pass.
2. Checked in both themes (`data-theme="dark"` and `"light"` on `<html>`) at 1440 and 390 wide. No horizontal scroll at 390.
3. Scroll reveals, hover states and continuous animations respect `prefers-reduced-motion`.
4. New prose went into `src/data`, not JSX. Icons are inline SVG from `Icons.js` / `SectionIcons.js`, never emoji or icon fonts.
5. No new dependencies without a reason written in the PR or commit.
6. If the change is visible, publish the mirror too (`npm run publish:gh`, commit and push that repo).

## Things that are deliberately not here

- No client-side GitHub or Medium API calls at runtime (rate limits broke the old site). Snapshots only.
- No `next/image` (static export; use `<img>`).
- No three.js, jsPDF, html2canvas, KaTeX or draggable windows. The macOS theme is gone for good.
- No phone number on web pages. It lives only in the owner's LaTeX file if he chooses.
