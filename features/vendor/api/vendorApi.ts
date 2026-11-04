import { ApiResponse, Vendor, VendorPayload } from '../types';

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

export const vendorApi = {
  /**
   * Fetch paginated list of vendors
   */
  async getVendors(page: number = 1): Promise<ApiResponse<Vendor[]>> {
    const res = await fetch(`${API_BASE_URL}/vendors?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Vendor[]>>(res);
  },

  /**
   * Fetch a single vendor by ID
   */
  async getVendor(id: number): Promise<{ data: Vendor }> {
    const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Vendor }>(res);
  },

  /**
   * Create a new vendor (POST /api/vendors)
   */
  async createVendor(payload: VendorPayload): Promise<{ data: Vendor }> {
    const res = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Vendor }>(res);
  },

  /**
   * Update a vendor (PUT /api/vendors/{id})
   */
  async updateVendor(id: number, payload: Partial<VendorPayload>): Promise<{ data: Vendor }> {
    const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Vendor }>(res);
  },

  /**
   * Delete a vendor (DELETE /api/vendors/{id})
   */
  async deleteVendor(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },
};

export { ApiError };
