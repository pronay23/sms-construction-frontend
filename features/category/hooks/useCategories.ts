'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, categoryApi } from '../api/categoryApi';
import { Category, CategoryPayload, PaginationMeta } from '../types';

export function useCategories(initialPage: number = 1) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getCategories(page);
      setCategories(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch categories');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (payload: CategoryPayload) => {
    const res = await categoryApi.createCategory(payload);
    await fetchCategories();
    return res.data;
  };

  const updateCategory = async (id: number, payload: Partial<CategoryPayload>) => {
    const res = await categoryApi.updateCategory(id, payload);
    await fetchCategories();
    return res.data;
  };

  const deleteCategory = async (id: number) => {
    await categoryApi.deleteCategory(id);
    await fetchCategories();
  };

  return {
    categories,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

