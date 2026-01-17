'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';

export default function EventManagementPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-purple-500/10">
            <Calendar size={32} className="text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold">Terminverwaltung</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Erstelle und verwalte Events, Kurse und Termine
        </p>
      </div>

      <div className="space-y-8">
        {/* Neuer Termin */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-green-500" />
            Neuen Termin erstellen
          </h2>
          <p className="text-slate-300 mb-4">
            Gehe zu <strong>Termine → Neuer Termin</strong> oder klicke auf den grünen "+ Button" auf der Seite.
          </p>
          <div className="space-y-4 text-slate-300">
            <div className="p-4 bg-slate-800 rounded-lg">
              <strong className="text-blue-400">📋 Pflichtfelder:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>Titel:</strong> Name des Events (z.B. "Anfängerkurs - Montag")</li>
                <li>• <strong>Beschreibung:</strong> Was ist das Event? (max 500 Zeichen)</li>
                <li>• <strong>Datum & Uhrzeit:</strong> Wann findet es statt?</li>
                <li>• <strong>Gruppe:</strong> Welche Tanzgruppe? (Little Joys, Smileys, etc.)</li>
                <li>• <strong>Ort:</strong> Wo ist der Ort? (Straße, Stadt)</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <strong className="text-blue-400">ℹ️ Optionale Felder:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>Kapazität:</strong> Maximale Teilnehmerzahl</li>
                <li>• <strong>Level:</strong> Anfänger, Fortgeschrittene, Alle</li>
                <li>• <strong>Link/Anmeldung:</strong> Externe Anmeldung</li>
                <li>• <strong>Kategorie:</strong> Workshop, Regelmäßiger Kurs, Spezial-Event</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Wiederkehrende Termine */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock size={24} className="text-blue-500" />
            Wiederkehrende Termine
          </h2>
          <p className="text-slate-300 mb-4">
            Für regelmäßige Events (z.B. jeden Montag):
          </p>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Erstelle den ersten Termin</li>
            <li><strong>2.</strong> Aktiviere "Wiederkehrend"</li>
            <li><strong>3.</strong> Wähle: täglich, wöchentlich oder monatlich</li>
            <li><strong>4.</strong> Lege das Enddatum fest (z.B. "31. Dezember")</li>
            <li><strong>5.</strong> Speichern - das System erstellt automatisch alle Termine!</li>
          </ol>
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
            ✓ <strong>Beispiel:</strong> "Jeden Montag um 19:00 Uhr bis zum 31. Dezember"
          </div>
        </section>

        {/* Bearbeiten & Löschen */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit size={24} className="text-yellow-500" />
            Termine bearbeiten & löschen
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>✏️ Bearbeiten:</strong> Klicke auf einen Termin → "Bearbeiten" → Ändere die Felder → "Speichern"
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🗑️ Löschen:</strong> Klicke auf einen Termin → "Löschen" → Bestätige die Aktion
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
              ⚠️ <strong>Achtung:</strong> Gelöschte Termine können nicht wiederhergestellt werden!
            </div>
          </div>
        </section>

        {/* Ansichten & Filter */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users size={24} className="text-cyan-500" />
            Filterung & Ansichten
          </h2>
          <p className="text-slate-300 mb-4">
            In der Terminübersicht kannst du filtern nach:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">📅 <strong>Zeitraum:</strong> Diese Woche, Dieser Monat</div>
            <div className="p-3 bg-slate-800 rounded">👥 <strong>Gruppe:</strong> Nach Tanzgruppe filtern</div>
            <div className="p-3 bg-slate-800 rounded">🎯 <strong>Status:</strong> Bevorstehend, Vorbei, Alle</div>
            <div className="p-3 bg-slate-800 rounded">🔍 <strong>Suche:</strong> Nach Titel suchen</div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⭐ Best Practices
          </h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Verwende prägnante Titel (z.B. "Kinderkurs: Samstag 10:00 Uhr")</li>
            <li>✓ Nutze die Beschreibung für wichtige Details</li>
            <li>✓ Setze realistische Kapazitätswerte</li>
            <li>✓ Aktualisiere Termine rechtzeitig bei Änderungen</li>
            <li>✓ Lösche alte Termine, um die Liste übersichtlich zu halten</li>
            <li>✓ Nutze Kategorien für bessere Organisation</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
