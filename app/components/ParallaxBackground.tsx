"use client";

import React, { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Memoized component to prevent unnecessary re-renders
const ParallaxBackgroundContent = memo(() => {
  const { scrollY } = useScroll();
  
  // Optimized: Reduced scroll range, smoother parallax effect (30% speed instead of 40%)
  const bgY = useTransform(scrollY, [0, 2000], [0, -600]);

  return (
    <motion.div
      style={{ y: bgY }}
      className="absolute inset-0 pointer-events-none z-0 w-full will-change-transform"
    >
      {/* Optimized SVG: Reduced complexity, better mobile performance */}
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 1200 1500"
        preserveAspectRatio="xMidYMid slice"
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
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
          <filter id="bgBlur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
        </defs>

        {/* Main gradient background */}
        <rect width="1200" height="1500" fill="url(#bgGradientMain)" />

        {/* Radial glow center-left - reduced animation complexity */}
        <motion.circle
          cx={200}
          cy={250}
          r={500}
          fill="url(#bgRadial)"
          filter="url(#bgBlur2)"
          animate={{
            cx: [200, 220, 200],
            cy: [250, 270, 250],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Radial glow right side */}
        <motion.circle
          cx={1000}
          cy={600}
          r={400}
          fill="rgba(46,196,198,0.08)"
          filter="url(#bgBlur1)"
          animate={{
            cx: [1000, 980, 1000],
            cy: [600, 620, 600],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave layer 1 - optimized */}
        <motion.path
          d="M -50 150 Q 300 100, 600 140 T 1300 150 L 1300 1500 L -50 1500 Z"
          fill="rgba(46,196,198,0.18)"
          animate={{ d: "M -50 170 Q 300 110, 600 160 T 1300 170 L 1300 1500 L -50 1500 Z" }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        {/* Wave layer 2 - medium */}
        <motion.path
          d="M -50 350 Q 300 280, 600 360 T 1300 350 L 1300 1500 L -50 1500 Z"
          fill="rgba(46,196,198,0.14)"
          animate={{ d: "M -50 370 Q 300 300, 600 380 T 1300 370 L 1300 1500 L -50 1500 Z" }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
        />

        {/* Wave layer 3 - optimized for performance */}
        <motion.path
          d="M -50 550 Q 300 480, 600 560 T 1300 550 L 1300 1500 L -50 1500 Z"
          fill="rgba(46,196,198,0.10)"
          animate={{ d: "M -50 570 Q 300 500, 600 580 T 1300 570 L 1300 1500 L -50 1500 Z" }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        />
      </svg>
    </motion.div>
  );
});

ParallaxBackgroundContent.displayName = "ParallaxBackgroundContent";

export default memo(function ParallaxBackground() {
  return <ParallaxBackgroundContent />;
});
