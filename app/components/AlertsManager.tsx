'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Save, AlertCircle, CheckCircle, Calendar, Info, AlertTriangle, XCircle, Bell, Clock, Eye, EyeOff, Sparkles, Zap, X } from 'lucide-react'

interface Alert {
  id: string
  title: string
  message: string
  alert_type: 'info' | 'warning' | 'error' | 'success'
  priority: number
  start_date: string
  end_date: string
  is_dismissible: boolean
  created_at: string
}

const alertTypeConfig = {
  info: {
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    accent: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    icon: Info,
    label: 'Information',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    accent: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    icon: AlertTriangle,
    label: 'Warnung',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  },
  error: {
    bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40',
    border: 'border-red-200 dark:border-red-800',
    accent: 'bg-red-500',
    text: 'text-red-700 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    icon: XCircle,
    label: 'Fehler',
    badgeBg: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
  },
  success: {
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    accent: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    icon: CheckCircle,
    label: 'Erfolg',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  },
}

const priorityConfig = {
  0: { label: 'Niedrig', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: null },
  1: { label: 'Normal', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400', icon: null },
  2: { label: 'Hoch', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400', icon: Zap },
  3: { label: 'Kritisch', color: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400', icon: Sparkles },
}

const alertTypeColors: Record<string, string> = {
  info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-500',
  warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500',
  error: 'bg-red-50 dark:bg-red-950/40 border-red-500',
  success: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500',
}

const alertTypeIcons: Record<string, string> = {
  info: 'ℹ️',
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
    alert_type: 'info' as 'info' | 'warning' | 'error' | 'success',
    priority: 0,
    start_date: new Date().toISOString().split('T')[0],
    start_time: '00:00',
    end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    end_time: '00:00',
    is_dismissible: true,
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-50" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'%3E%3C/path%3E%3C/svg%3E\")"}}></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Bell size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Alert-Management</h1>
              <p className="text-white/80">Erstelle und verwalte zeitgesteuerte Benachrichtigungen für deine Nutzer</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Schließen' : 'Neuer Alert'}
          </button>
        </div>
        
        {/* Stats */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Gesamt</p>
            <p className="text-2xl font-bold">{alerts.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Aktiv</p>
            <p className="text-2xl font-bold">{alerts.filter(isAlertActive).length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Geplant</p>
            <p className="text-2xl font-bold">{alerts.filter(a => new Date(a.start_date) > new Date()).length}</p>
          </div>
        </div>
      </div>

      {/* Toast Messages */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300 p-4 rounded-xl shadow-2xl flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <p className="font-medium">{message.text}</p>
          <button onClick={() => setMessage(null)} className="ml-2 hover:bg-white/20 rounded-full p-1 transition">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-500" />
              Neuen Alert erstellen
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Alert Type Selection - Visual Cards */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
                Alert-Typ auswählen
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.entries(alertTypeConfig) as [keyof typeof alertTypeConfig, typeof alertTypeConfig.info][]).map(([key, config]) => {
                  const IconComponent = config.icon
                  const isSelected = formData.alert_type === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, alert_type: key as 'info' | 'warning' | 'error' | 'success' })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${config.border} ${config.bg} ring-2 ring-offset-2 ring-${key === 'info' ? 'blue' : key === 'warning' ? 'amber' : key === 'error' ? 'red' : 'emerald'}-500 dark:ring-offset-gray-900`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center mb-2 mx-auto`}>
                        <IconComponent size={20} className={config.text} />
                      </div>
                      <p className={`font-medium text-center ${isSelected ? config.text : 'text-gray-700 dark:text-gray-300'}`}>
                        {config.label}
                      </p>
                      {isSelected && (
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${config.accent} flex items-center justify-center`}>
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title & Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. Geplante Wartungsarbeiten"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Priorität
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  <option value="0">🔹 Niedrig</option>
                  <option value="1">🔸 Normal</option>
                  <option value="2">⚡ Hoch</option>
                  <option value="3">🔥 Kritisch</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Nachricht *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Beschreibe hier die Details der Benachrichtigung..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                rows={4}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Markdown wird unterstützt
                </p>
                <p className={`text-xs font-medium ${formData.message.length > 450 ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formData.message.length}/500 Zeichen
                </p>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-purple-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Zeitraum festlegen</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                    Start
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                    />
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-28 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                    Ende
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                    />
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-28 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_dismissible}
                    onChange={(e) => setFormData({ ...formData, is_dismissible: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </div>
                <div className="flex items-center gap-2">
                  {formData.is_dismissible ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-500" />}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nutzer können schließen</span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-50 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Alert erstellen
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Alle Alerts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}</p>
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Keine Alerts vorhanden</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Erstelle deinen ersten Alert, um Nutzer zu informieren</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
            >
              <Plus size={18} />
              Alert erstellen
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => {
              const config = alertTypeConfig[alert.alert_type]
              const IconComponent = config.icon
              const isActive = isAlertActive(alert)
              const isScheduled = new Date(alert.start_date) > new Date()
              const isExpired = new Date(alert.end_date) < new Date()
              const priorityInfo = priorityConfig[alert.priority as keyof typeof priorityConfig]
              
              return (
                <div
                  key={alert.id}
                  className={`relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} transition-all duration-200 hover:shadow-lg group`}
                >
                  {/* Priority accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.accent}`} />
                  
                  <div className="p-5 pl-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                          <IconComponent size={24} className={config.text} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className={`font-bold text-lg ${config.text}`}>{alert.title}</h3>
                            
                            {/* Status Badge */}
                            {isActive && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                AKTIV
                              </span>
                            )}
                            {isScheduled && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                <Clock size={12} />
                                GEPLANT
                              </span>
                            )}
                            {isExpired && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-400 text-white text-xs font-bold rounded-full">
                                ABGELAUFEN
                              </span>
                            )}
                            
                            {/* Priority Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${priorityInfo.color}`}>
                              {priorityInfo.icon && <Zap size={12} />}
                              {priorityInfo.label}
                            </span>
                          </div>
                          
                          <p className={`${config.text} opacity-80 mb-3 leading-relaxed`}>{alert.message}</p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <div className={`flex items-center gap-1.5 ${config.text} opacity-70`}>
                              <Calendar size={14} />
                              <span>
                                {new Date(alert.start_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                {' '}
                                {new Date(alert.start_date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="mx-1">→</span>
                              <span>
                                {new Date(alert.end_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                {' '}
                                {new Date(alert.end_date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {alert.is_dismissible && (
                              <div className={`flex items-center gap-1 ${config.text} opacity-60`}>
                                <Eye size={14} />
                                <span>Schließbar</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="flex-shrink-0 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
                        title="Alert löschen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
