'use client';

import React, { useState } from 'react';
import { ExpensePayload, LookupItem } from '../types';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ExpensePayload) => Promise<unknown>;
  projects: LookupItem[];
  categories: LookupItem[];
  payments: LookupItem[];
  currencies: LookupItem[];
  vendors: LookupItem[];
  lookupLoading: boolean;
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects,
  categories,
  payments,
  currencies,
  vendors,
  lookupLoading,
}) => {
  const [date, setDate] = useState('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [paymentId, setPaymentId] = useState<number | ''>('');
  const [currencyId, setCurrencyId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [vendorId, setVendorId] = useState<number | ''>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [vat, setVat] = useState<number | ''>('');
  const [cashDeposit, setCashDeposit] = useState<number | ''>('');
  const [receivedFromBank, setReceivedFromBank] = useState<number | ''>('');
  const [receivedFromOwner, setReceivedFromOwner] = useState<number | ''>('');
  const [status, setStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError('Date is required');
      return;
    }
    if (!projectId) {
      setError('Project is required');
      return;
    }
    if (!categoryId) {
      setError('Category is required');
      return;
    }
    if (!paymentId) {
      setError('Payment is required');
      return;
    }
    if (!currencyId) {
      setError('Currency is required');
      return;
    }
    if (!vendorId) {
      setError('Vendor is required');
      return;
    }
    if (!amount) {
      setError('Amount is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        date,
        project_id: Number(projectId),
        category_id: Number(categoryId),
        payment_id: Number(paymentId),
        currency_id: Number(currencyId),
        description: description.trim(),
        vendor_id: Number(vendorId),
        amount: Number(amount),
        vat: vat ? Number(vat) : undefined,
        cash_deposit: cashDeposit ? Number(cashDeposit) : undefined,
        received_from_bank: receivedFromBank ? Number(receivedFromBank) : undefined,
        received_from_owner: receivedFromOwner ? Number(receivedFromOwner) : undefined,
        status,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  const SelectField = ({ label, options, value, onChange, required }: { label: string; options: LookupItem[]; value: number | string; onChange: (v: number) => void; required?: boolean }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>{label}{required ? ' *' : ''}</label>
      <select
        required={required}
        value={value === '' ? '' : String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          padding: '8px',
          background: 'var(--bg)',
          border: '1px solid var(--line)',
          borderRadius: '4px',
          color: 'var(--ink)',
          font: 'inherit',
          marginBottom: '10px',
        }}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );

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
      <div className="box" style={{ width: '100%', maxWidth: '560px', background: 'var(--surface)', maxHeight: '90vh', overflowY: 'auto' }}>
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
          <h2 style={{ margin: 0 }}>Add New Expense (POST /api/expenses)</h2>
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

        {lookupLoading && (
          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
            Loading reference data...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  color: 'var(--ink)',
                  font: 'inherit',
                }}
              />
            </div>
          </div>

          <SelectField label="Project" options={projects} value={projectId} onChange={setProjectId} required />
          <SelectField label="Category" options={categories} value={categoryId} onChange={setCategoryId} required />
          <SelectField label="Payment" options={payments} value={paymentId} onChange={setPaymentId} required />
          <SelectField label="Currency" options={currencies} value={currencyId} onChange={setCurrencyId} required />
          <SelectField label="Vendor" options={vendors} value={vendorId} onChange={setVendorId} required />

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Amount *</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount === '' ? '' : String(amount)}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Status *</label>
            <select
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Description</label>
            <textarea
              rows={3}
              placeholder="Expense description..."
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                padding: '8px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>VAT (%)</label>
            <input
              type="number"
              step="0.01"
              value={vat === '' ? '' : String(vat)}
              onChange={(e) => setVat(e.target.value === '' ? '' : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Cash Deposit</label>
              <input
                type="number"
                step="0.01"
                value={cashDeposit === '' ? '' : String(cashDeposit)}
                onChange={(e) => setCashDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  color: 'var(--ink)',
                  font: 'inherit',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Received from Bank</label>
              <input
                type="number"
                step="0.01"
                value={receivedFromBank === '' ? '' : String(receivedFromBank)}
                onChange={(e) => setReceivedFromBank(e.target.value === '' ? '' : Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  color: 'var(--ink)',
                  font: 'inherit',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--ink)' }}>Received from Owner</label>
            <input
              type="number"
              step="0.01"
              value={receivedFromOwner === '' ? '' : String(receivedFromOwner)}
              onChange={(e) => setReceivedFromOwner(e.target.value === '' ? '' : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
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
              disabled={submitting || lookupLoading}
              style={{
                flex: 2,
                margin: 0,
                background: 'var(--amber)',
                borderColor: 'var(--amber)',
                color: '#1d2a33',
              }}
            >
              {submitting ? 'Creating...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
