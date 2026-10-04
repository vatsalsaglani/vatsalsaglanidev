"use client";

import { useReducedMotion } from "framer-motion";

// Seamless strip: the list is rendered twice and translated by -50% (see `animate-marquee`).
export default function Marquee({ items, speed = 40 }) {
  const reduce = useReducedMotion();

  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="px-6">{item}</span>
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  if (reduce) {
    return (
      <div className="border-y border-line/10 py-4">
        <ul className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-6">
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden border-y border-line/10 py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
