/**
 * Customer Service
 *
 * Service for managing customer-related operations
 */

import type { AxiosRequestConfig } from 'axios';
import apiService from './api';
import type { CustomerDto, PageOfCustomerDto } from '../types/customer';
import type { PaginationParams, SortParams, FilterParam } from '@utils/apiUtils';

// API endpoints
const CUSTOMER_API_URL = '/api/v1/customers';
const CUSTOMER_BY_ID_URL = '/api/v1/customers/{id}';

/**
 * Customer Service class
 * Provides methods for interacting with the Customer API
 */
class CustomerService {
  /**
   * Get all customers
   *
   * @param config - Additional Axios request configuration
   * @returns Promise with the list of customers
   */
  public async getCustomers(config?: AxiosRequestConfig): Promise<CustomerDto[]> {
    return apiService.getWithNotification<CustomerDto[]>(CUSTOMER_API_URL, config);
  }

  /**
   * Get a paginated list of customers
   * Note: The API doesn't natively support pagination for customers,
   * so we implement client-side pagination
   *
   * @param pagination - Pagination parameters
   * @param sort - Sorting parameters
   * @param filters - Filter parameters
   * @param config - Additional Axios request configuration
   * @returns Promise with the paginated customer list
   */
  public async getCustomersPaginated(
    pagination?: PaginationParams,
    sort?: SortParams,
    filters?: FilterParam[],
    config?: AxiosRequestConfig
  ): Promise<PageOfCustomerDto> {
    // Get all customers
    const customers = await this.getCustomers(config);

    // Apply filters if provided
    let filteredCustomers = customers;
    if (filters && filters.length > 0) {
      filteredCustomers = this.applyFilters(customers, filters);
    }

    // Apply sorting if provided
    if (sort && sort.sort) {
      this.applySorting(filteredCustomers, sort);
    }

    // Apply pagination if provided
    const page = pagination?.page || 0;
    const size = pagination?.size || 20;
    const start = page * size;
    const end = start + size;
    const paginatedCustomers = filteredCustomers.slice(start, end);

    // Create a paginated response
    return {
      content: paginatedCustomers,
      pageable: {
        sort: {
          sorted: !!sort?.sort,
          unsorted: !sort?.sort,
          empty: !sort?.sort,
        },
        offset: start,
        pageNumber: page,
        pageSize: size,
        paged: true,
        unpaged: false,
      },
      totalPages: Math.ceil(filteredCustomers.length / size),
      totalElements: filteredCustomers.length,
      last: start + size >= filteredCustomers.length,
      size: size,
      number: page,
      sort: {
        sorted: !!sort?.sort,
        unsorted: !sort?.sort,
        empty: !sort?.sort,
      },
      numberOfElements: paginatedCustomers.length,
      first: page === 0,
      empty: paginatedCustomers.length === 0,
    };
  }

  /**
   * Apply filters to customers
   *
   * @param customers - List of customers
   * @param filters - Filter parameters
   * @returns Filtered list of customers
   */
  private applyFilters(customers: CustomerDto[], filters: FilterParam[]): CustomerDto[] {
    return customers.filter(customer => {
      return filters.every(filter => {
        const field = filter.field;
        const value = filter.value;

        if (field === 'name' && typeof value === 'string') {
          return customer.name.toLowerCase().includes(value.toLowerCase());
        }

        if (field === 'email' && typeof value === 'string') {
          return customer.email?.toLowerCase().includes(value.toLowerCase());
        }

        if (field === 'city' && typeof value === 'string') {
          return customer.city.toLowerCase().includes(value.toLowerCase());
        }

        if (field === 'state' && typeof value === 'string') {
          return customer.state.toLowerCase() === value.toLowerCase();
        }

        return true;
      });
    });
  }

  /**
   * Apply sorting to customers
   *
   * @param customers - List of customers
   * @param sort - Sorting parameters
   */
  private applySorting(customers: CustomerDto[], sort: SortParams): void {
    const field = sort.sort;
    const direction = sort.direction || 'asc';

    if (!field) return;

    customers.sort((a, b) => {
      let valueA: string;
      let valueB: string;

      switch (field) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'email':
          valueA = a.email || '';
          valueB = b.email || '';
          break;
        case 'city':
          valueA = a.city;
          valueB = b.city;
          break;
        case 'state':
          valueA = a.state;
          valueB = b.state;
          break;
        default:
          return 0;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }

  /**
   * Get a customer by ID
   *
   * @param id - Customer ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the customer
   */
  public async getCustomerById(id: number, config?: AxiosRequestConfig): Promise<CustomerDto> {
    return apiService.getByIdWithNotification<CustomerDto>(CUSTOMER_BY_ID_URL, id, config);
  }

  /**
   * Create a new customer
   *
   * @param customer - Customer data
   * @param config - Additional Axios request configuration
   * @returns Promise with the created customer
   */
  public async createCustomer(
    customer: CustomerDto,
    config?: AxiosRequestConfig
  ): Promise<CustomerDto> {
    return apiService.createWithNotification<CustomerDto>(CUSTOMER_API_URL, customer, config);
  }

  /**
   * Update a customer
   *
   * @param id - Customer ID
   * @param customer - Updated customer data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated customer
   */
  public async updateCustomer(
    id: number,
    customer: CustomerDto,
    config?: AxiosRequestConfig
  ): Promise<CustomerDto> {
    return apiService.updateWithNotification<CustomerDto>(CUSTOMER_BY_ID_URL, id, customer, config);
  }

  /**
   * Delete a customer
   *
   * @param id - Customer ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the response
   */
  public async deleteCustomer(id: number, config?: AxiosRequestConfig): Promise<void> {
    return apiService.deleteResourceWithNotification<void>(CUSTOMER_BY_ID_URL, id, config);
  }
}

// Create a singleton instance
const customerService = new CustomerService();

export default customerService;
