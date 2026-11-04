'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreatePaymentModal } from '../components/CreatePaymentModal';
import { EditPaymentModal } from '../components/EditPaymentModal';
import { usePayments } from '../hooks/usePayments';
import { PaymentList } from '../list/PaymentList';
import { Payment } from '../types';

export const PaymentView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const {
    payments,
    loading,
    error,
    refetch,
    createPayment,
    updatePayment,
    deletePayment,
  } = usePayments();

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
          activeTab="payment"
          onSelectTab={handleTabSelect}
        />

        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <PaymentList
            payments={payments}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(p) => setEditingPayment(p)}
            onDelete={deletePayment}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        </main>
      </div>

      <CreatePaymentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createPayment}
      />

      <EditPaymentModal
        payment={editingPayment}
        isOpen={Boolean(editingPayment)}
        onClose={() => setEditingPayment(null)}
        onSubmit={updatePayment}
      />
    </div>
  );
};
