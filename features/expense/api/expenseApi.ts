import { ApiResponse, Expense, ExpensePayload, ExpenseFilter, LookupItem } from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:8000/api';

class ApiError extends Error {
  errors?: Record<string, string[]>;
  status: number;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    let errors: Record<string, string[]> | undefined;

    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorMessage;
      errors = errorJson.errors;
    } catch {
      // Non-JSON response
    }

    throw new ApiError(errorMessage, response.status, errors);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

function buildQueryString(filters: ExpenseFilter, page: number): string {
  const params = new URLSearchParams({ page: String(page) });

  if (filters.project_id) params.append('project_id', String(filters.project_id));
  if (filters.category_id) params.append('category_id', String(filters.category_id));
  if (filters.payment_id) params.append('payment_id', String(filters.payment_id));
  if (filters.currency_id) params.append('currency_id', String(filters.currency_id));
  if (filters.vendor_id) params.append('vendor_id', String(filters.vendor_id));
  if (filters.status) params.append('status', filters.status);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);

  return params.toString();
}

export const expenseApi = {
  /**
   * Fetch paginated list of expenses
   */
  async getExpenses(page: number = 1, filters: ExpenseFilter = {}): Promise<ApiResponse<Expense[]>> {
    const res = await fetch(`${API_BASE_URL}/expenses?${buildQueryString(filters, page)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Expense[]>>(res);
  },

  /**
   * Fetch a single expense by ID
   */
  async getExpense(id: number): Promise<{ data: Expense }> {
    const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Expense }>(res);
  },

  /**
   * Create a new expense (POST /api/expenses)
   */
  async createExpense(payload: ExpensePayload): Promise<{ data: Expense }> {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Expense }>(res);
  },

  /**
   * Update an expense (PUT /api/expenses/{id})
   */
  async updateExpense(id: number, payload: Partial<ExpensePayload>): Promise<{ data: Expense }> {
    const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Expense }>(res);
  },

  /**
   * Delete an expense (DELETE /api/expenses/{id})
   */
  async deleteExpense(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },

  /**
   * Fetch lookup options for dropdowns
   */
  async getProjects(): Promise<LookupItem[]> {
    const res = await fetch(`${API_BASE_URL}/projects?page=1`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await handleResponse<ApiResponse<any>>(res);
    return data.data.map((item: any) => ({ id: item.id, name: item.name }));
  },

  async getCategories(): Promise<LookupItem[]> {
    const res = await fetch(`${API_BASE_URL}/categories?page=1`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await handleResponse<ApiResponse<any>>(res);
    return data.data.map((item: any) => ({ id: item.id, name: item.name }));
  },

  async getPayments(): Promise<LookupItem[]> {
    const res = await fetch(`${API_BASE_URL}/payments?page=1`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await handleResponse<ApiResponse<any>>(res);
    return data.data.map((item: any) => ({ id: item.id, name: item.name }));
  },

  async getCurrencies(): Promise<LookupItem[]> {
    const res = await fetch(`${API_BASE_URL}/currencies?page=1`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await handleResponse<ApiResponse<any>>(res);
    return data.data.map((item: any) => ({ id: item.id, name: item.name }));
  },

  async getVendors(): Promise<LookupItem[]> {
    const res = await fetch(`${API_BASE_URL}/vendors?page=1`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await handleResponse<ApiResponse<any>>(res);
    return data.data.map((item: any) => ({ id: item.id, name: item.name }));
  },
};

export { ApiError };
