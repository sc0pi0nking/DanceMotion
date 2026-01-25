'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Save, AlertCircle, CheckCircle, Calendar } from 'lucide-react'

interface Alert {
  id: string
  title: string
  message: string
  alert_type: 'info' | 'warning' | 'error' | 'success'
  priority: number
  start_date: string
  end_date: string
  is_dismissible: boolean
  visible_to_admins_only: boolean
  created_at: string
}

const alertTypeColors = {
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
}

const alertTypeIcons = {
  info: '📘',
  warning: '⚠️',
  error: '❌',
  success: '✅',
}

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    alert_type: 'info' as const,
    priority: 0,
    start_date: new Date().toISOString().split('T')[0],
    start_time: '00:00',
    end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    end_time: '00:00',
    is_dismissible: true,
    visible_to_admins_only: false,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadAlerts()
  }, [])

  async function loadAlerts() {
    try {
      const res = await fetch('/api/admin/alerts')
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (error) {
      console.error('Failed to load alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const startDateTime = `${formData.start_date}T${formData.start_time}:00`
      const endDateTime = `${formData.end_date}T${formData.end_time}:00`

      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          alert_type: formData.alert_type,
          priority: formData.priority,
          start_date: new Date(startDateTime).toISOString(),
          end_date: new Date(endDateTime).toISOString(),
          is_dismissible: formData.is_dismissible,
          visible_to_admins_only: formData.visible_to_admins_only,
        }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Alert erstellt!' })
        setShowForm(false)
        setFormData({
          title: '',
          message: '',
          alert_type: 'info',
          priority: 0,
          start_date: new Date().toISOString().split('T')[0],
          start_time: '00:00',
          end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          end_time: '00:00',
          is_dismissible: true,
          visible_to_admins_only: false,
        })
        await loadAlerts()
        setTimeout(() => setMessage(null), 3000)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Fehler beim Erstellen' })
      }
    } catch (error) {
      console.error('Submit failed:', error)
      setMessage({ type: 'error', text: 'Fehler beim Erstellen' })
    } finally {
      setSaving(false)
    }
  }

  async function deleteAlert(id: string) {
    if (!confirm('Alert wirklich löschen?')) return

    try {
      const res = await fetch(`/api/admin/alerts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await loadAlerts()
        setMessage({ type: 'success', text: 'Alert gelöscht!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      setMessage({ type: 'error', text: 'Fehler beim Löschen' })
    }
  }

  const isAlertActive = (alert: Alert) => {
    const now = new Date()
    return new Date(alert.start_date) <= now && now <= new Date(alert.end_date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Alerts verwalten</h1>
          <p className="text-gray-600 dark:text-gray-400">Zeitlich begrenzte Benachrichtigungen für Nutzer</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition"
        >
          <Plus size={20} />
          Neuer Alert
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg border ${message.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
        }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. Wartungsarbeiten"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Typ *
                </label>
                <select
                  value={formData.alert_type}
                  onChange={(e) => setFormData({ ...formData, alert_type: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                >
                  <option value="info">📘 Information</option>
                  <option value="warning">⚠️ Warnung</option>
                  <option value="error">❌ Fehler</option>
                  <option value="success">✅ Erfolg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Nachricht *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detaillierte Nachricht für Nutzer..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium resize-none"
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.message.length}/500 Zeichen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Priorität
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                >
                  <option value="0">Niedrig</option>
                  <option value="1">Normal</option>
                  <option value="2">Hoch</option>
                  <option value="3">Kritisch</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.is_dismissible}
                    onChange={(e) => setFormData({ ...formData, is_dismissible: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  Nutzer können schließen
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.visible_to_admins_only}
                    onChange={(e) => setFormData({ ...formData, visible_to_admins_only: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  Nur für Admins sichtbar
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Startdatum *
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                    required
                  />
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-24 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Enddatum *
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                    required
                  />
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-24 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition font-semibold flex items-center gap-2"
              >
                <Save size={18} />
                {saving ? 'Wird gespeichert...' : 'Alert erstellen'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">Keine Alerts vorhanden</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 flex items-start justify-between gap-4 ${alertTypeColors[alert.alert_type]}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{alertTypeIcons[alert.alert_type]}</span>
                  <h3 className="font-bold text-lg">{alert.title}</h3>
                  {isAlertActive(alert) && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                      AKTIV
                    </span>
                  )}
                </div>
                <p className="mb-2">{alert.message}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    📅 {new Date(alert.start_date).toLocaleDateString('de-DE')} {new Date(alert.start_date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>→</span>
                  <span>{new Date(alert.end_date).toLocaleDateString('de-DE')} {new Date(alert.end_date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>Priorität: {['Niedrig', 'Normal', 'Hoch', 'Kritisch'][alert.priority]}</span>
                  {alert.is_dismissible && <span>• Schließbar</span>}
                </div>
              </div>
              <button
                onClick={() => deleteAlert(alert.id)}
                className="p-2 hover:bg-red-500/20 rounded transition"
              >
                <Trash2 size={20} className="text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
