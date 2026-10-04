"use client";

import { motion } from "framer-motion";
import { getWriting } from "@/lib/data";
import { profile } from "@/data/profile";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn, formatDate } from "@/lib/utils";
import SectionHeading from "./SectionHeading";
import { ArrowUpRight } from "./SectionIcons";

const writing = getWriting();

const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat [box-decoration-break:clone] transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]";

function Tags({ article }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {article.series && <li className="chip border-accent/40 text-accent">Series</li>}
      {article.tags.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Meta({ article }) {
  return (
    <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
      <time dateTime={article.date} className="text-fg">
        {formatDate(article.date)}
      </time>
      <span>{article.publication}</span>
    </p>
  );
}

function Article({ article, featured }) {
  return (
    <motion.a
      variants={fadeUp}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col gap-5 rounded-xl2 border border-line/10 transition-colors duration-300 hover:border-line/40",
        featured ? "p-6 md:p-10 lg:col-span-3 md:col-span-2" : "p-6"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Meta article={article} />
        <ArrowUpRight
          size={featured ? 24 : 18}
          className="shrink-0 text-muted transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
        />
      </div>
      <h3 className={cn("font-serif leading-tight", featured ? "max-w-3xl text-4xl md:text-6xl" : "text-2xl")}>
        <span className={UNDERLINE}>{article.title}</span>
      </h3>
      <p className={cn("text-muted", featured ? "max-w-2xl text-base md:text-lg" : "line-clamp-3 text-sm")}>
        {article.blurb}
      </p>
      <div className="mt-auto pt-2">
        <Tags article={article} />
      </div>
    </motion.a>
  );
}

export default function Writing() {
  const [latest, ...rest] = writing;

  return (
    <section id="writing" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="03"
          eyebrow="Writing"
          title={
            <>
              Notes from the <em>field</em>
            </>
          }
          lede="Long-form write-ups on agent architectures, MCP and building with language models."
          action={
            <a href={profile.links.medium.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Read on Medium
              <ArrowUpRight size={16} />
            </a>
          }
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <Article article={latest} featured />
          {rest.map((a) => (
            <Article key={a.url + a.title} article={a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
