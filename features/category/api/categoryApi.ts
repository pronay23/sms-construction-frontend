import { ApiResponse, Category, CategoryPayload } from '../types';

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

export const categoryApi = {
  /**
   * Fetch paginated list of categories
   */
  async getCategories(page: number = 1): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${API_BASE_URL}/categories?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Category[]>>(res);
  },

  /**
   * Fetch a single category by ID
   */
  async getCategory(id: number): Promise<{ data: Category }> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Category }>(res);
  },

  /**
   * Create a new category (POST /api/categories)
   */
  async createCategory(payload: CategoryPayload): Promise<{ data: Category }> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Category }>(res);
  },

  /**
   * Update a category (PUT /api/categories/{id})
   */
  async updateCategory(id: number, payload: Partial<CategoryPayload>): Promise<{ data: Category }> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Category }>(res);
  },

  /**
   * Delete a category (DELETE /api/categories/{id})
   */
  async deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },
};

export { ApiError };

