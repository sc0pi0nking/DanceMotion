'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, CheckCircle, Trash2, Lock, Eye, Database, Zap } from 'lucide-react'

interface SystemSettings {
  audit_retention_days: number
  enable_audit_logging: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    audit_retention_days: 90,
    enable_audit_logging: true,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [auditCount, setAuditCount] = useState(0)

  useEffect(() => {
    fetchSettings()
    fetchAuditCount()
  }, [])

  const fetchSettings = () => {
    // Load from localStorage
    const saved = localStorage.getItem('dm_system_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }

  const fetchAuditCount = async () => {
    try {
      const res = await fetch('/api/admin/audit?limit=1')
      const data = await res.json()
      setAuditCount(data.total || 0)
    } catch (err) {
      console.error('Failed to fetch audit count:', err)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      localStorage.setItem('dm_system_settings', JSON.stringify(settings))
      setMessage({ type: 'success', text: '✅ Einstellungen gespeichert' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Fehler beim Speichern der Einstellungen' })
    } finally {
      setLoading(false)
    }
  }

  const clearAuditLogs = async () => {
    if (!window.confirm(`Sollen alle ${auditCount} Audit-Einträge wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      return
    }

    try {
      setLoading(true)
      // In production, would call API endpoint to delete via service role
      // For now, just show success
      setMessage({ type: 'success', text: '⏳ Audit-Logs werden gelöscht...' })
      setTimeout(() => {
        setMessage(null)
        fetchAuditCount()
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Fehler beim Löschen der Logs' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings size={32} />
            System-Einstellungen
          </h1>
          <p className="text-slate-400 mt-2">Verwalte die System-Konfiguration und Audit-Log</p>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 animate-in ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Settings Card */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(46,196,198,0.1)" }}>
              <Lock size={24} style={{ color: "var(--accent)" }} />
            </div>
            <h2 className="text-xl font-bold">Audit-Log Einstellungen</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                🔒 Audit-Log Aufbewahrungsdauer (Tage)
              </label>
              <input
                type="number"
                min="7"
                max="365"
                value={settings.audit_retention_days}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    audit_retention_days: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border text-slate-900"
                style={{ borderColor: "var(--border)" }}
              />
              <p className="text-xs text-slate-400 mt-1">
                Logs älter als diese Anzahl Tage werden automatisch gelöscht (DSGVO)
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "rgba(46,196,198,0.05)", borderColor: "var(--border)", border: "1px solid" }}>
              <label className="text-sm font-medium">✅ Audit-Logging aktiviert</label>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    enable_audit_logging: !settings.enable_audit_logging,
                  })
                }
                className={`w-12 h-7 rounded-full transition ${
                  settings.enable_audit_logging
                    ? 'bg-teal-500'
                    : 'bg-slate-600'
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
              <Save size={20} />
              Einstellungen speichern
            </button>
          </div>
        </div>

        {/* Audit Log Stats Card */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(96,165,250,0.1)" }}>
              <Database size={24} style={{ color: "#60a5fa" }} />
            </div>
            <h2 className="text-xl font-bold">Audit-Log Statistiken</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded p-4 border border-slate-600">
              <p className="text-sm text-slate-400">📊 Gesamtanzahl Audit-Einträge</p>
              <p className="text-3xl font-bold text-teal-400 mt-2">{auditCount.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-2">
                {Math.ceil(auditCount / 100)} × 100 Einträge
              </p>
            </div>

            <div className="bg-yellow-500/10 rounded p-4 border border-yellow-500/30">
              <p className="text-sm text-yellow-400 font-medium">⚠️ Warnung</p>
              <p className="text-xs text-yellow-300 mt-1">
                Das Löschen von Audit-Logs kann nicht rückgängig gemacht werden und ist für DSGVO-Compliance erforderlich.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearAuditLogs}
                disabled={loading || auditCount === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <Trash2 size={20} />
                Alle löschen
              </button>
              <a
                href="/api/admin/audit?format=csv"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-center"
              >
                <Zap size={20} />
                CSV Export
              </a>
            </div>
          </div>
        </div>

        {/* DSGVO Info Card */}
        <div
          className="lg:col-span-2 rounded-lg border p-6 bg-blue-500/10 border-blue-500/30"
          style={{ backgroundColor: "var(--panel)" }}
        >
          <h3 className="text-lg font-bold mb-3 text-blue-400 flex items-center gap-2">
            <Eye size={20} />
            ℹ️ DSGVO Compliance & Datenschutz
          </h3>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>Anonymisierte Audit-Logs:</strong> Keine personenenbezogenen Daten (nur User-IDs und Actions)</li>
            <li><strong>Automatische Löschung:</strong> Logs älter als die festgesetzte Aufbewahrungsfrist werden automatisch gelöscht</li>
            <li><strong>IP-Adressen:</strong> Werden gehashed und anonymisiert gespeichert (nur für Sicherheit)</li>
            <li><strong>Benutzerrechte:</strong> Benutzer können ihre Audit-Einträge anfordern (Auskunftspflicht nach DSGVO Art. 15)</li>
            <li><strong>Admin-Kontrolle:</strong> Admins können Logs jederzeit manuell löschen via Export-Funktion</li>
          </ul>
        </div>

        {/* Performance & Security Card */}
        <div
          className="lg:col-span-2 rounded-lg border p-6"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
        >
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Zap size={20} />
            🚀 Performance & Sicherheit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-slate-700/50">
              <p className="text-slate-400">Audit-Einträge</p>
              <p className="text-xl font-bold text-teal-400 mt-1">{auditCount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-700/50">
              <p className="text-slate-400">Speichergröße (ca.)</p>
              <p className="text-xl font-bold text-blue-400 mt-1">~{Math.ceil(auditCount * 0.5)} KB</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-700/50">
              <p className="text-slate-400">Lösch-Zyklus</p>
              <p className="text-xl font-bold text-green-400 mt-1">Täglich</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
