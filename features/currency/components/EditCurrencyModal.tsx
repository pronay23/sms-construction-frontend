'use client';

import React, { useEffect, useState } from 'react';
import { Currency, CurrencyPayload } from '../types';

interface EditCurrencyModalProps {
  currency: Currency | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: Partial<CurrencyPayload>) => Promise<unknown>;
}

export const EditCurrencyModal: React.FC<EditCurrencyModalProps> = ({
  currency,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currency) {
      setName(currency.name);
      setShortName(currency.short_name);
      setSymbol(currency.symbol);
      setError(null);
    }
  }, [currency]);

  if (!isOpen || !currency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Currency name is required');
      return;
    }
    if (!shortName.trim()) {
      setError('Short name is required');
      return;
    }
    if (!symbol.trim()) {
      setError('Symbol is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(currency.id, {
        name: name.trim(),
        short_name: shortName.trim(),
        symbol: symbol.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update currency');
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
          <h2 style={{ margin: 0 }}>Edit Currency #{currency.id}</h2>
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
            <label>Currency Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Short Name *</label>
            <input
              type="text"
              required
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
            />
          </div>

          <div>
            <label>Symbol *</label>
            <input
              type="text"
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
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
              {submitting ? 'Updating...' : 'Save Changes (PUT /api/currencies)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
