'use client';

import React, { useEffect, useState } from 'react';
import { Vendor, VendorPayload } from '../types';

interface EditVendorModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: Partial<VendorPayload>) => Promise<unknown>;
}

export const EditVendorModal: React.FC<EditVendorModalProps> = ({
  vendor,
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

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setEmail(vendor.email);
      setMobileNumber(vendor.mobile_number);
      setAddress(vendor.address || '');
      setError(null);
    }
  }, [vendor]);

  if (!isOpen || !vendor) return null;

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
      await onSubmit(vendor.id, {
        name: name.trim(),
        email: email.trim(),
        mobile_number: mobileNumber.trim(),
        address: address.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor');
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
          <h2 style={{ margin: 0 }}>Edit Vendor #{vendor.id}</h2>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Mobile Number *</label>
            <input
              type="tel"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              rows={3}
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
              {submitting ? 'Updating...' : 'Save Changes (PUT /api/vendors)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
