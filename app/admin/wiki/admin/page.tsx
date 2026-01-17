'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Image,
  FileText,
  Users,
  HelpCircle,
  Zap,
  Share2,
  ChevronRight,
  LayoutGrid,
  Clover,
} from 'lucide-react';

const adminArticles = [
  {
    id: 'getting-started',
    title: 'Erste Schritte',
    icon: Zap,
    description: 'Übersicht und Anleitung für neue Admin-Benutzer',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'event-management',
    title: 'Terminverwaltung',
    icon: Calendar,
    description: 'Termine erstellen, bearbeiten und verwalten',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'gallery-management',
    title: 'Galerie verwalten',
    icon: Image,
    description: 'Bilder hochladen, organisieren und präsentieren',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    id: 'document-management',
    title: 'Dokumente verwalten',
    icon: FileText,
    description: 'Dateien hochladen, Versionen verwalten',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'faq-management',
    title: 'FAQ bearbeiten',
    icon: HelpCircle,
    description: 'Häufig gestellte Fragen hinzufügen und verwalten',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    id: 'team-management',
    title: 'Team-Verwaltung',
    icon: Users,
    description: 'Team-Mitglieder und Social Links verwalten',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'content-management',
    title: 'Inhalte bearbeiten',
    icon: LayoutGrid,
    description: 'Website-Inhalte und Texte anpassen',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'social-links',
    title: 'Social Media Links',
    icon: Share2,
    description: 'Social-Media-Verbindungen konfigurieren',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

export default function AdminWikiPage() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
          <BookOpen size={32} style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">📚 Admin Wiki</h1>
          <p className="text-slate-400 mt-1">Leitfaden für Admin-Funktionen und Content-Verwaltung</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminArticles.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.id}
              href={`/admin/wiki/admin/${article.id}`}
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

      {/* Info Box */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Clover size={20} />
          💡 Tipps & Hinweise
        </h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✓ Speichere regelmäßig deine Änderungen</li>
          <li>✓ Verwende aussagekräftige Beschreibungen bei Uploads</li>
          <li>✓ Überprüfe Vorschaubilder, bevor du sie veröffentlichst</li>
          <li>✓ Bei Fragen kontaktiere dein technisches Team</li>
        </ul>
      </div>
    </div>
  );
}
