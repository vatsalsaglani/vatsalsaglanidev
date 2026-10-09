"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { now, profile } from "@/data/profile";
import { linkCompany } from "@/lib/linkify";
import { EASE } from "@/lib/motion";
import FieldCanvas from "@/components/FieldCanvas";
import Marquee from "@/components/Marquee";
import { ArrowDown, Github, Linkedin, Medium, X } from "@/components/Icons";

const socials = [
  { key: "github", Icon: Github },
  { key: "linkedin", Icon: Linkedin },
  { key: "medium", Icon: Medium },
  { key: "x", Icon: X },
];

function useLocalTime(timeZone) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
    let timer;
    const tick = () => {
      setTime(fmt.format(new Date()));
      // Re-arm for the next minute boundary so the clock never drifts.
      timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, [timeZone]);

  return time;
}

function MaskedWord({ children, delay, reduce }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        initial={reduce ? false : { y: "110%", rotate: 2 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function RotatingWord({ roles, reduce }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, [roles.length]);

  const motionProps = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: "40%", opacity: 0, filter: "blur(8px)" },
        animate: { y: 0, opacity: 1, filter: "blur(0px)" },
        exit: { y: "-30%", opacity: 0, filter: "blur(6px)" },
      };

  // Every role is rendered invisibly in the same grid cell so the block always
  // reserves the tallest phrase and the page never jumps when the word changes.
  return (
    <span className="inline-grid max-w-full align-top">
      {roles.map((role) => (
        <span key={role} aria-hidden="true" className="invisible col-start-1 row-start-1">
          <em className="italic">{role}</em>
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={roles[index]}
          className="col-start-1 row-start-1"
          transition={{ duration: 0.6, ease: EASE }}
          {...motionProps}
        >
          <em className="italic text-accent">{roles[index]}</em>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const time = useLocalTime(profile.timeZone);
  const city = useMemo(() => profile.location.split(",")[0], []);
  const [first, last] = profile.name.split(" ");

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <FieldCanvas />

      <div className="wrap relative z-10 flex flex-1 flex-col pb-8 pt-24 md:pb-10">
        <motion.div
          {...rise(0.1)}
          className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1.5"
        >
          <span>{city}</span>
          <span aria-hidden="true">·</span>
          <time className="tabular-nums text-fg" dateTime={time ?? undefined}>
            {time ?? "--:--"}
          </time>
          {profile.available && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-signal opacity-60 motion-safe:animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-signal motion-safe:animate-pulseDot" />
                </span>
                {profile.availabilityNote}
              </span>
            </>
          )}
        </motion.div>

        <div className="my-auto py-12 md:py-16">
          <h1 className="break-words font-serif text-display-xl">
            {/* Screen readers and crawlers get one plain sentence; the animated copy below is presentation. */}
            <span className="sr-only">{`${profile.name} builds ${profile.rotatingRoles[0]}.`}</span>
            <span aria-hidden="true">
              <span className="block">
                <MaskedWord delay={0.2} reduce={reduce}>{first}</MaskedWord>{" "}
                <MaskedWord delay={0.32} reduce={reduce}>{last}</MaskedWord>
              </span>
              <motion.span
                className="block"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
              >
                <span className="text-muted">builds</span> <RotatingWord roles={profile.rotatingRoles} reduce={reduce} />
              </motion.span>
            </span>
          </h1>

          <motion.p {...rise(0.75)} className="mt-8 max-w-2xl text-base text-muted md:mt-10 md:text-lg">
            {linkCompany(profile.bio)}
          </motion.p>

          <motion.div {...rise(0.9)} className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
            <a href="#work" className="btn-primary">
              See the work
              <ArrowDown className="text-base" />
            </a>
            <a href="#contact" className="btn-ghost">
              Get in touch
            </a>
            <ul className="ml-1 flex items-center gap-2">
              {socials.map(({ key, Icon }) => (
                <li key={key}>
                  <a
                    href={profile.links[key].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${profile.links[key].label} (opens in a new tab)`}
                    className="grid h-10 w-10 place-items-center rounded-full text-muted transition-all duration-300 hover:-translate-y-0.5 hover:bg-line/10 hover:text-accent"
                  >
                    <Icon className="text-[20px]" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.a
            href="#work"
            {...rise(1.1)}
            className="eyebrow hidden w-fit items-center gap-3 md:flex"
            aria-label="Scroll to work"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-line/15">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-accent"
                animate={reduce ? undefined : { y: [-12, 32] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
              />
            </span>
            scroll
          </motion.a>

          <motion.dl
            {...rise(1.3)}
            className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 md:gap-x-10"
          >
            {profile.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="eyebrow mt-2 max-w-[9rem]">{s.label}</dt>
                <dd className="font-serif text-4xl leading-none tracking-tight md:text-5xl">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <div className="relative z-10">
        <Marquee items={now} />
      </div>
    </section>
  );
}
