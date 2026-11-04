'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateCategoryModal } from '../components/CreateCategoryModal';
import { EditCategoryModal } from '../components/EditCategoryModal';
import { useCategories } from '../hooks/useCategories';
import { CategoryList } from '../list/CategoryList';
import { Category } from '../types';

export const CategoryView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    categories,
    loading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const handleTabSelect = (tab: string) => {
    if (tab === 'homes') {
      router.push('/home');
    } else if (tab === 'projects') {
      router.push('/projects');
    } else if (tab === 'inventory') {
      router.push('/inventory');
    } else if (tab === 'payment') {
      router.push('/payment');
    } else if (tab === 'currency') {
      router.push('/currency');
    } else if (tab === 'vendor') {
      router.push('/vendor');
    } else if (tab === 'expense') {
      router.push('/expense');
    } else if (tab === 'employee') {
      router.push('/employee');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab="category"
          onSelectTab={handleTabSelect}
        />

        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <CategoryList
            categories={categories}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(c) => setEditingCategory(c)}
            onDelete={deleteCategory}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        </main>
      </div>

      <CreateCategoryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createCategory}
      />

      <EditCategoryModal
        category={editingCategory}
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        onSubmit={updateCategory}
      />
    </div>
  );
};

