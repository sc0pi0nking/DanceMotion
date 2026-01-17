'use client';

import Link from 'next/link';
import { ArrowLeft, Terminal, Copy, Code, GitBranch, Package } from 'lucide-react';
import { useState } from 'react';

export default function CommandsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CommandBlock = ({ title, commands }: { title: string; commands: { cmd: string; desc: string; id: string }[] }) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-3 text-blue-400">{title}</h3>
      <div className="space-y-2">
        {commands.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg hover:bg-slate-800 transition">
            <button
              onClick={() => copyCommand(item.cmd, item.id)}
              className="mt-1 p-2 hover:bg-slate-700 rounded transition flex-shrink-0"
            >
              <Copy size={16} className={copied === item.id ? 'text-green-500' : 'text-slate-400'} />
            </button>
            <div className="flex-1 min-w-0">
              <code className="text-sm text-slate-300 block font-mono break-all">{item.cmd}</code>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-pink-500/10">
            <Terminal size={32} className="text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold">Nützliche Commands</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Häufig genutzte Commands für Development, Deployment und Debugging
        </p>
      </div>

      <div className="space-y-8">
        {/* Development */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Package size={24} className="text-blue-500" />
            Development & Build
          </h2>
          <CommandBlock
            title="Lokale Entwicklung"
            commands={[
              { id: 'dev', cmd: 'npm run dev', desc: 'Starte Dev Server (localhost:3000)' },
              { id: 'build', cmd: 'npm run build', desc: 'Produktions-Build erstellen' },
              { id: 'start', cmd: 'npm start', desc: 'Produktions-Build starten' },
              { id: 'lint', cmd: 'npm run lint', desc: 'ESLint prüfen' },
            ]}
          />
        </section>

        {/* Git */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GitBranch size={24} className="text-purple-500" />
            Git Operations
          </h2>
          <CommandBlock
            title="Basics"
            commands={[
              { id: 'status', cmd: 'git status', desc: 'Zeige Änderungen an' },
              { id: 'add-all', cmd: 'git add -A', desc: 'Alle Dateien zum Staging hinzufügen' },
              { id: 'add-file', cmd: 'git add path/to/file', desc: 'Einzelne Datei hinzufügen' },
              { id: 'commit', cmd: 'git commit -m "message"', desc: 'Änderungen committen' },
              { id: 'push', cmd: 'git push', desc: 'Zu GitHub pushen' },
              { id: 'pull', cmd: 'git pull', desc: 'Von GitHub pullen' },
            ]}
          />
          <CommandBlock
            title="Branches"
            commands={[
              { id: 'branch-list', cmd: 'git branch -a', desc: 'Alle Branches auflisten' },
              { id: 'branch-new', cmd: 'git branch feature/name', desc: 'Neuer Branch' },
              { id: 'branch-switch', cmd: 'git checkout feature/name', desc: 'Zu Branch wechseln' },
              { id: 'branch-delete', cmd: 'git branch -d feature/name', desc: 'Branch löschen' },
            ]}
          />
          <CommandBlock
            title="History & Undo"
            commands={[
              { id: 'log', cmd: 'git log --oneline -10', desc: 'Letzte 10 Commits zeigen' },
              { id: 'reset', cmd: 'git reset --hard HEAD~1', desc: 'Letzten Commit rückgängig machen' },
              { id: 'diff', cmd: 'git diff', desc: 'Ungespeicherte Änderungen zeigen' },
              { id: 'stash', cmd: 'git stash', desc: 'Änderungen temporär speichern' },
              { id: 'stash-apply', cmd: 'git stash apply', desc: 'Gespeicherte Änderungen laden' },
            ]}
          />
        </section>

        {/* Database */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code size={24} className="text-green-500" />
            Database & Supabase
          </h2>
          <CommandBlock
            title="Migrations"
            commands={[
              { id: 'migrate-list', cmd: 'supabase migration list', desc: 'Alle Migrations auflisten' },
              { id: 'migrate-up', cmd: 'supabase migration up', desc: 'Nächste Migration anwenden' },
              { id: 'migrate-down', cmd: 'supabase migration down', desc: 'Letzte Migration rückgängig' },
            ]}
          />
          <CommandBlock
            title="Supabase CLI"
            commands={[
              { id: 'supabase-status', cmd: 'supabase status', desc: 'Supabase Status prüfen' },
              { id: 'supabase-pull', cmd: 'supabase db pull', desc: 'Schema von Produktions-DB pullen' },
              { id: 'supabase-push', cmd: 'supabase db push', desc: 'Migrations zu Produktion pushen' },
            ]}
          />
        </section>

        {/* Docker & Server */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Terminal size={24} className="text-orange-500" />
            Docker & Server
          </h2>
          <CommandBlock
            title="Docker Compose"
            commands={[
              { id: 'docker-up', cmd: 'docker compose up -d', desc: 'Container im Hintergrund starten' },
              { id: 'docker-down', cmd: 'docker compose down', desc: 'Container stoppen' },
              { id: 'docker-logs', cmd: 'docker compose logs -f', desc: 'Live-Logs anzeigen' },
              { id: 'docker-restart', cmd: 'docker compose restart', desc: 'Container neustarten' },
              { id: 'docker-build', cmd: 'docker compose up -d --build', desc: 'Image neu bauen & Container starten' },
            ]}
          />
          <CommandBlock
            title="SSH & Server"
            commands={[
              { id: 'ssh-connect', cmd: 'ssh dev@192.168.178.116', desc: 'Zu Server verbinden' },
              { id: 'ssh-deploy', cmd: 'ssh dev@192.168.178.116 "cd /opt/dancemotion/web && git pull && docker compose down && docker compose up -d --build"', desc: 'Komplettes Deploy Skript' },
              { id: 'scp-upload', cmd: 'scp -r ./file dev@192.168.178.116:/remote/path', desc: 'Datei zu Server kopieren' },
            ]}
          />
        </section>

        {/* Debugging */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code size={24} className="text-red-500" />
            Debugging & Troubleshooting
          </h2>
          <CommandBlock
            title="TypeScript & Linting"
            commands={[
              { id: 'ts-check', cmd: 'npx tsc --noEmit', desc: 'TypeScript Fehler überprüfen' },
              { id: 'ts-strict', cmd: 'npx tsc --strict --noEmit', desc: 'Strikte Type-Checking' },
              { id: 'eslint-fix', cmd: 'npx eslint . --fix', desc: 'ESLint Fehler automatisch fixen' },
            ]}
          />
          <CommandBlock
            title="Node & Package Management"
            commands={[
              { id: 'npm-clean', cmd: 'rm -rf node_modules package-lock.json && npm install', desc: 'Dependencies neu installieren' },
              { id: 'npm-outdated', cmd: 'npm outdated', desc: 'Veraltete Packages zeigen' },
              { id: 'npm-list', cmd: 'npm ls', desc: 'Dependency-Tree zeigen' },
            ]}
          />
          <CommandBlock
            title="Process Management"
            commands={[
              { id: 'lsof', cmd: 'lsof -i :3000', desc: 'Prozess auf Port 3000 finden' },
              { id: 'kill-port', cmd: 'kill -9 $(lsof -t -i:3000)', desc: 'Prozess auf Port 3000 killen' },
            ]}
          />
        </section>

        {/* Workflow Examples */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📋 Typische Workflows</h2>
          <div className="space-y-4 text-slate-300">
            <div className="p-4 bg-slate-900 rounded-lg">
              <strong className="text-blue-400">1. Feature Development:</strong>
              <pre className="mt-2 text-sm">{`git checkout -b feature/new-feature
npm run dev
# ... edit files ...
git add -A
git commit -m "Add new feature"
git push`}</pre>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <strong className="text-blue-400">2. Production Deployment:</strong>
              <pre className="mt-2 text-sm">{`npm run build
git add -A
git commit -m "Release: version x.x.x"
git push
ssh dev@192.168.178.116 "cd /opt/dancemotion/web && git pull && docker compose down && docker compose up -d --build"`}</pre>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <strong className="text-blue-400">3. Bug Fix:</strong>
              <pre className="mt-2 text-sm">{`git checkout main
git pull
git checkout -b fix/bug-description
# ... fix bug ...
npm run build
git add -A
git commit -m "Fix: bug description"
git push`}</pre>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">💡 Tipps & Tricks</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Nutze <code className="bg-slate-800 px-2 py-1 rounded">git log --oneline</code> für übersichtliche Commit-Historie</li>
            <li>✓ Schreibe aussagekräftige Commit-Messages (z.B. "Fix: Auth bug" statt "fix")</li>
            <li>✓ Pushe regelmäßig, um Datenverlust zu vermeiden</li>
            <li>✓ Nutze branches für Features, um main sauber zu halten</li>
            <li>✓ Teste lokal mit <code className="bg-slate-800 px-2 py-1 rounded">npm run build</code> vor dem Push</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
