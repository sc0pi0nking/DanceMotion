'use client'

import { useEffect, useState } from 'react'
import { CalendarPlus, Download } from 'lucide-react'

interface CalendarButtonsProps {
  slug: string
  className?: string
}

export default function CalendarButtons({ slug, className = '' }: CalendarButtonsProps) {
  const [googleHref, setGoogleHref] = useState<string | null>(null)

  useEffect(() => {
    const host = window.location.host
    const webcal = `webcal://${host}/api/ical/${slug}.ics`
    setGoogleHref(
      `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`
    )
  }, [slug])

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={googleHref ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!googleHref}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
        style={{
          backgroundColor: 'rgba(46,196,198,0.12)',
          color: 'var(--accent)',
          border: '1px solid rgba(46,196,198,0.3)',
        }}
      >
        <CalendarPlus size={18} />
        In Google Kalender
      </a>
      <a
        href={`/api/ical/${slug}.ics`}
        download={`dancemotion-${slug}.ics`}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
        style={{
          backgroundColor: 'rgba(46,196,198,0.12)',
          color: 'var(--accent)',
          border: '1px solid rgba(46,196,198,0.3)',
        }}
      >
        <Download size={18} />
        iCal herunterladen
      </a>
    </div>
  )
}
