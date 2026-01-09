"use client";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header transition-all duration-300 ${scrolled ? "scrolled" : ""}`}>
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="site-logo group flex items-center gap-3 no-underline"
            aria-label="Zur Startseite"
          >
            <div className="site-logo-mark">DM</div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base" style={{ color: "var(--fg)" }}>
                DanceMotion
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Eschweiler
              </span>
            </div>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Navigation */}
          <nav 
            className="flex items-center gap-1" 
            role="navigation" 
            aria-label="Hauptnavigation"
          >
            <a 
              href="/#groups" 
              className="site-nav-link"
            >
              Gruppen
            </a>
            <a 
              href="/eventstudio" 
              className="site-nav-link"
            >
              Eventstudio
            </a>
          </nav>

          {/* Theme Toggle */}
          <div className="ml-4 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
