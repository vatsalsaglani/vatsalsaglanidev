# SEO notes

How discoverability is handled on this site, what was checked, and what to review by hand. Nothing here is automated against a search console; the numbers you want come from Google Search Console once it is connected, which it is not as of this writing.

## What the site does

- **One primary domain.** `https://vatsalsaglani.pages.dev` is canonical. The GitHub Pages mirror serves the same build, and every page there carries a canonical pointing at pages.dev, so the mirror does not compete. `robots.txt` and `sitemap.xml` reference pages.dev only.
- **Per-route metadata.** Title, description, canonical, Open Graph and Twitter tags are set per route in `src/app/layout.js` (home), `src/app/resume/page.js` and `src/app/not-found.js`. Shared strings live in `src/lib/seo.js` so routes cannot drift apart.
- **Structured data.** `src/lib/seo.js` builds JSON-LD from the data files: `WebSite`, `Person` (name, title, employer, Bengaluru, alma mater, profile links, a short list of skills) and `ProfilePage` on the home page; `Person`, `WebPage` and the publication list on `/resume/`. Every value is already visible on the page or in `src/data/profile.js`. Do not add fields that are not.
- **Crawlable text.** All content is server-rendered into the static HTML. Canvases (hero field, portrait) have `role="img"` and labels. The hero `<h1>` has one plain sentence for assistive tech and crawlers; the animated words are presentation.
- **404.** Own title, `noindex`, no canonical, no social tags.

## Page-to-intent map (hypotheses, not measured)

| URL | Intent it should satisfy | Primary signals |
| --- | --- | --- |
| `/` | "Who is Vatsal Saglani", "Vatsal Saglani QyrusAI", AI agent / autonomous testing engineer in Bengaluru, authors of GraphRAG4Rec, claudetools, Tinker | H1, Systems section, project cards, Person JSON-LD, profile links |
| `/resume/` | "Vatsal Saglani resume / CV" | Resume title, Person + publications JSON-LD, printable layout |
| Medium articles (external) | MCP architecture, schema-first function calling, local agent swarms | Linked from the Writing section with descriptive titles |

These are guesses about what people search for. Replace them with real queries from Search Console after a few weeks of data.

## Manual review checklist

Do this once after connecting Search Console, then roughly monthly.

1. **Baseline.** Note impressions, clicks and average position for `/` and `/resume/` over the last 28 days. Note the top 10 queries. Keep the numbers in this file's history, not in the site.
2. **Coverage.** Both URLs indexed, no "duplicate without user-selected canonical" for the github.io mirror. If the mirror shows up as canonical anywhere, that is a bug to fix here, not in the dashboard.
3. **Rich results.** Run `https://vatsalsaglani.pages.dev/` through the Rich Results Test and the Schema Markup Validator. ProfilePage and Person should parse without errors.
4. **Social cards.** Paste both URLs into the X card validator and LinkedIn post inspector. The image is `public/assets/og.png`; regenerate it if the positioning line changes.
5. **Links.** Run `npm run build && npm run check:seo`. It fails on broken internal links, missing canonicals, bad JSON-LD, and sitemap drift.
6. **Content freshness.** When a new article or project ships, add it to `src/data` and rebuild. The sitemap `lastmod` is the build time.

## Things deliberately not done

- No separate pages per project, skill or location. The home page is the entity page; thin pages would compete with it.
- No FAQ, review or rating markup. There is nothing on the page to back it.
- No keyword lists in copy. Descriptions say what the person does in plain language.
- No bought links, link exchanges or automated outreach. Google's spam policies treat these as manipulation.
- No special "AI search" files or schema. Google states that ordinary SEO fundamentals apply to AI features; there is no extra file to add.
- No automation that posts, publishes or schedules on the owner's behalf.

## If you change something

Before and after any copy or metadata change, diff the built HTML (`out/index.html`, `out/resume/index.html`) and confirm the H1, section headings, project names, links and JSON-LD still match. `npm run check:seo` catches the mechanical part; the content part is a human read.
