'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const HomeView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabSelect = (tab: string) => {
    if (tab === 'projects') {
      router.push('/projects');
      return;
    }
    if (tab === 'category') {
      router.push('/categories');
      return;
    }
    if (tab === 'inventory') {
      router.push('/inventory');
      return;
    }
    if (tab === 'payment') {
      router.push('/payment');
      return;
    }
    if (tab === 'currency') {
      router.push('/currency');
      return;
    }
    if (tab === 'vendor') {
      router.push('/vendor');
      return;
    }
    if (tab === 'expense') {
      router.push('/expense');
      return;
    }
    if (tab === 'employee') {
      router.push('/employee');
      return;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab="homes"
          onSelectTab={handleTabSelect}
        />

        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
          }}
        >
          <h1 style={{ margin: 0, textAlign: 'center', fontSize: '2rem' }}>
            Welcome to SMS Building Contg LLC OPC
          </h1>
        </main>
      </div>
    </div>
  );
};
