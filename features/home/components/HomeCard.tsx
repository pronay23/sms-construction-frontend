'use client';

import React from 'react';
import { Home } from '../types';

interface HomeCardProps {
  home: Home;
  onEdit?: (home: Home) => void;
  onDelete?: (id: number) => void;
}

export const HomeCard: React.FC<HomeCardProps> = ({ home, onEdit, onDelete }) => {
  const formatPrice = (val: number | string | null) => {
    if (!val) return 'Price TBD';
    const num = Number(val);
    return isNaN(num) ? String(val) : `$${num.toLocaleString()}`;
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="tag Paid">Completed</span>;
      case 'under_construction':
        return <span className="tag Pending">Under Construction</span>;
      case 'planning':
        return (
          <span
            className="tag"
            style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
          >
            Planning Phase
          </span>
        );
      default:
        return <span className="tag">{status}</span>;
    }
  };

  return (
    <div
      className="box"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--line)',
        background: 'var(--surface)',
      }}
    >
      <div>
        {/* Home Information */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <small style={{ color: 'var(--muted)' }}>{home.location || 'Site Location TBD'}</small>
          <span
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--amber)',
            }}
          >
            {formatPrice(home.price)}
          </span>
        </div>

        <h3
          style={{
            margin: '4px 0 6px',
            fontSize: '1.2rem',
            fontFamily: '"Barlow Condensed", sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          {home.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em',
          }}
        >
          {home.description || 'No construction project description available.'}
        </p>

        {/* Specs bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--line)',
            marginTop: '12px',
            paddingTop: '8px',
            fontSize: '0.85rem',
            color: 'var(--ink)',
          }}
        >
          <span>
            <strong>{home.bedrooms ?? '-'}</strong> Beds
          </span>
          <span>
            <strong>{home.bathrooms ?? '-'}</strong> Baths
          </span>
          <span>
            <strong>{home.area_sqft ? home.area_sqft.toLocaleString() : '-'}</strong> sq.ft
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '14px',
          borderTop: '1px solid var(--line)',
          paddingTop: '10px',
        }}
      >
        <button
          type="button"
          className="ghost"
          style={{ flex: 1, padding: '5px' }}
          onClick={() => onEdit?.(home)}
        >
          Edit
        </button>
        <button
          type="button"
          className="ghost"
          style={{ color: 'var(--pend)', borderColor: 'var(--pend)', padding: '5px 10px' }}
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${home.title}" via API?`)) {
              onDelete?.(home.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

