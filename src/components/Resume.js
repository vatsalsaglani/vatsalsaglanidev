import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { profile } from "@/data/profile";
import { experience, formatRange } from "@/data/experience";
import { skills } from "@/data/skills";
import { publications } from "@/data/publications";
import { getProjects } from "@/lib/data";

// Mirrors the project list in public/resume.tex.
const RESUME_SLUGS = ["tinker", "graphrag4rec", "claudetools", "funcreact", "bert4rec", "image-captioning-transformer"];

function selectProjects() {
  const all = getProjects();
  return RESUME_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(Boolean);
}

const bare = (url) => url.replace(/^https?:\/\//, "").replace(/\/+$/, "");

function contactLinks() {
  const { links } = profile;
  return [
    { label: profile.email, href: `mailto:${profile.email}` },
    { label: bare(profile.siteUrl), href: profile.siteUrl },
    { label: "GitHub", href: links.github.url },
    { label: "LinkedIn", href: links.linkedin.url },
    { label: "Medium", href: links.medium.url },
    { label: "Scholar", href: links.scholar.url },
  ];
}

function Section({ title, children }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-4 border-b border-line/20 pb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({ item }) {
  return (
    <article className="resume-entry">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-base font-medium">
          {item.role}
          <span className="font-normal text-muted"> · {item.org}</span>
        </h3>
        <p className="font-mono text-xs text-muted">{formatRange(item.start, item.end)}</p>
      </div>
      {item.location && <p className="font-mono text-xs text-muted">{item.location}{item.employerNote ? ` · ${item.employerNote}` : ""}</p>}
      {item.highlights.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed marker:text-muted">
          {item.highlights.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed">{item.summary}</p>
      )}
    </article>
  );
}

export default function Resume() {
  const work = experience.filter((e) => e.type === "work");
  const education = experience.filter((e) => e.type === "education");
  const projects = selectProjects();

  return (
    <div className="resume-page min-h-dvh pb-16 print:pb-0">
      <div className="no-print sticky top-0 z-40 border-b border-line/10 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-[52rem] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="link-underline font-mono text-xs uppercase tracking-wider">
            &larr; Back
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/resume.tex" download className="btn-ghost">
              Download LaTeX (.tex)
            </a>
            <PrintButton />
          </div>
        </div>
      </div>

      <main className="px-4 pt-8 print:p-0">
        <div className="resume-sheet mx-auto max-w-[52rem] rounded-xl2 border border-line/10 bg-raised p-6 shadow-card sm:p-10 md:p-14">
          <header className="mb-8">
            <h1 className="font-serif text-5xl leading-none tracking-tight">{profile.name}</h1>
            <p className="mt-3 text-base">
              {profile.role}, {profile.company} · {profile.headline} · {profile.location}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
              {contactLinks().map((link) => (
                <a key={link.href} href={link.href} className="link-underline hover:text-fg">
                  {link.label}
                </a>
              ))}
            </p>
          </header>

          <Section title="Experience">
            <div className="space-y-6">
              {work.map((item) => (
                <Entry key={item.id} item={item} />
              ))}
            </div>
          </Section>

          <Section title="Selected projects">
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.slug} className="resume-project text-sm leading-relaxed">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-muted"> — {project.tagline}</span>
                  <br />
                  <a href={project.repo} className="link-underline font-mono text-xs text-muted hover:text-fg">
                    {bare(project.repo)}
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Skills">
            <dl className="space-y-2 text-sm leading-relaxed">
              {skills.map((skill) => (
                <div key={skill.group} className="sm:flex sm:gap-4">
                  <dt className="shrink-0 font-medium sm:w-40">{skill.group}</dt>
                  <dd className="text-muted">{skill.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Education">
            <div className="space-y-4">
              {education.map((item) => (
                <Entry key={item.id} item={item} />
              ))}
            </div>
          </Section>

          <Section title="Publications">
            <ul className="space-y-3">
              {publications.map((pub) => (
                <li key={pub.title} className="resume-project text-sm leading-relaxed">
                  <span className="font-medium">{pub.title}</span>
                  <br />
                  <span className="text-muted">
                    {pub.venue}, {pub.year} · {pub.citations} citations
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </main>
    </div>
  );
}
