'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { ImageIcon, Save, RefreshCw, Eye, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import { AdminPageHeader } from '@/app/admin/components'

export default function GroupsBannerAdminPage() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadGroupsBannerSettings()
  }, [])

  const loadGroupsBannerSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/groups-banner', { credentials: 'include' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Gruppen-Banner konnte nicht geladen werden')
      }

      const data = await res.json()
      setImageUrl(data?.data?.image_url || '')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Fehler beim Laden' })
    } finally {
      setLoading(false)
    }
  }

  const saveGroupsBanner = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const res = await fetch('/api/admin/groups-banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ image_url: imageUrl }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Speichern fehlgeschlagen')
      }

      setMessage({ type: 'success', text: '✅ Gruppen-Banner gespeichert' })
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

      const res = await fetch('/api/admin/groups-banner/upload', {
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
          <p className="text-slate-400">Lade Gruppen Banner Einstellungen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={ImageIcon}
        title="Gruppen Banner"
        description="Bild zwischen der Überschrift 'Unsere Gruppen' und den Gruppen-Karten auf der Startseite"
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
              Leer lassen = kein Banner-Bild im Gruppen-Bereich. Unterstützt werden sichere https:// URLs.
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
              onClick={saveGroupsBanner}
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

          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-700">
              <img
                src={imageUrl}
                alt="Gruppen Banner Vorschau"
                className="w-full h-auto rounded-xl"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-700 min-h-[200px] flex items-center justify-center">
              <div className="text-center text-slate-500">
                <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
                <p>Kein Bild konfiguriert</p>
                <p className="text-sm mt-1">Lade ein Bild hoch oder gib eine URL ein</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
