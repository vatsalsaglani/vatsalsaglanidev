"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { systems } from "@/data/systems";
import { profile } from "@/data/profile";
import { EASE, fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

const MATURITY_TONE = {
  shipped: "text-signal border-signal/30",
  architected: "text-fg border-line/25",
  prototype: "text-accent border-accent/40",
};
const toneFor = (m) => MATURITY_TONE[m.split(" ")[0]] ?? "text-muted";

function Row({ item, index, open, onToggle, reduce }) {
  const id = `system-${item.slug}`;
  return (
    <motion.li variants={fadeUp} className="border-t border-line/10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[3.5rem_1fr_auto] md:py-7"
      >
        <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className={cn("block font-serif text-2xl leading-tight transition-colors md:text-3xl", open ? "text-fg" : "text-fg/85 group-hover:text-fg")}>
            {item.title}
          </span>
          <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{item.role}</span>
        </span>
        <span className="flex items-center gap-3">
          <span className={cn("chip hidden sm:inline-flex", toneFor(item.maturity))}>{item.maturity}</span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line/15 text-fg"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="body"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 pl-[3.5rem] pr-2 md:grid-cols-12 md:pl-[4.5rem]">
              <div className="md:col-span-4">
                <p className="eyebrow mb-3">The problem</p>
                <p className="text-base leading-relaxed text-fg/90">{item.problem}</p>
                <span className={cn("chip mt-5 sm:hidden", toneFor(item.maturity))}>{item.maturity}</span>
              </div>
              <div className="md:col-span-5">
                <p className="eyebrow mb-3">Approach</p>
                <p className="text-base leading-relaxed text-muted">{item.approach}</p>
              </div>
              <div className="md:col-span-3">
                <p className="eyebrow mb-3">What it does</p>
                <ul className="space-y-2">
                  {item.capabilities.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-fg/85">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Systems() {
  const [openSlug, setOpenSlug] = useState(systems[0].slug);
  const reduce = useReducedMotion();

  return (
    <section id="systems" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="01"
          eyebrow={`Systems · ${profile.company}`}
          title={
            <>
              Agents that test software, and what makes them <em>reliable</em>
            </>
          }
          lede="The professional work. Each entry says what the problem was, what I did, how it works and how mature it is. Internal product names are translated into what the system actually does."
        />

        <motion.ul
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="border-b border-line/10"
        >
          {systems.map((item, i) => (
            <Row
              key={item.slug}
              item={item}
              index={i}
              reduce={reduce}
              open={openSlug === item.slug}
              onToggle={() => setOpenSlug(openSlug === item.slug ? null : item.slug)}
            />
          ))}
        </motion.ul>

        <p className="mt-8 max-w-2xl font-mono text-xs leading-relaxed text-muted">
          Maturity labels are conservative: shipped means in use inside the product, architected means designed and built
          without adoption claims, prototype means research. No metrics are quoted that I cannot stand behind.
        </p>
      </div>
    </section>
  );
}
