import { Metadata } from 'next';
import GroupsManager from './GroupsManager';

export const metadata: Metadata = {
  title: 'Gruppen verwalten | DanceMotion Admin',
  robots: { index: false, follow: false },
};

export default function AdminGroupsPage() {
  return <GroupsManager />;
}
