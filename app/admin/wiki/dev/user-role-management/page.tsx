'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Lock, Shield } from 'lucide-react';

export default function UserRoleManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Users size={32} className="text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Benutzer & Rollen</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Permission System, Role-based Access Control, User Management
        </p>
      </div>

      <div className="space-y-8">
        {/* Roles Overview */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">👥 Verfügbare Rollen</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>admin:</strong> Vollständiger Zugriff auf alle Funktionen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>editor:</strong> Content, Gallery, Documents, FAQs, Team, Wiki Admin
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>event-manager:</strong> Events, Recurring Termine, Wiki Admin
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>social-manager:</strong> Social Links, Gallery, Wiki Admin
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>viewer:</strong> Nur Dashboard und Analytik (Read-Only)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>developer:</strong> Tech Wiki, Users, Roles, Audit, Settings
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>support:</strong> Dashboard, Admin Wiki, Analytik
            </div>
          </div>
        </section>

        {/* Permissions */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock size={24} className="text-yellow-500" />
            Permission System
          </h2>
          <p className="text-slate-300 mb-4">Alle verfügbaren Permissions:</p>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`dashboard          // Admin Dashboard
events             // Events verwalten
recurring          // Wiederkehrende Termine
content            // Inhalte bearbeiten
gallery            // Galerie verwalten
documents          // Dokumente verwalten
faqs               // FAQs verwalten
team               // Team-Mitglieder
wiki_admin         // Admin Wiki (Non-Tech)
wiki_dev           // Dev Wiki (Technical)
social             // Social Media Links
users              // Benutzer verwalten
roles              // Rollen verwalten
analytics          // Analytics einsehen
audit              // Audit Logs
settings           // System-Einstellungen`}</pre>
          </div>
        </section>

        {/* Database Schema */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🗄️ Datenbank-Schema</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  password_hash TEXT,
  role_id UUID REFERENCES admin_roles(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE admin_roles (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  description TEXT,
  permissions JSONB,  -- Array von Permission-Strings
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);`}</pre>
          </div>
        </section>

        {/* Permission Checking */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield size={24} className="text-green-500" />
            Permission Checking in Code
          </h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`// In lib/auth.ts
import { checkUserPermission } from '@/lib/auth';

// Server-side
const hasAccess = await checkUserPermission(userId, 'events');

// Client-side
if (!permissions.includes('wiki_admin')) {
  return <AccessDenied />;
}`}</pre>
          </div>
        </section>

        {/* API Routes */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔌 API Endpoints</h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/users
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>POST</strong> /api/admin/users
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>PUT</strong> /api/admin/users/[id]
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>DELETE</strong> /api/admin/users/[id]
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/roles
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>POST</strong> /api/admin/roles/[id]/reset-password
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Folge dem Principle of Least Privilege</li>
            <li>✓ Überprüfe Permissions auf Server-Seite</li>
            <li>✓ Nutze lib/auth.ts für Permission-Checks</li>
            <li>✓ Dokumentiere Custom Permissions</li>
            <li>✓ Teste Permission-Szenarien</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
