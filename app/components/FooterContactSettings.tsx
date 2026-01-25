'use client'

import { useState, useEffect } from 'react'
import { Save, AlertCircle, CheckCircle, Phone, Mail, MapPin } from 'lucide-react'

interface FooterContactInfo {
  email: string
  phone: string
  location: string
}

export default function FooterContactSettings() {
  const [contactInfo, setContactInfo] = useState<FooterContactInfo>({
    email: '',
    phone: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadFooterSettings()
  }, [])

  async function loadFooterSettings() {
    try {
      const res = await fetch('/api/admin/content')
      if (res.ok) {
        const items = await res.json()
        
        const emailItem = items.find((item: any) => item.key === 'footer_email')
        const phoneItem = items.find((item: any) => item.key === 'footer_phone')
        const locationItem = items.find((item: any) => item.key === 'footer_location')

        setContactInfo({
          email: emailItem?.value?.text || emailItem?.value || '',
          phone: phoneItem?.value?.text || phoneItem?.value || '',
          location: locationItem?.value?.text || locationItem?.value || '',
        })
      }
    } catch (error) {
      console.error('Failed to load footer settings:', error)
      setMessage({ type: 'error', text: 'Fehler beim Laden der Einstellungen' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!contactInfo.email || !contactInfo.phone || !contactInfo.location) {
      setMessage({ type: 'error', text: 'Alle Felder sind erforderlich' })
      return
    }

    setSaving(true)

    try {
      // Save email
      await fetch('/api/admin/content/footer_email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: { text: contactInfo.email },
          section: 'Footer',
        }),
      })

      // Save phone
      await fetch('/api/admin/content/footer_phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: { text: contactInfo.phone },
          section: 'Footer',
        }),
      })

      // Save location
      await fetch('/api/admin/content/footer_location', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: { text: contactInfo.location },
          section: 'Footer',
        }),
      })

      setMessage({ type: 'success', text: 'Kontaktinformationen gespeichert!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Save failed:', error)
      setMessage({ type: 'error', text: 'Fehler beim Speichern' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">📞 Footer-Kontaktinformationen</h2>
        <p className="text-gray-600 dark:text-gray-400">Verwalte die Kontaktdaten im Footer der Website</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Mail size={18} className="text-accent" />
            E-Mail-Adresse
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            placeholder="info@example.de"
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium focus:border-accent focus:outline-none transition"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Diese E-Mail wird als Kontaktadresse im Footer angezeigt
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Phone size={18} className="text-accent" />
            Telefonnummer
          </label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            placeholder="+49 (0) 123 456789"
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium focus:border-accent focus:outline-none transition"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Klickbar für telefonische Anrufe auf Mobilgeräten
          </p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <MapPin size={18} className="text-accent" />
            Ort/Adresse
          </label>
          <input
            type="text"
            value={contactInfo.location}
            onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
            placeholder="Eschweiler, NRW"
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium focus:border-accent focus:outline-none transition"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ort oder vollständige Adresse
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition font-bold flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Wird gespeichert...' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
