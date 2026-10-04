import { projects } from "@/data/projects";
import { writing } from "@/data/writing";
import githubSnapshot from "@/data/github-snapshot.json";
import mediumSnapshot from "@/data/medium-snapshot.json";

const WRITING_LIMIT = 8;

const repoName = (url) => (url || "").replace(/\/+$/, "").split("/").pop().toLowerCase();

// Curated projects with live star counts from the snapshot (when it has the repo).
export function getProjects() {
  const repos = {};
  for (const [name, data] of Object.entries(githubSnapshot.repos || {})) repos[name.toLowerCase()] = data;

  return projects.map((project) => {
    const live = repos[repoName(project.repo)];
    return live && typeof live.stars === "number" ? { ...project, stars: live.stars } : project;
  });
}

// Curated posts plus any newer posts from the Medium snapshot, newest first.
export function getWriting() {
  const seen = new Set(writing.map((post) => post.url));
  const extra = (mediumSnapshot.posts || [])
    .filter((post) => post.url && !seen.has(post.url))
    .map((post) => ({ tags: [], publication: "Medium", ...post, blurb: "" }));

  return [...writing, ...extra].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, WRITING_LIMIT);
}
