/**
 * Beer Order Service
 *
 * Service for managing beer order-related operations
 */

import type { AxiosRequestConfig } from 'axios';
import apiService from './api';
import type {
  BeerOrderDto,
  BeerOrderPatchDto,
  BeerOrderShipmentDto,
  PageOfBeerOrderDto,
} from '../types/beerOrder';
import type { PaginationParams, SortParams, FilterParam } from '@utils/apiUtils';

// API endpoints
const BEER_ORDER_API_URL = '/api/v1/beer-orders';
const BEER_ORDER_BY_ID_URL = '/api/v1/beer-orders/{id}';
const BEER_ORDER_SHIPMENTS_URL = '/api/v1/beer-orders/{beerOrderId}/shipments';
const BEER_ORDER_SHIPMENT_BY_ID_URL = '/api/v1/beer-orders/{beerOrderId}/shipments/{shipmentId}';

/**
 * Beer Order Service class
 * Provides methods for interacting with the Beer Order API
 */
class BeerOrderService {
  /**
   * Get all beer orders
   *
   * @param config - Additional Axios request configuration
   * @returns Promise with the list of beer orders
   */
  public async getBeerOrders(config?: AxiosRequestConfig): Promise<BeerOrderDto[]> {
    return apiService.getWithNotification<BeerOrderDto[]>(BEER_ORDER_API_URL, config);
  }

  /**
   * Get a paginated list of beer orders
   * Note: The API doesn't natively support pagination for beer orders,
   * so we implement client-side pagination
   *
   * @param pagination - Pagination parameters
   * @param sort - Sorting parameters
   * @param filters - Filter parameters
   * @param config - Additional Axios request configuration
   * @returns Promise with the paginated beer order list
   */
  public async getBeerOrdersPaginated(
    pagination?: PaginationParams,
    sort?: SortParams,
    filters?: FilterParam[],
    config?: AxiosRequestConfig
  ): Promise<PageOfBeerOrderDto> {
    // Get all beer orders
    const beerOrders = await this.getBeerOrders(config);

    // Apply filters if provided
    let filteredBeerOrders = beerOrders;
    if (filters && filters.length > 0) {
      filteredBeerOrders = this.applyFilters(beerOrders, filters);
    }

    // Apply sorting if provided
    if (sort && sort.sort) {
      this.applySorting(filteredBeerOrders, sort);
    }

    // Apply pagination if provided
    const page = pagination?.page || 0;
    const size = pagination?.size || 20;
    const start = page * size;
    const end = start + size;
    const paginatedBeerOrders = filteredBeerOrders.slice(start, end);

    // Create a paginated response
    return {
      content: paginatedBeerOrders,
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
      totalPages: Math.ceil(filteredBeerOrders.length / size),
      totalElements: filteredBeerOrders.length,
      last: start + size >= filteredBeerOrders.length,
      size: size,
      number: page,
      sort: {
        sorted: !!sort?.sort,
        unsorted: !sort?.sort,
        empty: !sort?.sort,
      },
      numberOfElements: paginatedBeerOrders.length,
      first: page === 0,
      empty: paginatedBeerOrders.length === 0,
    };
  }

  /**
   * Apply filters to beer orders
   *
   * @param beerOrders - List of beer orders
   * @param filters - Filter parameters
   * @returns Filtered list of beer orders
   */
  private applyFilters(beerOrders: BeerOrderDto[], filters: FilterParam[]): BeerOrderDto[] {
    return beerOrders.filter(beerOrder => {
      return filters.every(filter => {
        const field = filter.field;
        const value = filter.value;

        if (field === 'customerRef' && typeof value === 'string') {
          return beerOrder.customerRef?.toLowerCase().includes(value.toLowerCase());
        }

        if (field === 'status' && typeof value === 'string') {
          return beerOrder.status?.toLowerCase() === value.toLowerCase();
        }

        return true;
      });
    });
  }

  /**
   * Apply sorting to beer orders
   *
   * @param beerOrders - List of beer orders
   * @param sort - Sorting parameters
   */
  private applySorting(beerOrders: BeerOrderDto[], sort: SortParams): void {
    const field = sort.sort;
    const direction = sort.direction || 'asc';

    if (!field) return;

    beerOrders.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (field) {
        case 'id':
          valueA = a.id || 0;
          valueB = b.id || 0;
          break;
        case 'customerRef':
          valueA = a.customerRef || '';
          valueB = b.customerRef || '';
          break;
        case 'status':
          valueA = a.status || '';
          valueB = b.status || '';
          break;
        case 'createdDate':
          valueA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
          valueB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
          break;
        case 'paymentAmount':
          valueA = a.paymentAmount || 0;
          valueB = b.paymentAmount || 0;
          break;
        default:
          return 0;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }

  /**
   * Get a beer order by ID
   *
   * @param id - Beer order ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the beer order
   */
  public async getBeerOrderById(id: number, config?: AxiosRequestConfig): Promise<BeerOrderDto> {
    return apiService.getByIdWithNotification<BeerOrderDto>(BEER_ORDER_BY_ID_URL, id, config);
  }

  /**
   * Create a new beer order
   *
   * @param beerOrder - Beer order data
   * @param config - Additional Axios request configuration
   * @returns Promise with the created beer order
   */
  public async createBeerOrder(
    beerOrder: BeerOrderDto,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderDto> {
    return apiService.createWithNotification<BeerOrderDto>(BEER_ORDER_API_URL, beerOrder, config);
  }

  /**
   * Update a beer order
   *
   * @param id - Beer order ID
   * @param beerOrder - Updated beer order data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated beer order
   */
  public async updateBeerOrder(
    id: number,
    beerOrder: BeerOrderDto,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderDto> {
    return apiService.updateWithNotification<BeerOrderDto>(
      BEER_ORDER_BY_ID_URL,
      id,
      beerOrder,
      config
    );
  }

  /**
   * Delete a beer order
   *
   * @param id - Beer order ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the response
   */
  public async deleteBeerOrder(id: number, config?: AxiosRequestConfig): Promise<void> {
    return apiService.deleteResourceWithNotification<void>(BEER_ORDER_BY_ID_URL, id, config);
  }

  /**
   * Update beer order status
   *
   * @param id - Beer order ID
   * @param status - New status
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated beer order
   */
  public async updateBeerOrderStatus(
    id: number,
    status: string,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderDto> {
    const beerOrderPatch: BeerOrderPatchDto = {
      status,
    };
    return apiService.partialUpdateWithNotification<BeerOrderDto>(
      BEER_ORDER_BY_ID_URL,
      id,
      beerOrderPatch,
      config
    );
  }

  /**
   * Get all shipments for a beer order
   *
   * @param beerOrderId - Beer order ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the list of shipments
   */
  public async getBeerOrderShipments(
    beerOrderId: number,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderShipmentDto[]> {
    const url = BEER_ORDER_SHIPMENTS_URL.replace('{beerOrderId}', beerOrderId.toString());
    return apiService.getWithNotification<BeerOrderShipmentDto[]>(url, config);
  }

  /**
   * Get a specific shipment for a beer order
   *
   * @param beerOrderId - Beer order ID
   * @param shipmentId - Shipment ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the shipment
   */
  public async getBeerOrderShipmentById(
    beerOrderId: number,
    shipmentId: number,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderShipmentDto> {
    const url = BEER_ORDER_SHIPMENT_BY_ID_URL.replace(
      '{beerOrderId}',
      beerOrderId.toString()
    ).replace('{shipmentId}', shipmentId.toString());
    return apiService.getWithNotification<BeerOrderShipmentDto>(url, config);
  }

  /**
   * Create a new shipment for a beer order
   *
   * @param beerOrderId - Beer order ID
   * @param shipment - Shipment data
   * @param config - Additional Axios request configuration
   * @returns Promise with the created shipment
   */
  public async createBeerOrderShipment(
    beerOrderId: number,
    shipment: BeerOrderShipmentDto,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderShipmentDto> {
    const url = BEER_ORDER_SHIPMENTS_URL.replace('{beerOrderId}', beerOrderId.toString());
    return apiService.createWithNotification<BeerOrderShipmentDto>(url, shipment, config);
  }

  /**
   * Update a shipment for a beer order
   *
   * @param beerOrderId - Beer order ID
   * @param shipmentId - Shipment ID
   * @param shipment - Updated shipment data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated shipment
   */
  public async updateBeerOrderShipment(
    beerOrderId: number,
    shipmentId: number,
    shipment: BeerOrderShipmentDto,
    config?: AxiosRequestConfig
  ): Promise<BeerOrderShipmentDto> {
    const url = BEER_ORDER_SHIPMENT_BY_ID_URL.replace(
      '{beerOrderId}',
      beerOrderId.toString()
    ).replace('{shipmentId}', shipmentId.toString());
    return apiService.updateWithNotification<BeerOrderShipmentDto>(
      url,
      shipmentId,
      shipment,
      config
    );
  }

  /**
   * Delete a shipment for a beer order
   *
   * @param beerOrderId - Beer order ID
   * @param shipmentId - Shipment ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the response
   */
  public async deleteBeerOrderShipment(
    beerOrderId: number,
    shipmentId: number,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const url = BEER_ORDER_SHIPMENT_BY_ID_URL.replace(
      '{beerOrderId}',
      beerOrderId.toString()
    ).replace('{shipmentId}', shipmentId.toString());
    return apiService.deleteWithNotification<void>(url, config);
  }
}

// Create a singleton instance
const beerOrderService = new BeerOrderService();

export default beerOrderService;
