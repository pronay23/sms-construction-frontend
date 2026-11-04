'use client';

import React from 'react';
import { PaymentCard } from '../components/PaymentCard';
import { Payment } from '../types';

interface PaymentListProps {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: number) => void;
  onOpenCreateModal: () => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onOpenCreateModal,
}) => {
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
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Payment Methods</h2>
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
            {payments.length} Total
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
            + New Payment
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

      {loading && payments.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <p>Loading payments from API (/api/payments)...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="empty box" style={{ padding: '36px 20px' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: '"Barlow Condensed", sans-serif' }}>
            No Payment Methods Found
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            No construction payment methods found in the database.
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
            Create Your First Payment Method
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {payments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
