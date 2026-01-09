"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { Settings } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check admin session
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin/auth/session')
        setIsAdmin(res.ok)
      } catch {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [])

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
              href="/termine" 
              className="site-nav-link"
            >
              Termine
            </a>
            <a 
              href="/eventstudio" 
              className="site-nav-link"
            >
              Eventstudio
            </a>
            
            {/* Admin Button - nur für eingeloggte Admins */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="site-nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: "rgba(46,196,198,0.1)",
                  color: "var(--accent)",
                }}
                title="Admin-Bereich"
              >
                <Settings size={16} />
                <span className="font-semibold">Admin</span>
              </Link>
            )}
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
