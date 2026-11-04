'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateInventoryModal } from '../components/CreateInventoryModal';
import { useInventories } from '../hooks/useInventories';

export default function CreateInventoryPage() {
  const router = useRouter();
  const { createInventory } = useInventories();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/inventory')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateInventoryModal
            isOpen={true}
            onClose={() => router.push('/inventory')}
            onSubmit={async (payload) => {
              await createInventory(payload);
              router.push('/inventory');
            }}
          />
        </main>
      </div>
    </div>
  );
}
