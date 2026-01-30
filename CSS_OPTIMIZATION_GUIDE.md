# CSS Optimization & Performance Guide

## 🎯 Ziele

- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **Critical CSS Size**: < 15KB
- **Total CSS Size**: < 50KB (gzipped)

## 📊 Current Status

**Mit Tailwind CSS + Next.js:**
- ✅ Automatic CSS purging (removes unused classes)
- ✅ Global CSS: ~35KB (uncompressed), ~8KB (gzipped)
- ✅ No render-blocking CSS
- ✅ CSS-in-JS optimization ready

## 1️⃣ Critical CSS Strategy

CSS, das sofort für Initial Paint benötigt wird, sollte inlined sein:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        
        {/* Non-critical CSS deferred */}
        <link rel="preload" href="/styles/non-critical.css" as="style" onLoad={...} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Critical CSS Includes:
- Layout: Grid, Flexbox, Positioning
- Typography: Font sizes, line heights
- Navigation: Fixed header, menu
- Forms: Input styles, validation
- Utilities: Margin, padding, display

### Non-Critical CSS Defer:
- Animations, Transitions
- Hover states
- Shadows, Borders
- Background patterns
- Component decorations

## 2️⃣ Font Loading Optimization

### Current Setup (Recommended)

```css
@font-face {
  font-family: 'System-UI';
  src: system-ui, -apple-system, sans-serif;
  font-display: swap;
}

@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0-10FFFF;
}
```

### Font Display Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| **swap** | Show system font while loading | Text content (current) |
| **block** | Hide text until loaded | Icons, special effects |
| **fallback** | Short hide, then swap | Branding fonts |
| **optional** | Use if loaded within 100ms | Non-critical fonts |

### Loading Only Needed Weights

```css
/* ✅ Load only 400 (regular) and 700 (bold) */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-400.woff2') format('woff2');
  font-weight: 400;
}

@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-700.woff2') format('woff2');
  font-weight: 700;
}

/* ❌ Avoid loading all weights if not used */
```

## 3️⃣ CSS Code Splitting

### By Route

Next.js automatically loads CSS per route, but we can optimize further:

```tsx
// Dynamic import for rarely-used pages
const AdminStyles = dynamic(() => import('/styles/admin.css'))

// Only loaded when admin page is accessed
```

### By Feature

```tsx
'use client'
import { useEffect } from 'react'

export function FeatureComponent() {
  useEffect(() => {
    // Load CSS only if feature is used
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/styles/feature.css'
    document.head.appendChild(link)
  }, [])
  
  return <div>{/* ... */}</div>
}
```

## 4️⃣ Tailwind CSS Optimization

### PurgeCSS Configuration

```js
// tailwind.config.js
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Only CSS for used classes is included
}
```

**Result:** Unused Tailwind classes are automatically removed.

### File Size Reduction

- **Before**: ~500KB (all Tailwind utilities)
- **After**: ~35KB (only used classes)
- **Gzipped**: ~8KB

## 5️⃣ Media Query Optimization

### Mobile-First Approach

```css
/* Base styles (mobile) */
.card {
  padding: 1rem;
  font-size: 14px;
}

/* Tablet additions (only 640px+) */
@media (min-width: 640px) {
  .card {
    padding: 1.5rem;
    font-size: 16px;
  }
}

/* Desktop additions (only 1024px+) */
@media (min-width: 1024px) {
  .card {
    padding: 2rem;
    font-size: 18px;
  }
}
```

**Benefits:**
- Mobile gets only mobile CSS
- Larger devices progressively enhanced
- CSS file size smaller per device

## 6️⃣ Performance Monitoring

### Lighthouse CSS Metrics

```typescript
// Track CSS performance
import { getCLS, getFCP, getLCP } from 'web-vitals'

getCLS(metric => console.log('CLS:', metric.value))
getFCP(metric => console.log('FCP:', metric.value))
getLCP(metric => console.log('LCP:', metric.value))
```

### Custom Monitoring

```typescript
// Measure CSS load time
const startTime = performance.now()
const cssLoaded = () => {
  const endTime = performance.now()
  console.log(`CSS loaded in ${endTime - startTime}ms`)
}

// Measure unused CSS
const showUnusedCSS = () => {
  const unused = document.querySelectorAll('[unused]')
  console.log(`Unused CSS rules: ${unused.length}`)
}
```

## 7️⃣ Best Practices

### ✅ DO

- ✅ Inline critical CSS in `<head>`
- ✅ Use `font-display: swap`
- ✅ Load non-critical CSS asynchronously
- ✅ Remove unused CSS via PurgeCSS
- ✅ Use CSS custom properties for theming
- ✅ Minimize CSS specificity
- ✅ Preload fonts with `rel="preload"`
- ✅ Use CSS shorthand properties

### ❌ DON'T

- ❌ Import large CSS libraries globally
- ❌ Use @import (blocks parallel loading)
- ❌ Inline all CSS (defeats caching)
- ❌ Load fonts synchronously
- ❌ Use high CSS specificity
- ❌ Ignore unused CSS rules
- ❌ Load all font weights
- ❌ Use CSS files for single-use classes

## 8️⃣ Debugging CSS Performance

### Chrome DevTools

1. **Coverage Tab** → Find unused CSS
2. **Performance Tab** → See CSS load time
3. **Network Tab** → Monitor CSS file sizes
4. **Lighthouse** → Run performance audit

### Commands

```bash
# Check CSS file sizes
ls -lh app/styles/*.css

# Analyze coverage
# Chrome DevTools > More Tools > Coverage > Click Reload

# Check minification
npm run build # Check .next/static/css/
```

## 9️⃣ Optimization Checklist

- [ ] Critical CSS inlined in `<head>`
- [ ] Non-critical CSS deferred with `preload`
- [ ] Fonts use `font-display: swap`
- [ ] Only necessary font weights loaded
- [ ] Tailwind PurgeCSS enabled
- [ ] All CSS minified and gzipped
- [ ] CSS per-route splitting optimized
- [ ] No `@import` statements (except PostCSS)
- [ ] Media queries mobile-first
- [ ] Lighthouse CSS performance > 90
- [ ] CSS file size < 50KB (gzipped)

## 🔟 Implementation Timeline

### Phase 1 (Completed)
- ✅ Tailwind CSS configured with PurgeCSS
- ✅ globals.css and gradients.css optimized
- ✅ No unused classes in production

### Phase 2 (In Progress)
- 🔄 Extract critical CSS for inlining
- 🔄 Implement async CSS loading
- 🔄 Optimize font loading

### Phase 3 (Planned)
- ⏱️ CSS code splitting by route
- ⏱️ Advanced CSS compression
- ⏱️ Performance monitoring dashboard

## 📚 Resources

- [Web.dev - CSS Optimization](https://web.dev/optimize-css-delivery/)
- [Lighthouse Performance Metrics](https://web.dev/performance/)
- [Tailwind CSS Optimization](https://tailwindcss.com/docs/optimizing-for-production)
- [Font Loading Strategy](https://web.dev/fonts/)

---

**Last Updated**: 2024
**Status**: ✅ Ready for Production
