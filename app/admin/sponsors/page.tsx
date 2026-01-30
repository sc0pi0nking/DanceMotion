import { Metadata } from 'next';
import SponsorsAdminContent from './SponsorsAdminContent';

export const metadata: Metadata = {
  title: 'Sponsoren verwalten | DanceMotion Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSponsorsPage() {
  return <SponsorsAdminContent />;
}
