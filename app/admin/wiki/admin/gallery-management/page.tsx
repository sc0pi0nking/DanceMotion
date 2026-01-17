'use client';

import Link from 'next/link';
import { ArrowLeft, Upload, Image, Trash2, Edit, Grid } from 'lucide-react';

export default function GalleryManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-pink-500/10">
            <Image size={32} className="text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold">Galerie verwalten</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Bilder hochladen, organisieren und auf der Website anzeigen
        </p>
      </div>

      <div className="space-y-8">
        {/* Bilder hochladen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Upload size={24} className="text-green-500" />
            Bilder hochladen
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Gehe zu <strong>Galerie</strong> in der Sidebar</li>
            <li><strong>2.</strong> Klicke auf "+ Bild hochladen" oder ziehe Bilder hierher</li>
            <li><strong>3.</strong> Wähle ein oder mehrere Bilder aus (.jpg, .png, .webp)</li>
            <li><strong>4.</strong> Gib einen Titel und eine Beschreibung ein</li>
            <li><strong>5.</strong> Kategorie auswählen (Events, Team, Training, etc.)</li>
            <li><strong>6.</strong> Klicke "Veröffentlichen"</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            💡 <strong>Tipps:</strong> Optimiere Bilder vorher (max 5MB pro Bild). Verwende aussagekräftige Titel!
          </div>
        </section>

        {/* Bildverwaltung */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Grid size={24} className="text-blue-500" />
            Bildverwaltung
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔍 Ansicht:</strong> Sehe alle Bilder in einer Grid-Ansicht
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🏷️ Filter:</strong> Filtere nach Kategorie, Monat oder Suchbegriff
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔝 Sortierung:</strong> Ordne nach Neustem, Ältest oder Beliebtheit
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>⭐ Highlight:</strong> Markiere wichtige Bilder als "Featured"
            </div>
          </div>
        </section>

        {/* Bearbeiten & Löschen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit size={24} className="text-yellow-500" />
            Bilder bearbeiten & löschen
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>✏️ Bearbeiten:</strong> Klick auf ein Bild → "Bearbeiten" → Ändere Titel/Beschreibung → "Speichern"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗑️ Löschen:</strong> Klick auf ein Bild → "Löschen" → Bestätige
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              ⚠️ <strong>Achtung:</strong> Gelöschte Bilder erscheinen nicht mehr auf der Website!
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Nutze hochwertige Fotos (mind. 1920x1080px)</li>
            <li>✓ Beschreibe Bilder aussagekräftig (z.B. "Team Event 2025 - Januar")</li>
            <li>✓ Weise Bilder zur richtigen Kategorie zu</li>
            <li>✓ Lösche Duplikate und unscharfe Fotos</li>
            <li>✓ Aktualisiere die Galerie regelmäßig (mind. 1x pro Monat)</li>
            <li>✓ Nutze alt-Text für Barrierefreiheit</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
