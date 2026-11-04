'use client';

import React from 'react';
import { HomeCard } from '../components/HomeCard';
import { Home } from '../types';

interface HomeListProps {
  homes: Home[];
  loading: boolean;
  error: string | null;
  statusFilter: string;
  onFilterChange: (status: string) => void;
  onRefresh: () => void;
  onEdit: (home: Home) => void;
  onDelete: (id: number) => void;
  onOpenCreateModal: () => void;
}

export const HomeList: React.FC<HomeListProps> = ({
  homes,
  loading,
  error,
  statusFilter,
  onFilterChange,
  onRefresh,
  onEdit,
  onDelete,
  onOpenCreateModal,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Controls & Filter bar */}
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
          <label htmlFor="home-status-filter" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
            Filter Status:
          </label>
          <select
            id="home-status-filter"
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">All Projects</option>
            <option value="under_construction">Under Construction</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning Phase</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="ghost"
            onClick={onRefresh}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>🔄</span>
            <span>{loading ? 'Refreshing...' : 'Refresh API'}</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateModal}
            style={{
              background: 'var(--amber)',
              borderColor: 'var(--amber)',
              color: '#1d2a33',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            + Add Home
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: 'rgba(180, 69, 47, 0.1)',
            border: '1px solid var(--pend)',
            color: 'var(--pend)',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          <strong>API Error:</strong> {error}. Ensure your Laravel backend server is running on{' '}
          <code>http://127.0.0.1:8000</code>.
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && homes.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ fontStyle: 'italic' }}>Fetching homes data from Laravel API (/api/homes)...</p>
        </div>
      ) : homes.length === 0 ? (
        /* Empty State */
        <div className="empty box" style={{ padding: '36px 20px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: '"Barlow Condensed", sans-serif' }}>
            No construction homes found
          </h3>
          <p style={{ margin: '0 0 16px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            There are currently no homes matching the selected criteria in the backend database.
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
            Create Your First Home
          </button>
        </div>
      ) : (
        /* Grid of Homes */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {homes.map((home) => (
            <HomeCard key={home.id} home={home} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

