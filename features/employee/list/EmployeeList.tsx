'use client';

import React from 'react';
import { Employee } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee_id: string) => void;
  onOpenCreateModal: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onOpenCreateModal,
}) => {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Employees</h2>
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
            {employees.length} Total
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
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
            + New Employee
          </button>
        </div>
      </div>

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

      {loading && employees.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <p>Loading employees from API (/api/employees)...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="empty box" style={{ padding: '36px 20px' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: '"Barlow Condensed", sans-serif' }}>
            No Employees Found
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            No construction employees found in the database.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            style={{
              background: 'var(--amber)',
              borderColor: 'var(--amber)',
              color: '#1d2a33',
            }}
          >
            Create Your First Employee
          </button>
        </div>
      ) : (
        <div className="box" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                {['ID', 'Name', 'Email', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: '14px 16px',
                      color: 'var(--muted)',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      textAlign: heading === 'Actions' ? 'right' : 'left',
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>
                    #{employee.employee_id}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>{employee.name}</td>
                  <td style={{ padding: '14px 16px' }}>{employee.email}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="ghost"
                      style={{ padding: '5px 10px', marginRight: '8px' }}
                      onClick={() => onEdit(employee)}
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
                        if (confirm(`Delete employee "${employee.name}"?`)) {
                          onDelete(employee.employee_id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
