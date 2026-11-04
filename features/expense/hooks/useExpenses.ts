'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, expenseApi } from '../api/expenseApi';
import { Expense, ExpensePayload, ExpenseFilter, PaginationMeta, LookupItem } from '../types';

export function useExpenses(initialPage: number = 1, initialFilters: ExpenseFilter = {}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<ExpenseFilter>(initialFilters);

  // Lookup data for dropdowns
  const [projects, setProjects] = useState<LookupItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [payments, setPayments] = useState<LookupItem[]>([]);
  const [currencies, setCurrencies] = useState<LookupItem[]>([]);
  const [vendors, setVendors] = useState<LookupItem[]>([]);
  const [lookupLoading, setLookupLoading] = useState<boolean>(true);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseApi.getExpenses(page, filters);
      setExpenses(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch expenses');
      }
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchLookups = useCallback(async () => {
    setLookupLoading(true);
    try {
      const [projectsRes, categoriesRes, paymentsRes, currenciesRes, vendorsRes] =
        await Promise.all([
          expenseApi.getProjects(),
          expenseApi.getCategories(),
          expenseApi.getPayments(),
          expenseApi.getCurrencies(),
          expenseApi.getVendors(),
        ]);
      setProjects(projectsRes);
      setCategories(categoriesRes);
      setPayments(paymentsRes);
      setCurrencies(currenciesRes);
      setVendors(vendorsRes);
    } catch {
      // Non-fatal: lookups may fail but list still works
    } finally {
      setLookupLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchLookups();
  }, [fetchExpenses, fetchLookups]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const setFilter = (key: keyof ExpenseFilter, value: number | string | undefined) => {
    if (value === undefined || value === '' || value === null) {
      const { [key]: _, ...rest } = filters;
      setFilters(rest as ExpenseFilter);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const createExpense = async (payload: ExpensePayload) => {
    const res = await expenseApi.createExpense(payload);
    await fetchExpenses();
    return res.data;
  };

  const updateExpense = async (id: number, payload: Partial<ExpensePayload>) => {
    const res = await expenseApi.updateExpense(id, payload);
    await fetchExpenses();
    return res.data;
  };

  const deleteExpense = async (id: number) => {
    await expenseApi.deleteExpense(id);
    await fetchExpenses();
  };

  const refetch = () => fetchExpenses();

  return {
    expenses,
    meta,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilter,
    refetch,
    createExpense,
    updateExpense,
    deleteExpense,
    projects,
    categories,
    payments,
    currencies,
    vendors,
    lookupLoading,
  };
}
