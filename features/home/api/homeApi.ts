import { ApiResponse, ApiErrorResponse, Home, HomePayload } from '../types';

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
      const errorJson: ApiErrorResponse = await response.json();
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

export const homeApi = {
  /**
   * Fetch paginated list of homes with optional filter parameters
   */
  async getHomes(params?: { page?: number; status?: string }): Promise<ApiResponse<Home[]>> {
    const url = new URL(`${API_BASE_URL}/homes`);

    if (params?.page) {
      url.searchParams.set('page', String(params.page));
    }
    if (params?.status && params.status !== 'all') {
      url.searchParams.set('status', params.status);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Home[]>>(res);
  },

  /**
   * Fetch a single home by ID or slug
   */
  async getHome(id: number | string): Promise<{ data: Home }> {
    const res = await fetch(`${API_BASE_URL}/homes/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    return handleResponse<{ data: Home }>(res);
  },

  /**
   * Create a new home record
   */
  async createHome(payload: HomePayload): Promise<{ data: Home }> {
    const res = await fetch(`${API_BASE_URL}/homes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Home }>(res);
  },

  /**
   * Update an existing home record
   */
  async updateHome(id: number, payload: Partial<HomePayload>): Promise<{ data: Home }> {
    const res = await fetch(`${API_BASE_URL}/homes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Home }>(res);
  },

  /**
   * Delete a home record
   */
  async deleteHome(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/homes/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    await handleResponse<void>(res);
  },
};

export { ApiError };

