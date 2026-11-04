'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateCurrencyModal } from '../components/CreateCurrencyModal';
import { useCurrencies } from '../hooks/useCurrencies';

export default function CreateCurrencyPage() {
  const router = useRouter();
  const { createCurrency } = useCurrencies();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/currency')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateCurrencyModal
            isOpen={true}
            onClose={() => router.push('/currency')}
            onSubmit={async (payload) => {
              await createCurrency(payload);
              router.push('/currency');
            }}
          />
        </main>
      </div>
    </div>
  );
}
