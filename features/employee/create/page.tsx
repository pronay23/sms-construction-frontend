'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { useEmployees } from '../hooks/useEmployees';

export default function CreateEmployeePage() {
  const router = useRouter();
  const { createEmployee } = useEmployees();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/employee')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateEmployeeModal
            isOpen={true}
            onClose={() => router.push('/employee')}
            onSubmit={async (payload) => {
              await createEmployee(payload);
              router.push('/employee');
            }}
          />
        </main>
      </div>
    </div>
  );
}
