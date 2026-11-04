import { Metadata } from 'next';
import { CategoryView } from '@/features/category/view/CategoryView';

export const metadata: Metadata = {
  title: 'Categories - BuildCore Construction',
  description: 'Manage construction expense and material categories via REST API',
};

export default function CategoriesPage() {
  return <CategoryView />;
}

