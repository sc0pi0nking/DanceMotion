"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxBackground() {
  const { scrollY } = useScroll();
  
  // Parallax effect: Background moves at 40% of scroll speed - extended range for longer effect
  const bgY = useTransform(scrollY, [0, 3500], [0, -1400]);

  return (
    <motion.div
      style={{ y: bgY }}
      className="fixed inset-0 pointer-events-none z-0"
    >
      {/* SVG background with waves and gradient - stretches to fill entire viewport */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGradientMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.12)" />
            <stop offset="50%" stopColor="rgba(46,196,198,0.04)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0.02)" />
          </linearGradient>
          <radialGradient id="bgRadial" cx="40%" cy="20%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.15)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>
          <filter id="bgBlur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </filter>
          <filter id="bgBlur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
        </defs>

        {/* Main gradient background */}
        <rect width="1200" height="800" fill="url(#bgGradientMain)" />

        {/* Radial glow center-left */}
        <motion.circle
          cx={200}
          cy={250}
          r={500}
          fill="url(#bgRadial)"
          filter="url(#bgBlur2)"
          animate={{
            cx: [200, 250, 200],
            cy: [250, 200, 250],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Radial glow right side */}
        <motion.circle
          cx={1000}
          cy={600}
          r={400}
          fill="rgba(46,196,198,0.08)"
          filter="url(#bgBlur1)"
          animate={{
            cx: [1000, 950, 1000],
            cy: [600, 650, 600],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Wave layer 1 - slow */}
        <motion.path
          d="M -50 150 Q 300 100, 600 140 T 1300 150 L 1300 800 L -50 800 Z"
          fill="rgba(46,196,198,0.18)"
          animate={{ d: "M -50 180 Q 300 110, 600 170 T 1300 180 L 1300 800 L -50 800 Z" }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        {/* Wave layer 2 - medium */}
        <motion.path
          d="M -50 250 Q 300 180, 600 260 T 1300 250 L 1300 800 L -50 800 Z"
          fill="rgba(46,196,198,0.14)"
          animate={{ d: "M -50 280 Q 300 200, 600 290 T 1300 280 L 1300 800 L -50 800 Z" }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
        />

        {/* Wave layer 3 - fast */}
        <motion.path
          d="M -50 350 Q 300 280, 600 360 T 1300 350 L 1300 800 L -50 800 Z"
          fill="rgba(46,196,198,0.10)"
          animate={{ d: "M -50 370 Q 300 300, 600 380 T 1300 370 L 1300 800 L -50 800 Z" }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        />

        {/* Wave layer 4 - very deep */}
        <motion.path
          d="M -50 480 Q 300 420, 600 500 T 1300 480 L 1300 800 L -50 800 Z"
          fill="rgba(46,196,198,0.08)"
          animate={{ d: "M -50 510 Q 300 440, 600 520 T 1300 510 L 1300 800 L -50 800 Z" }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.5 }}
        />

        {/* Accent elements */}
        <motion.line
          x1={150}
          y1={400}
          x2={500}
          y2={350}
          stroke="rgba(46,196,198,0.06)"
          strokeWidth={2}
          animate={{ opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.path
          d="M 800 200 L 850 300 L 820 380"
          stroke="rgba(46,196,198,0.07)"
          strokeWidth="1.5"
          fill="none"
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </svg>
    </motion.div>
  );
}
