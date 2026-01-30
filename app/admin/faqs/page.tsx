'use client';

import { HelpCircle } from 'lucide-react';
import FAQManager from '@/app/components/FAQManager';
import { AdminPageHeader } from '../components';

export default function FAQsAdminPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQs verwalten"
        description="Häufig gestellte Fragen bearbeiten"
        icon={HelpCircle}
        breadcrumbs={[{ label: 'FAQs' }]}
      />
      <FAQManager />
    </div>
  );
}
