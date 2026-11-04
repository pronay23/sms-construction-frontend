'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, vendorApi } from '../api/vendorApi';
import { Vendor, VendorPayload, PaginationMeta } from '../types';

export function useVendors(initialPage: number = 1) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorApi.getVendors(page);
      setVendors(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch vendors');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const createVendor = async (payload: VendorPayload) => {
    const res = await vendorApi.createVendor(payload);
    await fetchVendors();
    return res.data;
  };

  const updateVendor = async (id: number, payload: Partial<VendorPayload>) => {
    const res = await vendorApi.updateVendor(id, payload);
    await fetchVendors();
    return res.data;
  };

  const deleteVendor = async (id: number) => {
    await vendorApi.deleteVendor(id);
    await fetchVendors();
  };

  return {
    vendors,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
  };
}
