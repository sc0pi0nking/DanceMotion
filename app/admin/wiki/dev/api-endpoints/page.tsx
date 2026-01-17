'use client';

import Link from 'next/link';
import { ArrowLeft, Code, Route, Zap } from 'lucide-react';

export default function APIEndpointsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10">
            <Code size={32} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">API Endpoints</h1>
        </div>
        <p className="text-slate-400 text-lg">
          REST APIs, Route Handler, Request/Response
        </p>
      </div>

      <div className="space-y-8">
        {/* Auth APIs */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔐 Authentication APIs</h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>POST</strong> /api/admin/auth/login
              <p className="text-xs text-slate-400">Email & Passwort</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>POST</strong> /api/admin/auth/logout
              <p className="text-xs text-slate-400">Session beenden</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/auth/session
              <p className="text-xs text-slate-400">Aktuelle Session prüfen</p>
            </div>
          </div>
        </section>

        {/* CRUD APIs */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Route size={24} className="text-blue-500" />
            Ressourcen APIs
          </h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/users
              <p className="text-xs text-slate-400">Alle Benutzer abrufen</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>POST</strong> /api/admin/users
              <p className="text-xs text-slate-400">Neuen Benutzer erstellen</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>PUT</strong> /api/admin/users/[id]
              <p className="text-xs text-slate-400">Benutzer aktualisieren</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>DELETE</strong> /api/admin/users/[id]
              <p className="text-xs text-slate-400">Benutzer löschen</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/events
              <p className="text-xs text-slate-400">Events abrufen</p>
            </div>
            <div className="p-3 bg-slate-900 rounded font-mono">
              <strong>GET</strong> /api/admin/roles
              <p className="text-xs text-slate-400">Alle Rollen abrufen</p>
            </div>
          </div>
        </section>

        {/* Query Parameters */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔍 Query Parameter</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`// Pagination
GET /api/admin/users?page=1&limit=20

// Filtering
GET /api/admin/events?status=upcoming&group=smileys

// Sorting
GET /api/admin/users?sort=name&order=asc

// Searching
GET /api/admin/documents?search=datenschutz

// Date Range
GET /api/admin/audit?from=2025-01-01&to=2025-01-31`}</pre>
          </div>
        </section>

        {/* Request/Response */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap size={24} className="text-yellow-500" />
            Request/Response Format
          </h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`// Request Headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}

// Request Body (POST/PUT)
{
  "name": "John Doe",
  "email": "john@example.com",
  "role_id": "uuid"
}

// Success Response (200)
{
  "success": true,
  "data": { /* resource data */ }
}

// Error Response (400/500)
{
  "error": "Error message",
  "status": 400
}`}</pre>
          </div>
        </section>

        {/* Security */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔒 API Security</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Authentication:</strong> Alle APIs erfordern Login
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Authorization:</strong> Permissions werden geprüft
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Rate Limiting:</strong> Verhindert Abuse
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Input Validation:</strong> Alle Inputs validieren
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>HTTPS Only:</strong> Encryption in Transit
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Nutze RESTful Conventions</li>
            <li>✓ Dokumentiere alle Endpoints</li>
            <li>✓ Validiere Input</li>
            <li>✓ Prüfe Permissions</li>
            <li>✓ Return angemessene Status-Codes</li>
            <li>✓ Versioning beachten</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
