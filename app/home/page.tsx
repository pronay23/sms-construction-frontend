import { Metadata } from 'next';
import { HomeView } from '@/features/home/view/HomeView';

export const metadata: Metadata = {
  title: 'Home Projects - BuildCore Construction',
  description: 'Manage construction home projects via REST API',
};

export default function HomePage() {
  return <HomeView />;
}

