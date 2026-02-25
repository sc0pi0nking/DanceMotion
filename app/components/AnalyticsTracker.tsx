'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return
    
    // Don't track if DNT is set
    if (navigator.doNotTrack === '1') return

    // Check if user has explicitly accepted cookies (echtes Opt-In DSGVO)
    const cookiePreference = localStorage.getItem('dancemotion_cookies_accepted')
    if (cookiePreference !== 'true') return  // Echtes Opt-In

    // Track page view
    const trackPageView = () => {
      try {
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

    // Small delay to ensure page is fully loaded
    const timeout = setTimeout(trackPageView, 100)
    return () => clearTimeout(timeout)
  }, [pathname])

  // This component doesn't render anything
  return null
}
