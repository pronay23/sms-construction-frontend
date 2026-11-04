'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployeeAuth } from '@/features/employee/auth/useEmployeeAuth';
import { Navbar } from '@/features/home/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { employee, loading, login } = useEmployeeAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && employee) {
      router.push('/home');
    }
  }, [employee, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeeId.trim()) {
      setError('Employee ID is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      setSubmitting(true);
      await login({ employee_id: employeeId.trim(), password });
      router.push('/home');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to log in. Invalid credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && employee) {
    return null; // Handled by redirect above
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          className="box"
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'var(--surface)',
            padding: '24px',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px',
              fontSize: '1.5rem',
              textAlign: 'center',
              fontFamily: '"Barlow Condensed", sans-serif',
            }}
          >
            Employee Login
          </h2>

          {error && (
            <div
              style={{
                padding: '10px',
                background: 'rgba(180,69,47,0.1)',
                color: 'var(--pend)',
                border: '1px solid var(--pend)',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}
              >
                Employee ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EMP-001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  color: 'var(--ink)',
                  font: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}
              >
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  color: 'var(--ink)',
                  font: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                margin: 0,
                background: 'var(--amber)',
                borderColor: 'var(--amber)',
                color: '#1d2a33',
                fontWeight: 700,
                padding: '10px',
                borderRadius: '4px',
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
