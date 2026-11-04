'use client';

import React, { useState } from 'react';
import { Inventory, ProjectInventory } from '../types';
import { Project } from '../../project/types';

interface CreateProjectInventoryModalProps {
  isOpen: boolean;
  projects: Project[];
  inventories: Inventory[];
  projectsLoading: boolean;
  inventoriesLoading: boolean;
  onClose: () => void;
  onSubmit: (projectInventory: Omit<ProjectInventory, 'id' | 'date'>) => Promise<void>;
}

export const CreateProjectInventoryModal: React.FC<CreateProjectInventoryModalProps> = ({
  isOpen,
  projects,
  inventories,
  projectsLoading,
  inventoriesLoading,
  onClose,
  onSubmit,
}) => {
  const [projectId, setProjectId] = useState('');
  const [inventoryId, setInventoryId] = useState('');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId || !inventoryId) {
      setError('Project and inventory are required.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ projectId: Number(projectId), inventoryId: Number(inventoryId), detail: detail.trim() });
      setProjectId('');
      setInventoryId('');
      setDetail('');
      setError(null);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project inventory.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
      }}
    >
      <div className="box" style={{ width: '100%', maxWidth: '480px', background: 'var(--surface)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--amber)',
            paddingBottom: '10px',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>New Project Inventory</h2>
          <button type="button" className="ghost" onClick={onClose} style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px',
              background: 'rgba(180,69,47,0.1)',
              color: 'var(--pend)',
              border: '1px solid var(--pend)',
              borderRadius: '4px',
              marginBottom: '12px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="project-inventory-project">Project</label>
            <select
              id="project-inventory-project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={projectsLoading || projects.length === 0}
              required
            >
              <option value="">{projectsLoading ? 'Loading projects...' : 'Select project'}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project-inventory-product">Inventory</label>
            <select
              id="project-inventory-product"
              value={inventoryId}
              onChange={(event) => setInventoryId(event.target.value)}
              disabled={inventoriesLoading || inventories.length === 0}
              required
            >
              <option value="">
                {inventoriesLoading ? 'Loading inventory...' : 'Select inventory product'}
              </option>
              {inventories.map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project-inventory-detail">Detail</label>
            <textarea
              id="project-inventory-detail"
              rows={3}
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              placeholder="Enter project inventory details"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                padding: '8px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button type="button" className="ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                margin: 0,
                background: 'var(--amber)',
                borderColor: 'var(--amber)',
                color: '#1d2a33',
              }}
            >
              {submitting ? 'Saving...' : 'Save Project Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
