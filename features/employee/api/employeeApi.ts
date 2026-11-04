import { ApiResponse, Employee, EmployeePayload } from '../types';

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

export const employeeApi = {
  /**
   * Fetch paginated list of employees
   */
  async getEmployees(page: number = 1): Promise<ApiResponse<Employee[]>> {
    const res = await fetch(`${API_BASE_URL}/employees?page=${page}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<ApiResponse<Employee[]>>(res);
  },

  /**
   * Fetch a single employee by employee_id
   */
  async getEmployee(employee_id: string): Promise<{ data: Employee }> {
    const res = await fetch(`${API_BASE_URL}/employees/${encodeURIComponent(employee_id)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    return handleResponse<{ data: Employee }>(res);
  },

  /**
   * Create a new employee (POST /api/employees)
   */
  async createEmployee(payload: EmployeePayload): Promise<{ data: Employee }> {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<{ data: Employee }>(res);
  },

  /**
   * Update an employee (PUT /api/employees/{employee_id})
   */
  async updateEmployee(
    employee_id: string,
    payload: Partial<EmployeePayload>,
  ): Promise<{ data: Employee }> {
    const res = await fetch(
      `${API_BASE_URL}/employees/${encodeURIComponent(employee_id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    return handleResponse<{ data: Employee }>(res);
  },

  /**
   * Delete an employee (DELETE /api/employees/{employee_id})
   */
  async deleteEmployee(employee_id: string): Promise<void> {
    const res = await fetch(
      `${API_BASE_URL}/employees/${encodeURIComponent(employee_id)}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      },
    );

    await handleResponse<void>(res);
  },
};

export { ApiError };
