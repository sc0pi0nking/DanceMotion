'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { ImageIcon, Save, RefreshCw, Eye, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import { AdminPageHeader } from '@/app/admin/components'

export default function HeroBannerAdminPage() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadHeroBannerSettings()
  }, [])

  const loadHeroBannerSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/hero-banner', { credentials: 'include' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Hero-Banner konnte nicht geladen werden')
      }

      const data = await res.json()
      setImageUrl(data?.data?.image_url || '')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Fehler beim Laden' })
    } finally {
      setLoading(false)
    }
  }

  const saveHeroBanner = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const res = await fetch('/api/admin/hero-banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ image_url: imageUrl }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Speichern fehlgeschlagen')
      }

      setMessage({ type: 'success', text: '✅ Hero Hintergrundbild gespeichert' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: `❌ ${err.message || 'Fehler beim Speichern'}` })
    } finally {
      setSaving(false)
    }
  }

  const resetImage = () => {
    setImageUrl('')
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setMessage(null)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/hero-banner/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Upload fehlgeschlagen')
      }

      const data = await res.json()
      setImageUrl(data?.url || '')
      setMessage({ type: 'success', text: '✅ Bild hochgeladen. Jetzt noch auf Speichern klicken.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: `❌ ${err.message || 'Upload fehlgeschlagen'}` })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Lade Hero Banner Einstellungen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={ImageIcon}
        title="Hero Banner"
        description="Hintergrundbild für den Hero-Bereich der Startseite konfigurieren"
      />

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Bild konfigurieren</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bild-URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              Leer lassen = Standard Hero ohne Hintergrundbild. Unterstützt werden sichere https:// URLs.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Oder Bild hochladen</label>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition cursor-pointer">
              {uploading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Upload läuft...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Bild auswählen
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">Erlaubte Formate: JPG, PNG, WEBP (max. 5MB)</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveHeroBanner}
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white rounded-lg font-medium transition"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Speichern
                </>
              )}
            </button>

            <button
              onClick={resetImage}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
            >
              <RefreshCw size={16} />
              Zurücksetzen
            </button>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-teal-400" />
            <h2 className="text-xl font-bold text-white">Vorschau</h2>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-700 min-h-[260px]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: imageUrl
                  ? `linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.72)), url(${imageUrl})`
                  : 'linear-gradient(135deg, rgba(46,196,198,0.22), rgba(46,196,198,0.06))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <div className="relative z-10 p-8">
              <h3 className="text-3xl font-bold text-white mb-3">Bewegung ist Ausdruck</h3>
              <p className="text-slate-200 max-w-md">
                So wirkt dein Hero-Bereich mit dem aktuell hinterlegten Hintergrundbild.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
