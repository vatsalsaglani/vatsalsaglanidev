"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { nav } from "@/data/profile";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { Close, Menu, Search } from "@/components/Icons";

const sectionIds = nav.map((n) => n.id);

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useActiveSection() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        // Prefer the earliest section (in page order) currently crossing the reading line.
        setActive(sectionIds.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return active;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(false);
  const active = useActiveSection();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    setScrolled(window.scrollY > 24);
    setMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openPalette = () => window.dispatchEvent(new CustomEvent("open-command-palette"));

  const onMobileLink = useCallback((e, id) => {
    e.preventDefault();
    setOpen(false);
    // Wait for the scroll lock to release before scrolling.
    setTimeout(() => scrollToId(id), 60);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled && !open
            ? "border-line/10 bg-bg/70 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="wrap grid h-16 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          <a href="#top" className="group flex w-fit items-center gap-1 font-serif text-2xl leading-none tracking-tight" aria-label="Vatsal Saglani, back to top">
            <span>VS</span>
            <span className="h-1.5 w-1.5 translate-y-[5px] rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "relative px-3 py-2 text-sm transition-colors duration-300",
                  active === item.id ? "text-fg" : "text-muted hover:text-fg"
                )}
              >
                {item.label}
                {active === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px h-px bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Search and commands"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line/15 px-3 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors duration-300 hover:border-line/40 hover:text-fg"
            >
              <Search className="text-[15px]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden min-w-[2.75rem] rounded border border-line/15 px-1.5 py-0.5 text-center font-mono text-[10px] normal-case tracking-normal sm:inline-block">
                {mac ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-line/15 text-fg transition-colors hover:border-line/40 md:hidden"
            >
              {open ? <Close className="text-[18px]" /> : <Menu className="text-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg/95 px-gutter pt-16 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
              className="flex flex-col"
            >
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  className="border-b border-line/10"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                  }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => onMobileLink(e, item.id)}
                    className="flex items-baseline gap-4 py-4 font-serif text-5xl tracking-tight"
                  >
                    <span className="font-mono text-[11px] tracking-[0.18em] text-accent">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
