"use client";

import React, { memo, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Generate subtle floating particles
const generateMeshParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 25,
    delay: Math.random() * 10,
  }));
};

// Memoized component to prevent unnecessary re-renders
const ParallaxBackgroundContent = memo(() => {
  const { scrollY } = useScroll();
  
  // Individual element parallax - POSITIVE values = elements move DOWN (slower than scroll)
  // This creates depth without leaving gaps
  const orb1Y = useTransform(scrollY, [0, 3000], [0, 150]);
  const orb2Y = useTransform(scrollY, [0, 3000], [0, 100]);
  const orb3Y = useTransform(scrollY, [0, 3000], [0, 200]);

  // Memoize particles
  const particles = useMemo(() => generateMeshParticles(12), []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 w-full h-full parallax-bg overflow-hidden"
    >
      {/* Subtler SVG background with gradient mesh effect - NOT like hero */}
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 1200 2000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Mesh gradient for organic feel - uses CSS variables */}
          <linearGradient id="meshGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--mesh-gradient-1, rgba(46,196,198,0.16))" />
            <stop offset="50%" stopColor="var(--mesh-gradient-2, rgba(46,196,198,0.08))" />
            <stop offset="100%" stopColor="rgba(46,196,198,0.02)" />
          </linearGradient>
          
          <radialGradient id="meshRadial1" cx="20%" cy="30%">
            <stop offset="0%" stopColor="var(--mesh-orb-1, rgba(46,196,198,0.22))" />
            <stop offset="60%" stopColor="var(--mesh-orb-2, rgba(46,196,198,0.10))" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>

          <radialGradient id="meshRadial2" cx="80%" cy="70%">
            <stop offset="0%" stopColor="var(--mesh-orb-1, rgba(46,196,198,0.20))" />
            <stop offset="60%" stopColor="var(--mesh-orb-2, rgba(46,196,198,0.08))" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>

          <radialGradient id="meshRadial3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--mesh-orb-2, rgba(46,196,198,0.15))" />
            <stop offset="100%" stopColor="rgba(46,196,198,0)" />
          </radialGradient>

          <filter id="meshBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
          <filter id="meshBlur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="80" />
          </filter>
          <filter id="particleGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base gradient layer */}
        <rect width="1200" height="2000" fill="url(#meshGradient1)" opacity={0.6} />

        {/* Mesh points - slow animation for organic feel */}
        <motion.circle
          cx={150}
          cy={300}
          r={650}
          fill="url(#meshRadial1)"
          filter="url(#meshBlur2)"
          animate={{
            cx: [150, 200, 150],
            cy: [300, 380, 300],
            r: [650, 680, 650],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx={1050}
          cy={1200}
          r={600}
          fill="url(#meshRadial2)"
          filter="url(#meshBlur2)"
          animate={{
            cx: [1050, 1000, 1050],
            cy: [1200, 1280, 1200],
            r: [600, 640, 600],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Additional depth layers */}
        <motion.circle
          cx={800}
          cy={400}
          r={350}
          fill="url(#meshRadial3)"
          filter="url(#meshBlur)"
          animate={{
            cx: [800, 830, 800],
            cy: [400, 450, 400],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />

        <motion.circle
          cx={200}
          cy={900}
          r={400}
          fill="url(#meshRadial3)"
          filter="url(#meshBlur)"
          animate={{
            cx: [200, 250, 200],
            cy: [900, 950, 900],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        />

        {/* Center accent orbs */}
        <motion.circle
          cx={600}
          cy={600}
          r={450}
          fill="url(#meshRadial3)"
          filter="url(#meshBlur)"
          animate={{
            r: [450, 480, 450],
            opacity: [0.3, 0.45, 0.3],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx={600}
          cy={1500}
          r={500}
          fill="url(#meshRadial3)"
          filter="url(#meshBlur)"
          animate={{
            r: [500, 540, 500],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Floating particles for extra depth */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill="var(--mesh-orb-1, rgba(46,196,198,0.3))"
            filter="url(#particleGlow)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              cy: [`${particle.y}%`, `${particle.y - 8}%`, `${particle.y}%`],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      
      {/* Parallax overlay orbs - move at different speeds */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb1Y }}
      >
        <div 
          className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb2Y }}
      >
        <div 
          className="absolute top-[40%] right-[5%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb3Y }}
      >
        <div 
          className="absolute top-[70%] left-[30%] w-[700px] h-[700px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </motion.div>
    </div>
  );
});

ParallaxBackgroundContent.displayName = "ParallaxBackgroundContent";

export default memo(function ParallaxBackground() {
  return <ParallaxBackgroundContent />;
});
