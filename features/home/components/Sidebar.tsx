'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useExpenses } from '@/features/expense/hooks/useExpenses';
import { CreateExpenseModal } from '@/features/expense/components/CreateExpenseModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab = 'homes',
  onSelectTab,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const pathname = usePathname();

  // Always close the mobile sidebar backdrop on navigation so it cannot
  // block clicks on the newly loaded page (e.g. after login → category).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    onClose();
  }, [pathname]);

  const {
    projects,
    categories,
    payments,
    currencies,
    vendors,
    lookupLoading,
    createExpense,
  } = useExpenses();

  const menuItems = [
    { id: 'homes', label: 'Home', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '🏗️' },
    { id: 'category', label: 'Category', icon: '✅' },
    { id: 'inventory', label: 'Inventory', icon: '📐' },
    { id: 'payment', label: 'Payment', icon: '⚡' },
    { id: 'currency', label: 'Currency', icon: '⚙️' },
    { id: 'vendor', label: 'Vendor', icon: '🤝' },
    { id: 'expense', label: 'Expenses', icon: '💰' },
    { id: 'employee', label: 'Employee', icon: '👷' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        style={{
          width: collapsed ? '58px' : '260px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: collapsed ? '20px 8px' : '20px 14px',
          flexShrink: 0,
          zIndex: 45,
          position: isOpen ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'space-between',
              alignItems: 'center',
            }}
          >
            {!collapsed && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Navigation
              </span>
            )}
            {isOpen && (
              <button
                type="button"
                className="ghost"
                onClick={onClose}
                style={{ fontSize: '1rem', padding: '2px 8px' }}
              >
                ✕
              </button>
            )}
            <button
              type="button"
              className="ghost"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ fontSize: '1rem', padding: '2px 8px' }}
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab?.(item.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textAlign: collapsed ? 'center' : 'left',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--amber)' : 'transparent',
                    background: isActive ? 'var(--bg)' : 'transparent',
                    color: isActive ? 'var(--amber)' : 'var(--ink)',
                    cursor: 'pointer',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span style={{ fontSize: '0.95rem' }}>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {!collapsed && (
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setExpenseModalOpen(true)}
                style={{
                  width: '100%',
                  background: 'var(--amber)',
                  borderColor: 'var(--amber)',
                  color: '#1d2a33',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                }}
              >
                <span>➕</span>
                <span>Add Expense</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {!collapsed && <div
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: '14px',
            fontSize: '0.8rem',
            color: 'var(--muted)',
          }}
        >
          &copy; {new Date().getFullYear()} SMS Building Contg LLC OPC
        </div>}
      </aside>

      {createPortal(
        <CreateExpenseModal
          isOpen={expenseModalOpen}
          onClose={() => setExpenseModalOpen(false)}
          onSubmit={createExpense}
          projects={projects}
          categories={categories}
          payments={payments}
          currencies={currencies}
          vendors={vendors}
          lookupLoading={lookupLoading}
        />,
        document.body,
      )}
    </>
  );
}
