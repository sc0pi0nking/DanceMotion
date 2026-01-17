'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

export default function GettingStartedPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Back Button */}
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Lightbulb size={32} className="text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Erste Schritte im Admin Panel</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Ein praktischer Überblick über die wichtigsten Admin-Funktionen
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Dashboard Übersicht
          </h2>
          <p className="text-slate-300 mb-4">
            Das Dashboard ist deine zentrale Anlaufstelle. Hier siehst du:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li>✓ <strong>Statistiken:</strong> Anzahl Events, Gallery Items, Team Members</li>
            <li>✓ <strong>Aktuelle Aktivitäten:</strong> Letzte Änderungen im System</li>
            <li>✓ <strong>Quick Links:</strong> Schneller Zugriff auf häufig genutzte Funktionen</li>
            <li>✓ <strong>System Status:</strong> Überblick über wichtige Metriken</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Navigation & Menü
          </h2>
          <p className="text-slate-300 mb-4">
            Die Sidebar auf der linken Seite bietet Zugriff auf alle Admin-Funktionen:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>📅 Termine:</strong> Erstelle und verwalte alle Events und Kurse
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🖼️ Galerie:</strong> Upload und Verwaltung von Bildern
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📄 Dokumente:</strong> Dateiverwaltung mit Versionskontrolle
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>❓ FAQ:</strong> Häufig gestellte Fragen bearbeiten
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>👥 Team:</strong> Team-Mitglieder und Social Links
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>✏️ Content:</strong> Website-Texte und Inhalte anpassen
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Benutzerprofile & Einstellungen
          </h2>
          <p className="text-slate-300 mb-4">
            Oben rechts findest du dein Profil-Menü:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li>👤 <strong>Dein Name & Rolle:</strong> Zeigt deine Berechtigungen an</li>
            <li>🌓 <strong>Theme Toggle:</strong> Wechsel zwischen Hellmodus und Dunkelmodus</li>
            <li>🚪 <strong>Abmelden:</strong> Sicher abmelden von deinem Konto</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-yellow-500" />
            Wichtige Tipps
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              💡 <strong>Speichern nicht vergessen:</strong> Klicke auf "Speichern" am Ende von Formularen
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              💡 <strong>Vorschau nutzen:</strong> Nutze Vorschau-Funktionen, bevor du Änderungen veröffentlichst
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              💡 <strong>Backup:</strong> Wichtige Dateien sollten regelmäßig gesichert werden
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              💡 <strong>Support:</strong> Bei Fragen kontaktiere dein technisches Team
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Nächste Schritte
          </h2>
          <p className="text-slate-300 mb-4">
            Je nachdem, was du verwalten möchtest, besuche diese Seiten:
          </p>
          <div className="space-y-2">
            <Link href="/admin/wiki/admin/event-management" className="block p-3 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition">
              📅 Termine verwalten →
            </Link>
            <Link href="/admin/wiki/admin/gallery-management" className="block p-3 bg-pink-500/10 rounded-lg hover:bg-pink-500/20 transition">
              🖼️ Galerie verwalten →
            </Link>
            <Link href="/admin/wiki/admin/content-management" className="block p-3 bg-orange-500/10 rounded-lg hover:bg-orange-500/20 transition">
              ✏️ Content bearbeiten →
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-slate-400 text-sm">
          Fragen? Besuche das<Link href="/admin/wiki/admin" className="text-blue-500 hover:text-blue-400"> Admin Wiki</Link> oder kontaktiere dein Team.
        </p>
      </div>
    </div>
  );
}
