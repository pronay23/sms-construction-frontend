'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, currencyApi } from '../api/currencyApi';
import { Currency, CurrencyPayload, PaginationMeta } from '../types';

export function useCurrencies(initialPage: number = 1) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await currencyApi.getCurrencies(page);
      setCurrencies(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch currencies');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const createCurrency = async (payload: CurrencyPayload) => {
    const res = await currencyApi.createCurrency(payload);
    await fetchCurrencies();
    return res.data;
  };

  const updateCurrency = async (id: number, payload: Partial<CurrencyPayload>) => {
    const res = await currencyApi.updateCurrency(id, payload);
    await fetchCurrencies();
    return res.data;
  };

  const deleteCurrency = async (id: number) => {
    setError(null);
    try {
      await currencyApi.deleteCurrency(id);
      await fetchCurrencies();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message.toLowerCase() : '';

      if (message.includes('foreign key') || message.includes('expenses_currency_id_foreign')) {
        setError('This currency cannot be deleted because it is used by one or more expenses.');
      } else if (err instanceof ApiError || err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete currency');
      }
    }
  };

  return {
    currencies,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
  };
}
