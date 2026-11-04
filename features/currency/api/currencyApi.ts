import { ApiResponse, Currency, CurrencyPayload } from '../types';

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

export const currencyApi = {
  /**
   * Fetch paginated list of currencies
   */
  async getCurrencies(page: number = 1): Promise<ApiResponse<Currency[]>> {
    const res = await fetch(`${API_BASE_URL}/currencies?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Currency[]>>(res);
  },

  /**
   * Fetch a single currency by ID
   */
  async getCurrency(id: number): Promise<{ data: Currency }> {
    const res = await fetch(`${API_BASE_URL}/currencies/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Currency }>(res);
  },

  /**
   * Create a new currency (POST /api/currencies)
   */
  async createCurrency(payload: CurrencyPayload): Promise<{ data: Currency }> {
    const res = await fetch(`${API_BASE_URL}/currencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Currency }>(res);
  },

  /**
   * Update a currency (PUT /api/currencies/{id})
   */
  async updateCurrency(id: number, payload: Partial<CurrencyPayload>): Promise<{ data: Currency }> {
    const res = await fetch(`${API_BASE_URL}/currencies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Currency }>(res);
  },

  /**
   * Delete a currency (DELETE /api/currencies/{id})
   */
  async deleteCurrency(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/currencies/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },
};

export { ApiError };
