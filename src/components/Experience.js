"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { experience, formatRange } from "@/data/experience";
import { linkCompany } from "@/lib/linkify";
import { EASE, fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";
import { GraduationCap } from "./SectionIcons";

const VISIBLE = 3;

function Node({ entry }) {
  const current = entry.end === null;
  return (
    <span className="absolute -left-11 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-bg" aria-hidden="true">
      {entry.type === "education" ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line/30 text-fg">
          <GraduationCap size={14} />
        </span>
      ) : (
        <span
          className={cn(
            "block h-2.5 w-2.5 rounded-full border",
            current ? "animate-pulseDot border-accent bg-accent ring-4 ring-accent/20" : "border-line/40 bg-bg"
          )}
        />
      )}
    </span>
  );
}

function Highlights({ items }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const extra = items.slice(VISIBLE);
  const bullet = (text) => (
    <li key={text} className="relative pl-5 text-sm leading-relaxed text-muted md:text-base">
      <span className="absolute left-0 top-[0.7em] h-px w-3 bg-accent" aria-hidden="true" />
      {text}
    </li>
  );

  return (
    <div className="mt-6">
      <ul className="space-y-3">{items.slice(0, VISIBLE).map(bullet)}</ul>
      {extra.length > 0 && (
        <>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                id={id}
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <li className="h-3" aria-hidden="true" />
                <div className="space-y-3">{extra.map(bullet)}</div>
              </motion.ul>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((v) => !v)}
            className="mt-4 font-mono text-xs uppercase tracking-wider text-fg link-underline"
          >
            {open ? "Show less" : `Show ${extra.length} more`}
          </button>
        </>
      )}
    </div>
  );
}

function Entry({ entry }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="relative pb-16 last:pb-0 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
    >
      <Node entry={entry} />
      <p className="mb-3 pt-2 font-mono text-xs uppercase tracking-wider text-muted lg:mb-0">
        {formatRange(entry.start, entry.end)}
      </p>
      <div>
        <h3 className="font-serif text-2xl leading-tight md:text-3xl">{entry.role}</h3>
        <p className="mt-2 text-muted">
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noopener noreferrer" className="link-underline text-fg">
              {entry.org}
            </a>
          ) : (
            <span className="text-fg">{entry.org}</span>
          )}
          {entry.location && <span> · {entry.location}</span>}
          {entry.employerNote && <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-muted/80">{entry.employerNote}</span>}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed md:text-lg">{linkCompany(entry.summary)}</p>
        {entry.highlights.length > 0 && <Highlights items={entry.highlights} />}
        {entry.stack.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {entry.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <section id="experience" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="03"
          eyebrow="Experience"
          title={
            <>
              Seven years of <em>applied</em> ML
            </>
          }
          lede="From classical NLP and computer vision to transformers, and now agent systems in production."
        />

        <div ref={ref} className="relative pl-11">
          <div className="absolute bottom-0 left-[14px] top-0 w-px bg-line/15" aria-hidden="true">
            <motion.div className="h-full w-full origin-top bg-accent" style={{ scaleY }} />
          </div>
          {experience.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
