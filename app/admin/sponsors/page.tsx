import { Metadata } from 'next';
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
    <div className="min-h-screen w-full">
      <AdminSponsorsManager />
    </div>
  );
}
