"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { categories } from "@/data/projects";
import { getProjects } from "@/lib/data";
import { profile } from "@/data/profile";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn, formatStars } from "@/lib/utils";
import ProjectCard from "./ProjectCard";

const projects = getProjects();
import SectionHeading from "./SectionHeading";
import { ArrowUpRight } from "./SectionIcons";

const FEATURED_ORDER = ["tinker", "cider", "graphrag4rec", "claudetools", "capsule", "rafu", "llama-cpp-search", "swarmloka"];
const rank = (p) => { const i = FEATURED_ORDER.indexOf(p.slug); return i === -1 ? 99 : i; };
const featured = projects.filter((p) => p.featured).sort((x, y) => rank(x) - rank(y));

// 12-column editorial rhythm on lg: 7/5 then three equal cards.
// 8 featured cards: 7/5, then two rows of 4/4/4. Extra cards fall back to a third of the row.
const SPANS = ["md:col-span-2 lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

const ROW_GRID =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_7.5rem_3rem_3rem_1rem] md:gap-x-6";

function ProjectRow({ project }) {
  const label = categories.find((c) => c.id === project.category)?.label;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="border-b border-line/10"
    >
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(ROW_GRID, "group py-4 transition-colors duration-300 hover:bg-line/5 md:px-3")}
      >
        <div className="min-w-0 md:contents">
          <h4 className="truncate font-serif text-2xl leading-tight transition-colors group-hover:text-accent">
            {project.name}
          </h4>
          <p className="truncate text-sm text-muted">{project.tagline}</p>
        </div>
        <span className="hidden truncate font-mono text-[11px] uppercase tracking-wider text-muted md:block">
          {label}
        </span>
        <span className="hidden font-mono text-xs text-muted md:block">{project.year}</span>
        <span className="flex items-center justify-end gap-3 md:contents">
          <span className="font-mono text-xs text-muted md:text-right">
            {project.stars == null ? "—" : formatStars(project.stars)}
          </span>
          <ArrowUpRight
            size={16}
            className="text-muted transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </span>
      </a>
    </motion.li>
  );
}

export default function Work() {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="work" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="02"
          eyebrow="Open source"
          title={
            <>
              Things I have <em>shipped</em>
            </>
          }
          lede="Side projects, mostly things I wanted for myself and could not find. The weekend builds are exactly that: some took half a day, some took several weekends, all of them were built alongside coding agents."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} size={i === 0 ? "lg" : "md"} className={SPANS[i] ?? "lg:col-span-4"} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20 md:mt-28"
        >
          <p className="eyebrow mb-5">All projects · {visible.length}</p>
          <LayoutGroup id="work-filter">
            <div role="group" aria-label="Filter projects by category" className="mb-6 flex flex-wrap gap-2">
              {categories.map((c) => {
                const on = c.id === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(c.id)}
                    className={cn(
                      "relative rounded-full border border-line/15 px-4 py-1.5 text-sm transition-colors duration-300",
                      on ? "border-transparent text-bg" : "text-muted hover:border-line/40 hover:text-fg"
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="work-filter-pill"
                        className="absolute inset-0 rounded-full bg-fg"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <ul className="relative border-t border-line/10">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((p) => (
                <ProjectRow key={p.slug} project={p} />
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-10 flex justify-end">
            <a href={profile.links.github.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              All repositories on GitHub
              <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
