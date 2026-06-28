'use client'

import { ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface MobileCarouselProps {
  children: ReactNode[]
  /** Tailwind flex-basis pro Slide, z.B. "85%" oder "60%" */
  slideBasis?: string
}

/**
 * Horizontal scrollbarer Embla-Carousel – nur für mobile Ansicht gedacht
 * (Aufrufer blendet ihn ab `md:` aus und zeigt stattdessen ein Grid).
 */
export default function MobileCarousel({ children, slideBasis = '85%' }: MobileCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' })

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {children.map((child, i) => (
          <div
            key={i}
            className="min-w-0"
            style={{ flex: `0 0 ${slideBasis}` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
