'use client';

import React from 'react';
import { Vendor } from '../types';

interface VendorCardProps {
  vendor: Vendor;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (id: number) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
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
          <small style={{ color: 'var(--muted)' }}>Vendor #{vendor.id}</small>
          <span className="tag Paid">Active</span>
        </div>

        <h3
          style={{
            margin: '8px 0 6px',
            fontSize: '1.25rem',
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {vendor.name}
        </h3>

        <p
          style={{
            margin: '0 0 4px',
            fontSize: '0.85rem',
            color: 'var(--muted)',
          }}
        >
          {vendor.email}
        </p>

        <p
          style={{
            margin: '0 0 4px',
            fontSize: '0.85rem',
            color: 'var(--muted)',
          }}
        >
          {vendor.mobile_number}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}
        >
          {vendor.address || 'No address provided.'}
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
          onClick={() => onEdit?.(vendor)}
        >
          Edit
        </button>
        <button
          type="button"
          className="ghost"
          style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
          onClick={() => {
            if (confirm(`Delete vendor "${vendor.name}"?`)) {
              onDelete?.(vendor.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
