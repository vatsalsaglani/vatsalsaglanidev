#!/usr/bin/env node
// Static SEO checks over the exported site in out/. Run after `npm run build`.
// Fails (exit 1) on anything that would hurt indexing; prints warnings for soft issues.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const SITE = "https://vatsalsaglani.pages.dev";
const PAGES = [
  { file: "index.html", url: `${SITE}/`, index: true },
  { file: "resume/index.html", url: `${SITE}/resume/`, index: true },
  { file: "404.html", url: null, index: false },
];

const errors = [];
const warns = [];
const read = (f) => fs.readFileSync(path.join(OUT, f), "utf8");
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];
const metas = (html) => [...html.matchAll(/<meta[^>]+>/g)].map((m) => m[0]);
const metaContent = (html, key, val) => metas(html).filter((m) => attr(m, key) === val).map((m) => attr(m, "content"));
const text = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

if (!fs.existsSync(OUT)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

for (const page of PAGES) {
  const html = read(page.file);
  const where = page.file;

  const titles = [...html.matchAll(/<title>(.*?)<\/title>/g)].map((m) => m[1]);
  if (titles.length !== 1) errors.push(`${where}: expected 1 <title>, found ${titles.length}`);
  else if (titles[0].length < 15 || titles[0].length > 70) warns.push(`${where}: title length ${titles[0].length} (aim 15–70): "${titles[0]}"`);

  const desc = metaContent(html, "name", "description");
  if (desc.length !== 1) errors.push(`${where}: expected 1 meta description, found ${desc.length}`);
  else if (desc[0].length < 50 || desc[0].length > 170) warns.push(`${where}: description length ${desc[0].length} (aim 50–160)`);

  const robots = metaContent(html, "name", "robots");
  const canon = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  if (page.index) {
    if (robots.some((r) => /noindex/.test(r))) errors.push(`${where}: indexable page carries noindex (${robots.join(" | ")})`);
    if (canon.length !== 1) errors.push(`${where}: expected 1 canonical, found ${canon.length}`);
    else if (canon[0] !== page.url) errors.push(`${where}: canonical ${canon[0]} != ${page.url}`);
    const ogUrl = metaContent(html, "property", "og:url");
    if (ogUrl[0] !== page.url) errors.push(`${where}: og:url ${ogUrl[0]} != ${page.url}`);
    const ogImg = metaContent(html, "property", "og:image")[0];
    if (!ogImg) errors.push(`${where}: missing og:image`);
    else {
      const rel = ogImg.replace(SITE, "");
      if (!fs.existsSync(path.join(OUT, rel))) errors.push(`${where}: og:image file missing: ${rel}`);
    }
    if (!metaContent(html, "name", "twitter:card").length) warns.push(`${where}: no twitter:card`);
  } else {
    if (!robots.some((r) => /noindex/.test(r))) errors.push(`${where}: 404 page should be noindex`);
    if (robots.some((r) => /^index/.test(r))) errors.push(`${where}: 404 page also says "${robots.join(" | ")}"`);
    if (canon.length) errors.push(`${where}: 404 page should not have a canonical`);
  }

  const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) => text(m[1]));
  if (h1s.length !== 1) errors.push(`${where}: expected 1 <h1>, found ${h1s.length}`);
  if (!/<html[^>]*lang="en"/.test(html)) errors.push(`${where}: <html lang> missing`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      const data = JSON.parse(m[1]);
      if (!data["@context"]) errors.push(`${where}: JSON-LD without @context`);
      const types = (data["@graph"] || [data]).map((n) => n["@type"]);
      console.log(`  ${where}: JSON-LD ok (${types.join(", ")})`);
    } catch (e) {
      errors.push(`${where}: JSON-LD does not parse: ${e.message}`);
    }
  }
  if (page.index && !/application\/ld\+json/.test(html)) warns.push(`${where}: no JSON-LD`);

  for (const m of html.matchAll(/<img[^>]*>/g)) {
    if (!/alt="/.test(m[0])) errors.push(`${where}: <img> without alt: ${m[0].slice(0, 80)}`);
  }

  // Internal links must resolve to exported files.
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    const candidates = [href, href.replace(/\/$/, "") + "/index.html", href + "index.html"].map((c) => path.join(OUT, c));
    if (!candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile())) errors.push(`${where}: internal link does not resolve: ${href}`);
  }
  if (/undefined|\[object Object\]|NaN/.test(text(html.replace(/<script[\s\S]*?<\/script>/g, "")))) warns.push(`${where}: suspicious literal (undefined / [object Object] / NaN) in visible text`);
}

// Sitemap and robots.
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  if (!loc.startsWith(SITE)) errors.push(`sitemap: ${loc} is not on ${SITE}`);
  const rel = loc.replace(SITE, "") || "/";
  if (!fs.existsSync(path.join(OUT, rel, "index.html"))) errors.push(`sitemap: ${loc} has no exported page`);
}
for (const p of PAGES.filter((p) => p.index)) if (!locs.includes(p.url)) errors.push(`sitemap: missing ${p.url}`);
const robotsTxt = read("robots.txt");
if (!/Sitemap:\s*\S+/.test(robotsTxt)) errors.push("robots.txt: no Sitemap line");
if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) errors.push("robots.txt: disallows everything");

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `\n${errors.length} error(s), ${warns.length} warning(s)` : `\nSEO check passed (${warns.length} warning(s))`);
process.exit(errors.length ? 1 : 0);
