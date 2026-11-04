'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEmployeeAuth } from '@/features/employee/auth/useEmployeeAuth';

interface NavbarProps {
  onToggleSidebar?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  searchTerm = '',
  onSearchChange,
}) => {
  const router = useRouter();
  const { employee, isAuthenticated, logout } = useEmployeeAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const initials = employee
    ? employee.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--surface)',
        borderBottom: '3px solid var(--amber)',
        marginBottom: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onToggleSidebar && (
          <button
            type="button"
            className="ghost"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation sidebar"
            style={{ padding: '6px 10px', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ☰
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.6rem', margin: 0 }}>SMS Building Contg LLC OPC</h1>
        </div>
      </div>


      {/* Right API Status & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--paid)',
              display: 'inline-block',
            }}
          />
          <span style={{ fontWeight: 600 }}>API Connected</span>
        </div>

        {!isAuthenticated ? (
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{
              background: 'var(--amber)',
              borderColor: 'var(--amber)',
              color: '#1d2a33',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {initials}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {employee?.name}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--pend)',
                color: 'var(--pend)',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
