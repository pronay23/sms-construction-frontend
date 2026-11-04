'use client';

import { useCallback, useEffect, useState } from 'react';
import { employeeAuthApi } from './employeeAuthApi';
import {
  AuthEmployee,
  AuthState,
  LoginPayload,
} from './types';

const STORAGE_KEY = 'employee_auth';

function loadStoredEmployee(): AuthEmployee | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthEmployee;
  } catch {
    return null;
  }
}

export function useEmployeeAuth() {
  const [employee, setEmployee] = useState<AuthEmployee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = loadStoredEmployee();
    setEmployee(stored);
    setLoading(false);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthEmployee> => {
      const response = await employeeAuthApi.login(payload);
      const authEmployee = response.data;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authEmployee));
      setEmployee(authEmployee);
      return authEmployee;
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await employeeAuthApi.logout();
    } catch {
      // Ignore logout API errors; still clear local state.
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setEmployee(null);
  }, []);

  return {
    employee,
    loading,
    isAuthenticated: Boolean(employee),
    login,
    logout,
  } as AuthState & { loading: boolean; login: (p: LoginPayload) => Promise<AuthEmployee>; logout: () => Promise<void> };
}
