'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Shield, Eye } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <Lock size={32} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold">Security & DSGVO</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Authentication, Authorization, Privacy, Compliance
        </p>
      </div>

      <div className="space-y-8">
        {/* Authentication */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock size={24} className="text-blue-500" />
            Authentication (Authentifizierung)
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Supabase Auth:</strong> Email/Passwort via Supabase
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Password Hashing:</strong> bcrypt mit Salt
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>JWT Tokens:</strong> Secure Session Management
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Session Timeout:</strong> 30 Minuten Inaktivität
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Password Reset:</strong> Email-Link mit Expiration
            </div>
          </div>
        </section>

        {/* Authorization */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield size={24} className="text-green-500" />
            Authorization (Berechtigung)
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Role-Based Access:</strong> Rollen mit Permissions
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>RLS Policies:</strong> Row Level Security in DB
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Permission Checking:</strong> Auf Server & Client
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Admin Only:</strong> Critical Operations geschützt
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye size={24} className="text-purple-500" />
            Datenschutz (DSGVO)
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔐 Encryption:</strong> HTTPS für alle Verbindungen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📛 Pseudonymisierung:</strong> Admin-Logs ohne Echtdaten
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗑️ Auto-Delete:</strong> Audit-Logs nach 90 Tagen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🍪 Cookie Banner:</strong> DSGVO-konform implementiert
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📊 Analytics:</strong> Respektiert Cookie-Einstellungen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📝 Datenschutz-Seite:</strong> /datenschutz mit Details
            </div>
          </div>
        </section>

        {/* OWASP Top 10 */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⚠️ OWASP Top 10 Schutzmaßnahmen</h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-3 bg-slate-900 rounded">
              <strong>1. Injection:</strong> Prepared Statements, Input Validation
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>2. Broken Authentication:</strong> JWT, Secure Sessions
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>3. Sensitive Data:</strong> Encryption, HTTPS nur
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>4. XML External Entities:</strong> N/A (kein XML)
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>5. Broken Access Control:</strong> RLS, Permission Checks
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>6. Security Misconfiguration:</strong> Security Headers, CSP
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>7. XSS:</strong> React Escaping, CSP Headers
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>8. Deserialization:</strong> JSON only, validiert
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>9. Using Components with Known Vulnerabilities:</strong> npm audit
            </div>
            <div className="p-3 bg-slate-900 rounded">
              <strong>10. Insufficient Logging:</strong> Audit Log System aktiv
            </div>
          </div>
        </section>

        {/* Security Headers */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🛡️ Security Headers</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`# next.config.ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' }
      ]
    }
  ];
}`}</pre>
          </div>
        </section>

        {/* Audit & Monitoring */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📊 Audit & Monitoring</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Audit Log:</strong> Alle Admin-Aktionen geloggt
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>IP Tracking:</strong> Client-IP für jede Aktion
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Zeitstempel:</strong> Exakte Timing für forensics
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Export:</strong> Audit-Logs als CSV für Reports
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Security Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Überprüfe Permissions auf Server-Seite</li>
            <li>✓ Verwende HTTPS überall</li>
            <li>✓ Sanitize User Input</li>
            <li>✓ Nutze Environment Variables für Secrets</li>
            <li>✓ Regelmäßige Security Updates</li>
            <li>✓ DSGVO-Compliance checken</li>
            <li>✓ Regelmäßige Security Audits</li>
            <li>✓ Incident Response Plan</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
