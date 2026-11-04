'use client';

import React, { useEffect, useState } from 'react';
import { Expense, ExpensePayload, LookupItem } from '../types';

interface EditExpenseModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: Partial<ExpensePayload>) => Promise<unknown>;
  projects: LookupItem[];
  categories: LookupItem[];
  payments: LookupItem[];
  currencies: LookupItem[];
  vendors: LookupItem[];
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  expense,
  isOpen,
  onClose,
  onSubmit,
  projects,
  categories,
  payments,
  currencies,
  vendors,
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

  useEffect(() => {
    if (expense) {
      setDate(expense.date.slice(0, 10));
      const findLookupId = (id: number | undefined, name: string | null, options: LookupItem[]) =>
        id ?? options.find((option) => option.name === name)?.id ?? '';

      setProjectId(findLookupId(expense.project_id, expense.project, projects));
      setCategoryId(findLookupId(expense.category_id, expense.category, categories));
      setPaymentId(findLookupId(expense.payment_id, expense.payment, payments));
      setCurrencyId(findLookupId(expense.currency_id, expense.currency, currencies));
      setVendorId(findLookupId(expense.vendor_id, expense.vendor, vendors));
      setDescription(expense.description || '');
      setAmount(expense.amount == null ? '' : Number(expense.amount));
      setVat(expense.vat == null ? '' : Number(expense.vat));
      setCashDeposit(expense.cash_deposit == null ? '' : Number(expense.cash_deposit));
      setReceivedFromBank(expense.received_from_bank == null ? '' : Number(expense.received_from_bank));
      setReceivedFromOwner(expense.received_from_owner == null ? '' : Number(expense.received_from_owner));
      setStatus(expense.status);
      setError(null);
    }
  }, [expense, projects, categories, payments, currencies, vendors]);

  if (!isOpen || !expense) return null;

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
      await onSubmit(expense.id, {
        date,
        project_id: Number(projectId),
        category_id: Number(categoryId),
        payment_id: Number(paymentId),
        currency_id: Number(currencyId),
        description: description.trim(),
        vendor_id: Number(vendorId),
        amount: Number(amount),
        vat: vat === '' ? undefined : Number(vat),
        vat_amount: expense.vat_amount == null ? undefined : Number(expense.vat_amount),
        cash_deposit: cashDeposit === '' ? undefined : Number(cashDeposit),
        received_from_bank: receivedFromBank === '' ? undefined : Number(receivedFromBank),
        received_from_owner: receivedFromOwner === '' ? undefined : Number(receivedFromOwner),
        status,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
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
          <h2 style={{ margin: 0 }}>Edit Expense #{expense.id} (PUT /api/expenses)</h2>
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
            <div>
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
                  marginBottom: '10px',
                }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
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
              disabled={submitting}
              style={{
                flex: 2,
                margin: 0,
                background: 'var(--amber)',
                borderColor: 'var(--amber)',
                color: '#1d2a33',
              }}
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
