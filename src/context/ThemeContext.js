"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  isAutoTheme: true,
  toggleAutoTheme: () => {},
});

function getTimeBasedTheme() {
  if (typeof window === 'undefined') return 'light'; // Default for SSR
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  // Initialize with null to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isAutoTheme, setIsAutoTheme] = useState(true);
  const [manualTheme, setManualTheme] = useState("light");

  // Handle initial setup after mount
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const storedAuto = localStorage.getItem("autoTheme");
    const isAuto = storedAuto === "true";
    
    setIsAutoTheme(isAuto);
    
    if (storedTheme) {
      setManualTheme(storedTheme);
      if (!isAuto) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      }
    }

    if (isAuto) {
      const timeBasedTheme = getTimeBasedTheme();
      setTheme(timeBasedTheme);
      document.documentElement.classList.toggle("dark", timeBasedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (!isAutoTheme || !mounted) return;

    const updateTimeBasedTheme = () => {
      const newTheme = getTimeBasedTheme();
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const interval = setInterval(updateTimeBasedTheme, 60000);
    updateTimeBasedTheme();

    return () => clearInterval(interval);
  }, [isAutoTheme, mounted]);

  const toggleTheme = () => {
    if (!mounted) return;
    
    if (isAutoTheme) {
      console.log('Switching from auto to manual theme:', theme);
      setIsAutoTheme(false);
      localStorage.setItem("autoTheme", "false");
      setManualTheme(theme);
      localStorage.setItem("theme", theme);
    } else {
      const newTheme = manualTheme === "light" ? "dark" : "light";
      console.log('Toggling manual theme to:', newTheme);
      setTheme(newTheme);
      setManualTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark");
    }
  };

  const toggleAutoTheme = () => {
    if (!mounted) return;
    
    setIsAutoTheme(true);
    localStorage.setItem("autoTheme", "true");
    const timeBasedTheme = getTimeBasedTheme();
    setTheme(timeBasedTheme);
    document.documentElement.classList.toggle("dark", timeBasedTheme === "dark");
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        isAutoTheme, 
        toggleAutoTheme,
        manualTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
