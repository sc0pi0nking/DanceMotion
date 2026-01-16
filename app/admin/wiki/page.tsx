'use client';

import { useState } from 'react';
import {
  BookOpen,
  Code,
  Terminal,
  Database,
  Settings,
  Users,
  FileText,
  Image,
  Calendar,
  HelpCircle,
  Folder,
  GitBranch,
  Container,
  Server,
  Zap,
  ChevronRight,
  Copy,
  Lock,
  Cpu,
} from 'lucide-react';

export default function WikiPage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'dev'>('admin');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'bash' }: { code: string; id: string; language?: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
      >
        <Copy size={16} className={copiedCode === id ? 'text-green-500' : 'text-gray-400'} />
      </button>
      <pre className="text-gray-100 text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );

  // ========== ADMIN SECTION ==========
  const adminContent = (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Admin Benutzerhandbuch
        </h2>
        <p style={{ color: 'var(--muted)' }}>
          Alles was du brauchst, um die Website zu verwalten - ohne technische Kenntnisse!
        </p>
      </div>

      {/* Termine Verwalten */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Termine verwalten
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <p><strong>1. Neue Termin hinzufuegen:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li>Gehe zu "Termine" im Admin-Menue</li>
            <li>Klicke auf "Termin erstellen" oder "Neuen Event hinzufuegen"</li>
            <li>Fuelle die Felder aus: Titel, Datum, Uhrzeit, Ort, Stadt</li>
            <li>Waehle eine Kategorie (Workshop, Auftritt, Performance, Sonstiges)</li>
            <li>Waehle die Gruppen, fuer die dieser Termin relevant ist</li>
            <li>Klicke "Speichern"</li>
          </ul>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-2 mt-4">
          <p><strong>2. Termin bearbeiten:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li>Klicke auf den Termin in der Liste</li>
            <li>Aendere die gewuenschten Felder</li>
            <li>Klicke "Aktualisieren"</li>
          </ul>
        </div>
      </section>

      {/* Inhalte bearbeiten */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Website-Texte bearbeiten
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <p><strong>Texte direkt auf der Website bearbeiten:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li>Gehe zu "Inhalte" im Admin-Menue</li>
            <li>Du siehst alle bearbeitbaren Texte auf der Website</li>
            <li>Aendere den Text in den Eingabefeldern</li>
            <li>Klicke "Speichern"</li>
            <li>Die Aenderungen sind sofort live auf der Website!</li>
          </ul>
        </div>
      </section>

      {/* Team verwalten */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Team-Mitglieder verwalten
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <ul className="list-disc list-inside space-y-2">
            <li>Gehe zu "Team" im Admin-Menue</li>
            <li>Klicke "Mitglied hinzufuegen"</li>
            <li>Fuelle Name, Rolle und Beschreibung ein</li>
            <li>Lade ein Profilbild hoch (optional)</li>
            <li>Ergaenze Social-Media Links (Instagram, Facebook, Email)</li>
            <li>Klicke "Speichern"</li>
          </ul>
        </div>
      </section>

      {/* Galerie verwalten */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Galerie und Bilder
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <ul className="list-disc list-inside space-y-2">
            <li>Gehe zu "Galerie" im Admin-Menue</li>
            <li>Erstelle eine neue Galerie oder bearbeite eine bestehende</li>
            <li>Lade Bilder hoch (Drag & Drop oder Klick)</li>
            <li>Gib der Galerie einen Titel und eine Beschreibung</li>
            <li>Klicke "Veroeffenlichen" zum Live-Schalten</li>
          </ul>
        </div>
      </section>

      {/* FAQs verwalten */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            FAQs (Haeufig gestellte Fragen)
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <ul className="list-disc list-inside space-y-2">
            <li>Gehe zu "FAQs" im Admin-Menue</li>
            <li>Klicke "FAQ hinzufuegen"</li>
            <li>Schreibe die Frage und Antwort</li>
            <li>Waehle eine Kategorie (z.B. "Allgemein", "Gruppen", etc.)</li>
            <li>Klicke "Speichern"</li>
          </ul>
        </div>
      </section>

      {/* Dokumente verwalten */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Dokumente verwalten
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <p>Fuer PDF, Protokolle, Vereinssatzung, etc.:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Gehe zu "Dokumente"</li>
            <li>Klicke "Dokument hochladen"</li>
            <li>Waehle die PDF oder Datei aus</li>
            <li>Gib einen Titel ein</li>
            <li>Klicke "Speichern" und es ist oeffentlich verfuegbar</li>
          </ul>
        </div>
      </section>
    </div>
  );

  // ========== DEV SECTION ==========
  const devContent = (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Developer Guide
        </h2>
        <p style={{ color: 'var(--muted)' }}>
          Technische Dokumentation, Infrastruktur, API-Referenzen und Projektstruktur
        </p>
      </div>

      {/* Projektstruktur */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Projektstruktur
          </h3>
        </div>
        <CodeBlock
          id="project-structure"
          code={`DanceMotion/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin Dashboard & Management
│   ├── api/                      # API Routes
│   ├── components/               # React Components
│   └── globals.css               # Global Styles & Theme Variables
├── lib/                          # Utilities & Services
│   ├── supabase.ts               # Supabase Client & Types
│   ├── email.ts                  # Email Service (SMTP)
│   └── auth.ts                   # Authentication
├── supabase/                     # Database Migrations & SQL
│   └── migrations/               # SQL Migration Files
├── public/                       # Static Assets (Logos, Images)
├── next.config.ts                # Next.js Configuration
└── package.json                  # Dependencies`}
          language="text"
        />
      </section>

      {/* Tech Stack */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Tech Stack
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-bold mb-2" style={{ color: 'var(--fg)' }}>Frontend:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Next.js 16.1.1 (React 19.2.3)</li>
              <li>Tailwind CSS v4</li>
              <li>Framer Motion (Animations)</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div>
            <p className="font-bold mb-2" style={{ color: 'var(--fg)' }}>Backend:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Supabase (PostgreSQL)</li>
              <li>Row Level Security (RLS)</li>
              <li>Node.js 20 (Alpine)</li>
              <li>Nodemailer (Email/SMTP)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Server className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Deployment Pipeline
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-3">
          <p><strong>Server:</strong> 192.168.178.104 | Path: /opt/dancemotion/web</p>
          <CodeBlock
            id="deploy-flow"
            code={`1. Local: git add -A && git commit -m "message"
2. Local: git push
3. Server: git pull
4. Server: docker compose down
5. Server: docker compose up -d --build
6. Deployed! Next.js Build Cache: ~15-25s`}
            language="bash"
          />
        </div>
      </section>

      {/* Environment Variables */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Environment Variables (.env.local)
          </h3>
        </div>
        <CodeBlock
          id="env-vars"
          code={`# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Email (SMTP)
EMAIL_FROM=noreply@example.com
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password

# Admin
ADMIN_SECRET=secure-secret-key`}
          language="bash"
        />
      </section>

      {/* Database */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Database Struktur
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-2">
          <p><strong>Tables:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>events - Termine und Events</li>
            <li>content - Bearbeitbare Website-Inhalte</li>
            <li>event_requests - Anfragen von Besuchern</li>
            <li>faqs - Haeufig gestellte Fragen</li>
            <li>gallery - Galerien und Bilder</li>
            <li>team - Team-Mitglieder</li>
            <li>documents - PDF & Dateien</li>
            <li>admin_users - Admin-Benutzer & Authentifizierung</li>
          </ul>
        </div>
      </section>

      {/* Git Workflow */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <GitBranch className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Git Workflow
          </h3>
        </div>
        <CodeBlock
          id="git-workflow"
          code={`# Create Feature Branch
git checkout -b feature/your-feature

# Make Changes
git add -A
git commit -m "feat: description"

# Push to GitHub
git push origin feature/your-feature

# Merge to Main
git checkout main
git pull
git merge feature/your-feature
git push origin main`}
          language="bash"
        />
      </section>

      {/* Performance */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Performance & Optimization
          </h3>
        </div>
        <div style={{ color: 'var(--muted)' }} className="space-y-2">
          <ul className="list-disc list-inside space-y-2">
            <li>Image Optimization: Next.js Image component mit WebP/AVIF</li>
            <li>Cache: Static pages cached 1 Jahr</li>
            <li>CSS: Tailwind v4 mit CSS Variables fuer Theme</li>
            <li>Build Time: ~15-25s mit Turbopack</li>
            <li>Parallax: Framer Motion mit reduced motion support</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>
          <BookOpen className="inline mr-3 w-8 h-8" style={{ color: 'var(--accent)' }} />
          Wiki & Dokumentation
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setActiveTab('admin')}
          className={`py-3 px-4 font-semibold transition-colors ${
            activeTab === 'admin'
              ? 'text-white border-b-2'
              : 'text-gray-500 hover:text-gray-400'
          }`}
          style={
            activeTab === 'admin'
              ? { borderBottomColor: 'var(--accent)', color: 'var(--accent)' }
              : {}
          }
        >
          Admin Guide
        </button>
        <button
          onClick={() => setActiveTab('dev')}
          className={`py-3 px-4 font-semibold transition-colors ${
            activeTab === 'dev'
              ? 'text-white border-b-2'
              : 'text-gray-500 hover:text-gray-400'
          }`}
          style={
            activeTab === 'dev'
              ? { borderBottomColor: 'var(--accent)', color: 'var(--accent)' }
              : {}
          }
        >
          Developer
        </button>
      </div>

      {/* Content */}
      <div>{activeTab === 'admin' ? adminContent : devContent}</div>
    </div>
  );
}
