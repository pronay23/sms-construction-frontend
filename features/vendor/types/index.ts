export interface Vendor {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VendorPayload {
  name: string;
  email: string;
  mobile_number: string;
  address?: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  links?: PaginationLinks;
  meta?: PaginationMeta;
}
