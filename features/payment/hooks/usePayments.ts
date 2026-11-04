'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, paymentApi } from '../api/paymentApi';
import { Payment, PaymentPayload, PaginationMeta } from '../types';

export function usePayments(initialPage: number = 1) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentApi.getPayments(page);
      setPayments(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch payments');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const createPayment = async (payload: PaymentPayload) => {
    const res = await paymentApi.createPayment(payload);
    await fetchPayments();
    return res.data;
  };

  const updatePayment = async (id: number, payload: Partial<PaymentPayload>) => {
    const res = await paymentApi.updatePayment(id, payload);
    await fetchPayments();
    return res.data;
  };

  const deletePayment = async (id: number) => {
    await paymentApi.deletePayment(id);
    await fetchPayments();
  };

  return {
    payments,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
  };
}
