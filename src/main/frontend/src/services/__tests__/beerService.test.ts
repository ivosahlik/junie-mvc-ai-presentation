import beerService from '../beerService';
import apiService from '../api';
import { createMockBeer, createMockPage } from '../../test/utils';
import type { BeerDto, BeerPatchDto } from '../../types/beer';

// Interface for API errors with response property
interface ApiError extends Error {
  response?: {
    status: number;
    data?: { message: string };
  };
  code?: string;
}

// Mock the API service
jest.mock('../api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('BeerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBeers', () => {
    it('should fetch beers with pagination', async () => {
      const mockBeers = [
        createMockBeer({ id: 1, beerName: 'Test Beer 1' }),
        createMockBeer({ id: 2, beerName: 'Test Beer 2' }),
      ];
      const mockPage = createMockPage(mockBeers);

      mockApiService.getPaginatedWithNotification.mockResolvedValue(mockPage);

      const result = await beerService.getBeers(
        { page: 0, size: 20 },
        { sort: 'beerName', direction: 'asc' }
      );

      expect(mockApiService.getPaginatedWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers',
        { page: 0, size: 20 },
        { sort: 'beerName', direction: 'asc' },
        [],
        undefined
      );
      expect(result).toEqual(mockPage);
    });

    it('should fetch beers with name filter', async () => {
      const mockBeers = [createMockBeer({ beerName: 'IPA Beer' })];
      const mockPage = createMockPage(mockBeers);

      mockApiService.getPaginatedWithNotification.mockResolvedValue(mockPage);

      await beerService.getBeers(undefined, undefined, 'IPA');

      expect(mockApiService.getPaginatedWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers',
        undefined,
        undefined,
        [{ field: 'beerName', value: 'IPA' }],
        undefined
      );
    });

    it('should fetch beers with style filter', async () => {
      const mockBeers = [createMockBeer({ beerStyle: 'IPA' })];
      const mockPage = createMockPage(mockBeers);

      mockApiService.getPaginatedWithNotification.mockResolvedValue(mockPage);

      await beerService.getBeers(undefined, undefined, undefined, 'IPA');

      expect(mockApiService.getPaginatedWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers',
        undefined,
        undefined,
        [{ field: 'beerStyle', value: 'IPA' }],
        undefined
      );
    });

    it('should fetch beers with both name and style filters', async () => {
      const mockBeers = [createMockBeer({ beerName: 'Test IPA', beerStyle: 'IPA' })];
      const mockPage = createMockPage(mockBeers);

      mockApiService.getPaginatedWithNotification.mockResolvedValue(mockPage);

      await beerService.getBeers(undefined, undefined, 'Test', 'IPA');

      expect(mockApiService.getPaginatedWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers',
        undefined,
        undefined,
        [
          { field: 'beerName', value: 'Test' },
          { field: 'beerStyle', value: 'IPA' },
        ],
        undefined
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockApiService.getPaginatedWithNotification.mockRejectedValue(error);

      await expect(beerService.getBeers()).rejects.toThrow('API Error');
    });
  });

  describe('getBeerById', () => {
    it('should fetch a beer by ID', async () => {
      const mockBeer = createMockBeer({ id: 1, beerName: 'Test Beer' });
      mockApiService.getByIdWithNotification.mockResolvedValue(mockBeer);

      const result = await beerService.getBeerById(1);

      expect(mockApiService.getByIdWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers/{id}',
        1,
        undefined
      );
      expect(result).toEqual(mockBeer);
    });

    it('should handle not found error', async () => {
      const error: ApiError = new Error('Beer not found');
      error.response = { status: 404 };
      mockApiService.getByIdWithNotification.mockRejectedValue(error);

      await expect(beerService.getBeerById(999)).rejects.toThrow('Beer not found');
    });

    it('should pass custom config', async () => {
      const mockBeer = createMockBeer({ id: 1 });
      const customConfig = { timeout: 5000 };
      mockApiService.getByIdWithNotification.mockResolvedValue(mockBeer);

      await beerService.getBeerById(1, customConfig);

      expect(mockApiService.getByIdWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers/{id}',
        1,
        customConfig
      );
    });
  });

  describe('createBeer', () => {
    it('should create a new beer', async () => {
      const newBeer: BeerDto = {
        beerName: 'New Beer',
        beerStyle: 'IPA',
        upc: '123456789',
        quantityOnHand: 100,
        price: 12.99,
      };
      const createdBeer = createMockBeer({ id: 1, ...newBeer });
      mockApiService.createWithNotification.mockResolvedValue(createdBeer);

      const result = await beerService.createBeer(newBeer);

      expect(mockApiService.createWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers',
        newBeer,
        undefined
      );
      expect(result).toEqual(createdBeer);
    });

    it('should handle validation errors', async () => {
      const invalidBeer: BeerDto = {
        beerName: '',
        beerStyle: 'IPA',
        upc: '123456789',
        quantityOnHand: 100,
        price: 12.99,
      };
      const error: ApiError = new Error('Validation failed');
      error.response = { status: 400, data: { message: 'Beer name is required' } };
      mockApiService.createWithNotification.mockRejectedValue(error);

      await expect(beerService.createBeer(invalidBeer)).rejects.toThrow('Validation failed');
    });
  });

  describe('updateBeer', () => {
    it('should update an existing beer', async () => {
      const updatedBeer: BeerDto = {
        id: 1,
        beerName: 'Updated Beer',
        beerStyle: 'IPA',
        upc: '123456789',
        quantityOnHand: 150,
        price: 13.99,
      };
      mockApiService.updateWithNotification.mockResolvedValue(updatedBeer);

      const result = await beerService.updateBeer(1, updatedBeer);

      expect(mockApiService.updateWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers/{id}',
        1,
        updatedBeer,
        undefined
      );
      expect(result).toEqual(updatedBeer);
    });

    it('should handle update conflicts', async () => {
      const beer = createMockBeer({ id: 1, version: 1 });
      const error: ApiError = new Error('Conflict');
      error.response = { status: 409, data: { message: 'Version conflict' } };
      mockApiService.updateWithNotification.mockRejectedValue(error);

      await expect(beerService.updateBeer(1, beer)).rejects.toThrow('Conflict');
    });
  });

  describe('patchBeer', () => {
    it('should partially update a beer', async () => {
      const patchData: BeerPatchDto = {
        price: 14.99,
        quantityOnHand: 200,
      };
      const updatedBeer = createMockBeer({ id: 1, ...patchData });
      mockApiService.partialUpdateWithNotification.mockResolvedValue(updatedBeer);

      const result = await beerService.patchBeer(1, patchData);

      expect(mockApiService.partialUpdateWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers/{id}',
        1,
        patchData,
        undefined
      );
      expect(result).toEqual(updatedBeer);
    });

    it('should handle patch validation errors', async () => {
      const invalidPatch: BeerPatchDto = {
        price: -1, // Invalid negative price
      };
      const error: ApiError = new Error('Invalid price');
      error.response = { status: 400 };
      mockApiService.partialUpdateWithNotification.mockRejectedValue(error);

      await expect(beerService.patchBeer(1, invalidPatch)).rejects.toThrow('Invalid price');
    });
  });

  describe('deleteBeer', () => {
    it('should delete a beer', async () => {
      mockApiService.deleteResourceWithNotification.mockResolvedValue(undefined);

      await beerService.deleteBeer(1);

      expect(mockApiService.deleteResourceWithNotification).toHaveBeenCalledWith(
        '/api/v1/beers/{id}',
        1,
        undefined
      );
    });

    it('should handle delete errors', async () => {
      const error: ApiError = new Error('Cannot delete beer');
      error.response = { status: 409, data: { message: 'Beer has active orders' } };
      mockApiService.deleteResourceWithNotification.mockRejectedValue(error);

      await expect(beerService.deleteBeer(1)).rejects.toThrow('Cannot delete beer');
    });

    it('should handle not found on delete', async () => {
      const error: ApiError = new Error('Beer not found');
      error.response = { status: 404 };
      mockApiService.deleteResourceWithNotification.mockRejectedValue(error);

      await expect(beerService.deleteBeer(999)).rejects.toThrow('Beer not found');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const networkError: ApiError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      mockApiService.getPaginatedWithNotification.mockRejectedValue(networkError);

      await expect(beerService.getBeers()).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      const timeoutError: ApiError = new Error('Timeout');
      timeoutError.code = 'ECONNABORTED';
      mockApiService.getByIdWithNotification.mockRejectedValue(timeoutError);

      await expect(beerService.getBeerById(1)).rejects.toThrow('Timeout');
    });

    it('should handle server errors', async () => {
      const serverError: ApiError = new Error('Internal Server Error');
      serverError.response = { status: 500 };
      mockApiService.createWithNotification.mockRejectedValue(serverError);

      const beer = createMockBeer();
      await expect(beerService.createBeer(beer)).rejects.toThrow('Internal Server Error');
    });
  });

  describe('service configuration', () => {
    it('should use correct API endpoints', () => {
      // Test that the service uses the expected endpoints
      expect(beerService).toBeDefined();
      expect(typeof beerService.getBeers).toBe('function');
      expect(typeof beerService.getBeerById).toBe('function');
      expect(typeof beerService.createBeer).toBe('function');
      expect(typeof beerService.updateBeer).toBe('function');
      expect(typeof beerService.patchBeer).toBe('function');
      expect(typeof beerService.deleteBeer).toBe('function');
    });

    it('should be a singleton instance', async () => {
      // Import the service again to test singleton behavior
      const { default: beerService2 } = await import('../beerService');
      expect(beerService).toBe(beerService2);
    });
  });
});
