'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Collects Core Web Vitals (LCP, CLS, FCP, INP, TTFB) via the `web-vitals`
 * library and reports them to /api/analytics/vitals.
 *
 * DSGVO: only runs after explicit opt-in via the cookie banner and respects
 * Do-Not-Track. No personal data is sent — the server derives an anonymous,
 * daily-rotating session hash. Admin pages are excluded.
 */
export function WebVitalsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname.startsWith('/admin')) return;
    if (navigator.doNotTrack === '1') return;

    const consent = localStorage.getItem('dancemotion_cookie_consent');
    const legacyConsent = localStorage.getItem('dancemotion_cookies_accepted');
    const hasOptIn = consent === 'accepted' || legacyConsent === 'true';
    if (!hasOptIn) return;

    let cancelled = false;

    const send = (name: string, value: number) => {
      if (cancelled) return;
      const body = JSON.stringify({ name, value, path: pathname });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/vitals', body);
        } else {
          fetch('/api/analytics/vitals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // analytics must never break the site
      }
    };

    import('web-vitals')
      .then(({ onLCP, onCLS, onFCP, onINP, onTTFB }) => {
        if (cancelled) return;
        const report = (metric: { name: string; value: number }) =>
          send(metric.name, metric.value);
        onLCP(report);
        onCLS(report);
        onFCP(report);
        onINP(report);
        onTTFB(report);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
