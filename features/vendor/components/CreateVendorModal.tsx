'use client';

import React, { useState } from 'react';
import { VendorPayload } from '../types';

interface CreateVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: VendorPayload) => Promise<unknown>;
}

export const CreateVendorModal: React.FC<CreateVendorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Vendor name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!mobileNumber.trim()) {
      setError('Mobile number is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        mobile_number: mobileNumber.trim(),
        address: address.trim(),
      });
      setName('');
      setEmail('');
      setMobileNumber('');
      setAddress('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
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
          <h2 style={{ margin: 0 }}>Add New Vendor (POST /api/vendors)</h2>
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
            <label>Vendor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Al Rashid Construction Supplies"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Email *</label>
            <input
              type="email"
              required
              placeholder="e.g. contact@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Mobile Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +971501234567"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              rows={3}
              placeholder="e.g. Al Qusais, Dubai, UAE"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                padding: '8px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              {submitting ? 'Creating...' : 'Save Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
