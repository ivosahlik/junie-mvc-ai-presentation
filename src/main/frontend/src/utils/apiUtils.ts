/**
 * API Utility Functions
 *
 * This module provides utility functions for common API operations.
 */

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

/**
 * Sorting parameters
 */
export interface SortParams {
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Filter parameter
 */
export interface FilterParam {
  field: string;
  value: string | number | boolean | null;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin';
}

/**
 * Combined query parameters
 */
export interface QueryParams extends PaginationParams, SortParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Create pagination parameters
 *
 * @param page - Page number (0-based)
 * @param size - Page size
 * @returns Pagination parameters object
 */
export function createPaginationParams(page: number = 0, size: number = 10): PaginationParams {
  return { page, size };
}

/**
 * Create sorting parameters
 *
 * @param sort - Field to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorting parameters object
 */
export function createSortParams(sort: string, direction: 'asc' | 'desc' = 'asc'): SortParams {
  return { sort, direction };
}

/**
 * Create a filter parameter
 *
 * @param field - Field to filter by
 * @param value - Filter value
 * @param operator - Filter operator (default: 'eq')
 * @returns Filter parameter object
 */
export function createFilterParam(
  field: string,
  value: string | number | boolean | null,
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin' = 'eq'
): FilterParam {
  return { field, value, operator };
}

/**
 * Convert filter parameters to query parameters
 *
 * @param filters - Array of filter parameters
 * @returns Query parameters object
 */
export function filtersToQueryParams(filters: FilterParam[]): Record<string, string> {
  const params: Record<string, string> = {};

  filters.forEach(filter => {
    if (filter.operator === 'eq' || !filter.operator) {
      params[filter.field] = String(filter.value);
    } else {
      params[`${filter.field}_${filter.operator}`] = String(filter.value);
    }
  });

  return params;
}

/**
 * Combine pagination, sorting, and filter parameters
 *
 * @param pagination - Pagination parameters
 * @param sort - Sorting parameters
 * @param filters - Array of filter parameters
 * @returns Combined query parameters
 */
export function createQueryParams(
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: FilterParam[]
): QueryParams {
  const params: QueryParams = {
    ...(pagination || {}),
    ...(sort || {}),
  };

  if (filters && filters.length > 0) {
    const filterParams = filtersToQueryParams(filters);
    Object.assign(params, filterParams);
  }

  return params;
}

/**
 * Format URL with path parameters
 *
 * @param url - URL template with placeholders (e.g., '/api/users/{id}')
 * @param params - Path parameters object (e.g., { id: 123 })
 * @returns Formatted URL with path parameters replaced
 */
export function formatUrl(url: string, params: Record<string, string | number>): string {
  let formattedUrl = url;

  Object.entries(params).forEach(([key, value]) => {
    formattedUrl = formattedUrl.replace(`{${key}}`, String(value));
  });

  return formattedUrl;
}

/**
 * Create a URL with query parameters
 *
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL with query parameters
 */
export function createUrlWithQueryParams(baseUrl: string, params: QueryParams): string {
  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.pathname + url.search;
}
