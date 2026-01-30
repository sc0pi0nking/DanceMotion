'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  width: number
  height: number
}

interface OptimizedGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * OptimizedGallery Component
 *
 * Displays a grid of optimized images with:
 * - Responsive columns
 * - Lightbox functionality
 * - Lazy loading
 * - Smooth transitions
 */
export default function OptimizedGallery({
  images,
  columns = 3,
  className = '',
}: OptimizedGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null

  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const handlePrevious = () => {
    setSelectedIndex((current) =>
      current === null || current === 0 ? images.length - 1 : current - 1
    )
  }

  const handleNext = () => {
    setSelectedIndex((current) =>
      current === null || current === images.length - 1 ? 0 : current + 1
    )
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-4 ${columnClasses[columns]} ${className}`}>
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="group cursor-pointer overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800"
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="relative aspect-square overflow-hidden">
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                context="gallery"
                className="group-hover:scale-105 transition-transform duration-300"
              />
              {image.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium text-sm">{image.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={(e) => {
            const event = e as unknown as KeyboardEvent
            if (selectedIndex === null) return
            if (event.key === 'ArrowLeft') handlePrevious()
            if (event.key === 'ArrowRight') handleNext()
            if (event.key === 'Escape') setSelectedIndex(null)
          }}
          role="presentation"
          tabIndex={0}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            onClick={() => setSelectedIndex(null)}
            aria-label="Schließen"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="max-w-4xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={selectedImage.width}
              height={selectedImage.height}
              context="hero"
              className="w-full h-full"
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && selectedIndex !== null && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-3 py-1 rounded-full text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}

          {/* Title */}
          {selectedImage.title && (
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-medium">{selectedImage.title}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
