# DanceMotion Eschweiler — Key Code Snippets & Technical Reference

## Motion Architecture

### Staggered Card Reveal Pattern
**How each card reveals in sequence (140ms apart)**:

```tsx
// In TileCard.tsx
<div
  className="tile-card"
  style={{ ['--idx' as any]: index ?? 0 }}
>
  {/* Card content */}
</div>
```

```css
/* In globals.css */
.tile-card {
  animation: revealUp 640ms cubic-bezier(0.2, 0.9, 0.25, 1) forwards;
  animation-delay: calc(var(--idx) * 140ms);
  opacity: 0; /* Start invisible */
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Result**: Card 0 starts animating at 0ms, card 1 at 140ms, card 2 at 280ms, etc.
Each animation takes 640ms, creating a smooth wave as the grid loads.

---

## Theme System Architecture

### Color Management (CSS Custom Properties)
**All colors are variables, switched via data attribute**:

```css
/* Light mode (default) */
:root {
  --bg: #FFFFFF;
  --fg: #0A0A0A;
  --accent: #2EC4C6;
  --muted: #5A5A5A;
  --panel: #F5F5F5;
  --border: #E8E8E8;
  --card-shadow: 0 12px 32px rgba(16,16,16,0.08);
}

/* Dark mode */
[data-theme="dark"] {
  --bg: #0A0A0A;
  --fg: #F7EFE7;
  --accent: #2EC4C6;
  --muted: #9A8A80;
  --panel: #1A1A1A;
  --border: #2A2A2A;
  --card-shadow: 0 24px 60px rgba(46,196,198,0.12);
}
```

```tsx
// In ThemeToggle.tsx
const toggleTheme = () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
};
```

```tsx
// Usage in any component
<div style={{ color: "var(--fg)", backgroundColor: "var(--bg)" }}>
  Content auto-switches with theme
</div>
```

---

## HeroScene Animation Pattern

### SVG with Framer Motion (Organic, Infinite Motion)
**Wave drifts, circles breathe, text staggers in**:

```tsx
import { motion } from "framer-motion";

export default function HeroScene() {
  return (
    <div className="hero-scene">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.05" />
          </linearGradient>

          <radialGradient id="heroBurst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>

          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
        </defs>

        {/* Wave animation (8s drift) */}
        <motion.path
          d="M -50 150 Q 300 50, 600 120 T 1200 150 L 1200 600 L 0 600 Z"
          fill="url(#heroGradient1)"
          initial={{ d: "M -50 150 Q 300 50, 600 120 T 1200 150 L 1200 600 L 0 600 Z" }}
          animate={{
            d: "M -50 160 Q 300 60, 600 130 T 1200 160 L 1200 600 L 0 600 Z",
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Radial pulse (12-14s breathe with stagger) */}
        <motion.circle
          cx={300}
          cy={200}
          r={80}
          fill="url(#heroBurst)"
          filter="url(#blur2)"
          animate={{
            cx: [300, 310, 300],
            cy: [200, 210, 200],
          }}
          transition={{
            duration: 12,
            delay: 0,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <motion.circle
          cx={900}
          cy={300}
          r={100}
          fill="url(#heroBurst)"
          filter="url(#blur2)"
          animate={{
            cx: [900, 910, 900],
            cy: [300, 315, 300],
          }}
          transition={{
            duration: 14,
            delay: 1,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </svg>

      {/* Text content (staggered entrance) */}
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Bewegung ist Ausdruck
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Willkommen in unserer offenen Tanzgemeinschaft
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Unsere Gruppen entdecken
        </motion.button>

        {/* Scroll indicator (bounce) */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="scroll-indicator"
        >
          ↓
        </motion.div>
      </div>
    </div>
  );
}
```

---

## Spotlight Glow Effect (Cards)

### Double-Layer Pseudo-Elements for Stage Lighting
**::before = gradient border, ::after = spotlight glow**:

```css
.tile-card .tile-card-content {
  position: relative;
  background: var(--panel);
  border-radius: 15px;
  padding: 1.75rem;
  border: 1px solid var(--border);
}

/* Gradient border effect (stage light edge) */
.tile-card .tile-card-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 15px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--accent),
    transparent
  );
  opacity: 0.32;
  filter: blur(12px);
  pointer-events: none;
  z-index: -1;
}

/* Spotlight glow (stage lighting reflection) */
.tile-card .tile-card-content::after {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    var(--accent),
    transparent
  );
  border-radius: 50%;
  opacity: 0.14;
  filter: blur(28px);
  pointer-events: none;
  z-index: -1;
}
```

**Visual Result**:
- Subtle accent-colored glow around edges
- Radial light source creating depth
- Works in both light and dark modes
- More pronounced in dark mode due to saturated glow

---

## Logo Integration Pattern

### Data → Component → Render
**How logos flow from data to display**:

```tsx
// In lib/site-data.ts
export type Tile = {
  title: string;
  slug: string;
  shortDescription: string;
  href: string;
  logo?: string; // NEW: optional logo path
};

export const tiles: Tile[] = [
  {
    title: "Emotion",
    slug: "emotion",
    shortDescription: "Contemporary & Modern Dance",
    href: "/gruppen/emotion",
    logo: "/logo-emotion.svg", // Path to public directory
  },
  {
    title: "Smileys",
    slug: "smileys",
    shortDescription: "Hip-Hop & Dance for All",
    href: "/gruppen/smileys",
    logo: "/logo-smileys.svg",
  },
  // ... more tiles
];
```

```tsx
// In TileCard.tsx
interface TileCardProps {
  tile: Tile;
  index?: number;
}

export default function TileCard({ tile, index }: TileCardProps) {
  return (
    <article
      className="tile-card"
      style={{ ['--idx' as any]: index ?? 0 }}
    >
      <div className="tile-card-content">
        {tile.logo && (
          <img
            src={tile.logo}
            alt={`${tile.title} logo`}
            className="h-16 w-16 mb-4"
          />
        )}
        <h2>{tile.title}</h2>
        <p>{tile.shortDescription}</p>
        <a href={tile.href}>Mehr erfahren →</a>
      </div>
    </article>
  );
}
```

```tsx
// In app/page.tsx
{tiles.map((tile, index) => (
  <TileCard key={tile.slug} tile={tile} index={index} />
))}
```

---

## German Localization Pattern

### Three Layers: Metadata, Aria, Content
**Ensure nothing is English**:

```tsx
// In app/layout.tsx (Metadata)
export const metadata = {
  title: "DanceMotion Eschweiler — Tanzgruppen & Eventstudio",
  description: "Offene Tanzgruppen und Eventstudio für alle Altersgruppen in Eschweiler.",
  // ... more metadata
};

export default function RootLayout({ children }) {
  return (
    <html lang="de"> {/* IMPORTANT: lang="de" */}
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// In Header.tsx (Aria Labels)
<Link href="/" aria-label="Zur Startseite">
  <span>Logo</span>
</Link>

<nav aria-label="Hauptnavigation">
  <a href="#groups">Gruppen</a>
  <a href="/eventstudio">Eventstudio</a>
</nav>
```

```tsx
// In ThemeToggle.tsx (Context-Aware Labels)
const toggleTheme = () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  setTheme(newTheme);
};

const isMoonIcon = theme !== "dark";

return (
  <button
    onClick={toggleTheme}
    aria-label={
      theme === "dark"
        ? "Wechsel zu Hellmodus"
        : "Wechsel zu Dunkelmodus"
    }
    title={
      theme === "dark"
        ? "Hellmodus aktivieren"
        : "Dunkelmodus aktivieren"
    }
  >
    {isMoonIcon ? "🌙" : "☀️"}
  </button>
);
```

```tsx
// In Group Pages (Content)
export const metadata = {
  title: "Emotion — DanceMotion Eschweiler",
  description: "Contemporary & Modern Dance für alle Niveaus.",
};

export default function EmotionPage() {
  return (
    <>
      <h1>Emotion</h1>
      <section>
        <h2>Für wen?</h2>
        <p>Für alle, die ausdrücken möchten...</p>
      </section>
      {/* ... more German content */}
    </>
  );
}
```

---

## Scroll Detection Pattern

### Header React State + useEffect + CSS Classes
**Track scroll to prepare for sticky header effects**:

```tsx
// In Header.tsx
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky-header ${scrolled ? "scrolled" : ""}`}>
      {/* Header content */}
    </header>
  );
}
```

```css
/* In globals.css */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.sticky-header.scrolled {
  border-bottom-color: var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

---

## Performance Tips

### 1. CSS Custom Properties Over Inline Styles
```tsx
// ❌ Avoid (causes re-renders)
<div style={{ color: isDark ? "#fff" : "#000" }}>

// ✅ Prefer (CSS handles it)
<div style={{ color: "var(--fg)" }}>
```

### 2. Animation-Delay via CSS Custom Properties
```tsx
// ❌ Avoid (inline style churn)
<div style={{ animationDelay: `${index * 140}ms` }}>

// ✅ Prefer (single re-render, CSS calculates)
<div style={{ ['--idx' as any]: index }}>
```

### 3. Framer Motion for SVG, CSS Animations for DOM
```tsx
// ✅ Framer Motion for complex paths
<motion.path animate={{ d: [...] }} />

// ✅ CSS for simple element animations
.tile-card { animation: revealUp 640ms ...; }
```

---

## Browser Compatibility

**Tested & Working**:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

**CSS Features Used**:
- ✅ CSS Custom Properties (--variable)
- ✅ CSS calc()
- ✅ CSS Filters (blur)
- ✅ Gradients (linear, radial)
- ✅ SVG Filters
- ✅ `data-*` attributes

**JavaScript API**:
- ✅ localStorage (theme persistence)
- ✅ window.scrollY (scroll detection)
- ✅ Framer Motion (animation library)

---

## Debugging Checklist

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| Cards not animating | `--idx` custom property not set | Verify `index` prop passed to TileCard in parent |
| Theme not persisting | localStorage disabled or corrupted | Check browser settings, clear cache (Ctrl+Shift+Del) |
| Colors wrong in dark mode | `[data-theme="dark"]` not applied | Verify `document.documentElement.dataset.theme` is set |
| HeroScene SVG too large/small | viewBox dimensions | Check SVG `viewBox="0 0 1200 600"` matches aspect ratio |
| German text not showing | Font missing or character encoding | Verify UTF-8 in file headers; check lang="de" |
| Scroll detection not working | Event listener not attached | Check console for JS errors in Header useEffect |

---

## Summary: The Technical Foundation

| Concept | Implementation | File |
|---------|---|---|
| **Motion** | Staggered reveals + infinite SVG animations | globals.css + HeroScene.tsx |
| **Theme** | CSS custom properties + localStorage | ThemeToggle.tsx + globals.css |
| **Logos** | Data-driven SVG asset rendering | site-data.ts + TileCard.tsx |
| **German** | Metadata + aria-labels + content | layout.tsx + all pages |
| **Scroll** | React useState + useEffect | Header.tsx |
| **Performance** | CSS vars, minimal re-renders, SSR | Next.js 16 + Tailwind v4 |

---

**Last Updated**: Sprint 4 Completion
**Confidence Level**: Production-ready
**Next Maintenance**: Monitor performance metrics, theme switching feedback
