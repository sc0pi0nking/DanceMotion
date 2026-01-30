'use client';

import { Share2, ExternalLink } from 'lucide-react';
import AdminSponsorsManager from '@/app/components/AdminSponsorsManager';
import { AdminPageHeader } from '@/app/admin/components';

export default function SponsorsAdminContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={Share2}
        title="Sponsoren"
        description="Verwalten Sie Ihre Sponsoren und Partner. Fügen Sie neue Sponsoren hinzu, bearbeiten Sie bestehende oder ändern Sie die Anzeigereihenfolge."
        actions={[
          {
            label: 'Öffentliche Seite',
            icon: ExternalLink,
            href: '/sponsor',
            variant: 'secondary',
          }
        ]}
      />

      {/* Manager Component */}
      <AdminSponsorsManager />

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
            <span>Nutzen Sie die <strong>Pfeile</strong> um die Anzeigereihenfolge zu ändern</span>
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
            <span>Alle Änderungen werden <strong>sofort gespeichert</strong> und protokolliert</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
