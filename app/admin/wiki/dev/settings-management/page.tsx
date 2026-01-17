'use client';

import Link from 'next/link';
import { ArrowLeft, Settings, Sliders, Clock } from 'lucide-react';

export default function SettingsManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10">
            <Settings size={32} className="text-cyan-500" />
          </div>
          <h1 className="text-4xl font-bold">Settings & Config</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Systemkonfiguration, Datenspeicherung, Retention
        </p>
      </div>

      <div className="space-y-8">
        {/* Settings Overview */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⚙️ System-Einstellungen</h2>
          <p className="text-slate-300 mb-4">
            Verwaltbare Konfigurationsoptionen im Admin Panel:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🕐 Retention:</strong> Wie lange Audit-Logs gespeichert werden
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📧 Email:</strong> SMTP-Konfiguration für Benachrichtigungen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔒 Security:</strong> Passwort-Anforderungen, Session-Timeout
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📱 API:</strong> API-Keys, Rate-Limiting
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎨 Branding:</strong> Site-Name, Logo, Farben
            </div>
          </div>
        </section>

        {/* Audit Retention */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock size={24} className="text-blue-500" />
            Audit Log Retention
          </h2>
          <p className="text-slate-300 mb-4">
            Konfiguriert wie lange Audit-Logs aufbewahrt werden:
          </p>
          <div className="p-4 bg-slate-900 rounded-lg text-slate-300 space-y-3">
            <div>
              <strong>Standard:</strong> 90 Tage
            </div>
            <div>
              <strong>Compliance:</strong> DSGVO-konform, Auto-Delete nach Ablauf
            </div>
            <div>
              <strong>Anpassbar:</strong> Über Admin Settings konfigurierbar
            </div>
            <div className="text-sm text-slate-400">
              Größere Aufbewahrungsfristen erhöhen die Speichernutzung
            </div>
          </div>
        </section>

        {/* Configuration Files */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📝 Konfigurationsdateien</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>.env.local:</strong> Lokale Umgebungsvariablen (nicht versioniert)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>.env.example:</strong> Vorlage für Umgebungsvariablen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>next.config.ts:</strong> Next.js Build-Konfiguration
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>tsconfig.json:</strong> TypeScript-Konfiguration
            </div>
          </div>
        </section>

        {/* Environment Variables */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sliders size={24} className="text-green-500" />
            Wichtige Umgebungsvariablen
          </h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Database
DATABASE_URL=...

# API
NEXT_PUBLIC_API_URL=https://...
API_SECRET_KEY=...

# Settings
AUDIT_RETENTION_DAYS=90
SESSION_TIMEOUT_MINUTES=30

# Features
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_COOKIE_BANNER=true`}</pre>
          </div>
        </section>

        {/* Database Migrations */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🗄️ Einstellungen in der Datenbank</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`CREATE TABLE admin_settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE,
  value JSONB,
  category TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

-- Beispiele:
-- { key: 'audit_retention_days', value: 90 }
-- { key: 'session_timeout', value: 30 }
-- { key: 'site_name', value: 'DanceMotion' }`}</pre>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Schreibe .env.local niemals in Git</li>
            <li>✓ Nutze .env.example für Dokumentation</li>
            <li>✓ Dokumentiere alle Settings mit Defaults</li>
            <li>✓ Teste Settings in Staging vor Production</li>
            <li>✓ Monitore Retention und Speichernutzung</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
