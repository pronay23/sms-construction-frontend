'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, inventoryApi } from '../api/inventoryApi';
import { Inventory, InventoryPayload, PaginationMeta } from '../types';

export function useInventories(initialPage: number = 1) {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchInventories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getInventories(page);
      setInventories(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch inventories');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const createInventory = async (payload: InventoryPayload) => {
    const res = await inventoryApi.createInventory(payload);
    await fetchInventories();
    return res.data;
  };

  const updateInventory = async (id: number, payload: Partial<InventoryPayload>) => {
    const res = await inventoryApi.updateInventory(id, payload);
    await fetchInventories();
    return res.data;
  };

  const deleteInventory = async (id: number) => {
    await inventoryApi.deleteInventory(id);
    await fetchInventories();
  };

  return {
    inventories,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchInventories,
    createInventory,
    updateInventory,
    deleteInventory,
  };
}
