'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Docker,
  Server,
  Zap,
  ChevronRight,
  Copy,
} from 'lucide-react';

export default function WikiPage() {
  const [activeSection, setActiveSection] = useState('admin');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const adminGuideContent = (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Admin User Guide
        </h2>
        <p style={{ color: 'var(--muted)' }} className="text-lg">
          Schritt-für-Schritt Anleitungen für die Verwaltung von Website-Inhalten
        </p>
      </div>

      {/* Content Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            📄 Inhalte verwalten
          </h3>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Schritt 1: Admin-Panel öffnen</h4>
          <ol style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>1. Gehe zu <code style={{ backgroundColor: 'rgba(46, 196, 198, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>/admin</code></li>
            <li>2. Melde dich mit deinen Zugangsdaten an</li>
            <li>3. Wähle "Content" aus dem Menü</li>
          </ol>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Schritt 2: Inhalte bearbeiten</h4>
          <ul style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>✓ Klick auf ein beliebiges Textfeld auf der Website zum Bearbeiten</li>
            <li>✓ Änderungen werden sofort gespeichert</li>
            <li>✓ Formatierung mit Markdown möglich (Fett: **text**, Kursiv: *text*)</li>
            <li>✓ Bilder können per Drag & Drop hochgeladen werden</li>
          </ul>
        </div>
      </section>

      {/* Documents */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            📑 Dokumente (Formulare)
          </h3>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Neue Dokumente hinzufügen:</h4>
          <ol style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>1. Admin → Documents</li>
            <li>2. Klick "Neues Dokument"</li>
            <li>3. Titel eingeben (z.B. "Anmeldungsformular")</li>
            <li>4. PDF, Word oder Image hochladen</li>
            <li>5. Kategorie wählen (z.B. "Anmeldung")</li>
            <li>6. "Speichern" klicken</li>
          </ol>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Dokumente verwalten:</h4>
          <ul style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>✓ Dokumente können jederzeit bearbeitet werden</li>
            <li>✓ Alte Versionen können deaktiviert (nicht gelöscht) werden</li>
            <li>✓ Nur aktive Dokumente sind öffentlich sichtbar</li>
            <li>✓ Suchfunktion auf /formulare hilft Besuchern</li>
          </ul>
        </div>
      </section>

      {/* Events */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            📅 Events/Termine
          </h3>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Event erstellen:</h4>
          <ol style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>1. Admin → Events</li>
            <li>2. "Neues Event" klicken</li>
            <li>3. Details ausfüllen (Datum, Zeit, Ort)</li>
            <li>4. Beschreibung hinzufügen</li>
            <li>5. Event-Bild hochladen (optional)</li>
            <li>6. "Veröffentlichen" klicken</li>
          </ol>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Event-Anfragen verwalten:</h4>
          <ul style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>✓ Besucher können Events auf der Homepage anfragen</li>
            <li>✓ Alle Anfragen unter Admin → Event Requests</li>
            <li>✓ Anfragen beantworten oder als erledigt markieren</li>
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Image className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            🖼️ Galerie
          </h3>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Bilder hochladen:</h4>
          <ol style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>1. Admin → Gallery</li>
            <li>2. "Neue Bilder" klicken</li>
            <li>3. Mehrere Bilder gleichzeitig wählen</li>
            <li>4. Gruppe zuordnen (Little Joys, Smileys, etc.)</li>
            <li>5. Beschreibung hinzufügen (optional)</li>
            <li>6. "Upload" klicken</li>
          </ol>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            ❓ FAQs
          </h3>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>FAQ-Eintrag erstellen:</h4>
          <ol style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>1. Admin → FAQs</li>
            <li>2. "Neue FAQ" klicken</li>
            <li>3. Frage eingeben</li>
            <li>4. Antwort schreiben (Markdown möglich)</li>
            <li>5. Kategorie wählen</li>
            <li>6. "Speichern" klicken</li>
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            👥 Team-Mitglieder
          </h3>
        </div>
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Team-Member hinzufügen:</h4>
          <ol style={{ color: 'var(--muted)' }} className="space-y-2 ml-4">
            <li>1. Admin → Team</li>
            <li>2. "Neues Mitglied" klicken</li>
            <li>3. Name, Position/Rolle eingeben</li>
            <li>4. Profilbild hochladen</li>
            <li>5. Beschreibung/Bio schreiben (optional)</li>
            <li>6. "Hinzufügen" klicken</li>
          </ol>
        </div>
      </section>

      {/* Tips */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mt-8">
        <h4 className="font-bold mb-3 text-green-400">💡 Tipps & Tricks</h4>
        <ul style={{ color: 'var(--muted)' }} className="space-y-2">
          <li>• Alle Änderungen werden sofort gespeichert</li>
          <li>• Verwende aussagekräftige Titel und Beschreibungen</li>
          <li>• Bilder sollten min. 400x300px groß sein</li>
          <li>• Datum-Format: DD.MM.YYYY</li>
          <li>• Fragen? Kontaktiere die IT/Web-Verantwortliche</li>
        </ul>
      </div>
    </div>
  );

  const devContent = (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          🛠️ Developer Documentation
        </h2>
        <p style={{ color: 'var(--muted)' }} className="text-lg">
          Komplette Referenz für Entwicklung, Deployment und Wartung
        </p>
      </div>

      {/* Project Structure */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Folder className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            📁 Projekt-Struktur
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { path: 'app/', desc: 'Next.js App Router - alle Pages und Komponenten' },
            { path: 'app/admin/', desc: 'Admin-Dashboard (authentifiziert)' },
            { path: 'app/api/', desc: 'API-Endpoints für Backend-Logik' },
            { path: 'app/components/', desc: 'Wiederverwendbare React-Komponenten' },
            { path: 'app/gruppen/', desc: 'Dynamische Gruppen-Seiten (Little Joys, Smileys, etc.)' },
            { path: 'lib/', desc: 'Utilities: Supabase, Auth, Content-Loader, Events' },
            { path: 'public/', desc: 'Statische Assets (Bilder, Logos, Fonts)' },
            { path: 'supabase/', desc: 'Datenbank-Migrationen und Seed-Daten' },
            { path: 'scripts/', desc: 'Hilfsskripte (Initialisierung, Maintenance)' },
          ].map((item) => (
            <div key={item.path} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <code style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{item.path}</code>
              <p style={{ color: 'var(--muted)', marginTop: '4px' }} className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Files */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            🔑 Wichtige Dateien
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { file: 'package.json', desc: 'Dependencies, Scripts, Projekt-Metadaten' },
            { file: 'next.config.ts', desc: 'Next.js Konfiguration (Bilder, Redirects)' },
            { file: 'tsconfig.json', desc: 'TypeScript strict mode und Path-Aliases' },
            { file: 'postcss.config.mjs', desc: 'Tailwind CSS Setup' },
            { file: 'app/globals.css', desc: 'CSS Variables, globale Styles, Utility Classes' },
            { file: 'lib/supabase.ts', desc: 'Supabase Client-Instanz' },
            { file: 'lib/auth.ts', desc: 'Authentifizierung und User-Management' },
            { file: 'lib/content-db.ts', desc: 'Content CRUD-Operationen' },
            { file: 'lib/events-db.ts', desc: 'Event CRUD-Operationen' },
            { file: 'dockerfile', desc: 'Docker Image für Production' },
            { file: 'docker-compose.yml', desc: 'Multi-Container Orchestration (Prod)' },
            { file: 'docker-compose-local.yml', desc: 'Local Development Setup' },
          ].map((item) => (
            <div key={item.file} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <code style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{item.file}</code>
              <p style={{ color: 'var(--muted)', marginTop: '4px' }} className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Console Commands */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            ⌨️ Konsolen-Befehle
          </h3>
        </div>

        <div>
          <h4 className="font-bold mb-3" style={{ color: 'var(--fg)' }}>Entwicklung:</h4>
          <div className="space-y-2">
            {[
              'npm install                    # Dependencies installieren',
              'npm run dev                    # Dev Server starten (http://localhost:3000)',
              'npm run build                  # Production Build erstellen',
              'npm start                      # Production Server starten',
              'npm run lint                   # ESLint & Type-Checking',
              'npm run format                 # Code mit Prettier formatieren',
            ].map((cmd) => (
              <div key={cmd} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <code style={{ color: 'var(--accent)', fontSize: '0.9em' }}>{cmd}</code>
                  <button
                    onClick={() => copyToClipboard(cmd.split(' ')[0] + ' ' + cmd.split(' ')[1], cmd)}
                    className="p-2 hover:opacity-70 transition-opacity"
                  >
                    {copiedCode === cmd ? '✓ Kopiert!' : <Copy size={16} style={{ color: 'var(--accent)' }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-3 mt-6" style={{ color: 'var(--fg)' }}>Docker (Production):</h4>
          <div className="space-y-2">
            {[
              'docker compose up -d           # Container starten',
              'docker compose down            # Container stoppen',
              'docker compose logs -f         # Logs anschauen (live)',
              'docker compose restart         # Container neustarten',
              'docker compose up -d --build   # Rebuild + Restart',
            ].map((cmd) => (
              <div key={cmd} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <code style={{ color: 'var(--accent)', fontSize: '0.9em' }}>{cmd}</code>
                  <button
                    onClick={() => copyToClipboard(cmd, cmd)}
                    className="p-2 hover:opacity-70 transition-opacity"
                  >
                    {copiedCode === cmd ? '✓ Kopiert!' : <Copy size={16} style={{ color: 'var(--accent)' }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-3 mt-6" style={{ color: 'var(--fg)' }}>Git & Deployment:</h4>
          <div className="space-y-2">
            {[
              'git status                     # Status anschauen',
              'git add .                      # Alle Änderungen stagen',
              'git commit -m "message"        # Commit mit Nachricht',
              'git push                       # Push zu Remote',
              'git pull                       # Updates vom Remote holen',
              'git log --oneline -n 10        # Letzte 10 Commits',
            ].map((cmd) => (
              <div key={cmd} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <code style={{ color: 'var(--accent)', fontSize: '0.9em' }}>{cmd}</code>
                  <button
                    onClick={() => copyToClipboard(cmd, cmd)}
                    className="p-2 hover:opacity-70 transition-opacity"
                  >
                    {copiedCode === cmd ? '✓ Kopiert!' : <Copy size={16} style={{ color: 'var(--accent)' }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-3 mt-6" style={{ color: 'var(--fg)' }}>SSH (Remote Server):</h4>
          <div className="space-y-2">
            {[
              'ssh luca@192.168.178.104       # Mit Server verbinden',
              'cd /opt/dancemotion/web        # Ins Projekt-Verzeichnis',
              'git pull && docker compose up -d --build  # Deploy-Befehl',
            ].map((cmd) => (
              <div key={cmd} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <code style={{ color: 'var(--accent)', fontSize: '0.9em' }}>{cmd}</code>
                  <button
                    onClick={() => copyToClipboard(cmd, cmd)}
                    className="p-2 hover:opacity-70 transition-opacity"
                  >
                    {copiedCode === cmd ? '✓ Kopiert!' : <Copy size={16} style={{ color: 'var(--accent)' }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Database */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            🗄️ Datenbank (Supabase)
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { table: 'users', desc: 'Authentifizierte Admin-User (Supabase Auth)' },
            { table: 'content', desc: 'Editierbare Text/Bild-Inhalte mit Metadaten' },
            { table: 'events', desc: 'Events/Termine mit Datum, Ort, Beschreibung' },
            { table: 'event_requests', desc: 'Anfragen von Besuchern' },
            { table: 'faqs', desc: 'Frage-Antwort Paare mit Kategorien' },
            { table: 'gallery_images', desc: 'Galerie-Bilder mit Gruppen-Zuordnung' },
            { table: 'documents', desc: 'Downloadbare Formulare/PDFs' },
            { table: 'team_members', desc: 'Team-Mitglieder mit Rollen' },
          ].map((item) => (
            <div key={item.table} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <code style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{item.table}</code>
              <p style={{ color: 'var(--muted)', marginTop: '4px' }} className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            🚀 Tech Stack
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Next.js 16', version: '16.1.1' },
            { name: 'React', version: '18' },
            { name: 'TypeScript', version: 'strict' },
            { name: 'Tailwind CSS', version: '4' },
            { name: 'Framer Motion', version: 'animations' },
            { name: 'Lucide Icons', version: '300+' },
            { name: 'Supabase', version: 'PostgreSQL' },
            { name: 'Docker', version: 'Alpine' },
            { name: 'Node.js', version: '20' },
          ].map((item) => (
            <div key={item.name} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--fg)', fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{item.version}</div>
            </div>
          ))}
        </div>
      </section>

      {/* API Endpoints */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            🔌 API Endpoints
          </h3>
        </div>
        <div className="space-y-2">
          {[
            { method: 'POST', path: '/api/admin/content', desc: 'Content erstellen/updaten' },
            { method: 'GET', path: '/api/admin/content/:id', desc: 'Content abrufen' },
            { method: 'POST', path: '/api/admin/events', desc: 'Event erstellen' },
            { method: 'GET', path: '/api/admin/events', desc: 'Alle Events abrufen' },
            { method: 'POST', path: '/api/admin/documents', desc: 'Dokument hochladen' },
            { method: 'GET', path: '/api/admin/gallery', desc: 'Galerie-Bilder abrufen' },
            { method: 'POST', path: '/api/event-requests', desc: 'Event-Anfrage senden' },
            { method: 'POST', path: '/api/admin/faqs', desc: 'FAQ erstellen' },
          ].map((item) => (
            <div key={item.path} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3">
                <span style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {item.method}
                </span>
                <div>
                  <code style={{ color: 'var(--accent)' }}>{item.path}</code>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85em', marginTop: '4px' }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Links */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            🔗 Wichtige Links & Zugriffe
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Live Website', url: 'https://dancemotion.de' },
            { label: 'Admin Panel', url: '/admin' },
            { label: 'GitHub Repo', url: 'https://github.com/...' },
            { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard' },
            { label: 'Production Server', url: 'ssh://luca@192.168.178.104' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--fg)', fontWeight: 'bold' }}>{item.label}</p>
              <code style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{item.url}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Troubleshooting */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mt-8">
        <h4 className="font-bold mb-3 text-yellow-400">⚠️ Häufige Probleme</h4>
        <div className="space-y-3">
          <div>
            <p className="font-semibold" style={{ color: 'var(--fg)' }}>Build fehlgeschlagen:</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9em' }}>npm run build lokal ausführen, Fehler lesen, fixen</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fg)' }}>TypeScript Fehler:</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9em' }}>npm run lint, Typen checken, :any vermeiden</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fg)' }}>Datenbank-Fehler:</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9em' }}>Supabase Logs checken, RLS Policies prüfen</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fg)' }}>Container-Fehler:</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9em' }}>docker compose logs -f, Ports checken, Network prüfen</p>
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      id: 'admin',
      title: 'Admin User Guide',
      icon: BookOpen,
      description: 'Für Content Editor (nicht-technisch)',
      content: adminGuideContent,
    },
    {
      id: 'dev',
      title: 'Developer Docs',
      icon: Code,
      description: 'Für Entwickler (technisch)',
      content: devContent,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            <h1 className="text-3xl font-bold">DanceMotion Wiki (Admin Only)</h1>
          </div>
          <p style={{ color: 'var(--muted)' }}>
            Admin Handbuch & Developer Dokumentation — Nur für authentifizierte Admins
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabs/Navigation */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2 sticky top-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full text-left p-4 rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        activeSection === section.id
                          ? 'var(--panel)'
                          : 'transparent',
                      borderColor: 'var(--border)',
                      borderWidth: activeSection === section.id ? '1px' : '0',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        style={{
                          color:
                            activeSection === section.id
                              ? 'var(--accent)'
                              : 'var(--muted)',
                        }}
                      />
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>
                          {section.title}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: 'var(--muted)' }}
                        >
                          {section.description}
                        </div>
                      </div>
                      {activeSection === section.id && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent)' }}
                        ></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2">
            {sections.find((s) => s.id === activeSection)?.content}
          </main>
        </div>
      </div>
    </div>
  );
}
