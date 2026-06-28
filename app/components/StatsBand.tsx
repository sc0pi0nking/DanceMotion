'use client'

import { useRef } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'framer-motion'

const STATS = [
  { to: 68, label: 'Aktive Mitglieder' },
  { to: 3, label: 'Tanzgruppen' },
  { to: 8, label: 'Jahre Erfahrung' },
  { to: 24, label: 'Auftritte pro Jahr' },
]

export default function StatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  // IntersectionObserver via framer-motion (einmalig, ab 40% sichtbar)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <section ref={ref} className="dm-stats">
      {STATS.map((stat) => (
        <div key={stat.label} className="dm-stat-cell">
          <span className="dm-stat-num tabular-nums">
            {inView ? <CountUp end={stat.to} duration={1.6} useEasing /> : 0}
          </span>
          <span className="dm-stat-label">{stat.label}</span>
        </div>
      ))}
    </section>
  )
}
