"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ==================== PERFORMANCE DETECTION ====================

// Detect if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detect if viewport is below threshold for full effects (< 1400px)
const isSmallViewport = (): boolean => {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 1400;
};

// Detect low-end CPU (< 4 cores)
const isLowEndCPU = (): boolean => {
  if (typeof window === "undefined") return false;
  return (navigator.hardwareConcurrency ?? 4) < 4;
};

// Detect if device is low-end (mobile or old browser)
const isLowEndDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isOldBrowser = /MSIE|Trident|Edge\/1[0-6]/.test(userAgent);
  
  return isMobile || isOldBrowser || isLowEndCPU();
};

// Performance mode types
type PerformanceMode = "full" | "reduced" | "lite" | "static";

// Determine best performance mode based on device capabilities
const getPerformanceMode = (): PerformanceMode => {
  if (typeof window === "undefined") return "static";
  
  const reducedMotion = prefersReducedMotion();
  const smallViewport = isSmallViewport();
  const lowEndDevice = isLowEndDevice();
  const lowCPU = isLowEndCPU();
  
  // Static: reduced motion OR (small viewport AND low-end)
  if (reducedMotion || (smallViewport && lowEndDevice)) return "static";
  
  // Lite: low CPU or small viewport
  if (lowCPU || smallViewport) return "lite";
  
  // Reduced: mobile/old browser but decent viewport
  if (lowEndDevice) return "reduced";
  
  // Full: all checks pass
  return "full";
};

// ==================== PARTICLE GENERATORS ====================

// Generate subtle floating particles - REDUCED count
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

// Generate floating bubbles - REDUCED count
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

// ==================== STATIC BACKGROUND COMPONENT ====================
// Ultra-lightweight static version for reduced motion / small viewports
const StaticBackground = memo(() => (
  <div className="fixed inset-0 pointer-events-none z-0 w-full h-full overflow-hidden">
    <div 
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 30%, var(--accent-light, rgba(46,196,198,0.12)) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 70%, var(--accent-light, rgba(46,196,198,0.10)) 0%, transparent 50%),
          radial-gradient(ellipse 70% 35% at 50% 50%, var(--accent-light, rgba(46,196,198,0.08)) 0%, transparent 60%)
        `,
      }}
    />
  </div>
));
StaticBackground.displayName = "StaticBackground";

// ==================== MAIN COMPONENT ====================
const ParallaxBackgroundContent = memo(() => {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>("static");
  
  // Initialize on client
  useEffect(() => {
    setIsMounted(true);
    setPerformanceMode(getPerformanceMode());
    
    // Listen for viewport changes
    const handleResize = () => setPerformanceMode(getPerformanceMode());
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // ==================== ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS ====================
  // React Hooks Rule: Hooks must always be called in the same order on every render
  
  // Parallax disabled for lite/static mode
  const parallaxDisabled = performanceMode === "lite" || performanceMode === "static";
  
  // REDUCED: Only 3 parallax layers instead of 8
  const orb1Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 100]);
  const orb2Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 150]);
  const orb3Y = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 80]);
  
  // Parallax transform for bubbles layer
  const bubblesY = useTransform(scrollY, [0, 3000], parallaxDisabled ? [0, 0] : [0, 120]);

  // Particle counts based on mode
  const particleCount = performanceMode === "full" ? 4 : 2;
  const bubbleCount = performanceMode === "full" ? 6 : 0;
  
  // Memoize particles - returns empty array for static/lite mode
  const particles = useMemo(() => {
    if (!isMounted || performanceMode === "lite" || performanceMode === "static") return [];
    return generateMeshParticles(particleCount);
  }, [isMounted, performanceMode, particleCount]);
  
  // Memoize floating bubbles - disabled in lite/static mode
  const floatingBubbles = useMemo(() => {
    if (!isMounted || performanceMode !== "full") return [];
    return generateFloatingBubbles(bubbleCount);
  }, [isMounted, performanceMode, bubbleCount]);
  
  // Animation enabled only in full mode
  const animationsEnabled = performanceMode === "full";
  
  // ==================== EARLY RETURNS AFTER ALL HOOKS ====================
  // Early return for static mode - massive performance gain
  if (performanceMode === "static") {
    return <StaticBackground />;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 w-full h-full parallax-bg overflow-hidden"
      style={{ "--parallax-mode": performanceMode } as React.CSSProperties}
    >
      {/* SVG background - OPTIMIZED: reduced filters and elements */}
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 1200 2000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Simplified gradient - no expensive blur */}
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

          {/* OPTIMIZED: Drastically reduced blur stdDeviation (was 50/80, now 15/25) */}
          <filter id="meshBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
          <filter id="meshBlur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
          {/* OPTIMIZED: Removed particleGlow filter entirely - uses simpler opacity */}
        </defs>

        {/* Base gradient layer */}
        <rect width="1200" height="2000" fill="url(#meshGradient1)" opacity={0.6} />

        {/* OPTIMIZED: Only 2 mesh circles instead of 6, animations are conditional */}
        <motion.circle
          cx={150}
          cy={300}
          r={650}
          fill="url(#meshRadial1)"
          filter={performanceMode === "full" ? "url(#meshBlur2)" : undefined}
          animate={animationsEnabled ? {
            cx: [150, 200, 150],
            cy: [300, 380, 300],
          } : undefined}
          transition={animationsEnabled ? { duration: 25, repeat: Infinity, ease: "easeInOut" } : undefined}
        />

        <motion.circle
          cx={1050}
          cy={1200}
          r={600}
          fill="url(#meshRadial2)"
          filter={performanceMode === "full" ? "url(#meshBlur2)" : undefined}
          animate={animationsEnabled ? {
            cx: [1050, 1000, 1050],
            cy: [1200, 1280, 1200],
          } : undefined}
          transition={animationsEnabled ? { duration: 28, repeat: Infinity, ease: "easeInOut", delay: 3 } : undefined}
        />

        {/* OPTIMIZED: One static center orb instead of multiple animated ones */}
        <circle
          cx={600}
          cy={800}
          r={450}
          fill="url(#meshRadial3)"
          filter={performanceMode === "full" ? "url(#meshBlur)" : undefined}
          opacity={0.35}
        />

        {/* Floating particles - only in full mode, no filter */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill="var(--mesh-orb-1, rgba(46,196,198,0.3))"
            initial={{ opacity: 0 }}
            animate={animationsEnabled ? {
              opacity: [0, 0.4, 0],
              cy: [`${particle.y}%`, `${particle.y - 8}%`, `${particle.y}%`],
            } : { opacity: 0.25 }}
            transition={animationsEnabled ? {
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            } : undefined}
          />
        ))}
      </svg>
      
      {/* OPTIMIZED: Only 3 parallax layers instead of 8 */}
      {/* Layer 1: Top area */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb1Y }}
      >
        <div 
          className="absolute top-[5%] left-[5%] w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: performanceMode === "full" ? "blur(60px)" : "blur(30px)",
          }}
        />
        <div 
          className="absolute top-[8%] right-[15%] w-[400px] h-[400px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: performanceMode === "full" ? "blur(70px)" : "blur(35px)",
          }}
        />
      </motion.div>
      
      {/* Layer 2: Mid section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb2Y }}
      >
        <div 
          className="absolute top-[35%] left-[8%] w-[600px] h-[600px] rounded-full opacity-32"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: performanceMode === "full" ? "blur(90px)" : "blur(40px)",
          }}
        />
        <div 
          className="absolute top-[50%] right-[10%] w-[500px] h-[500px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: performanceMode === "full" ? "blur(85px)" : "blur(40px)",
          }}
        />
      </motion.div>
      
      {/* Layer 3: Bottom section */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: orb3Y }}
      >
        <div 
          className="absolute top-[70%] left-[5%] w-[550px] h-[550px] rounded-full opacity-32"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: performanceMode === "full" ? "blur(80px)" : "blur(35px)",
          }}
        />
        <div 
          className="absolute top-[80%] right-[8%] w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: performanceMode === "full" ? "blur(90px)" : "blur(40px)",
          }}
        />
      </motion.div>
      
      {/* Floating Bubbles Layer - only in full mode */}
      {floatingBubbles.length > 0 && (
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
            {floatingBubbles.map((bubble) => (
              <motion.circle
                key={`bubble-${bubble.id}`}
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size / 10}
                fill="var(--accent)"
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
      )}
    </div>
  );
});

ParallaxBackgroundContent.displayName = "ParallaxBackgroundContent";

// ==================== EXPORT ====================
export default memo(function ParallaxBackground() {
  return <ParallaxBackgroundContent />;
});
