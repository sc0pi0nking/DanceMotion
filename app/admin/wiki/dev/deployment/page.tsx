'use client';

import Link from 'next/link';
import { ArrowLeft, Server, Container, GitBranch } from 'lucide-react';

export default function DeploymentPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-orange-500/10">
            <Server size={32} className="text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold">Deployment & Server</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Docker, SSH, CI/CD, Production Setup
        </p>
      </div>

      <div className="space-y-8">
        {/* Server Info */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🖥️ Produktions-Server</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Host:</strong> 192.168.178.116
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>User:</strong> dev (oder luca)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Path:</strong> /opt/dancemotion/web
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Runtime:</strong> Docker Alpine Node 20
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Domain:</strong> https://dancemotion.org
            </div>
          </div>
        </section>

        {/* Docker */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Container size={24} className="text-blue-500" />
            Docker Setup
          </h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=...
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    volumes:
      - ./:/app
      - /app/node_modules

# Befehle
docker compose up -d          # Start
docker compose down           # Stop
docker compose logs -f        # Logs
docker compose restart        # Restart
docker compose up -d --build  # Rebuild`}</pre>
          </div>
        </section>

        {/* Deployment Process */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GitBranch size={24} className="text-purple-500" />
            Deployment Workflow
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Code ändern & testen lokal</li>
            <li><strong>2.</strong> <code className="bg-slate-800 px-2 py-1 rounded">git add -A</code> & <code className="bg-slate-800 px-2 py-1 rounded">git commit</code></li>
            <li><strong>3.</strong> <code className="bg-slate-800 px-2 py-1 rounded">npm run build</code> - Build testen</li>
            <li><strong>4.</strong> <code className="bg-slate-800 px-2 py-1 rounded">git push</code> zu GitHub</li>
            <li><strong>5.</strong> SSH zu Server: <code className="bg-slate-800 px-2 py-1 rounded">ssh dev@192.168.178.116</code></li>
            <li><strong>6.</strong> Pull & Restart: <code className="bg-slate-800 px-2 py-1 rounded">cd /opt/dancemotion/web && git pull && docker compose down && docker compose up -d --build</code></li>
            <li><strong>7.</strong> Prüfe: <code className="bg-slate-800 px-2 py-1 rounded">docker compose logs -f</code></li>
          </ol>
        </section>

        {/* Health Checks */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🏥 Post-Deployment Checks</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🌐 Website:</strong> https://dancemotion.org sollte laden
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📝 Admin:</strong> https://dancemotion.org/admin Login prüfen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔗 API:</strong> API-Endpoints testen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📊 Logs:</strong> Keine Fehler in <code className="bg-slate-700 px-2 py-1 rounded">docker logs</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>💾 Database:</strong> Supabase Connection funktioniert
            </div>
          </div>
        </section>

        {/* Monitoring */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📈 Monitoring & Logs</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Live Logs:</strong> <code className="bg-slate-700 px-2 py-1 rounded">docker compose logs -f</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>History:</strong> <code className="bg-slate-700 px-2 py-1 rounded">docker compose logs --tail 100</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Container Status:</strong> <code className="bg-slate-700 px-2 py-1 rounded">docker ps</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Server Status:</strong> <code className="bg-slate-700 px-2 py-1 rounded">ssh dev@192.168.178.116 'df -h'</code>
            </div>
          </div>
        </section>

        {/* Rollback */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⏮️ Rollback bei Fehlern</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>Letzten Commit rückgängig:</strong> <code className="bg-slate-700 px-2 py-1 rounded">git reset --hard HEAD~1 && git push -f</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Zu älter Version:</strong> <code className="bg-slate-700 px-2 py-1 rounded">git checkout v1.0.0</code>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Server neustarten:</strong> <code className="bg-slate-700 px-2 py-1 rounded">docker compose restart</code>
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              ⚠️ <strong>Wichtig:</strong> Force-Push nur im Notfall, danach Team informieren!
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Teste immer lokal vor Push</li>
            <li>✓ Build erfolgreich prüfen</li>
            <li>✓ Schreibe aussagekräftige Commit-Messages</li>
            <li>✓ Kleine, regelmäßige Deployments</li>
            <li>✓ Monitoring nach jedem Deploy</li>
            <li>✓ Database Backups vor Migration</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
