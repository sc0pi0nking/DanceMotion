'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BookOpen,
  Code,
  Terminal,
  Database,
  Settings,
  Users,
  AlertCircle,
  GitBranch,
  Container,
  Server,
  Zap,
  ChevronRight,
  Folder,
  Lock,
  Copy,
} from 'lucide-react';

const devArticles = [
  {
    id: 'project-structure',
    title: 'Projektstruktur',
    icon: Folder,
    description: 'Verzeichnisaufbau, Ordnerstruktur, Navigationslogik',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'audit-system',
    title: 'Audit-Log-System',
    icon: Database,
    description: 'Audit Logging, Nachverfolgung, Export, Compliance',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'user-role-management',
    title: 'Benutzer & Rollen',
    icon: Users,
    description: 'Permission System, Role-based Access Control',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'settings-management',
    title: 'Settings & Config',
    icon: Settings,
    description: 'Systemkonfiguration, Datenspeicherung, Retention',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'error-handling',
    title: 'Fehlerbehandlung',
    icon: AlertCircle,
    description: 'Error Pages, Exception Handling, Logging',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'api-endpoints',
    title: 'API Endpoints',
    icon: Code,
    description: 'REST APIs, Route Handler, Request/Response',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'database-migrations',
    title: 'Datenbank & Migrations',
    icon: Database,
    description: 'Schema, Migrations, RLS, SQL Funktionen',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    id: 'deployment',
    title: 'Deployment & Server',
    icon: Server,
    description: 'Docker, SSH, CI/CD, Production Setup',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'commands',
    title: 'Nützliche Commands',
    icon: Terminal,
    description: 'Build, Deploy, Git, Database, Debugging',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    id: 'security',
    title: 'Security & DSGVO',
    icon: Lock,
    description: 'Authentication, Authorization, Privacy, Compliance',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
];

export default function DevWikiPage() {
  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
          <Code size={32} style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">👨‍💻 Dev Wiki</h1>
          <p className="text-slate-400 mt-1">Technische Dokumentation für Entwickler</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devArticles.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.id}
              href={`/admin/wiki/dev/${article.id}`}
              className="group p-5 rounded-lg border transition-all hover:scale-105"
              style={{
                backgroundColor: article.bgColor,
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Icon size={24} className={`${article.color} mt-1 flex-shrink-0`} />
                  <div>
                    <h3 className="font-semibold text-lg">{article.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{article.description}</p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-400 group-hover:text-slate-200 transition-colors mt-1 flex-shrink-0"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Reference */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Terminal size={20} />
          ⚡ Quick Commands Reference
        </h2>
        <div className="space-y-3">
          <div className="p-3 bg-slate-800 rounded font-mono text-sm text-slate-300">
            <div className="text-slate-400 mb-1">Build & Development:</div>
            <code>npm run dev</code> | <code>npm run build</code> | <code>npm run lint</code>
          </div>
          <div className="p-3 bg-slate-800 rounded font-mono text-sm text-slate-300">
            <div className="text-slate-400 mb-1">Git Operations:</div>
            <code>git add -A</code> | <code>git commit -m "message"</code> | <code>git push</code>
          </div>
          <div className="p-3 bg-slate-800 rounded font-mono text-sm text-slate-300">
            <div className="text-slate-400 mb-1">Deployment:</div>
            <code>ssh dev@192.168.178.116</code> | <code>docker compose logs -f</code>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap size={20} />
          🛠️ Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Next.js', version: '16.1.1' },
            { name: 'React', version: '19.2.3' },
            { name: 'TypeScript', version: '5' },
            { name: 'Tailwind', version: '4' },
            { name: 'Supabase', version: '2.90.1' },
            { name: 'PostgreSQL', version: '14+' },
          ].map((tech) => (
            <div key={tech.name} className="p-3 rounded bg-slate-800 text-center">
              <div className="font-semibold text-sm">{tech.name}</div>
              <div className="text-xs text-slate-400">{tech.version}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
