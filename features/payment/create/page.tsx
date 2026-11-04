'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreatePaymentModal } from '../components/CreatePaymentModal';
import { usePayments } from '../hooks/usePayments';

export default function CreatePaymentPage() {
  const router = useRouter();
  const { createPayment } = usePayments();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/payment')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreatePaymentModal
            isOpen={true}
            onClose={() => router.push('/payment')}
            onSubmit={async (payload) => {
              await createPayment(payload);
              router.push('/payment');
            }}
          />
        </main>
      </div>
    </div>
  );
}
