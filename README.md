# vatsalsaglani.pages.dev

Personal portfolio of Vatsal Saglani: work, experience, writing, a printable resume and a contact form. A static Next.js site, deployed to Cloudflare Pages and mirrored on GitHub Pages.

## Design

An editorial lab notebook: dark-first warm ink with a warm off-white paper theme, one signal-orange accent, huge Instrument Serif headings with italic emphasis, Geist for body text and Geist Mono for labels. Sections are numbered, divided by hairlines, and revealed with restrained framer-motion transitions.

## Stack

- Next.js 15 (app router, static export), React 19
- Tailwind CSS 3 with CSS-variable colour tokens (dark and light themes)
- framer-motion
- Plain JavaScript, no runtime dependencies beyond the above

## Project structure

```
src/
  app/            layout, home page, /resume, global styles and design tokens
  components/     page sections, Resume, Contact, Footer, shared UI
  data/           all site content (see below) plus generated snapshots
  lib/            motion presets, utilities, data merging (getProjects, getWriting)
scripts/
  refresh-data.mjs          fetch GitHub stars and Medium posts into snapshots
  publish-github-pages.sh   build and sync to the GitHub Pages repo
public/                     static assets, resume.tex
```

## Commands

```
npm run dev            # local dev server
npm run build          # static export to out/
npm run refresh:data   # update src/data/*-snapshot.json
npm run publish:gh     # build and sync out/ into ../vatsalsaglani.github.io
```

`refresh:data` calls the public GitHub and Medium endpoints. Set `GITHUB_TOKEN` to avoid unauthenticated rate limits. If a fetch fails, the previous snapshot is kept and the script still exits 0.

## Editing content

Everything lives in `src/data/`:

- `profile.js`: identity, links, bio, availability, contact endpoint, nav
- `experience.js`: work and education entries (also feeds the resume)
- `projects.js`: curated projects; star counts are overridden by the GitHub snapshot
- `writing.js`: curated articles; newer Medium posts from the snapshot are merged in
- `skills.js`, `publications.js`: resume and about content

The resume at `/resume/` is built from these files. `public/resume.tex` is the LaTeX version of the same content; update it when the data changes.

## Deployment

**Cloudflare Pages** (primary): build command `npm run build`, output directory `out`. The site is a static export, so no adapter or server runtime is needed.

**GitHub Pages mirror**: the `vatsalsaglani.github.io` repo serves the static build from its root with a `.nojekyll` file. Clone it next to this repo and run `npm run publish:gh` (or pass another path: `bash scripts/publish-github-pages.sh /path/to/repo`). The script builds, replaces the target contents (keeping `.git`, `README.md` and `CNAME`), and prints the git commands to commit and push.
