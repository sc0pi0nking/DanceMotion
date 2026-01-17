'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Edit, Save, Eye } from 'lucide-react';

export default function ContentManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-orange-500/10">
            <FileText size={32} className="text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold">Content verwalten</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Texte, Beschreibungen und Website-Inhalte bearbeiten
        </p>
      </div>

      <div className="space-y-8">
        {/* Überblick */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText size={24} className="text-blue-500" />
            Bearbeitbare Inhaltsbausteine
          </h2>
          <p className="text-slate-300 mb-4">
            Folgende Website-Bereiche können direkt bearbeitet werden:
          </p>
          <div className="space-y-2 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🏠 Homepage:</strong> Hero-Text, Sektionsbeschreibungen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📋 Seiten-Header:</strong> Titles und Subtitles auf allen Seiten
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>👥 Team-Beschreibungen:</strong> Über Tänzer und Trainer
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📝 FAQ Antworten:</strong> Häufig gestellte Fragen und Antworten
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔗 Footer:</strong> Impressum-Text, Copyright Info
            </div>
          </div>
        </section>

        {/* Inhalte bearbeiten */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit size={24} className="text-yellow-500" />
            Inhalte bearbeiten
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Gehe zu <strong>Inhalte</strong> in der Sidebar</li>
            <li><strong>2.</strong> Wähle den Inhalt aus, den du ändern möchtest</li>
            <li><strong>3.</strong> Klicke auf das Textfeld und bearbeite den Text</li>
            <li><strong>4.</strong> Nutze die Formatierungsoptionen (Fett, Kursiv, Links)</li>
            <li><strong>5.</strong> Klicke "Speichern" am Ende der Seite</li>
            <li><strong>6.</strong> Siehe die Änderung live auf der Website!</li>
          </ol>
        </section>

        {/* Formatierung */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Save size={24} className="text-cyan-500" />
            Text-Formatierung
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>**Fett**</strong> → <strong>Wichtige Worte</strong> hervorheben
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>*Kursiv*</strong> → <em>Betonungen</em> hinzufügen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>[Link](url)</strong> → Hyperlinks einbauen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>Zeilenumbrüche</strong> → Doppelte Zeilenumbrüche für neue Absätze
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            ℹ️ Der Editor unterstützt Markdown-Formatierung
          </div>
        </section>

        {/* Vorschau */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye size={24} className="text-purple-500" />
            Vorschau & Live-Anzeige
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>👁️ Vorschau:</strong> Sieh eine Vorschau deiner Änderungen, bevor du speicherst
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>⏱️ Live:</strong> Änderungen sind sofort auf der Website sichtbar nach dem Speichern
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📱 Responsive:</strong> Überprüfe, wie der Text auf Handy und Desktop aussieht
            </div>
          </div>
        </section>

        {/* Tipps */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">💡 Tipps & Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Schreibe kurze, aussagekräftige Sätze</li>
            <li>✓ Nutze Zeilenumbrüche für bessere Lesbarkeit</li>
            <li>✓ Überprüfe Rechtschreibung und Grammatik</li>
            <li>✓ Halte Texte aktuell (z.B. Daten, Preise)</li>
            <li>✓ Nutze Formatierung, um wichtige Teile hervorzuheben</li>
            <li>✓ Teste Links, um sicherzustellen, dass sie funktionieren</li>
            <li>✓ Halte ein einheitliches Tonfall über alle Seiten</li>
          </ul>
        </section>

        {/* Häufige Fehler */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">❌ Häufige Fehler vermeiden</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              <strong>Vergessen zu speichern:</strong> Drücke immer "Speichern" am Ende!
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              <strong>Zu lange Texte:</strong> Teile lange Texte in mehrere Absätze auf
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              <strong>Tippfehler:</strong> Überprüfe den Text vor dem Speichern
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              <strong>Externe Links:</strong> Überprüfe regelmäßig, ob Links noch aktuell sind
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
