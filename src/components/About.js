"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { publications } from "@/data/publications";
import { skills } from "@/data/skills";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import SectionHeading from "./SectionHeading";
import AgentTrace from "./AgentTrace";
import { ArrowUpRight } from "./SectionIcons";

const reveal = {
  variants: stagger(0.1),
  initial: "hidden",
  whileInView: "show",
  viewport: viewportOnce,
};

function Trace() {
  return (
    <motion.figure variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mx-auto max-w-xs sm:max-w-sm lg:max-w-none">
      <AgentTrace />
      <figcaption className="eyebrow mt-4 flex items-center justify-between">
        <span>A simulated run, looping</span>
        <span className="text-accent">{profile.location}</span>
      </figcaption>
    </motion.figure>
  );
}

function Toolbox() {
  return (
    <motion.div {...reveal} className="mt-16 md:mt-20">
      <motion.h3 variants={fadeUp} className="font-serif text-3xl md:text-4xl">
        Toolbox
      </motion.h3>
      <div className="mt-6 border-t border-line/10">
        {skills.map((s) => (
          <motion.div
            key={s.group}
            variants={fadeUp}
            className="grid gap-3 border-b border-line/10 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-6"
          >
            <p className="eyebrow pt-1.5">{s.group}</p>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((item) => (
                <li key={item} className="chip normal-case tracking-normal">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Publications() {
  return (
    <motion.div {...reveal} className="mt-16 md:mt-20">
      <div className="flex items-end justify-between gap-4">
        <motion.h3 variants={fadeUp} className="font-serif text-3xl md:text-4xl">
          Publications
        </motion.h3>
        <motion.a
          variants={fadeUp}
          href={profile.links.scholar.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 font-mono text-xs uppercase tracking-wider text-fg link-underline"
        >
          Google Scholar
          <ArrowUpRight size={14} />
        </motion.a>
      </div>
      <ol className="mt-6 border-t border-line/10">
        {publications.map((p, i) => (
          <motion.li
            key={p.title}
            variants={fadeUp}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-b border-line/10 py-5 md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:gap-x-5"
          >
            <span className="pt-1 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-serif text-lg leading-snug">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.venue}</p>
            </div>
            <p className="col-start-2 mt-2 font-mono text-xs text-muted md:col-start-3 md:mt-1 md:text-right">
              {p.year} · {p.citations} cit.
            </p>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

export default function About() {
  const [lead, ...rest] = profile.about;

  return (
    <section id="about" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="05"
          eyebrow="About"
          title={
            <>
              Who is <em>behind</em> this
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <Trace />
          </div>

          <div className="lg:col-span-7">
            <motion.div {...reveal} className="space-y-6 text-lg leading-relaxed text-muted">
              <motion.p variants={fadeUp} className="text-2xl leading-snug text-fg md:text-3xl">
                {lead}
              </motion.p>
              {rest.map((para) => (
                <motion.p key={para} variants={fadeUp}>
                  {para}
                </motion.p>
              ))}
            </motion.div>
            <Toolbox />
            <Publications />
          </div>
        </div>
      </div>
    </section>
  );
}
