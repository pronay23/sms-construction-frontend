import { ApiResponse, Payment, PaymentPayload } from '../types';

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

export const paymentApi = {
  /**
   * Fetch paginated list of payments
   */
  async getPayments(page: number = 1): Promise<ApiResponse<Payment[]>> {
    const res = await fetch(`${API_BASE_URL}/payments?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Payment[]>>(res);
  },

  /**
   * Fetch a single payment by ID
   */
  async getPayment(id: number): Promise<{ data: Payment }> {
    const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Payment }>(res);
  },

  /**
   * Create a new payment (POST /api/payments)
   */
  async createPayment(payload: PaymentPayload): Promise<{ data: Payment }> {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Payment }>(res);
  },

  /**
   * Update a payment (PUT /api/payments/{id})
   */
  async updatePayment(id: number, payload: Partial<PaymentPayload>): Promise<{ data: Payment }> {
    const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Payment }>(res);
  },

  /**
   * Delete a payment (DELETE /api/payments/{id})
   */
  async deletePayment(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },
};

export { ApiError };
