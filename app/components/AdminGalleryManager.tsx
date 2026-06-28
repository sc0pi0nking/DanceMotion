'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Upload, Trash2, Image as ImageIcon, X, Plus, Pencil, Eye, EyeOff, Images } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface GalleryImage {
  url: string
  title?: string
  description?: string
  is_hidden?: boolean
}

interface GalleryItem {
  id: string
  title: string
  category: string
  description?: string
  images: GalleryImage[]
  is_published: boolean
  created_at: string
}

const categoryLabels: Record<string, string> = {
  general: 'Allgemein',
  performances: 'Auftritte',
  training: 'Training',
  events: 'Events',
}

export default function AdminGalleryManager() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [listRef] = useAutoAnimate<HTMLDivElement>()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddImagesModal, setShowAddImagesModal] = useState<string | null>(null)
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null)
  const [editingImage, setEditingImage] = useState<{ galleryId: string; index: number } | null>(null)
  const [editImageData, setEditImageData] = useState({ title: '', description: '', is_hidden: false })
  const [editGalleryData, setEditGalleryData] = useState({ title: '', category: 'general', description: '', is_published: true })
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'general',
    description: '',
    is_published: true,
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [addImageFiles, setAddImageFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const [expandedGallery, setExpandedGallery] = useState<string | null>(null)

  useEffect(() => {
    loadGalleries()
  }, [])

  async function loadGalleries() {
    try {
      const res = await fetch('/api/admin/gallery', { credentials: 'include' })
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

  // --- Dropzone for creating new gallery ---
  const onDropCreate = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 25 * 1024 * 1024) {
        alert(`${file.name} überschreitet die maximale Größe von 25MB`)
        return false
      }
      return true
    })
    setUploadedFiles(prev => [...prev, ...validFiles])
  }, [])

  const { getRootProps: getCreateRootProps, getInputProps: getCreateInputProps, isDragActive: isCreateDragActive } = useDropzone({
    onDrop: onDropCreate,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: 25 * 1024 * 1024,
  })

  // --- Dropzone for adding images to existing gallery ---
  const onDropAdd = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 25 * 1024 * 1024) {
        alert(`${file.name} überschreitet die maximale Größe von 25MB`)
        return false
      }
      return true
    })
    setAddImageFiles(prev => [...prev, ...validFiles])
  }, [])

  const { getRootProps: getAddRootProps, getInputProps: getAddInputProps, isDragActive: isAddDragActive } = useDropzone({
    onDrop: onDropAdd,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: 25 * 1024 * 1024,
  })

  async function handleCreateGallery() {
    if (!newGallery.title || uploadedFiles.length === 0) {
      setError('Bitte Titel eingeben und mindestens ein Bild auswählen')
      return
    }

    setUploading(true)
    setError('')
    setUploadStatus(`Lade ${uploadedFiles.length} Bilder hoch...`)

    try {
      const formData = new FormData()
      formData.append('title', newGallery.title)
      formData.append('category', newGallery.category)
      formData.append('description', newGallery.description)
      formData.append('is_published', String(newGallery.is_published))

      uploadedFiles.forEach((file, index) => {
        formData.append('images', file)
        setUploadProgress(Math.round((index / uploadedFiles.length) * 100))
      })

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        setUploadStatus('Erfolgreich erstellt!')
        setTimeout(() => {
          setShowCreateModal(false)
          setUploadedFiles([])
          setUploadProgress(0)
          setUploadStatus('')
          setNewGallery({ title: '', category: 'general', description: '', is_published: true })
          loadGalleries()
        }, 1500)
      } else {
        const errorData = await res.json()
        setError(`Fehler: ${errorData.error}`)
        setUploadStatus('')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload fehlgeschlagen')
      setUploadStatus('')
    } finally {
      setUploading(false)
    }
  }

  async function handleAddImages(galleryId: string) {
    if (addImageFiles.length === 0) {
      setError('Bitte mindestens ein Bild auswählen')
      return
    }

    setUploading(true)
    setError('')
    setUploadStatus(`Lade ${addImageFiles.length} Bilder hoch...`)

    try {
      const formData = new FormData()
      addImageFiles.forEach(file => formData.append('images', file))

      const res = await fetch(`/api/admin/gallery/${galleryId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        setUploadStatus('Bilder hinzugefügt!')
        setTimeout(() => {
          setShowAddImagesModal(null)
          setAddImageFiles([])
          setUploadStatus('')
          loadGalleries()
        }, 1500)
      } else {
        const errorData = await res.json()
        setError(`Fehler: ${errorData.error}`)
        setUploadStatus('')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload fehlgeschlagen')
      setUploadStatus('')
    } finally {
      setUploading(false)
    }
  }

  async function updateGalleryMetadata() {
    if (!editingGallery) return

    try {
      const res = await fetch(`/api/admin/gallery/${editingGallery.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update_gallery',
          metadata: editGalleryData,
        }),
      })

      if (res.ok) {
        setEditingGallery(null)
        loadGalleries()
      } else {
        setError('Fehler beim Speichern')
      }
    } catch (error) {
      console.error('Update failed:', error)
      setError('Fehler beim Speichern')
    }
  }

  async function deleteGallery(id: string) {
    if (!confirm('Dieses Album und alle Bilder wirklich löschen?')) return

    try {
      await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', credentials: 'include' })
      loadGalleries()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  async function updateImageMetadata(galleryId: string, imageIndex: number) {
    try {
      const res = await fetch(`/api/admin/gallery/${galleryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update_image',
          imageIndex,
          metadata: editImageData,
        }),
      })

      if (res.ok) {
        setEditingImage(null)
        setEditImageData({ title: '', description: '', is_hidden: false })
        loadGalleries()
      } else {
        setError('Fehler beim Speichern')
      }
    } catch (error) {
      console.error('Update failed:', error)
      setError('Fehler beim Speichern')
    }
  }

  async function deleteImage(galleryId: string, imageIndex: number) {
    if (!confirm('Dieses Bild wirklich löschen?')) return

    try {
      await fetch(`/api/admin/gallery/${galleryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'delete_image', imageIndex }),
      })
      loadGalleries()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Lädt...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Alben verwalten</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-teal-600 transition-colors"
        >
          <Plus size={20} />
          Neues Album
        </button>
      </div>

      {/* Gallery / Album List */}
      <div ref={listRef} className="space-y-4">
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
          >
            {/* Album Header */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-750"
              onClick={() => setExpandedGallery(expandedGallery === gallery.id ? null : gallery.id)}
            >
              {/* Cover thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                {gallery.images.length > 0 ? (
                  <Image
                    src={typeof gallery.images[0] === 'string' ? gallery.images[0] : gallery.images[0].url}
                    alt={gallery.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-slate-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate">{gallery.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600 text-slate-300">
                    {categoryLabels[gallery.category] || gallery.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Images size={14} />
                    {gallery.images.length} Bilder
                  </span>
                  <span className={gallery.is_published ? 'text-green-400' : 'text-slate-500'}>
                    {gallery.is_published ? '● Veröffentlicht' : '○ Entwurf'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    setShowAddImagesModal(gallery.id)
                    setAddImageFiles([])
                    setError('')
                    setUploadStatus('')
                  }}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-teal-600 text-slate-300 hover:text-white transition-colors"
                  title="Bilder hinzufügen"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => {
                    setEditingGallery(gallery)
                    setEditGalleryData({
                      title: gallery.title,
                      category: gallery.category,
                      description: gallery.description || '',
                      is_published: gallery.is_published,
                    })
                  }}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                  title="Album bearbeiten"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => deleteGallery(gallery.id)}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                  title="Album löschen"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Expanded: show images */}
            {expandedGallery === gallery.id && (
              <div className="border-t border-slate-700 p-4">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {gallery.images.map((img, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg overflow-hidden relative group cursor-pointer ${
                        img.is_hidden ? 'opacity-40' : ''
                      }`}
                      onClick={() => {
                        setEditingImage({ galleryId: gallery.id, index: i })
                        setEditImageData({
                          title: img.title || '',
                          description: img.description || '',
                          is_hidden: img.is_hidden || false,
                        })
                      }}
                    >
                      <Image
                        src={typeof img === 'string' ? img : img.url}
                        alt={img.title || ''}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Pencil size={16} className="text-white" />
                      </div>
                      {img.is_hidden && (
                        <div className="absolute top-1 right-1">
                          <EyeOff size={14} className="text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {gallery.images.length === 0 && (
                  <p className="text-center py-4 text-slate-500">Keine Bilder vorhanden</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {galleries.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg">Noch keine Alben vorhanden</p>
          <p className="text-sm mt-1">Erstelle dein erstes Album mit dem Button oben</p>
        </div>
      )}

      {/* === CREATE ALBUM MODAL === */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Neues Album erstellen</h3>
              <button onClick={() => { setShowCreateModal(false); setUploadedFiles([]); setError(''); setUploadStatus('') }}>
                <X size={24} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">{error}</div>
            )}
            {uploadStatus && !error && (
              <div className="p-3 bg-teal-900/30 border border-teal-700 rounded-lg text-teal-400 text-sm">{uploadStatus}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Titel *</label>
                <input
                  type="text"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                  placeholder="z.B. Auftritt Stadtfest 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Kategorie</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="general">Allgemein</option>
                    <option value="performances">Auftritte</option>
                    <option value="training">Training</option>
                    <option value="events">Events</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGallery.is_published}
                      onChange={(e) => setNewGallery({ ...newGallery, is_published: e.target.checked })}
                      className="rounded bg-slate-700 border-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-300">Sofort veröffentlichen</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Beschreibung</label>
                <textarea
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 resize-y focus:border-teal-500 focus:outline-none"
                  rows={2}
                  placeholder="Kurze Beschreibung des Albums..."
                />
              </div>

              {/* Dropzone */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Bilder *</label>
                <div
                  {...getCreateRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isCreateDragActive ? 'border-teal-500 bg-teal-500/10' : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <input {...getCreateInputProps()} />
                  <Upload size={36} className="mx-auto mb-2 text-slate-500" />
                  <p className="text-sm text-slate-400">
                    {isCreateDragActive ? 'Bilder hier ablegen...' : 'Bilder ablegen oder klicken'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Alle Bildformate, max. 25MB pro Bild</p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">{uploadedFiles.length} Bilder ausgewählt</p>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-700">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateGallery}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Wird hochgeladen...' : 'Album erstellen'}
              </button>
              <button
                onClick={() => { setShowCreateModal(false); setUploadedFiles([]); setError(''); setUploadStatus('') }}
                className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === ADD IMAGES MODAL === */}
      {showAddImagesModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Bilder hinzufügen</h3>
              <button onClick={() => { setShowAddImagesModal(null); setAddImageFiles([]); setError(''); setUploadStatus('') }}>
                <X size={24} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">{error}</div>
            )}
            {uploadStatus && !error && (
              <div className="p-3 bg-teal-900/30 border border-teal-700 rounded-lg text-teal-400 text-sm">{uploadStatus}</div>
            )}

            <div
              {...getAddRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isAddDragActive ? 'border-teal-500 bg-teal-500/10' : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <input {...getAddInputProps()} />
              <Upload size={36} className="mx-auto mb-2 text-slate-500" />
              <p className="text-sm text-slate-400">
                {isAddDragActive ? 'Bilder hier ablegen...' : 'Bilder ablegen oder klicken'}
              </p>
            </div>

            {addImageFiles.length > 0 && (
              <div>
                <p className="text-sm text-slate-400 mb-2">{addImageFiles.length} Bilder ausgewählt</p>
                <div className="grid grid-cols-4 gap-2">
                  {addImageFiles.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-700">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setAddImageFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleAddImages(showAddImagesModal)}
                disabled={uploading || addImageFiles.length === 0}
                className="flex-1 px-4 py-2.5 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Wird hochgeladen...' : `${addImageFiles.length} Bilder hinzufügen`}
              </button>
              <button
                onClick={() => { setShowAddImagesModal(null); setAddImageFiles([]); setError(''); setUploadStatus('') }}
                className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === EDIT GALLERY MODAL === */}
      {editingGallery && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Album bearbeiten</h3>
              <button onClick={() => setEditingGallery(null)}>
                <X size={24} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Titel</label>
                <input
                  type="text"
                  value={editGalleryData.title}
                  onChange={(e) => setEditGalleryData({ ...editGalleryData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Kategorie</label>
                <select
                  value={editGalleryData.category}
                  onChange={(e) => setEditGalleryData({ ...editGalleryData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="general">Allgemein</option>
                  <option value="performances">Auftritte</option>
                  <option value="training">Training</option>
                  <option value="events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Beschreibung</label>
                <textarea
                  value={editGalleryData.description}
                  onChange={(e) => setEditGalleryData({ ...editGalleryData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white resize-y focus:border-teal-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editGalleryData.is_published}
                  onChange={(e) => setEditGalleryData({ ...editGalleryData, is_published: e.target.checked })}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm font-medium text-slate-300">Veröffentlicht</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateGalleryMetadata}
                className="flex-1 px-4 py-2.5 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors"
              >
                Speichern
              </button>
              <button
                onClick={() => setEditingGallery(null)}
                className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === IMAGE EDIT MODAL === */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Bild bearbeiten</h3>
              <button onClick={() => setEditingImage(null)}>
                <X size={24} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Preview */}
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-700">
              {galleries.find(g => g.id === editingImage.galleryId)?.images[editingImage.index] && (
                <Image
                  src={
                    (() => {
                      const img = galleries.find(g => g.id === editingImage.galleryId)?.images[editingImage.index]
                      return typeof img === 'string' ? img : img?.url || ''
                    })()
                  }
                  alt=""
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Bildtitel</label>
                <input
                  type="text"
                  value={editImageData.title}
                  onChange={(e) => setEditImageData({ ...editImageData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                  placeholder="z.B. Gruppenfoto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Beschreibung</label>
                <textarea
                  value={editImageData.description}
                  onChange={(e) => setEditImageData({ ...editImageData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 resize-none focus:border-teal-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editImageData.is_hidden}
                  onChange={(e) => setEditImageData({ ...editImageData, is_hidden: e.target.checked })}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm font-medium text-slate-300">Bild ausblenden</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateImageMetadata(editingImage.galleryId, editingImage.index)}
                className="flex-1 px-4 py-2.5 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors"
              >
                Speichern
              </button>
              <button
                onClick={() => deleteImage(editingImage.galleryId, editingImage.index)}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
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
