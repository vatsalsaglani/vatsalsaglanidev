# CLAUDE.md

Read `AGENTS.md` first (repo conventions, positioning, definition of done), then load the design skill at `.agents/skills/portfolio-design-system/SKILL.md` before any visual or copy change. Both apply to every agent working here.

Short version:

- Content lives in `src/data`. Components render it. Never hardcode copy or hex colors in JSX.
- Colors only via tokens (`bg-bg`, `text-fg`, `text-muted`, `border-line/10`, `text-accent`, `text-signal`). Both themes must work.
- Type: Instrument Serif for display (`font-serif`, italics for the emphasised word), Geist for body, Geist Mono for labels (`.eyebrow`).
- Motion: presets from `src/lib/motion.js`, ease `[0.22, 1, 0.36, 1]`, reveal once on scroll, always reduced-motion safe.
- The company is "QyrusAI" with a link to https://qyrus.ai. Use `linkCompany()` in prose.
- Lint and build must pass; check 1440 and 390 widths in dark and light before committing.
- Commit on the designated branch, then run `npm run publish:gh` and push the mirror repo when the change is visible.
