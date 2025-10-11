import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getApiBaseUrl } from '@utils/env';
import { handleApiError, handleAndNotifyError } from '@utils/errorHandler';
import { apiLogger } from '@utils/logger';
import type { PaginationParams, SortParams, FilterParam } from '@utils/apiUtils';
import { createQueryParams, formatUrl, createUrlWithQueryParams } from '@utils/apiUtils';

/**
 * Base API configuration
 */
const API_BASE_URL = getApiBaseUrl();

/**
 * Configuration for the Axios instance
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds
};

/**
 * Create a base API service with interceptors for authentication
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create(axiosConfig);
    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication and logging
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Get the token from localStorage or another secure storage
        const token = localStorage.getItem('auth_token');

        // If token exists, add it to the request headers
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log the request in development
        if (process.env.NODE_ENV !== 'production') {
          const method = config.method?.toUpperCase() || 'UNKNOWN';
          const url = config.url || 'UNKNOWN';

          apiLogger.info(`${method} ${url}`);

          if (config.params) {
            apiLogger.debug('Request Params:', config.params);
          }

          if (config.data) {
            apiLogger.debug('Request Data:', config.data);
          }
        }

        return config;
      },
      error => {
        // Log request errors
        apiLogger.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling common responses and logging
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log the response in development
        if (process.env.NODE_ENV !== 'production') {
          const method = response.config.method?.toUpperCase() || 'UNKNOWN';
          const url = response.config.url || 'UNKNOWN';
          const status = response.status;

          apiLogger.info(`${method} ${url} ${status}`);
          apiLogger.debug('Response Data:', response.data);
        }

        return response;
      },
      error => {
        // Log response errors
        if (error.response) {
          const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
          const url = error.config?.url || 'UNKNOWN';
          const status = error.response.status;

          apiLogger.error(`${method} ${url} ${status}`);
          apiLogger.debug('Response Error Data:', error.response.data);
        } else {
          apiLogger.error('Response Error:', error);
        }

        // Handle authentication errors (401)
        if (error.response && error.response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          // Redirect to login page or show authentication modal
          // window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Get the Axios instance
   */
  public getApi(): AxiosInstance {
    return this.api;
  }

  /**
   * Make a GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a GET request with error notification
   */
  public async getWithNotification<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleAndNotifyError(error);
    }
  }

  /**
   * Make a POST request with error notification
   */
  public async postWithNotification<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleAndNotifyError(error);
    }
  }

  /**
   * Make a PUT request with error notification
   */
  public async putWithNotification<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleAndNotifyError(error);
    }
  }

  /**
   * Make a PATCH request with error notification
   */
  public async patchWithNotification<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleAndNotifyError(error);
    }
  }

  /**
   * Make a DELETE request with error notification
   */
  public async deleteWithNotification<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleAndNotifyError(error);
    }
  }

  /**
   * Get a paginated list of resources
   *
   * @param url - Base URL for the resource
   * @param pagination - Pagination parameters
   * @param sort - Sorting parameters
   * @param filters - Filter parameters
   * @param config - Additional Axios request configuration
   * @returns Promise with the paginated response
   */
  public async getPaginated<T>(
    url: string,
    pagination?: PaginationParams,
    sort?: SortParams,
    filters?: FilterParam[],
    config?: AxiosRequestConfig
  ): Promise<T> {
    const params = createQueryParams(pagination, sort, filters);
    const fullUrl = createUrlWithQueryParams(url, params);
    return this.get<T>(fullUrl, config);
  }

  /**
   * Get a paginated list of resources with error notification
   *
   * @param url - Base URL for the resource
   * @param pagination - Pagination parameters
   * @param sort - Sorting parameters
   * @param filters - Filter parameters
   * @param config - Additional Axios request configuration
   * @returns Promise with the paginated response
   */
  public async getPaginatedWithNotification<T>(
    url: string,
    pagination?: PaginationParams,
    sort?: SortParams,
    filters?: FilterParam[],
    config?: AxiosRequestConfig
  ): Promise<T> {
    const params = createQueryParams(pagination, sort, filters);
    const fullUrl = createUrlWithQueryParams(url, params);
    return this.getWithNotification<T>(fullUrl, config);
  }

  /**
   * Get a resource by ID
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the resource
   */
  public async getById<T>(
    url: string,
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.get<T>(fullUrl, config);
  }

  /**
   * Get a resource by ID with error notification
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the resource
   */
  public async getByIdWithNotification<T>(
    url: string,
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.getWithNotification<T>(fullUrl, config);
  }

  /**
   * Create a resource
   *
   * @param url - URL for the resource
   * @param data - Resource data
   * @param config - Additional Axios request configuration
   * @returns Promise with the created resource
   */
  public async create<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.post<T>(url, data, config);
  }

  /**
   * Create a resource with error notification
   *
   * @param url - URL for the resource
   * @param data - Resource data
   * @param config - Additional Axios request configuration
   * @returns Promise with the created resource
   */
  public async createWithNotification<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.postWithNotification<T>(url, data, config);
  }

  /**
   * Update a resource
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param data - Resource data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated resource
   */
  public async update<T>(
    url: string,
    id: string | number,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.put<T>(fullUrl, data, config);
  }

  /**
   * Update a resource with error notification
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param data - Resource data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated resource
   */
  public async updateWithNotification<T>(
    url: string,
    id: string | number,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.putWithNotification<T>(fullUrl, data, config);
  }

  /**
   * Partially update a resource
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param data - Partial resource data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated resource
   */
  public async partialUpdate<T>(
    url: string,
    id: string | number,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.patch<T>(fullUrl, data, config);
  }

  /**
   * Partially update a resource with error notification
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param data - Partial resource data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated resource
   */
  public async partialUpdateWithNotification<T>(
    url: string,
    id: string | number,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.patchWithNotification<T>(fullUrl, data, config);
  }

  /**
   * Delete a resource
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the response
   */
  public async deleteResource<T>(
    url: string,
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.delete<T>(fullUrl, config);
  }

  /**
   * Delete a resource with error notification
   *
   * @param url - URL template with {id} placeholder
   * @param id - Resource ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the response
   */
  public async deleteResourceWithNotification<T>(
    url: string,
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = formatUrl(url, { id });
    return this.deleteWithNotification<T>(fullUrl, config);
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;
