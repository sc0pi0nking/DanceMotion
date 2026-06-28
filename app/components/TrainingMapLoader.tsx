'use client'

import dynamic from 'next/dynamic'
import { MapPin, Route } from 'lucide-react'

const TrainingMap = dynamic(() => import('./TrainingMap'), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full flex items-center justify-center text-sm"
      style={{ color: 'var(--muted)' }}
    >
      Karte wird geladen…
    </div>
  ),
})

interface TrainingMapLoaderProps {
  label?: string
}

export default function TrainingMapLoader({
  label = 'Turnhalle am Talbahnhof, Eschweiler',
}: TrainingMapLoaderProps) {
  const directions =
    'https://www.openstreetmap.org/directions?to=50.8176%2C6.2607'

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="h-72 w-full" style={{ background: 'var(--panel)' }}>
        <TrainingMap label={label} />
      </div>
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-4"
        style={{ background: 'var(--panel)' }}
      >
        <span
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: 'var(--fg)' }}
        >
          <MapPin size={16} style={{ color: 'var(--accent)' }} />
          {label}
        </span>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          <Route size={16} />
          Route planen
        </a>
      </div>
    </div>
  )
}
