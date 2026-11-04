import { ApiResponse, Project, ProjectPayload } from '../types';

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

export const projectApi = {
  /**
   * Fetch paginated list of projects
   */
  async getProjects(page: number = 1): Promise<ApiResponse<Project[]>> {
    const res = await fetch(`${API_BASE_URL}/projects?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Project[]>>(res);
  },

  /**
   * Fetch single project by ID
   */
  async getProject(id: number): Promise<{ data: Project }> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Project }>(res);
  },

  /**
   * Create a new project (POST /api/projects)
   */
  async createProject(payload: ProjectPayload): Promise<{ data: Project }> {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Project }>(res);
  },

  /**
   * Update a project (PUT /api/projects/{id})
   */
  async updateProject(id: number, payload: Partial<ProjectPayload>): Promise<{ data: Project }> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Project }>(res);
  },

  /**
   * Delete a project (DELETE /api/projects/{id})
   */
  async deleteProject(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    await handleResponse<void>(res);
  },
};

export { ApiError };

