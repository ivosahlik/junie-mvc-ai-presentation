/**
 * Beer-related type definitions
 */

/**
 * Beer DTO interface
 * Represents a beer entity in the system
 */
export interface BeerDto {
  id?: number;
  version?: number;
  createdDate?: string;
  updateDate?: string;
  beerName: string;
  beerStyle: string;
  upc: string;
  quantityOnHand: number;
  price: number;
  description?: string;
  imageUrl?: string;
}

/**
 * Beer Patch DTO interface
 * Used for partial updates to a beer entity
 */
export interface BeerPatchDto {
  id?: number;
  version?: number;
  createdDate?: string;
  updateDate?: string;
  beerName?: string;
  beerStyle?: string;
  upc?: string;
  quantityOnHand?: number;
  price?: number;
  description?: string;
  imageUrl?: string;
}

/**
 * Page interface
 * Generic pagination structure
 */
export interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Page of Beer DTO interface
 * Represents a paginated list of beers
 */
export type PageOfBeerDto = Page<BeerDto>;
