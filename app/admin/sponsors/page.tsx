import { Metadata } from 'next';
import { Share2 } from 'lucide-react';
import AdminSponsorsManager from '@/app/components/AdminSponsorsManager';

export const metadata: Metadata = {
  title: 'Sponsoren verwalten | DanceMotion Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSponsorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Share2 className="w-8 h-8 text-teal-400" />
            Sponsoren verwalten
          </h1>
        </div>
        <p className="text-slate-400">
          Verwalten Sie Ihre Sponsoren und Partner. Fügen Sie neue Sponsoren hinzu, bearbeiten Sie bestehende oder ändern Sie die Anzeigereihenfolge.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Aktive Sponsoren</p>
          <p className="text-2xl font-bold text-white">–</p>
          <p className="text-xs text-slate-500 mt-1">Wird geladen...</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Kategorien</p>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-xs text-slate-500 mt-1">
            Venue, Equipment, Media, Partner, General
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Öffentliche Seite</p>
          <a 
            href="/sponsor" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition text-sm font-medium"
          >
            /sponsor →
          </a>
          <p className="text-xs text-slate-500 mt-1">Zur öffentlichen Sponsorenseite</p>
        </div>
      </div>

      {/* Manager Component */}
      <div>
        <AdminSponsorsManager />
      </div>

      {/* Help Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-3">💡 Hinweise</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Nur <strong>aktive Sponsoren</strong> werden auf der öffentlichen Seite angezeigt</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Nutzen Sie <strong>Drag & Drop</strong> um die Anzeigereihenfolge zu ändern</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span><strong>Kategorien</strong> helfen bei der Organisation und Filterung</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Logo-URLs sollten HTTPS verwenden und optimal 200x200px sein</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Alle Änderungen werden <strong>sofort audited</strong> und protokolliert</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
