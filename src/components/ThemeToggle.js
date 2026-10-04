"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "@/components/Icons";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";
  const label = !mounted ? "Toggle theme" : isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-full border border-line/15 text-fg transition-colors duration-300 hover:border-line/40 hover:text-accent",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span
            key={isDark ? "moon" : "sun"}
            className="grid place-items-center"
            initial={{ rotate: isDark ? -70 : 70, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: isDark ? 70 : -70, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {isDark ? <Moon className="text-[18px]" /> : <Sun className="text-[18px]" />}
          </motion.span>
        ) : (
          <span className="grid place-items-center opacity-60">
            <Moon className="text-[18px]" />
          </span>
        )}
      </AnimatePresence>
    </button>
  );
}
