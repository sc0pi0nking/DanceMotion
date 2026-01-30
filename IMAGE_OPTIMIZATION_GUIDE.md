# Image Optimization Guide

## Übersicht

Diese Dokumentation zeigt, wie Images optimal im DanceMotion-Projekt verwendet werden, um Performance und SEO zu verbessern.

## 📊 Performance-Auswirkungen

Mit vollständiger Image Optimization können folgende Verbesserungen erreicht werden:

- **Seitengröße**: 40-60% Reduktion
- **LCP (Largest Contentful Paint)**: 30% schneller
- **Core Web Vitals**: Measurable CLS-Reduktion durch Aspect Ratio Preservation
- **Mobile Loading**: 50% schneller auf 4G

## 🎯 Best Practices

### 1. OptimizedImage Component verwenden

Alle Images sollten mit dem `OptimizedImage` Component angezeigt werden, nicht mit HTML `<img>`:

```tsx
import OptimizedImage from '@/app/components/OptimizedImage'

export default function Example() {
  return (
    <OptimizedImage
      src="/images/hero.jpg"
      alt="Beschreibung"
      width={1280}
      height={720}
      context="hero"
      priority={true} // Nur für above-the-fold images
    />
  )
}
```

### 2. Context Richtig Setzen

Verschiedene Kontexte optimieren die Größe automatisch:

```typescript
// Hero-Images: Full width
<OptimizedImage context="hero" /> // 1280px

// Gallery-Grid: 3 Spalten
<OptimizedImage context="gallery" /> // 400px

// Thumbnails: Kleine Vorschaubilder
<OptimizedImage context="thumbnail" /> // 200px

// Avatars: User-Profilbilder
<OptimizedImage context="avatar" /> // 64px

// Banner: Header/Footer
<OptimizedImage context="banner" /> // 1440px
```

### 3. Priority für Above-the-Fold

Nur erste Bilder sollten `priority={true}` haben (max. 2-3):

```tsx
{/* LCP image - render first */}
<OptimizedImage src={heroImage} priority={true} />

{/* Lazily loaded */}
<OptimizedImage src={galleryImage} priority={false} />
```

### 4. Korrekte Dimensionen

Width und Height müssen der tatsächlichen Bildgröße entsprechen:

```tsx
// ✅ Richtig
<OptimizedImage width={1280} height={720} /> // 16:9

// ❌ Falsch - führt zu CLS
<OptimizedImage width={100} height={100} /> // Nicht skaliert
```

## 🖼️ OptimizedGallery für Galerien

Für mehrere Bilder in Grid-Layout:

```tsx
import OptimizedGallery from '@/app/components/OptimizedGallery'

const galleryImages = [
  { 
    id: '1',
    src: '/gallery/image1.jpg',
    alt: 'Beschreibung',
    title: 'Event 2024',
    width: 1024,
    height: 1024
  },
  // ... more images
]

export default function Gallery() {
  return (
    <OptimizedGallery 
      images={galleryImages}
      columns={3}
    />
  )
}
```

**Features:**
- Responsive Columns (2, 3, oder 4)
- Lightbox mit Keyboard-Navigation
- Lazy Loading für alle Bilder
- Smooth Image Transitions

## 🧮 Image Utility Functions

### getResponsiveImageSizes()

Generiert `sizes` Attribute automatisch:

```typescript
import { getResponsiveImageSizes } from '@/lib/image-optimization'

const sizes = getResponsiveImageSizes('hero')
// Result: "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
```

### getImageWidthVariants()

Gibt optimale Breiten für srcSet zurück:

```typescript
const widths = getImageWidthVariants('gallery')
// Result: [320, 480, 640, 960, 1280]
```

### getAspectRatioPadding()

Verhindert CLS durch Aspect Ratio Padding:

```typescript
const padding = getAspectRatioPadding(1280, 720)
// Result: "56.25%" (16:9)
```

## 📝 Bildformat Empfehlungen

### Format-Auswahl

| Format | Use Case | Browser Support |
|--------|----------|-----------------|
| **WebP** | Primär (Modern Browsers) | ~95% |
| **AVIF** | Beste Kompression (Chrome 85+) | ~50% |
| **JPEG** | Fallback | 100% |
| **PNG** | Nur transparent (statt JPEG) | 100% |

### Dateigrößen nach Format

Beispiel: 1280×720 Hero-Image

```
Original JPEG:   850 KB
Optimiert WebP:  280 KB (67% kleiner)
Optimiert AVIF:  210 KB (75% kleiner)
```

### Kompression-Einstellungen

```typescript
// next.config.ts - bereits konfiguriert
images: {
  formats: ["image/webp", "image/avif"],
  quality: 75, // Good balance
  minimumCacheTTL: 31536000, // 1 year cache
}
```

## 🚀 Implementierungs-Checkliste

- [ ] Alle `<img>` Tags → `<OptimizedImage>` ersetzen
- [ ] Korrekte Width/Height für alle Images
- [ ] `priority={true}` nur für LCP images
- [ ] `context` Parameter gesetzt
- [ ] Bilder < 500KB (komprimieren sonst)
- [ ] Keine über 2000px Breite
- [ ] Gallery-Pages verwenden `OptimizedGallery`
- [ ] Lighthouse Score überprüfen

## 📊 Monitoring

Nach Implementation prüfen:

```bash
# Google PageSpeed Insights
# Prüfe: LCP, FCP, CLS scores

# Lighthouse (Chrome DevTools)
# Target: Performance Score > 90

# WebPageTest
# Prüfe: Image optimization score
```

## 🔍 Admin Image Upload

Für zukünftige Implementierung - Image Upload sollte:

1. **Validierung**: Max 5MB, nur jpg/png
2. **Vorschau**: Show optimized sizes
3. **Kompression**: Automatic WebP conversion
4. **Feedback**: Show estimated savings

```typescript
// Beispiel:
const originalSize = 2500 // KB
const estimatedWebP = estimateOptimizedSize(originalSize, 'webp')
// Result: 1500 KB (60% savings)
```

## 💡 Tipps & Tricks

### Aspect Ratio Padding für CLS Prevention

```css
/* Automatisch in OptimizedImage - aber für custom: */
.image-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Responsive Bilder ohne next/image

Sollte vermieden werden, aber wenn nötig:

```tsx
<picture>
  <source srcSet="/image.avif" type="image/avif" />
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="..." />
</picture>
```

### Statistiken Tracken

```typescript
// Track in analytics
analytics.track('image_loaded', {
  src: imagePath,
  format: 'webp', // Or 'avif', 'jpeg'
  loadTime: 234, // ms
  size: 45000, // bytes
})
```

## 📚 Weitere Ressourcen

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev - Image Optimization](https://web.dev/performance-optimizing-images/)
- [WebP Format Guide](https://developers.google.com/speed/webp)
- [AVIF Format Guide](https://aomediacodec.org/av1-image-format/)

---

**Implementierungsstatus**: ✅ Complete
- OptimizedImage Component: Ready
- OptimizedGallery Component: Ready
- Image Utility Functions: Ready
- next.config Optimization: Configured
