"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, profile } from "@/data/profile";
import { useTheme } from "@/components/ThemeProvider";
import {
  Copy,
  FileText,
  Github,
  Hash,
  Home,
  Linkedin,
  Mail,
  Medium,
  Moon,
  Scholar,
  Search,
  Sun,
  X,
} from "@/components/Icons";
import { cn } from "@/lib/utils";

const GROUPS = ["Navigate", "Links", "Theme", "Copy"];

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const openExternal = (url) => window.open(url, "_blank", "noopener,noreferrer");

const isTypingTarget = (el) =>
  el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export default function CommandPalette() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocus = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const items = useMemo(() => {
    const copy = (text) => () => navigator.clipboard?.writeText(text);
    return [
      { id: "top", group: "Navigate", label: "Top", hint: "section", keywords: "home hero start", Icon: Home, run: () => scrollToId("top") },
      ...nav.map((n) => ({
        id: n.id,
        group: "Navigate",
        label: n.label,
        hint: "section",
        keywords: "go jump section",
        Icon: Hash,
        run: () => scrollToId(n.id),
      })),
      { id: "resume", group: "Navigate", label: "Resume", hint: "page", keywords: "cv pdf", Icon: FileText, run: () => (window.location.href = "/resume/") },
      { id: "github", group: "Links", label: "GitHub", hint: "↗", keywords: "code repos open source", Icon: Github, run: () => openExternal(profile.links.github.url) },
      { id: "linkedin", group: "Links", label: "LinkedIn", hint: "↗", keywords: "profile career", Icon: Linkedin, run: () => openExternal(profile.links.linkedin.url) },
      { id: "medium", group: "Links", label: "Medium", hint: "↗", keywords: "blog articles writing", Icon: Medium, run: () => openExternal(profile.links.medium.url) },
      { id: "x", group: "Links", label: "X", hint: "↗", keywords: "twitter social", Icon: X, run: () => openExternal(profile.links.x.url) },
      { id: "scholar", group: "Links", label: "Google Scholar", hint: "↗", keywords: "papers publications citations research", Icon: Scholar, run: () => openExternal(profile.links.scholar.url) },
      { id: "email", group: "Links", label: "Email", hint: "↗", keywords: `mail contact ${profile.email}`, Icon: Mail, run: () => (window.location.href = `mailto:${profile.email}`) },
      {
        id: "theme",
        group: "Theme",
        label: "Toggle light/dark",
        hint: theme === "dark" ? "light" : "dark",
        keywords: "theme appearance mode",
        Icon: theme === "dark" ? Sun : Moon,
        run: toggleTheme,
      },
      { id: "copy-email", group: "Copy", label: "Copy email", hint: "⌘", keywords: profile.email, Icon: Copy, keepOpen: true, run: copy(profile.email) },
      { id: "copy-url", group: "Copy", label: "Copy site URL", hint: "⌘", keywords: "link share", Icon: Copy, keepOpen: true, run: copy(profile.siteUrl) },
    ];
  }, [theme, toggleTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => `${it.label} ${it.keywords} ${it.group}`.toLowerCase().includes(q));
  }, [items, query]);

  const run = useCallback(
    (item) => {
      if (!item) return;
      if (item.keepOpen) {
        item.run();
        setFlash(item.id);
        return;
      }
      close();
      // Let the scroll lock release before scrolling or navigating.
      setTimeout(item.run, 80);
    },
    [close]
  );

  // Global triggers: ⌘K / Ctrl+K, "/", and the custom event used by the nav button.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingTarget(document.activeElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Open lifecycle: remember focus, lock scroll, then undo both on close.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      setQuery("");
      setActive(0);
      setFlash(null);
      returnFocus.current?.focus?.();
    };
  }, [open]);

  // Copy confirmation: show "copied" briefly, then dismiss.
  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(close, 700);
    return () => clearTimeout(id);
  }, [flash, close]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Single focus stop: the combobox input owns the dialog.
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <div className="pointer-events-none absolute inset-0 bg-bg/60 backdrop-blur-md" aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="card relative w-full max-w-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-line/10 px-4">
              <Search className="shrink-0 text-lg text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
                aria-label="Search commands"
                placeholder="Type a command or search…"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full bg-transparent text-base text-fg placeholder:text-muted focus:outline-none"
              />
              <kbd className="hidden rounded border border-line/15 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">esc</kbd>
            </div>

            <div ref={listRef} id="palette-list" role="listbox" aria-label="Commands" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-10 text-center text-sm text-muted">No matches for “{query}”.</p>
              )}
              {GROUPS.map((group) => {
                const rows = results.filter((r) => r.group === group);
                if (!rows.length) return null;
                return (
                  <div key={group} role="group" aria-label={group} className="mb-1">
                    <p className="eyebrow px-3 pb-1 pt-3" aria-hidden="true">{group}</p>
                    {rows.map((item) => {
                      const index = results.indexOf(item);
                      const selected = index === active;
                      return (
                        <div
                          key={item.id}
                          id={`palette-${item.id}`}
                          role="option"
                          aria-selected={selected}
                          data-index={index}
                          onMouseMove={() => setActive(index)}
                          onClick={() => run(item)}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                            selected ? "bg-line/10 text-fg" : "text-muted"
                          )}
                        >
                          <item.Icon className={cn("shrink-0 text-lg", selected && "text-accent")} />
                          <span className="flex-1 truncate">{item.label}</span>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                            {flash === item.id ? "copied" : item.hint}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="hidden items-center gap-4 border-t border-line/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted sm:flex">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span className="ml-auto">esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
