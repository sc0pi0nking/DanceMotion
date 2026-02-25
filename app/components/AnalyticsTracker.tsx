'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const trackPageView = () => {
      try {
        if (pathname.startsWith('/admin')) return
        if (navigator.doNotTrack === '1') return

        const consent = localStorage.getItem('dancemotion_cookie_consent')
        const legacyConsent = localStorage.getItem('dancemotion_cookies_accepted')
        const hasOptIn = consent === 'accepted' || legacyConsent === 'true'
        if (!hasOptIn) return

        const data = {
          path: pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        }

        // Use sendBeacon for reliability (works even when page is closing)
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/track', JSON.stringify(data))
        } else {
          // Fallback for older browsers
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            keepalive: true,
          }).catch(() => {}) // Silent fail
        }
      } catch {
        // Silent fail - analytics should never break the site
      }
    }

    const timeout = setTimeout(trackPageView, 100)

    const onConsentChanged = () => {
      trackPageView()
    }

    window.addEventListener('dancemotion-consent-changed', onConsentChanged)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('dancemotion-consent-changed', onConsentChanged)
    }

  }, [pathname])

  // This component doesn't render anything
  return null
}
