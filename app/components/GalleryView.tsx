'use client'

import { useState, useEffect } from 'react'
import { Camera, Images, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Album {
  id: string
  title: string
  category: string
  description: string
  cover_image: string | null
  image_count: number
  created_at: string
}

const categoryLabels: Record<string, string> = {
  all: 'Alle',
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

export default function GalleryView() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadAlbums()
  }, [])

  async function loadAlbums() {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) {
        const data = await res.json()
        setAlbums(data)
      }
    } catch (error) {
      console.error('Failed to load gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAlbums = selectedCategory === 'all'
    ? albums
    : albums.filter((a) => a.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(albums.map((a) => a.category).filter(Boolean)))]

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

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.1)',
              color: selectedCategory === cat ? 'var(--bg)' : 'var(--fg)',
            }}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <Link
            key={album.id}
            href={`/galerie/${album.id}`}
            className="group block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--card-bg, rgba(var(--accent-rgb), 0.05))',
              border: '1px solid var(--border, rgba(var(--accent-rgb), 0.1))',
            }}
          >
            {/* Cover Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
              {album.cover_image ? (
                <img
                  src={album.cover_image}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={48} className="text-gray-300 dark:text-gray-600" />
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`${categoryColors[album.category] || 'bg-slate-500'} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg`}
                >
                  {categoryLabels[album.category] || album.category}
                </span>
              </div>

              {/* Image count badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Images size={14} />
                  {album.image_count}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <h3
                className="text-lg font-bold line-clamp-1 group-hover:underline decoration-2 underline-offset-2"
                style={{ color: 'var(--fg)' }}
              >
                {album.title}
              </h3>

              {album.description && (
                <p className="text-sm line-clamp-2" style={{ color: 'var(--muted)' }}>
                  {album.description}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-xs pt-1" style={{ color: 'var(--muted)' }}>
                <Calendar size={13} />
                {formatDate(album.created_at)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-20">
          <Camera size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--muted)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>
            {selectedCategory === 'all'
              ? 'Noch keine Alben vorhanden'
              : 'Keine Alben in dieser Kategorie'}
          </p>
        </div>
      )}
    </div>
  )
}
