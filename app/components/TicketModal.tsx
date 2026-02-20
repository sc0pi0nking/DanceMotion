'use client'

import { useState, useRef } from 'react'
import { X, AlertCircle, ImagePlus } from 'lucide-react'

const categories = [
  { id: 'bug', label: 'Fehler oder Problem', description: 'Etwas funktioniert nicht richtig' },
  { id: 'incomplete', label: 'Unvollständiges Feature', description: 'Ein Feature ist unvollständig oder unklar' },
  { id: 'suggestion', label: 'Feature-Wunsch', description: 'Eine Idee für eine neue Funktion' },
  { id: 'question', label: 'Frage', description: 'Ich habe eine Frage zur Website' },
  { id: 'other', label: 'Sonstiges', description: 'Etwas anderes' },
]

const priorities = [
  { id: 'low', label: 'Niedrig' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'Hoch' },
]

const guidanceText = {
  bug: 'Beschreibe bitte: Was wolltest du tun? Was hast du erwartet? Was ist stattdessen passiert?',
  incomplete: 'Erkläre, welcher Teil verwirrend ist oder was fehlt, um das Feature vollständig zu nutzen.',
  suggestion: 'Teile deine Idee mit und erkläre, warum sie die Website besser machen würde.',
  question: 'Stelle deine Frage so detailliert wie möglich.',
  other: 'Gib bitte einen aussagekräftigen Titel und Beschreibung.',
}

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'question',
    priority: 'normal',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/tickets/upload', {
      method: 'POST',
      body: fd,
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload fehlgeschlagen')
    }

    const data = await res.json()
    return data.url as string
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (uploadedImages.length + files.length > 3) {
      setError('Maximal 3 Bilder erlaubt')
      return
    }

    setUploading(true)
    setError('')

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`"${file.name}" ist zu groß (max. 5MB)`)
          continue
        }
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
          setError(`"${file.name}" hat ein ungültiges Format`)
          continue
        }
        const url = await uploadImage(file)
        setUploadedImages(prev => [...prev, url])
      }
    } catch (err: any) {
      setError(err.message || 'Bild-Upload fehlgeschlagen')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attachments: uploadedImages,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({
          title: '',
          description: '',
          category: 'question',
          priority: 'normal',
        })
        setUploadedImages([])
        setTimeout(() => {
          setSubmitted(false)
          onClose()
        }, 2000)
      } else {
        const data = await res.json()
        setError(data.error || 'Fehler beim Absenden')
      }
    } catch (err) {
      setError('Netzwerkfehler - bitte versuchen Sie es später erneut')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Feedback geben</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-900 dark:text-gray-100" />
          </button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ✓ Dein Feedback hilft uns die Website zu verbessern! Alles wird anonym verarbeitet.
          </p>
        </div>

        {submitted && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-400 font-medium">
              ✓ Vielen Dank! Dein Feedback wurde eingereicht.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
              <p className="text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
                Worum geht es? *
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all"
                    style={{
                      borderColor: formData.category === cat.id ? 'var(--accent)' : 'var(--border)',
                      backgroundColor: formData.category === cat.id ? 'rgba(46,196,198,0.05)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={formData.category === cat.id}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{cat.label}</p>
                      <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Guidance */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>Tipp:</strong> {guidanceText[formData.category as keyof typeof guidanceText]}
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Kurzer Titel *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. 'Button wird nicht angeklickt' oder 'Formulare-Seite lädt nicht'"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none text-sm"
              />
              <p className="text-xs text-muted mt-1">{formData.title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Beschreibung *
              </label>
              <textarea
                required
                maxLength={2000}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreibe dein Anliegen so detailliert wie möglich..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none resize-none text-sm"
              />
              <p className="text-xs text-muted mt-1">{formData.description.length}/2000</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Bilder anhängen (Optional, max. 3)
              </label>

              {uploadedImages.length < 3 && (
                <div className="mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                  >
                    <ImagePlus size={18} />
                    {uploading ? 'Wird hochgeladen...' : 'Bild(er) auswählen'}
                  </button>
                  <p className="text-xs text-muted mt-1">JPG, PNG, WEBP oder GIF (max. 5MB pro Bild)</p>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url}
                        alt={`Anhang ${i + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Wichtigkeit (Optional)
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none text-sm"
              >
                {priorities.map((prio) => (
                  <option key={prio.id} value={prio.id}>
                    {prio.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || uploading || !formData.title.trim() || !formData.description.trim()}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Wird gesendet...' : 'Absenden'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
