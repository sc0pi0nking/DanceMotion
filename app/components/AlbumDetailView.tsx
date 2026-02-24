'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ArrowLeft, Calendar, Images } from 'lucide-react'
import Link from 'next/link'

interface AlbumImage {
  id: string
  url: string
  title: string
  description: string
}

interface AlbumData {
  id: string
  title: string
  category: string
  description: string
  images: AlbumImage[]
  created_at: string
}

const categoryLabels: Record<string, string> = {
  general: 'Allgemein',
  performances: 'Auftritte',
  training: 'Training',
  events: 'Events',
}

const categoryColors: Record<string, string> = {
  general: 'bg-slate-500',
  performances: 'bg-purple-500',
  training: 'bg-teal-500',
  events: 'bg-amber-500',
}

export default function AlbumDetailView({ albumId }: { albumId: string }) {
  const [album, setAlbum] = useState<AlbumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    loadAlbum()
  }, [albumId])

  async function loadAlbum() {
    try {
      const res = await fetch(`/api/gallery/${albumId}`)
      if (res.ok) {
        const data = await res.json()
        setAlbum(data)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (index: number) => setSelectedImage(index)
  const closeLightbox = () => setSelectedImage(null)

  const nextImage = useCallback(() => {
    if (!album) return
    setSelectedImage((prev) =>
      prev !== null ? (prev + 1) % album.images.length : null
    )
  }, [album])

  const prevImage = useCallback(() => {
    if (!album) return
    setSelectedImage((prev) =>
      prev !== null ? (prev - 1 + album.images.length) % album.images.length : null
    )
  }, [album])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedImage === null) return
      if (e.key === 'ArrowRight') nextImage()
      else if (e.key === 'ArrowLeft') prevImage()
      else if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, nextImage, prevImage])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <p className="text-lg mb-6" style={{ color: 'var(--muted)' }}>
          Album nicht gefunden
        </p>
        <Link
          href="/galerie"
          className="inline-flex items-center gap-2 font-medium hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          <ArrowLeft size={18} />
          Zurück zur Galerie
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/galerie"
        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        <ArrowLeft size={16} />
        Zurück zur Galerie
      </Link>

      {/* Album Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--fg)' }}>
            {album.title}
          </h1>
          <span
            className={`${categoryColors[album.category] || 'bg-slate-500'} text-white text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {categoryLabels[album.category] || album.category}
          </span>
        </div>

        {album.description && (
          <p className="text-base max-w-2xl" style={{ color: 'var(--muted)' }}>
            {album.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(album.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Images size={14} />
            {album.images.length} {album.images.length === 1 ? 'Bild' : 'Bilder'}
          </span>
        </div>
      </div>

      {/* Image Grid - Masonry */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {album.images.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.title || album.title}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && album.images[selectedImage] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox() }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>

          <div
            className="max-w-7xl max-h-[90vh] px-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={album.images[selectedImage].url}
              alt={album.images[selectedImage].title || album.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {(album.images[selectedImage].title || album.images[selectedImage].description) && (
              <div className="text-center mt-4 space-y-1">
                {album.images[selectedImage].title && (
                  <p className="text-white text-lg font-medium">
                    {album.images[selectedImage].title}
                  </p>
                )}
                {album.images[selectedImage].description && (
                  <p className="text-white/70 text-sm">
                    {album.images[selectedImage].description}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={32} className="text-white" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {selectedImage + 1} / {album.images.length}
          </div>
        </div>
      )}
    </div>
  )
}
