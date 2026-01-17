'use client';

import Link from 'next/link';
import { ArrowLeft, Database, Clock, Download } from 'lucide-react';

export default function AuditSystemPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-purple-500/10">
            <Database size={32} className="text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold">Audit-Log-System</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Nachverfolgung, Compliance und Audit Logs
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📋 Audit-Log Überblick</h2>
          <p className="text-slate-300 mb-4">
            Das Audit-Log System dokumentiert alle Benutzeraktivitäten:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>👤 Benutzer:</strong> Wer hat etwas getan
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎯 Aktion:</strong> Was wurde getan (create, update, delete, login, etc.)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗂️ Target:</strong> Was wurde verändert (User, Event, Document, etc.)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📍 IP-Adresse:</strong> Von wo aus die Aktion erfolgte
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>⏰ Zeitstempel:</strong> Wann die Aktion stattfand
            </div>
          </div>
        </section>

        {/* API Routes */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔌 API Endpoints</h2>
          <div className="space-y-3 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/audit
              <p className="text-xs text-slate-400 mt-1">Audit-Logs abrufen (mit Pagination & Filtering)</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>POST</strong> /api/admin/audit/export
              <p className="text-xs text-slate-400 mt-1">Logs als CSV exportieren</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/audit?action=login
              <p className="text-xs text-slate-400 mt-1">Nach Aktion filtern</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">✨ Audit-System Features</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔍 Suche & Filter:</strong> Nach Benutzer, Aktion, Datum filtern
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📊 Statistiken:</strong> Top-Aktionen, Aktivitätstrends
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📥 Export:</strong> Logs als CSV/JSON exportieren
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🕐 Retention:</strong> 90-Tage Auto-Delete für Compliance
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔐 Sicherheit:</strong> Audit-Logs können nicht gelöscht werden
            </div>
          </div>
        </section>

        {/* Database Schema */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🗄️ Datenbank-Schema</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY,
  user_id TEXT,           -- Admin User ID
  action TEXT,            -- 'create', 'update', 'delete', 'login'
  target_type TEXT,       -- 'user', 'role', 'event', 'document'
  target_id TEXT,         -- ID des veränderten Objekts
  details JSONB,          -- Zusätzliche Daten
  ip_address TEXT,        -- Client IP
  created_at TIMESTAMPTZ
)

CREATE INDEX idx_audit_user_id ON admin_audit_log(user_id);
CREATE INDEX idx_audit_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_log(action);`}</pre>
          </div>
        </section>

        {/* Compliance */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⚖️ Compliance & DSGVO</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🕐 Auto-Delete:</strong> Logs werden nach 90 Tagen automatisch gelöscht
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔒 Pseudonymisierung:</strong> Benutzerdaten werden gekürzt dargestellt
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📋 Reporting:</strong> Compliance-Reports generieren
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔑 Zugriffskontrolle:</strong> Nur Admin kann Logs einsehen
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
