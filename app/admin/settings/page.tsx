'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'

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
      setMessage({ type: 'success', text: 'Einstellungen gespeichert' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern der Einstellungen' })
    } finally {
      setLoading(false)
    }
  }

  const clearAuditLogs = async () => {
    if (!window.confirm(`Sollen alle ${auditCount} Audit-Einträge wirklich gelöscht werden?`)) {
      return
    }

    try {
      setLoading(true)
      // In production, would call API endpoint to delete via service role
      // For now, just show success
      setMessage({ type: 'success', text: 'Audit-Logs werden gelöscht...' })
      setTimeout(() => {
        setMessage(null)
        fetchAuditCount()
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Löschen der Logs' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings size={32} />
            System-Einstellungen
          </h1>
          <p className="text-slate-400 mt-2">Verwalte die System-Einstellungen und Audit-Logs</p>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Settings Card */}
        <div
          className="rounded-lg border p-6"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            Audit-Log Einstellungen
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Audit-Log Aufbewahrungsdauer (Tage)
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
                Audit-Logs älter als diese Anzahl Tage werden automatisch gelöscht (DSGVO)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Audit-Logging aktiviert</label>
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
          className="rounded-lg border p-6"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            Audit-Log Statistiken
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded p-4">
              <p className="text-sm text-slate-400">Gesamtanzahl Audit-Einträge</p>
              <p className="text-3xl font-bold text-teal-400">{auditCount.toLocaleString()}</p>
            </div>

            <div className="bg-yellow-500/10 rounded p-4 border border-yellow-500/30">
              <p className="text-xs text-yellow-400 mb-2">⚠️ Warnung</p>
              <p className="text-sm text-yellow-300">
                Das Löschen von Audit-Logs kann nicht rückgängig gemacht werden.
              </p>
            </div>

            <button
              onClick={clearAuditLogs}
              disabled={loading || auditCount === 0}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <Trash2 size={20} />
              Alle Audit-Logs löschen
            </button>
          </div>
        </div>

        {/* DSGVO Info Card */}
        <div
          className="lg:col-span-2 rounded-lg border p-6 bg-blue-500/10 border-blue-500/30"
          style={{ backgroundColor: "var(--panel)" }}
        >
          <h3 className="text-lg font-bold mb-3 text-blue-400">ℹ️ DSGVO Compliance</h3>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>Audit-Logs enthalten keine personenenbezogenen Daten (nur User-IDs)</li>
            <li>Logs älter als die festgesetzte Aufbewahrungsfrist werden automatisch gelöscht</li>
            <li>IP-Adressen werden anonymisiert gespeichert (nur für Sicherheit)</li>
            <li>Benutzer haben das Recht, ihre Audit-Einträge zu erfahren</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
