"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import EditableContent from "./EditableContent";

export default function HeroScene() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax effect: Background moves slower than scroll
  const bgY = useTransform(scrollY, [0, 500], [0, -150]);
  const contentY = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <section ref={containerRef} className="hero-scene relative min-h-[700px] w-full overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* SVG background layers with motion */}
        <svg
        className="absolute inset-0 h-full w-full opacity-60 pointer-events-none"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.08)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0.01)" />
          </linearGradient>
          <radialGradient id="heroBurst" cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.15)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>
          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
          <filter id="blur3">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
        </defs>

        {/* Layer 1: Large organic wave shapes */}
        <motion.path
          d="M -50 180 Q 300 80, 600 150 T 1300 180 L 1300 700 L -50 700 Z"
          fill="url(#heroGradient1)"
          opacity={0.3}
          animate={{ d: "M -50 200 Q 300 100, 600 170 T 1300 200 L 1300 700 L -50 700 Z" }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } as any}
        />

        {/* Layer 2: Radial burst center-left */}
        <motion.circle
          cx={250}
          cy={220}
          r={420}
          fill="url(#heroBurst)"
          filter="url(#blur3)"
          animate={{
            cx: [250, 280, 250],
            cy: [220, 200, 220],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" } as any}
        />

        {/* Layer 3: Secondary radial glow right side */}
        <motion.circle
          cx={950}
          cy={450}
          r={350}
          fill="rgba(46,196,198,0.06)"
          filter="url(#blur2)"
          animate={{
            cx: [950, 920, 950],
            cy: [450, 480, 450],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 } as any}
        />

        {/* Layer 4: Accent line elements */}
        <motion.line
          x1={100}
          y1={300}
          x2={400}
          y2={250}
          stroke="rgba(46,196,198,0.08)"
          strokeWidth={2}
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" } as any}
        />

        {/* Subtle diagonal elements for energy */}
        <motion.path
          d="M 600 50 L 650 120 L 620 180"
          stroke="rgba(46,196,198,0.06)"
          strokeWidth="1.5"
          fill="none"
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 } as any}
        />
      </svg>
      </motion.div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-40 flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <EditableContent
              contentKey="hero.title"
              defaultValue="Bewegung ist Ausdruck"
              className="text-5xl font-bold leading-tight"
              style={{ color: "var(--fg)" }}
              as="h1"
            />
          </motion.div>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <EditableContent
              contentKey="hero.subtitle"
              defaultValue="DanceMotion ist eine offene Tanzgemeinschaft — voller Energie, Kreativität und Wärme. Wir laden dich ein, dich selbst auszudrücken und Teil unserer Bühne zu werden."
              className="text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
              multiline
            />
          </motion.div>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <a
              href="#groups"
              className="inline-block rounded-full px-6 py-3 text-base font-semibold transition"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg)",
                boxShadow: "0 12px 36px rgba(46,196,198,0.16)",
              }}
            >
              Unsere Gruppen entdecken
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 translate-x-[-50%]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" } as any}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "var(--accent)", opacity: 0.4 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.div>
    </section>
  );
}
