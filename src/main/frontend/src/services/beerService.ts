/**
 * Beer Service
 *
 * Service for managing beer-related operations
 */

import type { AxiosRequestConfig } from 'axios';
import apiService from './api';
import type { BeerDto, BeerPatchDto, PageOfBeerDto } from '../types/beer';
import type { PaginationParams, SortParams, FilterParam } from '@utils/apiUtils';

// API endpoints
const BEER_API_URL = '/api/v1/beers';
const BEER_BY_ID_URL = '/api/v1/beers/{id}';

/**
 * Beer Service class
 * Provides methods for interacting with the Beer API
 */
class BeerService {
  /**
   * Get a paginated list of beers with optional filtering
   *
   * @param pagination - Pagination parameters
   * @param sort - Sorting parameters
   * @param beerName - Optional beer name filter
   * @param beerStyle - Optional beer style filter
   * @param config - Additional Axios request configuration
   * @returns Promise with the paginated beer list
   */
  public async getBeers(
    pagination?: PaginationParams,
    sort?: SortParams,
    beerName?: string,
    beerStyle?: string,
    config?: AxiosRequestConfig
  ): Promise<PageOfBeerDto> {
    const filters: FilterParam[] = [];

    if (beerName) {
      filters.push({ field: 'beerName', value: beerName });
    }

    if (beerStyle) {
      filters.push({ field: 'beerStyle', value: beerStyle });
    }

    return apiService.getPaginatedWithNotification<PageOfBeerDto>(
      BEER_API_URL,
      pagination,
      sort,
      filters,
      config
    );
  }

  /**
   * Get a beer by ID
   *
   * @param id - Beer ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the beer
   */
  public async getBeerById(id: number, config?: AxiosRequestConfig): Promise<BeerDto> {
    return apiService.getByIdWithNotification<BeerDto>(BEER_BY_ID_URL, id, config);
  }

  /**
   * Create a new beer
   *
   * @param beer - Beer data
   * @param config - Additional Axios request configuration
   * @returns Promise with the created beer
   */
  public async createBeer(beer: BeerDto, config?: AxiosRequestConfig): Promise<BeerDto> {
    return apiService.createWithNotification<BeerDto>(BEER_API_URL, beer, config);
  }

  /**
   * Update a beer
   *
   * @param id - Beer ID
   * @param beer - Updated beer data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated beer
   */
  public async updateBeer(
    id: number,
    beer: BeerDto,
    config?: AxiosRequestConfig
  ): Promise<BeerDto> {
    return apiService.updateWithNotification<BeerDto>(BEER_BY_ID_URL, id, beer, config);
  }

  /**
   * Partially update a beer
   *
   * @param id - Beer ID
   * @param beerPatch - Partial beer data
   * @param config - Additional Axios request configuration
   * @returns Promise with the updated beer
   */
  public async patchBeer(
    id: number,
    beerPatch: BeerPatchDto,
    config?: AxiosRequestConfig
  ): Promise<BeerDto> {
    return apiService.partialUpdateWithNotification<BeerDto>(BEER_BY_ID_URL, id, beerPatch, config);
  }

  /**
   * Delete a beer
   *
   * @param id - Beer ID
   * @param config - Additional Axios request configuration
   * @returns Promise with the response
   */
  public async deleteBeer(id: number, config?: AxiosRequestConfig): Promise<void> {
    return apiService.deleteResourceWithNotification<void>(BEER_BY_ID_URL, id, config);
  }
}

// Create a singleton instance
const beerService = new BeerService();

export default beerService;
