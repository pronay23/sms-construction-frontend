'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/features/home/components/Navbar';
import { Sidebar } from '@/features/home/components/Sidebar';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useProjects } from '../hooks/useProjects';

export default function CreateProjectPage() {
  const router = useRouter();
  const { createProject } = useProjects();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={false} onClose={() => {}} onSelectTab={() => router.push('/projects')} />
        <main style={{ flex: 1, padding: '24px' }}>
          <CreateProjectModal
            isOpen={true}
            onClose={() => router.push('/projects')}
            onSubmit={async (payload) => {
              await createProject(payload);
              router.push('/projects');
            }}
          />
        </main>
      </div>
    </div>
  );
}

