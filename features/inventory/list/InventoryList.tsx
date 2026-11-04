'use client';

import React, { useState } from 'react';
import { Inventory, ProjectInventory } from '../types';
import { Project } from '../../project/types';

interface InventoryListProps {
  inventories: Inventory[];
  projects: Project[];
  projectsError: string | null;
  projectInventoriesError: string | null;
  projectInventories: ProjectInventory[];
  onOpenProjectInventoryModal: () => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (inventory: Inventory) => void;
  onDelete: (id: number) => void;
  onOpenCreateModal: () => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  projects,
  projectsError,
  projectInventoriesError,
  projectInventories,
  onOpenProjectInventoryModal,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onOpenCreateModal,
}) => {
  const [projectInventorySearch, setProjectInventorySearch] = useState('');
  const normalizedSearch = projectInventorySearch.trim().toLowerCase();
  const filteredProjectInventories = projectInventories.filter((projectInventory) => {
    const projectName =
      projects.find((project) => project.id === projectInventory.projectId)?.name || '';
    const inventoryName =
      inventories.find((inventory) => inventory.id === projectInventory.inventoryId)?.name || '';
    const detail = projectInventory.detail || '';

    return (
      projectName.toLowerCase().includes(normalizedSearch) ||
      inventoryName.toLowerCase().includes(normalizedSearch) ||
      detail.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Inventory Items</h2>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
            }}
          >
            {inventories.length} Total
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="ghost"
            onClick={onRefresh}
            disabled={loading}
          >
            🔄 {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={onOpenCreateModal}
            style={{
              background: 'var(--amber)',
              borderColor: 'var(--amber)',
              color: '#1d2a33',
            }}
          >
            + New Inventory
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(180, 69, 47, 0.1)',
            border: '1px solid var(--pend)',
            color: 'var(--pend)',
            padding: '12px 16px',
            borderRadius: '6px',
          }}
        >
          <strong>API Error:</strong> {error}
        </div>
      )}

      {projectsError && (
        <div
          style={{
            background: 'rgba(180, 69, 47, 0.1)',
            border: '1px solid var(--pend)',
            color: 'var(--pend)',
            padding: '12px 16px',
            borderRadius: '6px',
          }}
        >
          <strong>Project API Error:</strong> {projectsError}
        </div>
      )}

      {projectInventoriesError && (
        <div
          style={{
            background: 'rgba(180, 69, 47, 0.1)',
            border: '1px solid var(--pend)',
            color: 'var(--pend)',
            padding: '12px 16px',
            borderRadius: '6px',
          }}
        >
          <strong>Project Inventory API Error:</strong> {projectInventoriesError}
        </div>
      )}

      {loading && inventories.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <p>Loading inventory from API (/api/inventories)...</p>
        </div>
      ) : inventories.length === 0 ? (
        <div className="empty box" style={{ padding: '36px 20px' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: '"Barlow Condensed", sans-serif' }}>
            No Inventory Items Found
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            No construction inventory items found in the database.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            style={{
              background: 'var(--amber)',
              borderColor: 'var(--amber)',
              color: '#1d2a33',
            }}
          >
            Create Your First Inventory Item
          </button>
        </div>
      ) : (
        <div className="box" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  ID
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Item Name
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Description
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Status
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    color: 'var(--muted)',
                    fontSize: '0.8rem',
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inventory) => (
                <tr key={inventory.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>#{inventory.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>{inventory.name}</td>
                  <td
                    style={{
                      padding: '14px 16px',
                      color: 'var(--muted)',
                      maxWidth: '360px',
                    }}
                  >
                    {inventory.description || 'No description provided.'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="tag Paid">Active</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="ghost"
                      style={{ padding: '5px 10px', marginRight: '8px' }}
                      onClick={() => onEdit(inventory)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
                      onClick={() => {
                        if (confirm(`Delete inventory "${inventory.name}"?`)) {
                          onDelete(inventory.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            margin: '8px 0 16px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Project Inventory</h2>
          <input
            type="search"
            value={projectInventorySearch}
            onChange={(event) => setProjectInventorySearch(event.target.value)}
            placeholder="Search project inventory..."
            aria-label="Search project inventory"
            style={{ flex: '1 1 260px', maxWidth: '380px', margin: 0 }}
          />
          <button
            type="button"
            onClick={onOpenProjectInventoryModal}
            style={{
              background: 'var(--amber)',
              borderColor: 'var(--amber)',
              color: '#1d2a33',
            }}
          >
            + New Project Inventory
          </button>
        </div>
        <div className="box" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Project
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Inventory Product
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Detail
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjectInventories.map((projectInventory) => (
                <tr key={projectInventory.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    {projects.find((project) => project.id === projectInventory.projectId)?.name ||
                      'Unknown project'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    {inventories.find((inventory) => inventory.id === projectInventory.inventoryId)?.name ||
                      'Unknown inventory'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)', maxWidth: '360px' }}>
                    {projectInventory.detail || 'No detail provided.'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>
                    {new Date(projectInventory.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredProjectInventories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)' }}
                  >
                    {projectInventorySearch
                      ? 'No matching project inventory found.'
                      : 'No project inventory added yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
