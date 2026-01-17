'use client';

import Link from 'next/link';
import { ArrowLeft, Share2, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

export default function SocialLinksPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/admin" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Admin Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-500/10">
            <Share2 size={32} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold">Social Media Links</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Social-Media-Verbindungen konfigurieren und verwalten
        </p>
      </div>

      <div className="space-y-8">
        {/* Überblick */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Share2 size={24} className="text-blue-500" />
            Verfügbare Social-Media-Plattformen
          </h2>
          <p className="text-slate-300 mb-4">
            Verlinke alle Social-Media-Profile der Organisation:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>📘 Facebook:</strong> https://facebook.com/dancemotion
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📸 Instagram:</strong> https://instagram.com/dancemotion
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎵 TikTok:</strong> https://tiktok.com/@dancemotion
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>▶️ YouTube:</strong> https://youtube.com/channel/dancemotion
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>𝕏 X/Twitter:</strong> https://twitter.com/dancemotion
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎵 Spotify:</strong> https://open.spotify.com/artist/...
            </div>
          </div>
        </section>

        {/* Social Links verwalten */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-green-500" />
            Social Links hinzufügen/bearbeiten
          </h2>
          <ol className="space-y-3 text-slate-300">
            <li><strong>1.</strong> Gehe zu <strong>Social</strong> in der Sidebar</li>
            <li><strong>2.</strong> Wähle die Plattform aus (Facebook, Instagram, etc.)</li>
            <li><strong>3.</strong> Gib den vollständigen Link ein (https://...)</li>
            <li><strong>4.</strong> Aktiviere/deaktiviere die Anzeige auf der Website</li>
            <li><strong>5.</strong> Klicke "Speichern"</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            ℹ️ <strong>Wichtig:</strong> Nutze immer vollständige URLs mit https://
          </div>
        </section>

        {/* Footer & Widgets */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🎨 Wo werden Social Links angezeigt?</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>👣 Footer:</strong> Alle Social Links im Website-Footer
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📱 Header:</strong> Manchmal auch in der oberen Navigation
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>👤 Team-Seite:</strong> Persönliche Social Links bei Team-Mitgliedern
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📧 E-Mail-Signatur:</strong> Optional in automatisierten E-Mails
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={24} className="text-cyan-500" />
            Performance überwachen
          </h2>
          <p className="text-slate-300 mb-4">
            Überprüfe, wie viele Besucher deine Social-Media-Links klicken:
          </p>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>📊 Click-Statistiken:</strong> Anzahl der Klicks pro Plattform
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>📈 Trends:</strong> Welche Plattformen sind populär
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>🎯 Optimierung:</strong> Priorisiere erfolgreichste Kanäle
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">⭐ Best Practices</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Nutze offizielle Links direkt von den Plattformen</li>
            <li>✓ Überprüfe regelmäßig auf kaputte Links</li>
            <li>✓ Aktualisiere Links, wenn sich Accounts ändern</li>
            <li>✓ Priorisiere die wichtigsten Social-Media-Kanäle</li>
            <li>✓ Verwende konsistente Branding über alle Plattformen</li>
            <li>✓ Verlinke von deinen Social-Media-Profilen zurück zur Website</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
