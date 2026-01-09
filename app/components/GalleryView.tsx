'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: string
  url: string
  title?: string
  category?: string
}

interface GalleryViewProps {
  category?: string
}

export default function GalleryView({ category }: GalleryViewProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')

  useEffect(() => {
    loadGallery()
  }, [])

  async function loadGallery() {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) {
        const data = await res.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Failed to load gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))]

  const openLightbox = (index: number) => setSelectedImage(index)
  const closeLightbox = () => setSelectedImage(null)
  const nextImage = () => setSelectedImage((prev) => prev !== null ? (prev + 1) % filteredImages.length : null)
  const prevImage = () => setSelectedImage((prev) => prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat || 'all')}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.1)',
              color: selectedCategory === cat ? 'var(--bg)' : 'var(--fg)',
            }}
          >
            {cat === 'all' ? 'Alle' : cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-auto">
              <img
                src={image.url}
                alt={image.title || 'Gallery image'}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-medium">{image.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted">Keine Bilder in dieser Kategorie</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>

          <div className="max-w-7xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredImages[selectedImage].url}
              alt={filteredImages[selectedImage].title || 'Gallery image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {filteredImages[selectedImage].title && (
              <p className="text-white text-center mt-4 text-lg">
                {filteredImages[selectedImage].title}
              </p>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={32} className="text-white" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
