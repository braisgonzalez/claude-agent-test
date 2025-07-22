// Common API types
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  timestamp: string;
  path?: string;
}

export interface ValidationError extends ApiError {
  fieldErrors?: Array<{
    field: string;
    message: string;
  }>;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  content: T[];
  page: PageInfo;
}