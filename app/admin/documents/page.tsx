'use client';

import { FileDown } from 'lucide-react';
import AdminDocumentManager from '@/app/components/AdminDocumentManager';
import { AdminPageHeader } from '../components';

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dokumente verwalten"
        description="Lade Dokumente hoch und verwalte Downloads"
        icon={FileDown}
        breadcrumbs={[{ label: 'Dokumente' }]}
      />
      <AdminDocumentManager />
    </div>
  );
}
