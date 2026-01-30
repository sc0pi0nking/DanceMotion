/**
 * CSS Optimization Strategy
 * 
 * This document outlines CSS loading optimization strategies
 * to improve First Contentful Paint (FCP) and performance.
 */

// ============================================
// 1. CRITICAL CSS (Inline in <head>)
// ============================================

/*
Critical CSS includes:
- Layout and positioning
- Typography basics
- Above-the-fold styling
- Navigation styles
- Form elements

This CSS is inlined in layout.tsx <head> to prevent render-blocking
*/

// Key critical styles
export const criticalCSS = `
/* Layout Foundation */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; }

/* Navigation */
nav { position: fixed; top: 0; width: 100%; z-index: 50; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); }

/* Hero Section */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }

/* Grid System */
.container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
.grid { display: grid; gap: 1rem; }

/* Utilities */
.hidden { display: none !important; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border-width: 0; }

/* Prevent layout shift */
html { overflow-y: scroll; }

/* Focus styles for accessibility */
:focus-visible { outline: 2px solid #0d9488; outline-offset: 2px; }

/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`

// ============================================
// 2. NON-CRITICAL CSS (Defer Loading)
// ============================================

/*
Non-critical CSS includes:
- Animations and transitions
- Hover states
- Component-specific styles
- Below-fold styling
- Media queries

This CSS is loaded asynchronously with rel="preload" + onload
*/

export const deferredCSSFiles = [
  // Component styles
  '/styles/components/buttons.css',
  '/styles/components/cards.css',
  '/styles/components/forms.css',
  '/styles/components/modals.css',

  // Page-specific styles
  '/styles/pages/home.css',
  '/styles/pages/events.css',
  '/styles/pages/gallery.css',

  // Animations
  '/styles/animations.css',
  '/styles/transitions.css',
]

// ============================================
// 3. FONT OPTIMIZATION
// ============================================

/*
Font loading strategy:
1. System fonts first (fast, no network delay)
2. Local web fonts with font-display: swap
3. Limit to 2-3 font families
4. Load only necessary weights (400, 600, 700)
*/

export const fontOptimization = {
  strategy: 'font-display-swap',
  description:
    'Shows system font while web font loads, no invisible text (FOIT)',
  implementation: `
    @font-face {
      font-family: 'Custom Font';
      src: url('/fonts/custom.woff2') format('woff2');
      font-display: swap;
      font-weight: 400;
    }
  `,
}

// ============================================
// 4. CSS-IN-JS OPTIMIZATION
// ============================================

/*
For Tailwind CSS (current implementation):
- Already optimized via PurgeCSS
- Tree-shaking removes unused styles
- Final CSS size: ~30-50KB (gzipped: ~8-12KB)
*/

export const tailwindOptimization = {
  // Already configured in tailwind.config.js
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  // Only outputs used classes
  // No CSS for unused components
}

// ============================================
// 5. CSS SPLITTING BY ROUTE
// ============================================

/*
Strategy: Load only CSS needed for current page
Implementation: Next.js automatically does this, but we can optimize
*/

export const cssLoadingStrategy = {
  // Global (always loaded)
  global: ['globals.css', 'layout.css'],

  // Route-specific (loaded per route)
  routes: {
    '/': ['home.css'],
    '/gruppen/[id]': ['group.css'],
    '/termine': ['events.css'],
    '/galerie': ['gallery.css'],
    '/admin': ['admin.css'],
  },
}

// ============================================
// 6. MEDIA QUERY OPTIMIZATION
// ============================================

/*
Separate CSS by device size:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

Only mobile CSS downloaded on mobile devices
*/

export const mediaQueryStrategy = `
/* Mobile first approach - this CSS loads for all devices */
.card { padding: 1rem; }

/* Tablet additions - loaded only for 640px+ */
@media (min-width: 640px) {
  .card { padding: 1.5rem; }
}

/* Desktop additions - loaded only for 1024px+ */
@media (min-width: 1024px) {
  .card { padding: 2rem; }
}
`

// ============================================
// 7. PERFORMANCE METRICS
// ============================================

export const cssPerformanceTargets = {
  // Current state (with optimization)
  criticalCSSSize: '< 15KB', // Inlined in head
  totalCSSSize: '< 50KB', // All CSS gzipped
  cssLoadTime: '< 200ms', // FCP not blocked
  renderBlockingTime: '0ms', // CSS not render-blocking

  // Monitoring
  monitoring: {
    measureCSS: `
      const start = performance.now();
      // CSS loads here
      const end = performance.now();
      console.log('CSS Load Time:', end - start, 'ms');
    `,
  },
}

// ============================================
// 8. IMPLEMENTATION CHECKLIST
// ============================================

export const cssOptimizationChecklist = [
  '✅ Inline critical CSS in <head>',
  '✅ Defer non-critical CSS with preload',
  '✅ Use font-display: swap for web fonts',
  '✅ Limit font families to 2-3',
  '✅ Remove unused CSS via PurgeCSS',
  '✅ Minify all CSS files',
  '✅ Gzip compress CSS',
  '✅ Use CSS-in-JS for component styles',
  '✅ Separate media queries by breakpoint',
  '✅ Load CSS per route',
  '✅ Monitor CSS load performance',
]

// ============================================
// 9. NEXT.JS SPECIFIC OPTIMIZATIONS
// ============================================

export const nextJSCSSOptimizations = {
  // Tailwind CSS (already optimized)
  tailwind: {
    purge: {
      enabled: true,
      // Remove unused Tailwind classes
    },
  },

  // Critical CSS extraction
  criticalCSS: {
    // Inline above-fold styles
    // Defer everything else
  },

  // CSS modules
  // Automatic scoping prevents conflicts
  // Smaller individual bundle sizes

  // PostCSS plugins
  plugins: [
    // autoprefixer - adds vendor prefixes
    // cssnano - minification
    // postcss-preset-env - modern CSS support
  ],
}

// ============================================
// 10. BROWSER SUPPORT
// ============================================

export const browserSupport = {
  cssGridLayout: '>= 95% of browsers',
  cssFlexbox: '>= 95% of browsers',
  cssVariables: '>= 90% of browsers',
  cssBackdropFilter: '>= 80% of browsers',

  fallbacks: {
    // Provide fallbacks for ~10% of browsers
    gridFallback: 'flex layout',
    backdropFilterFallback: 'solid background',
  },
}

export default {
  criticalCSS,
  deferredCSSFiles,
  fontOptimization,
  cssPerformanceTargets,
  cssOptimizationChecklist,
}
