'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateCurrencyModal } from '../components/CreateCurrencyModal';
import { EditCurrencyModal } from '../components/EditCurrencyModal';
import { useCurrencies } from '../hooks/useCurrencies';
import { CurrencyList } from '../list/CurrencyList';
import { Currency } from '../types';

export const CurrencyView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  const {
    currencies,
    loading,
    error,
    refetch,
    createCurrency,
    updateCurrency,
    deleteCurrency,
  } = useCurrencies();

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
          activeTab="currency"
          onSelectTab={handleTabSelect}
        />

        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <CurrencyList
            currencies={currencies}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(c) => setEditingCurrency(c)}
            onDelete={deleteCurrency}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        </main>
      </div>

      <CreateCurrencyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createCurrency}
      />

      <EditCurrencyModal
        currency={editingCurrency}
        isOpen={Boolean(editingCurrency)}
        onClose={() => setEditingCurrency(null)}
        onSubmit={updateCurrency}
      />
    </div>
  );
};
