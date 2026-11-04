'use client';

import React from 'react';
import { Currency } from '../types';

interface CurrencyCardProps {
  currency: Currency;
  onEdit?: (currency: Currency) => void;
  onDelete?: (id: number) => void;
}

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  currency,
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
          <small style={{ color: 'var(--muted)' }}>Currency #{currency.id}</small>
          <span className="tag Paid">Active</span>
        </div>

        <h3
          style={{
            margin: '8px 0 6px',
            fontSize: '1.25rem',
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {currency.name} ({currency.short_name})
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--muted)',
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {currency.symbol}
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
          onClick={() => onEdit?.(currency)}
        >
          Edit
        </button>
        <button
          type="button"
          className="ghost"
          style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
          onClick={() => {
            if (confirm(`Delete currency "${currency.name}"?`)) {
              onDelete?.(currency.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
