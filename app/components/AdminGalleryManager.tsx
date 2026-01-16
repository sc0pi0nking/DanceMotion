'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, Image as ImageIcon, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface GalleryItem {
  id: string
  title: string
  category: string
  description?: string
  images: string[]
  is_published: boolean
  created_at: string
}

export default function AdminGalleryManager() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'general',
    description: '',
    is_published: true,
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    loadGalleries()
  }, [])

  async function loadGalleries() {
    try {
      const res = await fetch('/api/admin/gallery')
      if (res.ok) {
        const data = await res.json()
        setGalleries(data)
      }
    } catch (error) {
      console.error('Failed to load galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  })

  async function handleUpload() {
    if (!newGallery.title || uploadedFiles.length === 0) {
      alert('Bitte Titel eingeben und Bilder auswählen')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', newGallery.title)
      formData.append('category', newGallery.category)
      formData.append('description', newGallery.description)
      formData.append('is_published', String(newGallery.is_published))
      
      uploadedFiles.forEach((file) => {
        formData.append('images', file)
      })

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        alert('Galerie erfolgreich erstellt!')
        setShowUploadModal(false)
        setUploadedFiles([])
        setNewGallery({
          title: '',
          category: 'general',
          description: '',
          is_published: true,
        })
        loadGalleries()
      } else {
        const error = await res.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  async function deleteGallery(id: string) {
    if (!confirm('Galerie wirklich löschen?')) return

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadGalleries()
      } else {
        alert('Fehler beim Löschen')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Löschen fehlgeschlagen')
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return <div className="p-8">Lädt...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Galerie verwalten</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-accent text-bg rounded-lg font-semibold flex items-center gap-2 hover:opacity-90"
        >
          <Upload size={20} />
          Neue Galerie
        </button>
      </div>

      {/* Gallery List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            className="border rounded-lg p-4 space-y-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{gallery.title}</h3>
                <p className="text-sm text-muted">{gallery.category}</p>
              </div>
              <button
                onClick={() => deleteGallery(gallery.id)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {gallery.images.slice(0, 3).map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <Image src={img} alt="" width={100} height={100} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{gallery.images.length} Bilder</span>
              <span className={gallery.is_published ? 'text-green-600' : 'text-gray-400'}>
                {gallery.is_published ? 'Veröffentlicht' : 'Entwurf'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Neue Galerie erstellen</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Titel *</label>
                <input
                  type="text"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  placeholder="z.B. Auftritt 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Kategorie</label>
                <select
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                >
                  <option value="general">Allgemein</option>
                  <option value="performances">Auftritte</option>
                  <option value="training">Training</option>
                  <option value="events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Beschreibung</label>
                <textarea
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={newGallery.is_published}
                  onChange={(e) => setNewGallery({ ...newGallery, is_published: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Sofort veröffentlichen
                </label>
              </div>

              {/* Dropzone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Bilder hochladen *</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-accent bg-accent/5' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isDragActive
                      ? 'Bilder hier ablegen...'
                      : 'Bilder hier ablegen oder klicken zum Auswählen'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF bis 10MB</p>
                </div>
              </div>

              {/* Preview */}
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Wird hochgeladen...' : 'Galerie erstellen'}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
