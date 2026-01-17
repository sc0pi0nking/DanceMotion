"use client";

import React, { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import EditableContent from "./EditableContent";

// Generate floating particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));
};

export default function HeroScene() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax effect: Background moves slower than scroll
  const bgY = useTransform(scrollY, [0, 500], [0, -150]);

  // Memoize particles to prevent regeneration on re-renders
  const particles = useMemo(() => generateParticles(20), []);

  return (
    <section ref={containerRef} className="hero-scene relative min-h-[700px] w-full overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* SVG background layers with motion */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none hero-svg-bg"
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Enhanced gradients for more depth */}
            <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--hero-gradient-start, rgba(46,196,198,0.12))" />
              <stop offset="50%" stopColor="var(--hero-gradient-mid, rgba(46,196,198,0.06))" />
              <stop offset="100%" stopColor="var(--hero-gradient-end, rgba(46,196,198,0.02))" />
            </linearGradient>
            <radialGradient id="heroBurst" cx="30%" cy="30%">
              <stop offset="0%" stopColor="var(--hero-burst-inner, rgba(46,196,198,0.20))" />
              <stop offset="60%" stopColor="var(--hero-burst-mid, rgba(46,196,198,0.08))" />
              <stop offset="100%" stopColor="rgba(46,196,198,0)" />
            </radialGradient>
            <radialGradient id="heroGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="var(--hero-glow-inner, rgba(46,196,198,0.25))" />
              <stop offset="100%" stopColor="rgba(46,196,198,0)" />
            </radialGradient>
            <filter id="blur2">
              <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
            </filter>
            <filter id="blur3">
              <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
            </filter>
            <filter id="blur4">
              <feGaussianBlur in="SourceGraphic" stdDeviation="80" />
            </filter>
            <filter id="glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 0: Base ambient glow */}
          <motion.ellipse
            cx={600}
            cy={350}
            rx={800}
            ry={400}
            fill="url(#heroGradient1)"
            opacity={0.6}
            animate={{ 
              rx: [800, 850, 800],
              ry: [400, 420, 400],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" } as any}
          />

          {/* Layer 1: Large organic wave shapes */}
          <motion.path
            d="M -50 180 Q 300 80, 600 150 T 1300 180 L 1300 700 L -50 700 Z"
            fill="url(#heroGradient1)"
            opacity={0.4}
            animate={{ d: "M -50 200 Q 300 100, 600 170 T 1300 200 L 1300 700 L -50 700 Z" }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } as any}
          />

          {/* Layer 2: Primary radial burst center-left */}
          <motion.circle
            cx={200}
            cy={250}
            r={450}
            fill="url(#heroBurst)"
            filter="url(#blur4)"
            animate={{
              cx: [200, 250, 200],
              cy: [250, 220, 250],
              r: [450, 480, 450],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" } as any}
          />

          {/* Layer 3: Secondary radial glow right side */}
          <motion.circle
            cx={1000}
            cy={400}
            r={380}
            fill="url(#heroGlow)"
            filter="url(#blur3)"
            animate={{
              cx: [1000, 950, 1000],
              cy: [400, 450, 400],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 } as any}
          />

          {/* Layer 4: Floating orb top-right */}
          <motion.circle
            cx={900}
            cy={120}
            r={150}
            fill="url(#heroGlow)"
            filter="url(#blur2)"
            animate={{
              cx: [900, 920, 880, 900],
              cy: [120, 150, 100, 120],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" } as any}
          />

          {/* Layer 5: Small accent orb bottom-left */}
          <motion.circle
            cx={100}
            cy={550}
            r={100}
            fill="url(#heroGlow)"
            filter="url(#blur2)"
            animate={{
              cy: [550, 520, 550],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 } as any}
          />

          {/* Accent geometric lines for energy */}
          <motion.line
            x1={80}
            y1={320}
            x2={350}
            y2={280}
            stroke="var(--hero-line-color, rgba(46,196,198,0.12))"
            strokeWidth={1.5}
            filter="url(#glow)"
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" } as any}
          />
          <motion.line
            x1={850}
            y1={580}
            x2={1100}
            y2={520}
            stroke="var(--hero-line-color, rgba(46,196,198,0.10))"
            strokeWidth={1}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 } as any}
          />

          {/* Floating particles */}
          {particles.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={`${particle.x}%`}
              cy={`${particle.y}%`}
              r={particle.size}
              fill="var(--hero-particle-color, rgba(46,196,198,0.4))"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                cy: [`${particle.y}%`, `${particle.y - 15}%`, `${particle.y}%`],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              } as any}
            />
          ))}
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
