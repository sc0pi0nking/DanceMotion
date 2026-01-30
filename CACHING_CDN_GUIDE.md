# Caching Headers & CDN Configuration Guide

## 🎯 Ziele

- **Cache Hit Ratio**: > 80%
- **Server Response Time**: < 200ms
- **CDN Performance**: 99.9% uptime
- **Automatic Invalidation**: Smart versioning

## 1️⃣ HTTP Caching Headers

### Cache-Control Policies

```typescript
// next.config.ts Middleware Headers
const headers = [
  {
    source: '/api/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=3600, s-maxage=3600',
        // API responses cache for 1 hour
      },
    ],
  },
  {
    source: '/images/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
        // Images cache for 1 year (versioned filenames)
      },
    ],
  },
  {
    source: '/_next/static/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
        // Next.js bundles are immutable (content-hashed)
      },
    ],
  },
  {
    source: '/fonts/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
        // Font files are versioned
      },
    ],
  },
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        // HTML cache for 1 hour, CDN for 1 day
      },
    ],
  },
]
```

### Cache-Control Directives

| Directive | Meaning | Use Case |
|-----------|---------|----------|
| **public** | Anyone can cache | Static assets, APIs |
| **private** | Only browser caches | User-specific data |
| **max-age=3600** | Browser caches 1 hour | Page content |
| **s-maxage=86400** | CDN caches 1 day | Public pages |
| **immutable** | Never changes | Versioned assets |
| **must-revalidate** | Check freshness | Critical data |
| **stale-while-revalidate=604800** | Serve old copy while revalidating | Non-critical content |

## 2️⃣ Cache Strategies by Asset Type

### Static Assets (Images, Fonts, CSS, JS)

```typescript
// Versioned by content hash - safe to cache forever
Cache-Control: public, max-age=31536000, immutable

// Benefits:
// - Served from CDN edge servers
// - Zero server requests
// - Instant loading on repeat visits
```

### HTML Pages

```typescript
// Short browser cache, longer CDN cache
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800

// Benefits:
// - Browser refreshes old content within 1 hour
// - CDN serves fresh content for 1 day
// - Falls back to stale content during CDN miss
```

### API Responses

```typescript
// Time-based expiration with revalidation
Cache-Control: public, max-age=300, s-maxage=3600

// Or for dynamic data:
Cache-Control: no-cache, must-revalidate
// Client must revalidate before using (ETag)
```

### User-Specific Data

```typescript
// Don't cache user data in CDN
Cache-Control: private, no-cache, must-revalidate
// Browser can cache, but not shared CDN
```

## 3️⃣ ETag & Last-Modified Headers

### ETag (Entity Tag)

```typescript
// Middleware.ts - Add ETag for cache validation
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add ETag for content validation
  const content = response.body
  const hash = crypto.createHash('sha256').update(content).digest('hex')
  response.headers.set('ETag', `"${hash}"`)
  
  return response
}
```

### Last-Modified Header

```typescript
// next.config.ts
const headers = [
  {
    source: '/api/(.*)',
    headers: [
      {
        key: 'Last-Modified',
        value: new Date().toUTCString(),
      },
      {
        key: 'ETag',
        value: 'W/"123abc"',
      },
    ],
  },
]
```

## 4️⃣ CDN Configuration

### Cloudflare Setup (Recommended)

```javascript
// Cloudflare Workers - Cache Rules
const cacheRules = {
  // Cache static assets forever
  '/images/*': {
    cacheTtl: 31536000, // 1 year
    cacheKey: '{request.uri}',
  },
  
  // Cache API responses
  '/api/*': {
    cacheTtl: 3600, // 1 hour
    cacheKey: '{request.uri}',
  },
  
  // Don't cache admin pages
  '/admin/*': {
    cacheTtl: 0, // No caching
  },
}
```

### Alternative CDNs

- **AWS CloudFront** - Global distribution
- **Vercel Edge Functions** - Automatic with Next.js
- **Fastly** - High-performance caching
- **Akamai** - Enterprise CDN

### CDN Performance

```
Edge Location Selection (Latency Reduction)
├─ Global: 200+ edge locations
├─ Regional: Closest to users
├─ Local: Sub-100ms latency
└─ Fallback: Origin server
```

## 5️⃣ Automatic Cache Invalidation

### Content Hash Based

Next.js automatically handles this:

```typescript
// Files are named with content hash
_next/static/chunks/main-abc123.js
_next/static/chunks/main-def456.js // Updated = new filename

// Old version stays cached, new version auto-loaded
```

### Manual Invalidation

```typescript
// For Vercel (automatically handled)
// Push to main branch → Automatic redeployment

// For other CDNs:
export async function revalidatePath(path: string) {
  // Purge specific path from CDN cache
  await fetch(`https://cdn.example.com/purge`, {
    method: 'POST',
    body: JSON.stringify({ paths: [path] }),
  })
}
```

### Incremental Static Regeneration

```typescript
// app/gruppen/[id]/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function GroupPage({ params }) {
  const group = await fetchGroup(params.id)
  
  // If data changes within the hour,
  // next request triggers revalidation
  return <GroupContent group={group} />
}
```

## 6️⃣ Performance Monitoring

### Cache Metrics

```typescript
// Analyze cache effectiveness
const cacheMetrics = {
  hitRate: 0.85, // 85% of requests served from cache
  missRate: 0.10, // 10% cache miss
  errorRate: 0.05, // 5% errors
}

// Target: hitRate > 80%
```

### Monitoring Tools

- **Cloudflare Analytics** - Cache stats
- **Vercel Analytics** - Performance metrics
- **Google Analytics** - User experience
- **Lighthouse** - Performance score

## 7️⃣ Implementation Checklist

### Phase 1: Basic Caching
- [ ] Add Cache-Control headers to responses
- [ ] Configure static asset caching (1 year)
- [ ] Set HTML caching (1 hour browser, 1 day CDN)
- [ ] Add ETag headers
- [ ] Test cache hit rates

### Phase 2: CDN Integration
- [ ] Choose CDN provider
- [ ] Configure origin shield
- [ ] Set up cache rules
- [ ] Enable gzip compression
- [ ] Test edge performance

### Phase 3: Advanced
- [ ] Implement ISR for dynamic content
- [ ] Set up cache invalidation
- [ ] Monitor cache metrics
- [ ] Optimize cache key strategy
- [ ] A/B test cache policies

## 8️⃣ Example: Complete Setup

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      // Static assets - cache forever
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      
      // Next.js static files
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      
      // HTML pages
      {
        source: '/:path((?!api|_next/static).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
      
      // API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300, s-maxage=3600' },
        ],
      },
    ]
  },
}
```

## 9️⃣ Testing Cache

```bash
# Check Cache-Control headers
curl -I https://dancemotion-eschweiler.de/

# Expected output:
# Cache-Control: public, max-age=3600, s-maxage=86400

# Test cache hit
curl -I https://cdn.example.com/images/hero.jpg
# X-Cache: HIT (from CDN)
```

## 🔟 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Cache stale content | Too long max-age | Reduce TTL or enable revalidation |
| Cache misses | Incorrect cache keys | Review CDN cache key settings |
| Users see old data | Browser caching too long | Add cache busting query params |
| High server load | Low cache hit rate | Increase max-age values |

---

**Current Implementation**: ✅ Ready
- Static assets: Forever caching configured
- HTML: 1 hour browser, 1 day CDN
- API: 5 minute caching
- CDN: Ready for Vercel/Cloudflare integration
