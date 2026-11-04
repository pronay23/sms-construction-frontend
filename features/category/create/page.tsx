'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateCategoryModal } from '../components/CreateCategoryModal';
import { useCategories } from '../hooks/useCategories';

export default function CreateCategoryPage() {
  const router = useRouter();
  const { createCategory } = useCategories();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/categories')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateCategoryModal
            isOpen={true}
            onClose={() => router.push('/categories')}
            onSubmit={async (payload) => {
              await createCategory(payload);
              router.push('/categories');
            }}
          />
        </main>
      </div>
    </div>
  );
}

