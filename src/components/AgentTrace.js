"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// A looping, simulated agent run. Every line is illustrative, not a real product log.
const RUN = [
  { k: "objective", t: "Sign in with a saved card and confirm the order total shows tax." },
  { k: "plan", t: "Open app, authenticate, add item, reach checkout, read total." },
  { k: "tool", name: "device.launch", args: "ios · iPhone 15 · build 4.2.1", ms: 1840 },
  { k: "tool", name: "screen.observe", args: "login form · 2 fields · 1 button", ms: 210 },
  { k: "tool", name: "ui.type", args: "#email → ada@example.com", ms: 96 },
  { k: "tool", name: "ui.tap", args: "button 'Continue'", ms: 74 },
  { k: "tool", name: "screen.observe", args: "catalog · 24 cells", ms: 188 },
  { k: "memory", t: "Recalled locator for 'Add to bag' from a previous run." },
  { k: "tool", name: "ui.tap", args: "cell[3] → 'Add to bag'", ms: 81 },
  { k: "tool", name: "ui.tap", args: "nav 'Bag' → 'Checkout'", ms: 90 },
  { k: "tool", name: "screen.observe", args: "checkout · total $42.80 · tax $3.20", ms: 203 },
  { k: "check", t: "Total includes tax → pass.", ok: true },
  { k: "evidence", t: "11 steps · 9 screenshots · 1 network trace saved." },
  { k: "done", t: "Reusable test written: checkout_total_with_tax" },
];

const LABEL = {
  objective: "objective",
  plan: "plan",
  tool: "tool",
  memory: "memory",
  check: "check",
  evidence: "evidence",
  done: "done",
};

function Line({ line }) {
  if (line.k === "tool") {
    return (
      <div className="grid grid-cols-[4.5rem_1fr_auto] gap-3">
        <span className="text-muted">{LABEL.tool}</span>
        <span className="min-w-0 truncate">
          <span className="text-fg">{line.name}</span>
          <span className="text-muted"> · {line.args}</span>
        </span>
        <span className="text-muted tabular-nums">{line.ms}ms</span>
      </div>
    );
  }
  const tone =
    line.k === "done" || line.ok ? "text-signal" : line.k === "objective" ? "text-accent" : line.k === "memory" ? "text-fg" : "text-muted";
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-3">
      <span className={cn(line.k === "objective" ? "text-accent" : "text-muted")}>{LABEL[line.k]}</span>
      <span className={cn("min-w-0", tone, line.k === "objective" && "text-fg")}>{line.t}</span>
    </div>
  );
}

export default function AgentTrace() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? RUN.length : 0);
  const [cycle, setCycle] = useState(0);
  const listRef = useRef(null);

  // Reveal lines one at a time, pause on the final line, then restart.
  useEffect(() => {
    if (reduce) return;
    let timer;
    if (count < RUN.length) {
      const next = RUN[count];
      const delay = next.k === "tool" ? 260 + Math.min(next.ms, 900) * 0.35 : next.k === "objective" ? 400 : 700;
      timer = setTimeout(() => setCount((c) => c + 1), delay);
    } else {
      timer = setTimeout(() => {
        setCount(0);
        setCycle((c) => c + 1);
      }, 4200);
    }
    return () => clearTimeout(timer);
  }, [count, reduce]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [count]);

  const visible = RUN.slice(0, count);
  const done = count === RUN.length;
  const tools = visible.filter((l) => l.k === "tool");
  const elapsed = tools.reduce((s, l) => s + l.ms, 0);

  return (
    <div className="card relative flex aspect-[3/4] flex-col overflow-hidden font-mono text-[12px] leading-relaxed sm:aspect-[4/5] sm:text-[13px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", done ? "bg-signal" : "bg-accent animate-pulseDot")} />
          <span className="eyebrow !text-fg">session · ios</span>
        </div>
        <span className="eyebrow tabular-nums">
          run {String(cycle + 1).padStart(3, "0")} · {done ? "complete" : "live"}
        </span>
      </div>

      {/* Log */}
      <div ref={listRef} className="relative flex-1 space-y-2.5 overflow-hidden px-5 py-4">
        <AnimatePresence initial={false}>
          {visible.map((line, i) => (
            <motion.div
              key={`${cycle}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Line line={line} />
            </motion.div>
          ))}
        </AnimatePresence>
        {!done && (
          <div className="flex items-center gap-2 text-muted">
            <span className="inline-block h-[1.1em] w-[0.55em] animate-caret bg-accent" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Telemetry footer */}
      <div className="grid grid-cols-3 divide-x divide-line/10 border-t border-line/10">
        {[
          ["steps", String(tools.length).padStart(2, "0")],
          ["elapsed", `${(elapsed / 1000).toFixed(1)}s`],
          ["evidence", done ? "9 shots" : `${Math.max(0, tools.filter((l) => l.name === "screen.observe").length)} shots`],
        ].map(([k, v]) => (
          <div key={k} className="px-5 py-3">
            <p className="eyebrow">{k}</p>
            <p className="mt-1 font-serif text-xl text-fg tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
