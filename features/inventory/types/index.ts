export interface Inventory {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryPayload {
  name: string;
  description?: string;
}

export interface ProjectInventory {
  id: number;
  projectId: number;
  inventoryId: number;
  detail: string | null;
  date: string;
}

export interface ProjectInventoryPayload {
  project_id: number;
  inventory_id: number;
  detail?: string;
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
