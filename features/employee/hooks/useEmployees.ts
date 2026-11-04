'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, employeeApi } from '../api/employeeApi';
import { Employee, EmployeePayload, PaginationMeta } from '../types';

export function useEmployees(initialPage: number = 1) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getEmployees(page);
      setEmployees(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch employees');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = async (payload: EmployeePayload) => {
    const res = await employeeApi.createEmployee(payload);
    await fetchEmployees();
    return res.data;
  };

  const updateEmployee = async (
    employee_id: string,
    payload: Partial<EmployeePayload>,
  ) => {
    const res = await employeeApi.updateEmployee(employee_id, payload);
    await fetchEmployees();
    return res.data;
  };

  const deleteEmployee = async (employee_id: string) => {
    await employeeApi.deleteEmployee(employee_id);
    await fetchEmployees();
  };

  return {
    employees,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
