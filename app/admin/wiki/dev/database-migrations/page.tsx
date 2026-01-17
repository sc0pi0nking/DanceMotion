'use client';

import Link from 'next/link';
import { ArrowLeft, Database, GitBranch, Lock } from 'lucide-react';

export default function DatabaseMigrationsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-indigo-500/10">
            <Database size={32} className="text-indigo-500" />
          </div>
          <h1 className="text-4xl font-bold">Datenbank & Migrations</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Schema, Migrations, RLS, SQL Funktionen
        </p>
      </div>

      <div className="space-y-8">
        {/* Migrations Overview */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📋 Migration System</h2>
          <p className="text-slate-300 mb-4">
            Versionskontrolle für Datenbankänderungen:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Location:</strong> supabase/migrations/
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Naming:</strong> 001_create_tables.sql, 002_add_columns.sql, etc.
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Idempotent:</strong> Migrations müssen mehrmals laufen können
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Version Control:</strong> Alle Migrations in Git
            </div>
          </div>
        </section>

        {/* Migration Files */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GitBranch size={24} className="text-blue-500" />
            Verfügbare Migrations
          </h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded">
              <strong>001_create_tables.sql:</strong> Basis-Schema (users, roles, etc.)
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>002_create_documents.sql:</strong> Document System
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>003_event_requests_and_roles.sql:</strong> Events & Roles
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>004_dsgvo_auto_delete.sql:</strong> 90-Day Auto-Delete
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>005_create_test_users.sql:</strong> Test-Daten
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>006_faq_system.sql:</strong> FAQ-Tabellen
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>007_team_system.sql:</strong> Team-Verwaltung
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>008_add_document_versioning.sql:</strong> Document Versioning
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>011_user_role_management.sql:</strong> Permissions & Audit
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>012_analytics_system.sql:</strong> Analytics-Tabellen
            </div>
          </div>
        </section>

        {/* RLS (Row Level Security) */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock size={24} className="text-yellow-500" />
            Row Level Security (RLS)
          </h2>
          <p className="text-slate-300 mb-4">
            Datenbankebenen-Zugriffskontrolle:
          </p>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`-- RLS Policy Beispiel
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can see all users"
ON admin_users FOR SELECT
USING (
  auth.uid()::text IN (
    SELECT user_id FROM admin_users
    WHERE role_id IN (
      SELECT id FROM admin_roles WHERE name = 'admin'
    )
  )
);

-- Service Role umgeht RLS (für APIs)`}</pre>
          </div>
        </section>

        {/* SQL Functions */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⚙️ SQL Funktionen</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`-- Update Timestamp
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Get User Permissions
CREATE FUNCTION get_user_permissions(user_id UUID)
RETURNS JSONB AS $$
BEGIN
  -- Returns user's permissions based on role
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}</pre>
          </div>
        </section>

        {/* Indexes */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⚡ Performance Indexes</h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>B-Tree:</strong> Standard für WHERE, ORDER BY, JOIN
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GIST:</strong> Für Full-Text Search
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GIN:</strong> Für JSONB Columns
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>BRIN:</strong> Für große Tabellen mit zeitlichen Daten
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Schreibe Migrations idempotent (DROP IF EXISTS)</li>
            <li>✓ Teste Migrations lokal vor Push</li>
            <li>✓ Dokumentiere Schema-Änderungen</li>
            <li>✓ Nutze RLS für Datensicherheit</li>
            <li>✓ Erstelle Indexes für häufige Queries</li>
            <li>✓ Backup vor Production-Migrations</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
