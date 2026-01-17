'use client';

import Link from 'next/link';
import { ArrowLeft, HelpCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function FAQManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <HelpCircle size={32} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold">FAQ bearbeiten</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Häufig gestellte Fragen verwalten und aktualisieren
        </p>
      </div>

      <div className="space-y-8">
        {/* Neue FAQ */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-green-500" />
            Neue FAQ hinzufügen
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Gehe zu <strong>FAQ</strong> in der Sidebar</li>
            <li><strong>2.</strong> Klicke auf "+ Neue Frage"</li>
            <li><strong>3.</strong> Gib die Frage ein (z.B. "Welche Tanzgruppen gibt es?")</li>
            <li><strong>4.</strong> Schreibe eine aussagekräftige Antwort</li>
            <li><strong>5.</strong> Wähle eine Kategorie (Allgemein, Kurse, Events, Preise, etc.)</li>
            <li><strong>6.</strong> Klicke "Speichern"</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            💡 <strong>Tipp:</strong> Fragen sollten prägnant sein, Antworten präzise und hilfreich
          </div>
        </section>

        {/* Organisieren */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye size={24} className="text-blue-500" />
            FAQ Organisieren
          </h2>
          <p className="text-slate-300 mb-4">
            Strukturiere deine FAQs für bessere Benutzerfreundlichkeit:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>📁 Kategorien:</strong> Gruppiere verwandte Fragen (z.B. "Tanzgruppen", "Preismodell")
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📌 Reihenfolge:</strong> Ordne Fragen nach Häufigkeit und Relevanz
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>⭐ Priorität:</strong> Markiere wichtige Fragen als "Oben anheften"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔍 Suchbar:</strong> Fragen sind automatisch in der Site-Suche verfügbar
            </div>
          </div>
        </section>

        {/* Bearbeiten & Löschen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit size={24} className="text-yellow-500" />
            FAQs bearbeiten & löschen
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>✏️ Bearbeiten:</strong> Klick auf eine FAQ → "Bearbeiten" → Ändere Frage/Antwort → "Speichern"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗑️ Löschen:</strong> Klick auf eine FAQ → "Löschen" → Bestätige
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              ⚠️ <strong>Achtung:</strong> Gelöschte FAQs sind nicht mehr auf der Website sichtbar!
            </div>
          </div>
        </section>

        {/* Formatierung */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📝 Text-Formatierung</h2>
          <p className="text-slate-300 mb-4">Du kannst Markdown-Formatierung nutzen:</p>
          <div className="space-y-2 text-slate-300">
            <div className="p-2 bg-slate-800 rounded text-sm">
              <strong>**Fett**</strong> → <strong>Wichtige Worte</strong>
            </div>
            <div className="p-2 bg-slate-800 rounded text-sm">
              <strong>*Kursiv*</strong> → <em>Hervorhebungen</em>
            </div>
            <div className="p-2 bg-slate-800 rounded text-sm">
              <strong>[Link](url)</strong> → Hyperlinks
            </div>
            <div className="p-2 bg-slate-800 rounded text-sm">
              <strong>- Punkt 1</strong> → Aufzählungslisten
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Stelle die häufigsten Fragen zuerst</li>
            <li>✓ Halte Antworten kurz und prägnant</li>
            <li>✓ Verwende einfache, verständliche Sprache</li>
            <li>✓ Verlinke auf relevante Seiten</li>
            <li>✓ Aktualisiere FAQs basierend auf Benutzer-Feedback</li>
            <li>✓ Prüfe regelmäßig auf veraltete oder irrelevante Inhalte</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
