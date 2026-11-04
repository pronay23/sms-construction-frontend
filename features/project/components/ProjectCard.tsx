'use client';

import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  return (
    <div
      className="box"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--surface)',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <small style={{ color: 'var(--muted)' }}>Project #{project.id}</small>
          <span className="tag Paid">Active</span>
        </div>

        <h3
          style={{
            margin: '8px 0 6px',
            fontSize: '1.25rem',
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {project.name}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          borderTop: '1px solid var(--line)',
          paddingTop: '10px',
        }}
      >
        <button
          type="button"
          className="ghost"
          style={{ flex: 1, padding: '5px' }}
          onClick={() => onEdit?.(project)}
        >
          Edit
        </button>
        <button
          type="button"
          className="ghost"
          style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
          onClick={() => {
            if (confirm(`Delete project "${project.name}"?`)) {
              onDelete?.(project.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

