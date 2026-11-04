export interface Expense {
  id: number;
  date: string;
  project_id?: number;
  project: string | null;
  category_id?: number;
  category: string | null;
  payment_id?: number;
  payment: string | null;
  currency_id?: number;
  currency: string | null;
  description: string | null;
  vendor_id?: number;
  vendor: string | null;
  amount: number | string | null;
  vat: number | string | null;
  vat_amount: number | string | null;
  cash_deposit: number | string | null;
  received_from_bank: number | string | null;
  received_from_owner: number | string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpensePayload {
  date: string;
  project_id: number;
  category_id: number;
  payment_id: number;
  currency_id: number;
  description?: string;
  vendor_id: number;
  amount: number;
  vat?: number;
  vat_amount?: number;
  cash_deposit?: number;
  received_from_bank?: number;
  received_from_owner?: number;
  status: string;
}

export interface ExpenseFilter {
  project_id?: number;
  category_id?: number;
  payment_id?: number;
  currency_id?: number;
  vendor_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
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

export interface LookupItem {
  id: number;
  name: string;
}
