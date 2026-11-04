import { LoginPayload, LoginResponse, LogoutResponse } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:8000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // Non-JSON response
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const employeeAuthApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/employee/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<LoginResponse>(res);
  },

  async logout(): Promise<LogoutResponse> {
    const res = await fetch(`${API_BASE_URL}/employee/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    return handleResponse<LogoutResponse>(res);
  },
};
