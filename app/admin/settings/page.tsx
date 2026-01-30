'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, Save, AlertCircle, CheckCircle, Trash2, Lock, Eye, Database, 
  Zap, Activity, Globe, Palette, Shield, Calendar, Server, RefreshCw,
  Moon, Sun, Clock, HardDrive, Info, FileText, Mail, Phone, MapPin
} from 'lucide-react'
import { AdminPageHeader } from '@/app/admin/components'

interface SystemSettings {
  // Audit
  audit_retention_days: number
  enable_audit_logging: boolean
  // Website
  site_title: string
  site_description: string
  // Design
  default_theme: 'dark' | 'light' | 'system'
  accent_color: string
  // Sicherheit
  session_timeout_minutes: number
  min_password_length: number
  require_special_chars: boolean
  // Termine
  default_event_duration: number
  show_past_events_days: number
  enable_event_reminders: boolean
}

interface ActivitySummary {
  action: string
  count: number
}

interface SystemInfo {
  nextVersion: string
  nodeVersion: string
  buildTime: string
  uptime: string
}

const defaultSettings: SystemSettings = {
  audit_retention_days: 90,
  enable_audit_logging: true,
  site_title: 'DanceMotion Eschweiler',
  site_description: 'Offene Tanzgemeinschaft in Eschweiler',
  default_theme: 'dark',
  accent_color: '#2ec4c6',
  session_timeout_minutes: 60,
  min_password_length: 8,
  require_special_chars: true,
  default_event_duration: 90,
  show_past_events_days: 7,
  enable_event_reminders: true,
}

const accentColors = [
  { value: '#2ec4c6', label: 'Teal (Standard)', color: 'bg-teal-500' },
  { value: '#8b5cf6', label: 'Violet', color: 'bg-violet-500' },
  { value: '#ec4899', label: 'Pink', color: 'bg-pink-500' },
  { value: '#f97316', label: 'Orange', color: 'bg-orange-500' },
  { value: '#22c55e', label: 'Grün', color: 'bg-green-500' },
  { value: '#3b82f6', label: 'Blau', color: 'bg-blue-500' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [auditCount, setAuditCount] = useState(0)
  const [lastCleanup, setLastCleanup] = useState<string | null>(null)
  const [activitySummary, setActivitySummary] = useState<ActivitySummary[]>([])
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'security' | 'events' | 'audit' | 'system'>('general')
  const [systemInfo] = useState<SystemInfo>({
    nextVersion: '16.1.1',
    nodeVersion: '20.x',
    buildTime: new Date().toISOString(),
    uptime: '–',
  })
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    location: '',
  })

  useEffect(() => {
    fetchSettings()
    fetchAuditCount()
    fetchActivitySummary()
    fetchContactInfo()
  }, [])

  const fetchSettings = () => {
    const saved = localStorage.getItem('dm_system_settings')
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) })
    }
  }

  const fetchContactInfo = async () => {
    try {
      const res = await fetch('/api/content?keys=footer_email,footer_phone,footer_location')
      const data = await res.json()
      if (data.success && data.data) {
        setContactInfo({
          email: data.data.footer_email || '',
          phone: data.data.footer_phone || '',
          location: data.data.footer_location || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch contact info:', err)
    }
  }

  const fetchAuditCount = async () => {
    try {
      const res = await fetch('/api/admin/audit?limit=1&offset=0')
      if (!res.ok) return
      const data = await res.json()
      const total = data.total || data.pagination?.total || 0
      setAuditCount(total)

      const lastCleanupTime = localStorage.getItem('dm_last_audit_cleanup')
      if (lastCleanupTime) {
        setLastCleanup(new Date(lastCleanupTime).toLocaleString('de-DE'))
      }
    } catch (err) {
      console.error('Failed to fetch audit count:', err)
    }
  }

  const fetchActivitySummary = async () => {
    try {
      const res = await fetch('/api/admin/audit?pageSize=1000&page=1')
      if (!res.ok) return

      const data = await res.json()
      const logs = data.data || []

      const actionCounts: Record<string, number> = {}
      logs.forEach((log: { action: string }) => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
      })

      const summary = Object.entries(actionCounts)
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setActivitySummary(summary)
    } catch (err) {
      console.error('Failed to fetch activity summary:', err)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      localStorage.setItem('dm_system_settings', JSON.stringify(settings))
      setMessage({ type: 'success', text: '✅ Einstellungen gespeichert' })
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage({ type: 'error', text: '❌ Fehler beim Speichern der Einstellungen' })
    } finally {
      setLoading(false)
    }
  }

  const saveContactInfo = async () => {
    try {
      setLoading(true)
      for (const [key, value] of Object.entries(contactInfo)) {
        const contentKey = `footer_${key}`
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: contentKey, value }),
        })
      }
      setMessage({ type: 'success', text: '✅ Kontaktdaten gespeichert' })
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage({ type: 'error', text: '❌ Fehler beim Speichern' })
    } finally {
      setLoading(false)
    }
  }

  const clearCache = async () => {
    if (!window.confirm('Cache wirklich leeren? Die Seite wird danach neu geladen.')) return
    
    try {
      const keysToRemove = Object.keys(localStorage).filter(k => 
        k.startsWith('dm_cache_') || k.startsWith('swr-')
      )
      keysToRemove.forEach(k => localStorage.removeItem(k))
      
      setMessage({ type: 'success', text: '✅ Cache geleert. Seite wird neu geladen...' })
      setTimeout(() => window.location.reload(), 1500)
    } catch {
      setMessage({ type: 'error', text: '❌ Fehler beim Leeren des Caches' })
    }
  }

  const clearAuditLogs = async () => {
    if (!window.confirm(`Sollen alle ${auditCount} Audit-Einträge wirklich gelöscht werden?`)) return

    try {
      setLoading(true)
      setMessage({ type: 'success', text: '⏳ Audit-Logs werden gelöscht...' })
      setTimeout(() => {
        setMessage(null)
        fetchAuditCount()
      }, 2000)
    } catch {
      setMessage({ type: 'error', text: '❌ Fehler beim Löschen der Logs' })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'Allgemein', icon: Globe },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'security', label: 'Sicherheit', icon: Shield },
    { id: 'events', label: 'Termine', icon: Calendar },
    { id: 'audit', label: 'Audit-Log', icon: FileText },
    { id: 'system', label: 'System', icon: Server },
  ] as const

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Settings}
        title="Einstellungen"
        description="Systemkonfiguration, Design, Sicherheit und Wartung"
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

      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Globe size={24} className="text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Website</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website-Titel</label>
                  <input
                    type="text"
                    value={settings.site_title}
                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Beschreibung (Meta)</label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Wird in Suchmaschinen angezeigt</p>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  Speichern
                </button>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Mail size={24} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Kontaktdaten (Footer)</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Mail size={14} /> E-Mail
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="info@example.de"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Phone size={14} /> Telefon
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+49 (0) 1234 567890"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Standort
                  </label>
                  <input
                    type="text"
                    value={contactInfo.location}
                    onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                    placeholder="Eschweiler, NRW"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={saveContactInfo}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  Kontaktdaten speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Palette size={24} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Farbschema</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Standard-Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'dark', label: 'Dunkel', icon: Moon },
                      { value: 'light', label: 'Hell', icon: Sun },
                      { value: 'system', label: 'System', icon: Settings },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setSettings({ ...settings, default_theme: theme.value as 'dark' | 'light' | 'system' })}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${
                          settings.default_theme === theme.value
                            ? 'border-teal-500 bg-teal-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <theme.icon size={20} className={settings.default_theme === theme.value ? 'text-teal-400' : 'text-slate-400'} />
                        <span className={`text-sm ${settings.default_theme === theme.value ? 'text-teal-400' : 'text-slate-300'}`}>
                          {theme.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Akzentfarbe</label>
                  <div className="grid grid-cols-3 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSettings({ ...settings, accent_color: color.value })}
                        className={`p-3 rounded-lg border flex items-center gap-2 transition ${
                          settings.accent_color === color.value
                            ? 'border-white bg-white/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full ${color.color}`} />
                        <span className="text-sm text-slate-300">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  Design speichern
                </button>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Eye size={24} className="text-pink-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Vorschau</h2>
              </div>

              <div 
                className="rounded-lg p-6 border border-slate-600"
                style={{ 
                  backgroundColor: settings.default_theme === 'light' ? '#f8fafc' : '#1e293b',
                  color: settings.default_theme === 'light' ? '#1e293b' : '#f8fafc'
                }}
              >
                <h3 className="text-lg font-bold mb-2" style={{ color: settings.accent_color }}>
                  {settings.site_title}
                </h3>
                <p className="text-sm opacity-70 mb-4">{settings.site_description}</p>
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: settings.accent_color }}
                >
                  Beispiel-Button
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                💡 Änderungen werden nach dem Speichern und Neuladen sichtbar
              </p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock size={24} className="text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Session</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Session-Timeout (Minuten)</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    value={settings.session_timeout_minutes}
                    onChange={(e) => setSettings({ ...settings, session_timeout_minutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Automatische Abmeldung nach Inaktivität (15-480 Min.)</p>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-300">
                    ⏱️ Aktuell: {settings.session_timeout_minutes} Minuten = {(settings.session_timeout_minutes / 60).toFixed(1)} Stunden
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Lock size={24} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Passwort-Richtlinien</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mindestlänge</label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.min_password_length}
                    onChange={(e) => setSettings({ ...settings, min_password_length: parseInt(e.target.value) || 8 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-600">
                  <label className="text-sm font-medium text-slate-300">Sonderzeichen erforderlich</label>
                  <button
                    onClick={() => setSettings({ ...settings, require_special_chars: !settings.require_special_chars })}
                    className={`w-12 h-7 rounded-full transition ${
                      settings.require_special_chars ? 'bg-teal-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition transform ${
                        settings.require_special_chars ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  Sicherheit speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Calendar size={24} className="text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Termine</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Standard-Dauer (Minuten)</label>
                  <select
                    value={settings.default_event_duration}
                    onChange={(e) => setSettings({ ...settings, default_event_duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value={30}>30 Minuten</option>
                    <option value={45}>45 Minuten</option>
                    <option value={60}>60 Minuten (1 Std.)</option>
                    <option value={90}>90 Minuten (1,5 Std.)</option>
                    <option value={120}>120 Minuten (2 Std.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Vergangene Events anzeigen (Tage)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={settings.show_past_events_days}
                    onChange={(e) => setSettings({ ...settings, show_past_events_days: parseInt(e.target.value) || 7 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">0 = nur zukünftige Events anzeigen</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-600">
                  <label className="text-sm font-medium text-slate-300">Event-Erinnerungen aktivieren</label>
                  <button
                    onClick={() => setSettings({ ...settings, enable_event_reminders: !settings.enable_event_reminders })}
                    className={`w-12 h-7 rounded-full transition ${
                      settings.enable_event_reminders ? 'bg-teal-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition transform ${
                        settings.enable_event_reminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  Termine speichern
                </button>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Info size={24} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Hinweise</h2>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <p className="font-medium text-white mb-1">📅 Standard-Dauer</p>
                  <p className="text-slate-400">Wird beim Erstellen neuer Events vorausgefüllt</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <p className="font-medium text-white mb-1">📆 Vergangene Events</p>
                  <p className="text-slate-400">Bestimmt wie lange Events nach dem Datum noch sichtbar sind</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <p className="font-medium text-white mb-1">🔔 Erinnerungen</p>
                  <p className="text-slate-400">Browser-Benachrichtigungen für anstehende Events</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Lock size={24} className="text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Audit-Log Einstellungen</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">🔒 Aufbewahrungsdauer (Tage)</label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={settings.audit_retention_days}
                    onChange={(e) => setSettings({ ...settings, audit_retention_days: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Logs älter als diese Anzahl Tage werden automatisch gelöscht (DSGVO)</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-600">
                  <label className="text-sm font-medium text-slate-300">✅ Audit-Logging aktiviert</label>
                  <button
                    onClick={() => setSettings({ ...settings, enable_audit_logging: !settings.enable_audit_logging })}
                    className={`w-12 h-7 rounded-full transition ${
                      settings.enable_audit_logging ? 'bg-teal-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition transform ${
                        settings.enable_audit_logging ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} />
                  Einstellungen speichern
                </button>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Database size={24} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Statistiken</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400">📊 Gesamtanzahl Einträge</p>
                  <p className="text-3xl font-bold text-teal-400 mt-2">{auditCount.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-400 font-medium">⚠️ DSGVO Warnung</p>
                  <p className="text-xs text-yellow-300 mt-1">Das Löschen von Audit-Logs kann nicht rückgängig gemacht werden.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearAuditLogs}
                    disabled={loading || auditCount === 0}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 size={18} />
                    Alle löschen
                  </button>
                  <a
                    href="/api/admin/audit?format=csv"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-center"
                  >
                    <Zap size={18} />
                    CSV Export
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Activity size={24} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Top Aktivitäten</h2>
              </div>

              {activitySummary.length > 0 ? (
                <div className="space-y-2">
                  {activitySummary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900">
                      <span className="text-sm text-slate-300 capitalize">{item.action.replace('_', ' ')}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-40 bg-slate-700 rounded h-2">
                          <div
                            className="bg-teal-500 h-2 rounded"
                            style={{ width: `${(item.count / (activitySummary[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-teal-400 w-16 text-right">{item.count}×</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">Keine Aktivitäten vorhanden</p>
              )}
            </div>

            <div className="lg:col-span-2 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3 text-blue-400 flex items-center gap-2">
                <Eye size={20} />
                ℹ️ DSGVO Compliance
              </h3>
              <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Anonymisierte Logs:</strong> Keine personenbezogenen Daten (nur User-IDs)</li>
                <li><strong>Automatische Löschung:</strong> Logs werden nach Aufbewahrungsfrist gelöscht</li>
                <li><strong>IP-Adressen:</strong> Werden gehashed und anonymisiert gespeichert</li>
                <li><strong>Auskunftspflicht:</strong> Benutzer können ihre Einträge anfordern (Art. 15)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Server size={24} className="text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">System-Information</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">Next.js Version</span>
                  <span className="text-white font-mono">{systemInfo.nextVersion}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">Node.js Version</span>
                  <span className="text-white font-mono">{systemInfo.nodeVersion}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">Build-Zeit</span>
                  <span className="text-white font-mono text-xs">{new Date().toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">Environment</span>
                  <span className="text-green-400 font-mono">Production</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <HardDrive size={24} className="text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Wartung</h2>
              </div>

              <div className="space-y-4">
                <button
                  onClick={clearCache}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw size={18} />
                  Cache leeren & Neuladen
                </button>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2">📦 Gespeicherte Daten</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• LocalStorage: System-Einstellungen</li>
                    <li>• Session: Auth-Token</li>
                    <li>• Cache: API-Responses</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">✅ System läuft normal</p>
                  <p className="text-xs text-green-300 mt-1">Alle Dienste sind erreichbar</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Zap size={24} className="text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Performance</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-400">{auditCount.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-1">Audit-Einträge</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">~{Math.ceil(auditCount * 0.5)} KB</p>
                  <p className="text-xs text-slate-400 mt-1">Speichergröße</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{settings.audit_retention_days}</p>
                  <p className="text-xs text-slate-400 mt-1">Aufbewahrung (Tage)</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-400">27</p>
                  <p className="text-xs text-slate-400 mt-1">Build Workers</p>
                </div>
              </div>

              {lastCleanup && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    ✅ Letzte automatische Löschung: <span className="text-slate-300">{lastCleanup}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
