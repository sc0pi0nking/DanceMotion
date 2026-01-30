'use client';

import { Images } from 'lucide-react';
import AdminGalleryManager from "@/app/components/AdminGalleryManager"
import { AdminPageHeader } from '../components';

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Galerie verwalten"
        description="Verwalte Alben und lade neue Bilder hoch"
        icon={Images}
        breadcrumbs={[{ label: 'Galerie' }]}
      />
      <AdminGalleryManager />
    </div>
  )
}
