'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateVendorModal } from '../components/CreateVendorModal';
import { useVendors } from '../hooks/useVendors';

export default function CreateVendorPage() {
  const router = useRouter();
  const { createVendor } = useVendors();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/vendor')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateVendorModal
            isOpen={true}
            onClose={() => router.push('/vendor')}
            onSubmit={async (payload) => {
              await createVendor(payload);
              router.push('/vendor');
            }}
          />
        </main>
      </div>
    </div>
  );
}
