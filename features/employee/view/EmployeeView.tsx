'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeAuth } from '../auth/useEmployeeAuth';
import { EmployeeList } from '../list/EmployeeList';
import { Employee } from '../types';

export const EmployeeView: React.FC = () => {
  const router = useRouter();
  const { employee, loading: authLoading, isAuthenticated } = useEmployeeAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const {
    employees,
    loading,
    error,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

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
          activeTab="employee"
          onSelectTab={handleTabSelect}
        />

        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <EmployeeList
            employees={employees}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(e) => setEditingEmployee(e)}
            onDelete={deleteEmployee}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        </main>
      </div>

      <CreateEmployeeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createEmployee}
      />

      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        onSubmit={updateEmployee}
      />
    </div>
  );
};
