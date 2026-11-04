export interface AuthEmployee {
  employee_id: string;
  name: string;
  email: string;
}

export interface LoginPayload {
  employee_id: string;
  password: string;
}

export interface LoginResponse {
  data: AuthEmployee;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthState {
  employee: AuthEmployee | null;
  isAuthenticated: boolean;
}
