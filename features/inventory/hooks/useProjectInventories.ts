'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, inventoryApi } from '../api/inventoryApi';
import { ProjectInventory } from '../types';

export function useProjectInventories() {
  const [projectInventories, setProjectInventories] = useState<ProjectInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectInventories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getProjectInventories();
      setProjectInventories(response.data || []);
    } catch (err: unknown) {
      if (err instanceof ApiError || err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch project inventory');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectInventories();
  }, [fetchProjectInventories]);

  const createProjectInventory = async (
    projectId: number,
    inventoryId: number,
    detail?: string,
  ) => {
    const response = await inventoryApi.createProjectInventory({
      project_id: projectId,
      inventory_id: inventoryId,
      detail,
    });
    await fetchProjectInventories();
    return response.data;
  };

  return {
    projectInventories,
    loading,
    error,
    refetch: fetchProjectInventories,
    createProjectInventory,
  };
}
