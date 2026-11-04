'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, homeApi } from '../api/homeApi';
import { Home, HomePayload, PaginationMeta } from '../types';

export function useHomes(initialStatus: string = 'all') {
  const [homes, setHomes] = useState<Home[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [page, setPage] = useState<number>(1);

  const fetchHomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeApi.getHomes({ page, status: statusFilter });
      setHomes(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch homes from API');
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchHomes();
  }, [fetchHomes]);

  const createHome = async (payload: HomePayload) => {
    const res = await homeApi.createHome(payload);
    await fetchHomes();
    return res.data;
  };

  const updateHome = async (id: number, payload: Partial<HomePayload>) => {
    const res = await homeApi.updateHome(id, payload);
    await fetchHomes();
    return res.data;
  };

  const deleteHome = async (id: number) => {
    await homeApi.deleteHome(id);
    await fetchHomes();
  };

  return {
    homes,
    meta,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    refetch: fetchHomes,
    createHome,
    updateHome,
    deleteHome,
  };
}

