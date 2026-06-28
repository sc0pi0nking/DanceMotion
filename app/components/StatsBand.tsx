'use client'

import { useRef } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'framer-motion'

const STATS = [
  { to: 500, label: 'Auftritte seit Gründung' },
  { to: 3, label: 'Aktive Tanzgruppen' },
  { to: 10, label: 'Jahre DanceMotion' },
]

export default function StatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  // IntersectionObserver via framer-motion (einmalig, ab 40% sichtbar)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <section
      ref={ref}
      className="relative z-20 border-y"
      style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-14 sm:py-16 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div
              className="text-5xl sm:text-6xl font-bold tabular-nums"
              style={{ color: 'var(--accent)' }}
            >
              {inView ? (
                <CountUp end={stat.to} duration={1.6} useEasing />
              ) : (
                0
              )}
            </div>
            <div className="mt-3 text-sm font-medium" style={{ color: 'var(--muted)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
