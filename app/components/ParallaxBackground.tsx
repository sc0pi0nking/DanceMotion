"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Detect if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detect if device is low-end (mobile or old browser)
const isLowEndDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Check if laptop/desktop with low RAM or old browser
  const isOldBrowser = /MSIE|Trident|Edge\/1[0-6]/.test(userAgent);
  
  return isMobile || isOldBrowser;
};

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

// Generate floating bubbles like in Hero - these animate up/down and fade in/out
// OPTIMIZED: Much fewer bubbles on low-end devices
const generateFloatingBubbles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 8,
    floatDistance: Math.random() * 8 + 5,
  }));
};

// Memoized component to prevent unnecessary re-renders
const ParallaxBackgroundContent = memo(() => {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  // Only generate particles on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setShouldReduceMotion(prefersReducedMotion());
    setIsLowEnd(isLowEndDevice());
  }, []);
  
  // Individual element parallax - POSITIVE values = elements move DOWN (slower than scroll)
  // OPTIMIZED: Disable parallax on low-end devices or if reduce-motion preference
  const parallaxDisabled = shouldReduceMotion || isLowEnd;
  
  const orb1Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 150]);
  const orb2Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 100]);
  const orb3Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 200]);
  const orb4Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 80]);
  const orb5Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 180]);
  const orb6Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 120]);
  const orb7Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 250]);
  const orb8Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 60]);

  // Memoize particles - only generate on client
  // OPTIMIZED: Reduce from 12 to 8 particles on low-end devices
  const particles = useMemo(() => {
    if (!isMounted) return [];
    const count = isLowEnd ? 4 : 8;
    return generateMeshParticles(count);
  }, [isMounted, isLowEnd]);
  
  // Memoize floating bubbles - Hero-style animated bubbles
  // OPTIMIZED: Reduce from 40 to 15 (or 0 on low-end if reduce-motion)
  const floatingBubbles = useMemo(() => {
    if (!isMounted) return [];
    if (shouldReduceMotion && isLowEnd) return []; // Disable completely on low-end with reduce-motion
    const count = isLowEnd ? 8 : 15;
    return generateFloatingBubbles(count);
  }, [isMounted, isLowEnd, shouldReduceMotion]);
  
  // Parallax transform for bubbles layer
  const bubblesY = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 180]);

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
      
      {/* Parallax overlay orbs - move at different speeds for depth */}
      {/* Layer 1: Top area - hero complement */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb1Y }}
      >
        <div 
          className="absolute top-[5%] left-[5%] w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div 
          className="absolute top-[8%] right-[15%] w-[400px] h-[400px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div 
          className="absolute top-[12%] left-[40%] w-[350px] h-[350px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
      </motion.div>
      
      {/* Layer 2: Upper-mid section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb2Y }}
      >
        <div 
          className="absolute top-[20%] right-[5%] w-[550px] h-[550px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div 
          className="absolute top-[25%] left-[20%] w-[350px] h-[350px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div 
          className="absolute top-[18%] left-[55%] w-[400px] h-[400px] rounded-full opacity-28"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
      </motion.div>
      
      {/* Layer 3: Mid section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb3Y }}
      >
        <div 
          className="absolute top-[35%] left-[8%] w-[600px] h-[600px] rounded-full opacity-32"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div 
          className="absolute top-[40%] right-[25%] w-[450px] h-[450px] rounded-full opacity-28"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(75px)",
          }}
        />
        <div 
          className="absolute top-[32%] right-[8%] w-[380px] h-[380px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>
      
      {/* Layer 4: Lower-mid section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb4Y }}
      >
        <div 
          className="absolute top-[50%] right-[10%] w-[500px] h-[500px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(85px)",
          }}
        />
        <div 
          className="absolute top-[55%] left-[35%] w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div 
          className="absolute top-[48%] left-[5%] w-[450px] h-[450px] rounded-full opacity-28"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(75px)",
          }}
        />
      </motion.div>
      
      {/* Layer 5: Lower section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb5Y }}
      >
        <div 
          className="absolute top-[65%] left-[5%] w-[550px] h-[550px] rounded-full opacity-32"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div 
          className="absolute top-[70%] right-[20%] w-[380px] h-[380px] rounded-full opacity-28"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
        <div 
          className="absolute top-[62%] right-[45%] w-[420px] h-[420px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </motion.div>
      
      {/* Layer 6: Bottom section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb6Y }}
      >
        <div 
          className="absolute top-[80%] right-[8%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div 
          className="absolute top-[85%] left-[25%] w-[450px] h-[450px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(75px)",
          }}
        />
        <div 
          className="absolute top-[78%] left-[60%] w-[380px] h-[380px] rounded-full opacity-28"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
      </motion.div>
      
      {/* Layer 7: Extra depth - scattered smaller orbs */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb7Y }}
      >
        <div 
          className="absolute top-[15%] left-[45%] w-[300px] h-[300px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div 
          className="absolute top-[45%] left-[60%] w-[280px] h-[280px] rounded-full opacity-32"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
        <div 
          className="absolute top-[75%] left-[50%] w-[320px] h-[320px] rounded-full opacity-28"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <div 
          className="absolute top-[28%] left-[75%] w-[260px] h-[260px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
      </motion.div>
      
      {/* Layer 8: Accent smaller orbs for density */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb8Y }}
      >
        <div 
          className="absolute top-[30%] right-[40%] w-[250px] h-[250px] rounded-full opacity-38"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div 
          className="absolute top-[60%] left-[15%] w-[220px] h-[220px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(35px)",
          }}
        />
        <div 
          className="absolute top-[90%] right-[35%] w-[280px] h-[280px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
        <div 
          className="absolute top-[52%] right-[60%] w-[240px] h-[240px] rounded-full opacity-32"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>
      
      {/* Floating Bubbles Layer - Hero-style animated bubbles that float and fade */}
      <motion.div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ y: bubblesY }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="bubbleGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {floatingBubbles.map((bubble) => (
            <motion.circle
              key={`bubble-${bubble.id}`}
              cx={bubble.x}
              cy={bubble.y}
              r={bubble.size / 10}
              fill="var(--accent)"
              filter="url(#bubbleGlow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                cy: [bubble.y, bubble.y - bubble.floatDistance, bubble.y],
              }}
              transition={{
                duration: bubble.duration,
                repeat: Infinity,
                delay: bubble.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
});

ParallaxBackgroundContent.displayName = "ParallaxBackgroundContent";

export default memo(function ParallaxBackground() {
  return <ParallaxBackgroundContent />;
});
