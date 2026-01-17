'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Plus, Edit, Trash2, LinkIcon } from 'lucide-react';

export default function TeamManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10">
            <Users size={32} className="text-cyan-500" />
          </div>
          <h1 className="text-4xl font-bold">Team-Verwaltung</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Team-Mitglieder verwalten und Social Links konfigurieren
        </p>
      </div>

      <div className="space-y-8">
        {/* Neues Team-Mitglied */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-green-500" />
            Neues Team-Mitglied hinzufügen
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Gehe zu <strong>Team</strong> in der Sidebar</li>
            <li><strong>2.</strong> Klicke auf "+ Team-Mitglied hinzufügen"</li>
            <li><strong>3.</strong> Gib Name, Position/Rolle ein</li>
            <li><strong>4.</strong> Lade ein Profilfoto hoch (optional)</li>
            <li><strong>5.</strong> Schreibe eine kurze Biografie</li>
            <li><strong>6.</strong> Wähle Tanzgruppen/Spezialisierungen</li>
            <li><strong>7.</strong> Klicke "Speichern"</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            📸 <strong>Foto-Tipps:</strong> Quadratisches Format (800x800px), professionelles Porträt
          </div>
        </section>

        {/* Social Links */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <LinkIcon size={24} className="text-blue-500" />
            Social Media Links
          </h2>
          <p className="text-slate-300 mb-4">
            Verbinde Social-Media-Profile für jedes Team-Mitglied:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>📘 Facebook:</strong> Link zum Facebook-Profil
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📸 Instagram:</strong> Link zum Instagram-Profil
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎵 TikTok:</strong> Link zum TikTok-Profil
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>✉️ E-Mail:</strong> Kontakt-E-Mail-Adresse
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🔗 Website:</strong> Persönliche Website oder Blog
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            💡 <strong>Tipp:</strong> Nutze vollständige URLs (https://...)
          </div>
        </section>

        {/* Bearbeiten & Löschen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit size={24} className="text-yellow-500" />
            Team-Mitglieder bearbeiten & löschen
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>✏️ Bearbeiten:</strong> Klick auf ein Mitglied → "Bearbeiten" → Ändere Daten → "Speichern"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗑️ Löschen:</strong> Klick auf ein Mitglied → "Löschen" → Bestätige
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              ⚠️ <strong>Achtung:</strong> Gelöschte Mitglieder werden von der Website entfernt!
            </div>
          </div>
        </section>

        {/* Reihenfolge */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📋 Reihenfolge & Organisation</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎯 Reihenfolge:</strong> Nutze Drag-and-Drop um Mitglieder zu sortieren
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>👤 Hauptmitglieder:</strong> Markiere wichtige Mitglieder als "Hervorgehoben"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🏷️ Kategorien:</strong> Gruppiere nach Tanzgruppe (Little Joys, Smileys, etc.)
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Verwende aktuelle, hochwertige Fotos</li>
            <li>✓ Halte Biografien informativ aber kurz</li>
            <li>✓ Verlinke alle verfügbaren Social-Media-Profile</li>
            <li>✓ Aktualisiere Informationen regelmäßig</li>
            <li>✓ Nutze konsistente Formatierung</li>
            <li>✓ Prüfe Links auf Gültigkeit</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
