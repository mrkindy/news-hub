export interface FilterOption {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface FilterOptionsData {
  categories: FilterOption[];
  sources: FilterOption[];
  authors: FilterOption[];
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptionsData;
}

export interface SearchFilterRequest {
  type: 'categories' | 'sources' | 'authors';
  query: string;
  limit?: number;
}

export interface SearchFilterResponse {
  success: boolean;
  data: FilterOption[];
}
