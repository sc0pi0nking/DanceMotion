# SEO Optimizations Guide

**Status:** Implementation Ready  
**Generated:** January 30, 2026

---

## 1. IMPLEMENTED SEO IMPROVEMENTS

### ✅ Removed Eventstudio References
Already updated in:
- `app/layout.tsx` - All metadata
- `supabase/seed-content.sql` - Home page content
- `supabase/migrations/006_faq_system.sql` - FAQ references

### ✅ Current SEO Status
- ✅ Meta tags present
- ✅ Open Graph tags configured
- ✅ Keywords defined
- ✅ robots.txt exists
- ✅ Canonical URLs set
- ✅ Mobile-friendly
- ✅ DSGVO-compliant

---

## 2. RECOMMENDED SEO ADDITIONS

### 2.1 Add JSON-LD Structured Data

Create file: `lib/structured-data.ts`

```typescript
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DanceMotion Eschweiler',
    url: 'https://dancemotion.org',
    logo: 'https://dancemotion.org/logo.png',
    description: 'Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Events',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Straße und Hausnummer',
      addressLocality: 'Eschweiler',
      addressRegion: 'NRW',
      postalCode: 'PLZ',
      addressCountry: 'DE',
    },
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+49-XXX-XXXXXX',
      email: 'kontakt@dancemotion.org',
    },
    sameAs: [
      'https://www.facebook.com/dancemotion',
      'https://www.instagram.com/dancemotion',
    ],
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DanceMotion Eschweiler',
    image: 'https://dancemotion.org/og-image.jpg',
    description: 'Tanzschule mit offenen Tanzgruppen und Events',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Straße und Hausnummer',
      addressLocality: 'Eschweiler',
      addressRegion: 'NRW',
      postalCode: 'PLZ',
      addressCountry: 'DE',
    },
    priceRange: '€€',
    telephone: '+49-XXX-XXXXXX',
    url: 'https://dancemotion.org',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Monday',
        opens: '16:00',
        closes: '20:00',
      },
      // ... more days
    ],
  };
}

export function getEventSchema(event: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date + 'T' + event.time,
    endDate: event.end_date + 'T' + event.end_time,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eschweiler',
        addressCountry: 'DE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'DanceMotion Eschweiler',
      url: 'https://dancemotion.org',
    },
    image: event.image_url || 'https://dancemotion.org/og-image.jpg',
  };
}

export function getGroupSchema(group: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: group.name,
    description: group.description,
    url: `https://dancemotion.org/gruppen/${group.slug}`,
    image: group.image_url,
    agencyOfOrigin: {
      '@type': 'Organization',
      name: 'DanceMotion Eschweiler',
    },
  };
}
```

Add to layout.tsx (in `<head>`):

```tsx
import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/structured-data';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLocalBusinessSchema()),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2.2 Dynamic Meta Tags Per Page

Example for group pages:

```typescript
// app/gruppen/[slug]/page.tsx
import { Metadata } from 'next';
import { loadContent } from '@/lib/content-loader';

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const groupTitle = await loadContent(`group.${params.slug}.hero.title`, 'Tanzgruppe');
  const groupDescription = await loadContent(
    `group.${params.slug}.about.text`,
    'Tanzgruppe von DanceMotion Eschweiler'
  );
  const groupImage = `/group-${params.slug}.jpg`;

  return {
    title: `${groupTitle} | DanceMotion Eschweiler`,
    description: groupDescription.substring(0, 160),
    alternates: {
      canonical: `/gruppen/${params.slug}`,
    },
    openGraph: {
      title: `${groupTitle} - DanceMotion Eschweiler`,
      description: groupDescription.substring(0, 160),
      images: [
        {
          url: groupImage,
          width: 1200,
          height: 630,
          alt: groupTitle,
        },
      ],
    },
  };
}
```

### 2.3 Dynamic OG Image Generation

Install: `npm install @vercel/og`

Create: `app/api/og/route.tsx`

```typescript
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'DanceMotion Eschweiler';
  const description = searchParams.get('description') || 'Tanzgruppen & Events';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2EC4C6 0%, #0B0B0B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <h1 style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '20px' }}>
          {title}
        </h1>
        <p style={{ fontSize: '30px', marginBottom: '40px', opacity: 0.8 }}>
          {description}
        </p>
        <p style={{ fontSize: '20px', opacity: 0.6 }}>
          https://dancemotion.org
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

Usage in page metadata:
```typescript
images: [
  {
    url: `/api/og?title=${title}&description=${description}`,
    width: 1200,
    height: 630,
    alt: title,
  },
],
```

### 2.4 Dynamic Sitemap Generation

Create: `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { supabaseServer } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base routes
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: 'https://dancemotion.org',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://dancemotion.org/gruppen',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://dancemotion.org/termine',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://dancemotion.org/galerie',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://dancemotion.org/faq',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://dancemotion.org/team',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://dancemotion.org/sponsor',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic group routes
  const { data: groups } = await supabaseServer
    .from('event_groups')
    .select('slug, updated_at')
    .eq('is_active', true);

  const groupRoutes: MetadataRoute.Sitemap = (groups || []).map((group: any) => ({
    url: `https://dancemotion.org/gruppen/${group.slug}`,
    lastModified: new Date(group.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic event routes
  const { data: events } = await supabaseServer
    .from('events')
    .select('id, updated_at')
    .eq('is_active', true)
    .limit(50);

  const eventRoutes: MetadataRoute.Sitemap = (events || []).map((event: any) => ({
    url: `https://dancemotion.org/termine/${event.id}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...baseRoutes, ...groupRoutes, ...eventRoutes];
}
```

### 2.5 Better Internal Linking

In each page component, add related links:

```typescript
// Example for group page footer
<section className="mt-12 pt-8 border-t border-border">
  <h3 className="text-lg font-semibold mb-4">Weitere Gruppen</h3>
  <div className="grid grid-cols-2 gap-4">
    <Link href="/gruppen/little-joys" className="text-accent hover:underline">
      → Little Joys
    </Link>
    <Link href="/gruppen/smileys" className="text-accent hover:underline">
      → Smileys
    </Link>
    <Link href="/gruppen/emotion" className="text-accent hover:underline">
      → Emotion
    </Link>
    <Link href="/termine" className="text-accent hover:underline">
      → Nächste Termine
    </Link>
  </div>
</section>
```

---

## 3. TECHNICAL SEO CHECKLIST

### Current Status
- ✅ Mobile responsive design
- ✅ Fast page load (after optimizations)
- ✅ HTTPS enabled
- ✅ robots.txt present
- ✅ sitemap.xml present (but static)
- ✅ Meta tags present
- ✅ Canonical URLs set
- ✅ 404 page configured
- ✅ Structured data (basic)

### To Implement
- ⭕ JSON-LD structured data (Organization, LocalBusiness, Event)
- ⭕ Dynamic OG image generation
- ⭕ Dynamic sitemap generation
- ⭕ Better internal linking strategy
- ⭕ Performance metrics tracking (Web Vitals)

---

## 4. CONTENT SEO TIPS

### Keyword Strategy
- Primary: "Tanzgruppe Eschweiler", "Tanzkurse NRW"
- Secondary: "Kindertanz", "Erwachsenentanz", "DanceMotion"
- Location: Always include "Eschweiler"

### Page Optimization
1. **Titles:** `[Group Name] | DanceMotion Eschweiler` (60 chars max)
2. **Descriptions:** Start with group name, end with location (155 chars)
3. **Headings:** Use H1 once, follow hierarchy
4. **Images:** Add alt text to all images
5. **Links:** Use descriptive anchor text

### Example Optimizations

**Before:**
```
Title: Unsere Gruppen
Description: Verschiedene Tanzgruppen für alle Altersgruppen
```

**After:**
```
Title: Tanzgruppen in Eschweiler | Little Joys, Smileys, Emotion
Description: Offene Tanzgruppen für Kinder und Erwachsene in Eschweiler. Professioneller Tanzunterricht von DanceMotion.
```

---

## 5. MONITORING & TESTING

### Tools to Use
1. **Google Search Console** - Track indexing & keywords
2. **Google Analytics** - User behavior tracking
3. **Lighthouse** - Performance & SEO audit
4. **Screaming Frog** - Crawl analysis
5. **SEMrush/Ahrefs** - Competitor analysis

### Monitoring Setup
```bash
# Add to package.json
"scripts": {
  "lighthouse": "lighthouse https://dancemotion.org --view",
  "test:seo": "npm run build && npm run lighthouse"
}
```

---

## 6. IMPLEMENTATION PRIORITY

**This Week:**
- [ ] Add JSON-LD structured data
- [ ] Implement dynamic sitemap
- [ ] Set up Google Search Console

**Next Week:**
- [ ] Dynamic OG image generation
- [ ] Better internal linking
- [ ] Track Web Vitals

**Following Week:**
- [ ] Keyword optimization review
- [ ] Content gap analysis
- [ ] Competitor analysis

---

## Summary

**Quick Wins (Easy + High Impact):**
1. ✅ Add JSON-LD structured data (5 mins)
2. ✅ Dynamic sitemap (10 mins)
3. ✅ Dynamic OG images (20 mins)

**Medium Effort:**
1. Better internal linking (1 hour)
2. Track performance metrics (2 hours)
3. Content optimization (2 hours)

**Expected Impact:**
- ✅ Better Google ranking
- ✅ Better social media sharing appearance
- ✅ Better crawlability
- ✅ Better user experience

