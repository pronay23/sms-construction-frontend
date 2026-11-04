'use client';

import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onOpenCreateModal: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
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
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>All Construction Projects</h2>
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
            {projects.length} Total
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
            + New Project
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

      {loading && projects.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <p>Loading projects from API (/api/projects)...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty box" style={{ padding: '36px 20px' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: '"Barlow Condensed", sans-serif' }}>
            No Projects Found
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            No construction project records found in the database.
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
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="box" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  ID
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Project Name
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Description
                </th>
                <th style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                  Status
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    color: 'var(--muted)',
                    fontSize: '0.8rem',
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>#{project.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>{project.name}</td>
                  <td
                    style={{
                      padding: '14px 16px',
                      color: 'var(--muted)',
                      maxWidth: '360px',
                    }}
                  >
                    {project.description || 'No description provided.'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="tag Paid">Active</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="ghost"
                      style={{ padding: '5px 10px', marginRight: '8px' }}
                      onClick={() => onEdit(project)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
                      onClick={() => {
                        if (confirm(`Delete project "${project.name}"?`)) {
                          onDelete(project.id);
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
