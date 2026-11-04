export type HomeStatus = 'planning' | 'under_construction' | 'completed' | 'sold';

export interface Home {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  price: number | string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  status: HomeStatus | string;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HomePayload {
  title: string;
  slug?: string;
  description?: string;
  location?: string;
  price?: number | string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  status?: HomeStatus | string;
  is_featured?: boolean;
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

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

