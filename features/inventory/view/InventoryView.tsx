'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateInventoryModal } from '../components/CreateInventoryModal';
import { CreateProjectInventoryModal } from '../components/CreateProjectInventoryModal';
import { EditInventoryModal } from '../components/EditInventoryModal';
import { useInventories } from '../hooks/useInventories';
import { useProjectInventories } from '../hooks/useProjectInventories';
import { useProjects } from '../../project/hooks/useProjects';
import { InventoryList } from '../list/InventoryList';
import { Inventory, ProjectInventory } from '../types';

export const InventoryView: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);
  const [projectInventoryModalOpen, setProjectInventoryModalOpen] = useState(false);

  const {
    inventories,
    loading,
    error,
    refetch,
    createInventory,
    updateInventory,
    deleteInventory,
  } = useInventories();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const {
    projectInventories,
    error: projectInventoriesError,
    createProjectInventory,
  } = useProjectInventories();

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

  const handleCreateProjectInventory = async ({
    projectId,
    inventoryId,
    detail,
  }: Omit<ProjectInventory, 'id' | 'date'>) => {
    await createProjectInventory(projectId, inventoryId, detail || undefined);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab="inventory"
          onSelectTab={handleTabSelect}
        />

        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <InventoryList
            inventories={inventories}
            projects={projects}
            projectsError={projectsError}
            projectInventoriesError={projectInventoriesError}
            projectInventories={projectInventories}
            onOpenProjectInventoryModal={() => setProjectInventoryModalOpen(true)}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onEdit={(i) => setEditingInventory(i)}
            onDelete={deleteInventory}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        </main>
      </div>

      <CreateInventoryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createInventory}
      />

      <EditInventoryModal
        inventory={editingInventory}
        isOpen={Boolean(editingInventory)}
        onClose={() => setEditingInventory(null)}
        onSubmit={updateInventory}
      />

      <CreateProjectInventoryModal
        isOpen={projectInventoryModalOpen}
        projects={projects}
        inventories={inventories}
        projectsLoading={projectsLoading}
        inventoriesLoading={loading}
        onClose={() => setProjectInventoryModalOpen(false)}
        onSubmit={handleCreateProjectInventory}
      />
    </div>
  );
};
