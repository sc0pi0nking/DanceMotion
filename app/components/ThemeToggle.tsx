"use client";
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // determine initial theme
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
        return;
      }
    } catch (e) {
      // ignore
    }

    // fallback to prefers-color-scheme
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // ignore
    }
    document.documentElement.dataset.theme = next;
  };

  return (
    <button
      aria-label={theme === "dark" ? "Wechsel zu Hellmodus" : "Wechsel zu Dunkelmodus"}
      onClick={toggle}
      className="theme-toggle p-2 rounded-lg transition-all hover:scale-110"
      title={theme === "dark" ? "Zum Hellmodus wechseln" : "Zum Dunkelmodus wechseln"}
      style={{
        backgroundColor: "rgba(46,196,198,0.1)",
        color: "var(--accent)",
      }}
    >
      {theme === "dark" ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
    </button>
  );
}
