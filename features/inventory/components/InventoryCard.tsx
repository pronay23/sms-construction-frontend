'use client';

import React from 'react';
import { Inventory } from '../types';

interface InventoryCardProps {
  inventory: Inventory;
  onEdit?: (inventory: Inventory) => void;
  onDelete?: (id: number) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  inventory,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="box"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--surface)',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <small style={{ color: 'var(--muted)' }}>Inventory #{inventory.id}</small>
          <span className="tag Paid">Active</span>
        </div>

        <h3
          style={{
            margin: '8px 0 6px',
            fontSize: '1.25rem',
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {inventory.name}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}
        >
          {inventory.description || 'No description provided.'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          borderTop: '1px solid var(--line)',
          paddingTop: '10px',
        }}
      >
        <button
          type="button"
          className="ghost"
          style={{ flex: 1, padding: '5px' }}
          onClick={() => onEdit?.(inventory)}
        >
          Edit
        </button>
        <button
          type="button"
          className="ghost"
          style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
          onClick={() => {
            if (confirm(`Delete inventory "${inventory.name}"?`)) {
              onDelete?.(inventory.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
