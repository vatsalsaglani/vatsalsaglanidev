#!/usr/bin/env node
// Refreshes src/data/github-snapshot.json and src/data/medium-snapshot.json.
// Each fetch is independent; on failure the previous snapshot is kept. Always exits 0.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const GITHUB_USER = "vatsalsaglani";
const MEDIUM_FEED = "https://medium.com/feed/@thevatsalsaglani";
const dataDir = new URL("../src/data/", import.meta.url);
const snapshotPath = (name) => fileURLToPath(new URL(name, dataDir));

const KNOWN_PUBLICATIONS = {
  "ai.plainenglish.io": "AI in Plain English",
  "pub.towardsai.net": "Towards AI",
  "generativeai.pub": "Generative AI",
  "levelup.gitconnected.com": "Level Up Coding",
};

async function fetchWithTimeout(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res;
}

async function refreshGithub() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-refresh-data" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetchWithTimeout(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, { headers });
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error("unexpected GitHub response");

  const repos = {};
  for (const repo of list) {
    repos[repo.name] = {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      pushedAt: repo.pushed_at,
      description: repo.description,
      language: repo.language,
    };
  }
  await writeFile(snapshotPath("github-snapshot.json"), `${JSON.stringify({ fetchedAt: new Date().toISOString(), repos }, null, 2)}\n`);
  return Object.keys(repos).length;
}

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};

function derivePublication(url) {
  const { hostname, pathname } = new URL(url);
  if (KNOWN_PUBLICATIONS[hostname]) return KNOWN_PUBLICATIONS[hostname];
  if (hostname === "medium.com") {
    const first = pathname.split("/").filter(Boolean)[0];
    if (first && !first.startsWith("@")) {
      return first.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return "Medium";
  }
  if (hostname.endsWith(".medium.com")) return "Medium";
  return hostname;
}

function parseFeed(xml) {
  const posts = [];
  const seenTitles = new Set();
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = tag(item, "title");
    const link = tag(item, "link");
    const pubDate = tag(item, "pubDate");
    if (!title || !link || seenTitles.has(title)) continue;
    seenTitles.add(title);

    const url = new URL(link);
    url.search = "";
    url.hash = "";
    const date = new Date(pubDate);
    posts.push({
      title,
      url: url.toString(),
      date: Number.isNaN(date.getTime()) ? null : date.toISOString(),
      publication: derivePublication(url.toString()),
      tags: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) => decode(m[1])),
    });
  }
  return posts;
}

async function refreshMedium() {
  const res = await fetchWithTimeout(MEDIUM_FEED, { headers: { "User-Agent": "portfolio-refresh-data" } });
  const posts = parseFeed(await res.text());
  if (!posts.length) throw new Error("no posts found in feed");
  await writeFile(snapshotPath("medium-snapshot.json"), `${JSON.stringify({ fetchedAt: new Date().toISOString(), posts }, null, 2)}\n`);
  return posts.length;
}

async function hasSnapshot(name) {
  try {
    await readFile(snapshotPath(name));
    return true;
  } catch {
    return false;
  }
}

async function run(label, file, task) {
  try {
    const count = await task();
    console.log(`${label}: wrote ${count} entries to ${file}`);
  } catch (err) {
    const kept = (await hasSnapshot(file)) ? "keeping the previous snapshot" : "no previous snapshot";
    console.warn(`${label}: refresh failed (${err.cause?.code || err.message}); ${kept}.`);
  }
}

await run("GitHub", "github-snapshot.json", refreshGithub);
await run("Medium", "medium-snapshot.json", refreshMedium);
process.exit(0);
