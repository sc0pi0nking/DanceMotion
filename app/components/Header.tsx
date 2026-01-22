"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // Close mobile menu on route change
  useEffect(() => {
    const closeMobileMenu = () => setMobileMenuOpen(false);
    window.addEventListener('popstate', closeMobileMenu);
    return () => window.removeEventListener('popstate', closeMobileMenu);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/#groups", label: "Gruppen" },
    { href: "/termine", label: "Termine" },
    { href: "/galerie", label: "Galerie" },
    { href: "/formulare", label: "Formulare" },
    { href: "/faq", label: "FAQ" },
    { href: "/team", label: "Team" },
  ];

  return (
    <>
      <header className={`site-header transition-all duration-300 ${scrolled ? "scrolled" : ""}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="site-logo group flex items-center gap-3 no-underline"
                aria-label="Zur Startseite"
              >
                <Image 
                  src="/logos/dancemotion-eschweiler.png" 
                  alt="DanceMotion Eschweiler" 
                  width={48}
                  height={48}
                  priority
                  className="h-12 w-12 hover:scale-110 transition-transform"
                />
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: "var(--fg)" }}>
                    DanceMotion
                  </div>
                  <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                    Eschweiler
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav 
              className="hidden lg:flex items-center gap-1 flex-1 justify-end" 
              role="navigation" 
              aria-label="Hauptnavigation"
            >
              {navLinks.map((link) => {
                // Determine if this link is active
                const isActive = pathname === link.href || 
                  (link.href === "/#groups" && pathname === "/") ||
                  (link.href !== "/#groups" && pathname.startsWith(link.href.replace(/\/$/, "")));
                
                return (
                  <a 
                    key={link.href}
                    href={link.href} 
                    className={`site-nav-link transition-all duration-200 ${
                      isActive 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={isActive ? { color: "var(--accent)" } : {}}
                  >
                    {link.label}
                  </a>
                );
              })}
              
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

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(46,196,198,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X size={24} style={{ color: "var(--fg)" }} />
                ) : (
                  <Menu size={24} style={{ color: "var(--fg)" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay & Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] shadow-2xl z-50 lg:hidden overflow-y-auto"
              style={{ backgroundColor: "var(--bg)" }}
              role="navigation"
              aria-label="Mobile Navigation"
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h2 className="text-lg font-bold" style={{ color: "var(--fg)" }}>
                  Menü
                </h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "var(--fg)" }}
                  aria-label="Menü schließen"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col p-4">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href || 
                    (link.href === "/#groups" && pathname === "/") ||
                    (link.href !== "/#groups" && pathname.startsWith(link.href.replace(/\/$/, "")));
                  
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-base font-medium transition-all"
                      style={{
                        color: isActive ? "var(--accent)" : "var(--fg)",
                        fontWeight: isActive ? 700 : 500,
                        backgroundColor: isActive ? "rgba(46,196,198,0.1)" : "transparent",
                      }}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}

                {/* Admin Link (Mobile) */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 mt-2 rounded-lg font-medium transition-all"
                      style={{
                        backgroundColor: "rgba(46,196,198,0.1)",
                        color: "var(--accent)",
                      }}
                    >
                      <Settings size={18} />
                      <span>Admin-Bereich</span>
                    </Link>
                  </motion.div>
                )}

                {/* Additional Links */}
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                  <motion.a
                    href="/impressum"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--muted)" }}
                  >
                    Impressum
                  </motion.a>
                  <motion.a
                    href="/datenschutz"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--muted)" }}
                  >
                    Datenschutz
                  </motion.a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
