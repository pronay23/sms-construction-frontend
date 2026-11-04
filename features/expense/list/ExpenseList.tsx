'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Expense, ExpenseFilter } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onOpenCreateModal: () => void;
  filters: ExpenseFilter;
  setFilter: (key: keyof ExpenseFilter, value: number | string | undefined) => void;
  projects: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  payments: { id: number; name: string }[];
  currencies: { id: number; name: string }[];
  vendors: { id: number; name: string }[];
  lookupLoading: boolean;
}

const FilterChip: React.FC<{ label: string; value: string | number; onRemove: () => void }> = ({
  label,
  value,
  onRemove,
}) => (
  <div
    className="expense-list-header"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'var(--bg)',
      border: '1px solid var(--line)',
      borderRadius: '999px',
      padding: '2px 8px',
      fontSize: '0.8rem',
      marginBottom: '8px',
    }}
  >
    <span style={{ color: 'var(--ink)' }}>{label}: {value}</span>
    <button
      type="button"
      onClick={onRemove}
      style={{ background: 'none', border: 'none', color: 'var(--pend)', cursor: 'pointer', padding: 0 }}
    >
      ✕
    </button>
  </div>
);

const searchableExpenseFields: (keyof Expense)[] = [
  'date',
  'project',
  'category',
  'payment',
  'currency',
  'description',
  'vendor',
  'status',
];

const formatExpenseDate = (date: string): string => {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  const parsedDate = dateOnlyMatch
    ? new Date(Date.UTC(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3])))
    : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate);
};

const toAmount = (value: number | string | null): number => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const formatAmount = (value: number): string =>
  `৳${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const calculateVatAmount = (expense: Expense): number =>
  (toAmount(expense.amount) * toAmount(expense.vat)) / 100;

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onOpenCreateModal,
  filters,
  setFilter,
  projects,
  categories,
  payments,
  currencies,
  vendors,
  lookupLoading,
}) => {
  const activeFilters = Object.entries(filters).filter(([, v]) => v !== undefined && v !== '');
  const [searchTerm, setSearchTerm] = useState('');
  const summaryCardsRef = useRef<HTMLDivElement>(null);
  const slideSummaryCards = (direction: number) => {
    summaryCardsRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };
  const filteredExpenses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return expenses;
    }

    return expenses.filter((expense) =>
      [
        String(expense.id),
        ...searchableExpenseFields.map((field) => String(expense[field] ?? '')),
      ].some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [expenses, searchTerm]);
  const summary = useMemo(() => {
    const totalExpense = filteredExpenses.reduce((total, expense) => total + toAmount(expense.amount), 0);
    const paid = filteredExpenses
      .filter((expense) => expense.status === 'paid')
      .reduce((total, expense) => total + toAmount(expense.amount), 0);
    const pending = filteredExpenses
      .filter((expense) => expense.status !== 'paid')
      .reduce((total, expense) => total + toAmount(expense.amount), 0);
    const vatAmount = filteredExpenses.reduce((total, expense) => total + calculateVatAmount(expense), 0);
    const receivedFromBank = filteredExpenses.reduce(
      (total, expense) => total + toAmount(expense.received_from_bank),
      0,
    );
    const receivedFromOwner = filteredExpenses.reduce(
      (total, expense) => total + toAmount(expense.received_from_owner),
      0,
    );
    const cashDeposit = filteredExpenses.reduce(
      (total, expense) => total + toAmount(expense.cash_deposit),
      0,
    );

    return {
      totalExpense,
      paid,
      pending,
      vatAmount,
      receivedFromBank,
      receivedFromOwner,
      cashDeposit,
      profit: receivedFromBank + receivedFromOwner - totalExpense,
    };
  }, [filteredExpenses]);

  const summaryCards = [
    { label: 'Total expense', value: summary.totalExpense, tone: 'var(--ink)' },
    { label: 'Paid', value: summary.paid, tone: 'var(--paid)' },
    { label: 'Pending', value: summary.pending, tone: 'var(--pend)' },
    { label: 'Total VAT amount', value: summary.vatAmount, tone: 'var(--ink)' },
    { label: 'Received from bank', value: summary.receivedFromBank, tone: 'var(--ink)' },
    { label: 'Received from owner', value: summary.receivedFromOwner, tone: 'var(--ink)' },
    { label: 'Cash deposit', value: summary.cashDeposit, tone: 'var(--ink)' },
    {
      label: 'Profit (bank + owner − expense)',
      value: summary.profit,
      tone: summary.profit >= 0 ? 'var(--paid)' : 'var(--pend)',
    },
  ];

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
        <div className="expense-list-title">
          <h2 style={{ margin: 5, fontSize: '1.4rem' }}>Expenses</h2>
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
            {filteredExpenses.length} of {expenses.length} Total
          </span>
        </div>

        <div className="expense-search-wrap">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search expenses..."
            aria-label="Search expenses"
            style={{ width: '100%', maxWidth: '380px' }}
          />
        </div>
        <div className="expense-list-actions">
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
            + New Expense
          </button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {activeFilters.map(([key, value]) => (
            <FilterChip
              key={key}
              label={key.replace(/_/g, ' ')}
              value={value}
              onRemove={() => setFilter(key as keyof ExpenseFilter, undefined)}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              Object.keys(filters).forEach((k) => setFilter(k as keyof ExpenseFilter, undefined));
            }}
            style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Clear all filters
          </button>
        </div>
      )}

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

      <section
        className="box expense-summary"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label htmlFor="expense-project-filter" style={{ fontWeight: 700 }}>
            Project summary
          </label>
          <select
            className="expense-project-filter"
            id="expense-project-filter"
            value={filters.project_id ?? ''}
            onChange={(event) => {
              const value = event.target.value;
              setFilter('project_id', value ? Number(value) : undefined);
            }}
            style={{
              minWidth: '240px',
              padding: '8px 10px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              color: 'var(--ink)',
              font: 'inherit',
            }}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="expense-summary-carousel">
          <button
            type="button"
            className="ghost"
            onClick={() => slideSummaryCards(-1)}
            aria-label="Show previous summary cards"
          >
            ‹
          </button>
          <div className="expense-summary-cards" ref={summaryCardsRef}>
            {summaryCards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ color: 'var(--muted)', marginBottom: '8px' }}>{card.label}</div>
                <strong style={{ color: card.tone, fontSize: '1.6rem' }}>
                  {formatAmount(card.value)}
                </strong>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="ghost"
            onClick={() => slideSummaryCards(1)}
            aria-label="Show next summary cards"
          >
            ›
          </button>
        </div>
      </section>

      {loading && expenses.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <p>Loading expenses from API (/api/expenses)...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty box" style={{ padding: '36px 20px' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: '"Barlow Condensed", sans-serif' }}>
            {expenses.length === 0 ? 'No Expenses Found' : 'No Matching Expenses'}
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            {expenses.length === 0
              ? 'No construction expenses found in the database.'
              : 'Try a different search term.'}
          </p>
          {expenses.length === 0 && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              style={{
                background: 'var(--amber)',
                borderColor: 'var(--amber)',
                color: '#1d2a33',
              }}
            >
              Create Your First Expense
            </button>
          )}
        </div>
      ) : (
        <div className="box expense-table-wrap">
          <table style={{ width: 'max-content', minWidth: '1550px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                {[
                  'ID',
                  'Date',                  
                  'Project',
                  'Description',
                  'Category',
                  'Vendor',
                  'Payment',
                  'Currency',
                  'Amount',
                  'VAT',
                  'VAT Amount',
                  'Cash',
                  'Bank',
                  'Owner',
                  'Status',
                  'Actions',
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: '14px 12px',
                      color: 'var(--muted)',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => {
                const isPaid = expense.status === 'paid';
                return (
                  <tr key={expense.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 12px', color: 'var(--muted)' }}>#{expense.id}</td>
                    <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}>
                      {formatExpenseDate(expense.date)}
                    </td>
                    <td style={{ padding: '14px 12px' }}>{expense.project || '—'}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>
                      {expense.description || 'Expense'}
                    </td>            
                    <td style={{ padding: '14px 12px' }}>{expense.category || '—'}</td>
                    <td style={{ padding: '14px 12px' }}>{expense.vendor || '—'}</td>
                    <td style={{ padding: '14px 12px' }}>{expense.payment || '—'}</td>
                    <td style={{ padding: '14px 12px' }}>{expense.currency || '—'}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{expense.amount ?? '0.00'}</td>
                    <td style={{ padding: '14px 12px' }}>{expense.vat ?? '0.00'}%</td>
                    <td style={{ padding: '14px 12px' }}>
                      {calculateVatAmount(expense).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 12px' }}>{expense.cash_deposit || '0.00'}</td>
                    <td style={{ padding: '14px 12px' }}>{expense.received_from_bank || '0.00'}</td>
                    <td style={{ padding: '14px 12px' }}>{expense.received_from_owner || '0.00'}</td>
                    <td style={{ padding: '14px 12px' }}>
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
                        {expense.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="ghost"
                        style={{ padding: '5px 10px', marginRight: '8px' }}
                        onClick={() => onEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        style={{
                          color: 'var(--pend)',
                          borderColor: 'var(--pend)',
                          padding: '5px 10px',
                        }}
                        onClick={() => {
                          if (confirm(`Delete expense "${expense.description}"?`)) {
                            onDelete(expense.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {lookupLoading && (
        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
          Loading reference data for forms...
        </div>
      )}
    </div>
  );
};
