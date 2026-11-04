'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateExpenseModal } from '../components/CreateExpenseModal';
import { EditExpenseModal } from '../components/EditExpenseModal';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseList } from '../list/ExpenseList';
import { Expense } from '../types';

export const ExpenseView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const {
    expenses,
    meta,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilter,
    refetch,
    createExpense,
    updateExpense,
    deleteExpense,
    projects,
    categories,
    payments,
    currencies,
    vendors,
    lookupLoading,
  } = useExpenses();

  const handleTabSelect = (tab: string) => {
    if (tab === 'homes') {
      router.push('/home');
    } else if (tab === 'projects') {
      router.push('/projects');
    } else if (tab === 'category') {
      router.push('/categories');
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
          activeTab="expense"
          onSelectTab={handleTabSelect}
        />

        <main className="expense-page-main" style={{ minWidth: 0 }}>
          <ExpenseList
            expenses={expenses}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(e) => setEditingExpense(e)}
            onDelete={deleteExpense}
            onOpenCreateModal={() => setCreateModalOpen(true)}
            filters={filters}
            setFilter={setFilter}
            projects={projects}
            categories={categories}
            payments={payments}
            currencies={currencies}
            vendors={vendors}
            lookupLoading={lookupLoading}
          />
        </main>
      </div>

      <CreateExpenseModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createExpense}
        projects={projects}
        categories={categories}
        payments={payments}
        currencies={currencies}
        vendors={vendors}
        lookupLoading={lookupLoading}
      />

      <EditExpenseModal
        expense={editingExpense}
        isOpen={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        onSubmit={updateExpense}
        projects={projects}
        categories={categories}
        payments={payments}
        currencies={currencies}
        vendors={vendors}
      />
    </div>
  );
};
