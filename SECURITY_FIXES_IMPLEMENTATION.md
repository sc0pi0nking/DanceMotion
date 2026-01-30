# Security Fixes & Implementation Guide

## Status: Implementation Ready
**Generated:** January 30, 2026

---

## 1. CRITICAL SECURITY FIXES (To Implement)

### Fix #1: Add Admin Authentication Check Helper

Create a reusable function to check admin role:

```typescript
// lib/auth-check.ts
import { supabaseServer } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  permissions: string[];
}

export async function getAdminUser(authHeader: string | null): Promise<AdminUser | null> {
  if (!authHeader) return null;

  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    
    if (error || !user) return null;

    // Fetch user's role and permissions
    const { data: adminUser, error: roleError } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*, admin_roles(permissions)')
      .eq('user_id', user.id)
      .single();

    if (roleError || !adminUser) return null;

    return {
      id: user.id,
      email: user.email || '',
      permissions: adminUser.admin_roles?.permissions || [],
    };
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(authHeader: string | null, requiredPermission?: string) {
  const adminUser = await getAdminUser(authHeader);
  
  if (!adminUser) {
    throw new Error('UNAUTHORIZED');
  }

  if (requiredPermission && !adminUser.permissions.includes(requiredPermission)) {
    throw new Error('FORBIDDEN');
  }

  return adminUser;
}
```

### Fix #2: Update All Admin API Routes

Pattern to apply to ALL `/api/admin/**` routes:

```typescript
// BEFORE (VULNERABLE)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data } = await supabaseServer.from('table').insert(body).select().single();
  return NextResponse.json(data);
}

// AFTER (SECURE)
export async function POST(request: NextRequest) {
  try {
    // 1. Check admin status
    const adminUser = await requireAdmin(request.headers.get('authorization'));
    
    // 2. Validate input
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 3. Perform action
    const { data, error } = await supabaseServer
      .from('table')
      .insert([{ ...body, created_by: adminUser.id }])
      .select()
      .single();

    if (error) throw error;

    // 4. Log action
    await logAuditAction(adminUser.id, 'action_type', 'Description', 'table');

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Fix #3: Add Rate Limiting Middleware

Create rate limiting for public endpoints:

```typescript
// lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Per-endpoint rate limiters
export const contactFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 per hour
  analytics: true,
});

export const analyticsLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 per minute
  analytics: true,
});

// Usage in API route:
export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
  
  const { limit, remaining, reset, pending } = await contactFormLimiter.limit(clientIp);

  if (!limit) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(reset / 1000)) } }
    );
  }

  // ... rest of handler
}
```

**Installation:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

Set environment variables in `.env.local`:
```
UPSTASH_REDIS_REST_URL=https://***
UPSTASH_REDIS_REST_TOKEN=***
```

### Fix #4: Add CSRF Protection Middleware

Create CSRF middleware:

```typescript
// lib/csrf.ts
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate CSRF token for forms
  if (!request.cookies.has('csrf-token')) {
    const token = generateCSRFToken();
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|public).*)'],
};
```

### Fix #5: Add HTTPS Redirect

In `next.config.ts`:

```typescript
export default {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
      },
    ];
  },
  // Add security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};
```

---

## 2. MEDIUM PRIORITY FIXES

### Fix #6: Better Email Validation

```typescript
// lib/validators.ts
import { validate } from 'email-validator';

export function validateEmail(email: string): boolean {
  return validate(email);
}
```

Installation:
```bash
npm install email-validator
```

### Fix #7: Improve Input Sanitization

```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 5000)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
```

Installation:
```bash
npm install isomorphic-dompurify
```

---

## 3. IMPLEMENTED OPTIMIZATIONS (Already Done)

✅ **ParallaxBackground Performance Optimization**
- Reduced floating bubbles: 40 → 15 (8 on low-end devices)
- Reduced mesh particles: 12 → 8 (4 on low-end devices)
- Added `prefers-reduced-motion` support
- Added device detection for low-end devices
- Disables parallax scrolling on low-end devices

✅ **Removed Eventstudio References**
- Updated metadata in `app/layout.tsx`
- Updated seed content in `supabase/seed-content.sql`
- Updated FAQ content in `supabase/migrations/006_faq_system.sql`

✅ **Sponsors System Implementation**
- Database migration: `supabase/migrations/018_sponsors_system.sql`
- API routes: `/api/sponsors` and `/api/sponsors/[id]`
- Admin component: `AdminSponsorsManager.tsx`
- Public page: `/sponsor` with `SponsorsGrid.tsx`
- Admin page: `/admin/sponsors`

---

## 4. IMPLEMENTATION CHECKLIST

### This Week (Priority)
- [ ] Apply `getAdminUser()` helper to all admin routes
  - [ ] `/api/admin/users/**`
  - [ ] `/api/admin/roles/**`
  - [ ] `/api/admin/documents/**`
  - [ ] `/api/admin/gallery/**`
  - [ ] `/api/admin/tickets/**`
- [ ] Set up Upstash Redis account and add rate limiting
- [ ] Test all security fixes locally
- [ ] Deploy to staging environment
- [ ] Run security audit on staging

### Next Week (Medium Priority)
- [ ] Implement CSRF protection
- [ ] Add better email validation
- [ ] Implement input sanitization library
- [ ] Add security headers to `next.config.ts`
- [ ] Run Lighthouse audit
- [ ] Test on low-end devices

### Following Week (Nice to Have)
- [ ] Implement Service Worker for PWA
- [ ] Add web vitals monitoring
- [ ] Implement image optimization
- [ ] Add analytics improvements

---

## 5. TESTING COMMANDS

```bash
# Build and test locally
npm run build
npm run start

# Run on low-end device emulation (Chrome DevTools)
# Open DevTools → More Tools → Network Conditions
# Set throttling to "Slow 4G" and low-end device CPU

# Lighthouse audit
# DevTools → Lighthouse → Generate report

# Security headers check
curl -I https://dancemotion.org
```

---

## 6. DEPLOYMENT CHECKLIST

Before deploying to production:

```bash
# 1. Test security
curl -I https://staging.dancemotion.org | grep -i "strict-transport"

# 2. Verify rate limiting is working
curl -X POST https://staging.dancemotion.org/api/contact \
  -d '{"name":"test","email":"test@test.com","message":"test"}'

# 3. Run full test suite
npm test

# 4. Performance audit
npm run build && npm run start

# 5. Security audit with OWASP
# Use ZAP or similar tool

# 6. Final checklist
# - All environment variables set
# - Database migrations applied
# - Redis/rate limiting configured
# - HTTPS redirect working
# - CSP headers set
```

---

## Questions Checklist

- ✅ **Is ParallaxBackground causing laptop lag?** → Fixed with device detection
- ✅ **Is Eventstudio mentioned in shared links?** → Removed from metadata
- ✅ **Are there security issues?** → Critical issues identified + fixes provided
- ✅ **Should we add sponsors system?** → Fully implemented
- ✅ **Are there performance improvements?** → Multiple optimizations applied
- ❓ **Should we add more SEO?** → See next document

