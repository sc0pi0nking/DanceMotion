"use client";

import React, { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Memoized component to prevent unnecessary re-renders
const ParallaxBackgroundContent = memo(() => {
  const { scrollY } = useScroll();
  
  // Optimized: Slower parallax (20% speed) für subtileren Effekt
  const bgY = useTransform(scrollY, [0, 3000], [0, -400]);

  return (
    <motion.div
      style={{ y: bgY }}
      className="absolute inset-0 pointer-events-none z-0 w-full will-change-transform"
    >
      {/* Subtler SVG background with gradient mesh effect - NOT like hero */}
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 1200 2000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Mesh gradient for organic feel */}
          <linearGradient id="meshGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.16)" />
            <stop offset="50%" stopColor="rgba(46,196,198,0.08)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0.05)" />
          </linearGradient>
          
          <radialGradient id="meshRadial1" cx="20%" cy="30%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.22)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>

          <radialGradient id="meshRadial2" cx="80%" cy="70%">
            <stop offset="0%" stopColor="rgba(46,196,198,0.20)" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>

          <filter id="meshBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
        </defs>

        {/* Base gradient */}
        <rect width="1200" height="2000" fill="url(#meshGradient1)" />

        {/* Mesh points - slow animation for organic feel */}
        <motion.circle
          cx={150}
          cy={300}
          r={600}
          fill="url(#meshRadial1)"
          filter="url(#meshBlur)"
          animate={{
            cx: [150, 180, 150],
            cy: [300, 350, 300],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx={1050}
          cy={1200}
          r={550}
          fill="url(#meshRadial2)"
          filter="url(#meshBlur)"
          animate={{
            cx: [1050, 1020, 1050],
            cy: [1200, 1250, 1200],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle accent circles */}
        <motion.circle
          cx={600}
          cy={600}
          r={400}
          fill="rgba(46,196,198,0.12)"
          filter="url(#meshBlur)"
          animate={{
            opacity: [0.12, 0.16, 0.12],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx={600}
          cy={1500}
          r={500}
          fill="rgba(46,196,198,0.10)"
          filter="url(#meshBlur)"
          animate={{
            opacity: [0.10, 0.14, 0.10],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </svg>
    </motion.div>
  );
});

ParallaxBackgroundContent.displayName = "ParallaxBackgroundContent";

export default memo(function ParallaxBackground() {
  return <ParallaxBackgroundContent />;
});
