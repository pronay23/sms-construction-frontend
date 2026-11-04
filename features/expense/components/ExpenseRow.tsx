'use client';

import React from 'react';
import { Expense } from '../types';

interface ExpenseRowProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
}

const calculateVatAmount = (expense: Expense): number => {
  const amount = Number(expense.amount);
  const vatRate = Number(expense.vat);

  return (Number.isFinite(amount) ? amount : 0) * (Number.isFinite(vatRate) ? vatRate : 0) / 100;
};

const StatusTag: React.FC<{ status: string }> = ({ status }) => {
  const isPaid = status === 'paid';
  return (
    <span
      className="tag"
      style={{
        color: isPaid ? 'var(--paid)' : 'var(--pend)',
        borderColor: isPaid ? 'var(--paid)' : 'var(--pend)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
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
        border: '1px solid var(--line)',
      }}
    >
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <small style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Expense #{expense.id}</small>
            <h3
              style={{
                margin: '4px 0 0',
                fontSize: '1.25rem',
                fontFamily: '"Barlow Condensed", sans-serif',
              }}
            >
              {expense.description || 'Expense'}
            </h3>
          </div>
          <StatusTag status={expense.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '10px' }}>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Date</small>
            <span style={{ fontWeight: 600 }}>{expense.date}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Project</small>
            <span style={{ fontWeight: 600 }}>{expense.project || '—'}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Category</small>
            <span style={{ fontWeight: 600 }}>{expense.category || '—'}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Currency</small>
            <span style={{ fontWeight: 600 }}>{expense.currency || '—'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '10px' }}>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Vendor</small>
            <span style={{ fontWeight: 600 }}>{expense.vendor || '—'}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Payment</small>
            <span style={{ fontWeight: 600 }}>{expense.payment || '—'}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Amount</small>
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{expense.amount}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>VAT (%)</small>
            <span style={{ fontWeight: 600 }}>{expense.vat || '0.00'}</span>
          </div>
          <div>
            <small style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>VAT Amount</small>
            <span style={{ fontWeight: 600 }}>{calculateVatAmount(expense).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          <div>Cash: {expense.cash_deposit || '0.00'}</div>
          <div>Bank: {expense.received_from_bank || '0.00'}</div>
          <div>Owner: {expense.received_from_owner || '0.00'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="ghost"
            style={{ padding: '6px 10px' }}
            onClick={() => onEdit?.(expense)}
          >
            Edit
          </button>
          <button
            type="button"
            className="ghost"
            style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '6px 10px' }}
            onClick={() => {
              if (confirm(`Delete expense "${expense.description}"?`)) {
                onDelete?.(expense.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
