'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateVendorModal } from '../components/CreateVendorModal';
import { EditVendorModal } from '../components/EditVendorModal';
import { useVendors } from '../hooks/useVendors';
import { VendorList } from '../list/VendorList';
import { Vendor } from '../types';

export const VendorView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const {
    vendors,
    loading,
    error,
    refetch,
    createVendor,
    updateVendor,
    deleteVendor,
  } = useVendors();

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
          activeTab="vendor"
          onSelectTab={handleTabSelect}
        />

        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <VendorList
            vendors={vendors}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(v) => setEditingVendor(v)}
            onDelete={deleteVendor}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        </main>
      </div>

      <CreateVendorModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createVendor}
      />

      <EditVendorModal
        vendor={editingVendor}
        isOpen={Boolean(editingVendor)}
        onClose={() => setEditingVendor(null)}
        onSubmit={updateVendor}
      />
    </div>
  );
};
