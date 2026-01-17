'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Upload, Trash2, Edit, History } from 'lucide-react';

export default function DocumentManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10">
            <FileText size={32} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">Dokumente verwalten</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Dateien hochladen, Versionen verwalten und verteilen
        </p>
      </div>

      <div className="space-y-8">
        {/* Dokumente hochladen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Upload size={24} className="text-green-500" />
            Neue Dokumente hochladen
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Gehe zu <strong>Dokumente</strong> in der Sidebar</li>
            <li><strong>2.</strong> Klicke auf "+ Neues Dokument"</li>
            <li><strong>3.</strong> Wähle eine Datei aus (.pdf, .doc, .xlsx, etc.)</li>
            <li><strong>4.</strong> Gib einen aussagekräftigen Namen ein</li>
            <li><strong>5.</strong> Wähle eine Kategorie (Formulare, Richtlinien, Datenschutz, etc.)</li>
            <li><strong>6.</strong> Setze Zugriffsrechte (Öffentlich oder Beschränkt)</li>
            <li><strong>7.</strong> Klicke "Veröffentlichen"</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            ℹ️ <strong>Unterstützte Formate:</strong> PDF, DOC, DOCX, XLS, XLSX, PPT, TXT (max 20MB)
          </div>
        </section>

        {/* Versioning */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <History size={24} className="text-blue-500" />
            Versionsverwaltung
          </h2>
          <p className="text-slate-300 mb-4">
            Das System speichert automatisch frühere Versionen deiner Dokumente:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>📝 Versionshistorie:</strong> Alle bisherigen Versionen eines Dokuments
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>↩️ Wiederherstellen:</strong> Gehe zu einer älteren Version zurück (Klick auf "Wiederherstellen")
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>👀 Änderungen anzeigen:</strong> Vergleich zwischen Versionen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📅 Zeitstempel:</strong> Jede Version zeigt Datum und Bearbeiter
            </div>
          </div>
        </section>

        {/* Bearbeiten & Löschen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit size={24} className="text-yellow-500" />
            Dokumente bearbeiten & löschen
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>✏️ Bearbeiten:</strong> Klick auf ein Dokument → "Bearbeiten" → Ändere Name, Kategorie, Zugriffsrechte → "Speichern"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📤 Ersetzen:</strong> Lade eine neue Version der Datei hoch (alte Versionen bleiben erhalten)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗑️ Löschen:</strong> Klick auf ein Dokument → "Löschen" → Bestätige
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              ⚠️ <strong>Achtung:</strong> Gelöschte Dokumente sind nicht mehr verfügbar!
            </div>
          </div>
        </section>

        {/* Zugriffsrechte */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🔒 Zugriffsrechte & Sichtbarkeit</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🌐 Öffentlich:</strong> Alle Besucher können das Dokument sehen und herunterladen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔐 Beschränkt:</strong> Nur authentifizierte Benutzer können zugreifen
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>👥 Team-Zugriff:</strong> Nur bestimmte Rollen können zugreifen
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Verwende aussagekräftige Dateinamen (z.B. "Datenschutzerklärung-2025")</li>
            <li>✓ Nutze Kategorien konsistent</li>
            <li>✓ Prüfe Dateigröße vor Upload (max 20MB)</li>
            <li>✓ Aktualisiere veraltete Dokumente regelmäßig</li>
            <li>✓ Nutze Versioning für Änderungsverlauf</li>
            <li>✓ Setze korrekte Zugriffsrechte (öffentlich vs. beschränkt)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
