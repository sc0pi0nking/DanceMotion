"use client";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="site-header w-full">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gray-900 text-white flex items-center justify-center font-semibold">DM</div>
          <span className="text-lg font-semibold" style={{ color: "var(--fg)" }}>DanceMotion Eschweiler</span>
        </Link>

        <nav className="flex items-center gap-4">
          <a href="/#groups" className="hover:opacity-90" style={{ color: "var(--fg)" }}>
            Gruppen
          </a>
          <Link href="/eventstudio" className="hover:opacity-90" style={{ color: "var(--fg)" }}>
            Eventstudio
          </Link>
          <div>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
