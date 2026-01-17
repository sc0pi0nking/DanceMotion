'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Bug, FileText } from 'lucide-react';

export default function ErrorHandlingPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-500/10">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold">Fehlerbehandlung</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Error Pages, Exception Handling, Logging
        </p>
      </div>

      <div className="space-y-8">
        {/* Error Pages */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText size={24} className="text-orange-500" />
            Error Pages
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>404 Not Found:</strong> app/not-found.tsx - Seite existiert nicht
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>500 Server Error:</strong> app/error.tsx - Interner Server-Fehler
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>401 Unauthorized:</strong> Authentifizierung erforderlich
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>403 Forbidden:</strong> Zugriff verweigert (Permission)
            </div>
          </div>
        </section>

        {/* Exception Handling */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bug size={24} className="text-yellow-500" />
            Exception Handling
          </h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`// Try-Catch Pattern
try {
  const data = await fetchData();
  return Response.json(data);
} catch (error) {
  console.error('Error:', error);
  return Response.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}

// Custom Error Classes
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}`}</pre>
          </div>
        </section>

        {/* Logging */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📊 Error Logging</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Console:</strong> Entwicklungs-Logging mit console.log/error
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Sentry:</strong> Production Error Tracking (optional)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Audit Log:</strong> Alle Fehler in Audit-DB dokumentieren
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Server Logs:</strong> Docker/systemd Logs prüfen
            </div>
          </div>
        </section>

        {/* API Error Responses */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔌 API Error Responses</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`// Standard Error Response
{
  error: "Invalid input",
  status: 400,
  timestamp: "2025-01-17T10:30:00Z"
}

// Validation Error
{
  error: "Validation failed",
  status: 422,
  details: {
    email: "Invalid email format",
    name: "Name is required"
  }
}

// Authentication Error
{
  error: "Unauthorized",
  status: 401,
  message: "Please login first"
}`}</pre>
          </div>
        </section>

        {/* Debugging Tips */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔍 Debugging Tipps</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Browser DevTools:</strong> F12 für Network & Console Logs
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Server Logs:</strong> <code className="bg-slate-700 px-2 py-1 rounded">docker logs -f</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Database:</strong> SQL-Fehler in Supabase Dashboard prüfen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Network:</strong> Netzwerkfehler und Timeouts überprüfen
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Definiere Custom Error Classes</li>
            <li>✓ Nutze Try-Catch für Async Operations</li>
            <li>✓ Gib aussagekräftige Error Messages</li>
            <li>✓ Logge Errors mit Kontext</li>
            <li>✓ Verstecke sensitive Daten in Errors</li>
            <li>✓ Teste Error Szenarien</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
