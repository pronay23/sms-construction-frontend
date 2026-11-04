'use client';

import React, { useState } from 'react';
import { HomePayload } from '../types';
import { validateHomeForm, ValidationErrors } from '../validation/homeValidation';

interface CreateHomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: HomePayload) => Promise<unknown>;
}

export const CreateHomeModal: React.FC<CreateHomeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<HomePayload>({
    title: '',
    location: '',
    price: '',
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2200,
    status: 'under_construction',
    description: '',
    is_featured: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validation = validateHomeForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to save home');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
      }}
    >
      <div
        className="box"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--amber)',
            paddingBottom: '10px',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>Add New Home Project</h2>
          <button type="button" className="ghost" onClick={onClose} style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {apiError && (
          <div
            style={{
              padding: '10px',
              background: 'rgba(180,69,47,0.1)',
              color: 'var(--pend)',
              border: '1px solid var(--pend)',
              borderRadius: '4px',
              marginBottom: '12px',
              fontSize: '0.85rem',
            }}
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Project / Home Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Skyline Heights Villa"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <small style={{ color: 'var(--pend)' }}>{errors.title}</small>}
          </div>

          <div className="two">
            <div>
              <label>Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label>Target Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="450000"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && <small style={{ color: 'var(--pend)' }}>{errors.price}</small>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label>Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms ?? ''}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms ?? ''}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Sq. Ft.</label>
              <input
                type="number"
                value={formData.area_sqft ?? ''}
                onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label>Construction Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="planning">Planning Phase</option>
              <option value="under_construction">Under Construction</option>
              <option value="completed">Completed & Ready</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label>Description</label>
            <textarea
              rows={2}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                padding: '8px',
                color: 'var(--ink)',
                font: 'inherit',
              }}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button type="button" className="ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                margin: 0,
                background: 'var(--amber)',
                borderColor: 'var(--amber)',
                color: '#1d2a33',
              }}
            >
              {submitting ? 'Creating via API...' : 'Save & Publish (POST /api/homes)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

