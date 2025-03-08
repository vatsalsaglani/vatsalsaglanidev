"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, manualTheme, toggleTheme, isAutoTheme, toggleAutoTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Render nothing until mounted
  }

  // Use manualTheme when not in auto mode, otherwise use current theme
  const currentTheme = isAutoTheme ? theme : manualTheme;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="relative p-2 rounded-lg hover:bg-light-text/5 dark:hover:bg-dark-text/5 transition-colors"
        aria-label="Toggle theme"
        title={isAutoTheme ? "Auto (Time-based)" : currentTheme === 'light' ? "Light Mode" : "Dark Mode"}
      >
        {/* Sun icon */}
        <svg
          className={`w-5 h-5 transition-all text-light-text dark:text-dark-text ${
            currentTheme === 'light' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ position: currentTheme === 'light' ? 'relative' : 'absolute' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>

        {/* Moon icon */}
        <svg
          className={`w-5 h-5 transition-all text-light-text dark:text-dark-text ${
            currentTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ position: currentTheme === 'dark' ? 'relative' : 'absolute' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      <button
        onClick={toggleAutoTheme}
        className={`text-xs px-2 py-1 rounded-md transition-colors ${
          isAutoTheme 
            ? 'bg-light-accent dark:bg-dark-accent text-light-background dark:text-dark-background' 
            : 'bg-light-text/5 dark:bg-dark-text/5 text-light-text dark:text-dark-text hover:bg-light-text/10 dark:hover:bg-dark-text/10'
        }`}
        title="Toggle automatic theme based on time"
      >
        Auto
      </button>
    </div>
  );
}
