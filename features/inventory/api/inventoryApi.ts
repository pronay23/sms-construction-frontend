import {
  ApiResponse,
  Inventory,
  InventoryPayload,
  ProjectInventory,
  ProjectInventoryPayload,
} from '../types';

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

export const inventoryApi = {
  /**
   * Fetch paginated list of inventories
   */
  async getInventories(page: number = 1): Promise<ApiResponse<Inventory[]>> {
    const res = await fetch(`${API_BASE_URL}/inventories?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Inventory[]>>(res);
  },

  /**
   * Fetch a single inventory by ID
   */
  async getInventory(id: number): Promise<{ data: Inventory }> {
    const res = await fetch(`${API_BASE_URL}/inventories/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Inventory }>(res);
  },

  /**
   * Create a new inventory (POST /api/inventories)
   */
  async createInventory(payload: InventoryPayload): Promise<{ data: Inventory }> {
    const res = await fetch(`${API_BASE_URL}/inventories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Inventory }>(res);
  },

  /**
   * Update an inventory (PUT /api/inventories/{id})
   */
  async updateInventory(
    id: number,
    payload: Partial<InventoryPayload>,
  ): Promise<{ data: Inventory }> {
    const res = await fetch(`${API_BASE_URL}/inventories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Inventory }>(res);
  },

  /**
   * Delete an inventory (DELETE /api/inventories/{id})
   */
  async deleteInventory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/inventories/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },

  async getProjectInventories(page: number = 1): Promise<ApiResponse<ProjectInventory[]>> {
    const res = await fetch(`${API_BASE_URL}/project-inventories?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    const response = await handleResponse<
      ApiResponse<{
        id: number;
        project_id: number;
        inventory_id: number;
        detail: string | null;
        date: string;
      }[]>
    >(res);

    return {
      ...response,
      data: response.data.map((item) => ({
        id: item.id,
        projectId: item.project_id,
        inventoryId: item.inventory_id,
        detail: item.detail,
        date: item.date,
      })),
    };
  },

  async createProjectInventory(
    payload: ProjectInventoryPayload,
  ): Promise<{
    data: { id: number; project_id: number; inventory_id: number; detail: string | null; date: string };
  }> {
    const res = await fetch(`${API_BASE_URL}/project-inventories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(res);
  },
};

export { ApiError };
