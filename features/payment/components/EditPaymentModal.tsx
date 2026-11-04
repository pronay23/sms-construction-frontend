'use client';

import React, { useEffect, useState } from 'react';
import { Payment, PaymentPayload } from '../types';

interface EditPaymentModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: Partial<PaymentPayload>) => Promise<unknown>;
}

export const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  payment,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (payment) {
      setName(payment.name);
      setError(null);
    }
  }, [payment]);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Payment name is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(payment.id, { name: name.trim() });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update payment');
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
          <h2 style={{ margin: 0 }}>Edit Payment #{payment.id}</h2>
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
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Payment Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              {submitting ? 'Updating...' : 'Save Changes (PUT /api/payments)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
