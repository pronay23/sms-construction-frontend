'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateExpenseModal } from '../components/CreateExpenseModal';
import { useExpenses } from '../hooks/useExpenses';

export default function CreateExpensePage() {
  const router = useRouter();
  const { createExpense, projects, categories, payments, currencies, vendors, lookupLoading } = useExpenses();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/expense')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateExpenseModal
            isOpen={true}
            onClose={() => router.push('/expense')}
            onSubmit={async (payload) => {
              await createExpense(payload);
              router.push('/expense');
            }}
            projects={projects}
            categories={categories}
            payments={payments}
            currencies={currencies}
            vendors={vendors}
            lookupLoading={lookupLoading}
          />
        </main>
      </div>
    </div>
  );
}
