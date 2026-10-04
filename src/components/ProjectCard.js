"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { categories } from "@/data/projects";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn, formatStars } from "@/lib/utils";
import { ArrowUpRight, Star } from "./SectionIcons";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };
const MAX_TILT = 5;

const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? id;

export default function ProjectCard({ project, size = "md", className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING);

  const { name, tagline, description, category, year, language, stack, stars, status, repo } = project;
  const isNew = !stars && year === 2026;

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (reduce) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cn("[perspective:1100px]", className)}
    >
      <motion.a
        ref={ref}
        href={repo}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="card group relative flex h-full flex-col justify-between gap-10 overflow-hidden p-6 transition-colors duration-300 hover:border-line/30 md:p-8"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.14), transparent 65%)",
          }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow">
              {categoryLabel(category)} · {year} · {language}
            </p>
            <ArrowUpRight
              size={20}
              className="shrink-0 text-muted transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </div>
          <h3 className={cn("mt-6 font-serif leading-none", size === "lg" ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl")}>
            {name}
          </h3>
          <p className="mt-4 text-lg text-fg">{tagline}</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">{description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center justify-between gap-4 border-t border-line/10 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            {stars > 0 && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-fg">
                <Star className="text-accent" />
                {formatStars(stars)}
              </span>
            )}
            {isNew && <span className="chip border-accent/40 text-accent">New</span>}
            <span className="chip">{status}</span>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted transition-colors group-hover:text-fg">
            Repo
            <ArrowUpRight size={14} />
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}
