import { Metadata } from 'next';
import { ProjectView } from '@/features/project/view/ProjectView';

export const metadata: Metadata = {
  title: 'Projects - BuildCore Construction',
  description: 'Manage construction projects via REST API',
};

export default function ProjectsPage() {
  return <ProjectView />;
}

