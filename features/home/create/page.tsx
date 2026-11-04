'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useHomes } from '../hooks/useHomes';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { CreateHomeModal } from './CreateHomeModal';

export default function CreateHomePage() {
  const router = useRouter();
  const { createHome } = useHomes();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/home')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateHomeModal
            isOpen={true}
            onClose={() => router.push('/home')}
            onSubmit={async (payload) => {
              await createHome(payload);
              router.push('/home');
            }}
          />
        </main>
      </div>
    </div>
  );
}

