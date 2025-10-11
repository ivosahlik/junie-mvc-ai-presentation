import { createMockBeer, createMockCustomer, createMockBeerOrder, createMockPage } from '../utils';
import type { BeerDto } from '../../types/beer';
import type { CustomerDto } from '../../types/customer';
import type { BeerOrderDto, BeerOrderShipmentDto } from '../../types/beerOrder';

// Mock Beer Service
export const mockBeerService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBeers: jest.fn().mockImplementation((_params = {}) => {
    const mockBeers = [
      createMockBeer({ id: 1, beerName: 'Mango Bobs', beerStyle: 'IPA' }),
      createMockBeer({ id: 2, beerName: 'Galaxy Cat', beerStyle: 'PALE_ALE' }),
      createMockBeer({ id: 3, beerName: 'Pinball Porter', beerStyle: 'PORTER' }),
    ];
    return Promise.resolve(createMockPage(mockBeers));
  }),

  getBeerById: jest.fn().mockImplementation((id: number) => {
    const mockBeer = createMockBeer({ id, beerName: `Test Beer ${id}` });
    return Promise.resolve(mockBeer);
  }),

  createBeer: jest
    .fn()
    .mockImplementation(
      (beerData: Omit<BeerDto, 'id' | 'version' | 'createdDate' | 'updateDate'>) => {
        const mockBeer = createMockBeer({ id: 999, ...beerData });
        return Promise.resolve(mockBeer);
      }
    ),

  updateBeer: jest.fn().mockImplementation((id: number, beerData: Partial<BeerDto>) => {
    const mockBeer = createMockBeer({ id, ...beerData });
    return Promise.resolve(mockBeer);
  }),

  patchBeer: jest.fn().mockImplementation((id: number, patchData: Partial<BeerDto>) => {
    const mockBeer = createMockBeer({ id, ...patchData });
    return Promise.resolve(mockBeer);
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteBeer: jest.fn().mockImplementation((_id: number) => {
    return Promise.resolve();
  }),
};

// Mock Customer Service
export const mockCustomerService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCustomers: jest.fn().mockImplementation((_params = {}) => {
    const mockCustomers = [
      createMockCustomer({ id: 1, customerName: 'John Doe', email: 'john@example.com' }),
      createMockCustomer({ id: 2, customerName: 'Jane Smith', email: 'jane@example.com' }),
      createMockCustomer({ id: 3, customerName: 'Bob Johnson', email: 'bob@example.com' }),
    ];
    return Promise.resolve(createMockPage(mockCustomers));
  }),

  getCustomerById: jest.fn().mockImplementation((id: number) => {
    const mockCustomer = createMockCustomer({ id, customerName: `Test Customer ${id}` });
    return Promise.resolve(mockCustomer);
  }),

  createCustomer: jest
    .fn()
    .mockImplementation(
      (customerData: Omit<CustomerDto, 'id' | 'version' | 'createdDate' | 'updateDate'>) => {
        const mockCustomer = createMockCustomer({ id: 999, ...customerData });
        return Promise.resolve(mockCustomer);
      }
    ),

  updateCustomer: jest.fn().mockImplementation((id: number, customerData: Partial<CustomerDto>) => {
    const mockCustomer = createMockCustomer({ id, ...customerData });
    return Promise.resolve(mockCustomer);
  }),

  patchCustomer: jest.fn().mockImplementation((id: number, patchData: Partial<CustomerDto>) => {
    const mockCustomer = createMockCustomer({ id, ...patchData });
    return Promise.resolve(mockCustomer);
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteCustomer: jest.fn().mockImplementation((_id: number) => {
    return Promise.resolve();
  }),
};

// Mock Beer Order Service
export const mockBeerOrderService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBeerOrders: jest.fn().mockImplementation((_params = {}) => {
    const mockOrders = [
      createMockBeerOrder({ id: 1, customerRef: 'CUST-001', status: 'NEW' }),
      createMockBeerOrder({ id: 2, customerRef: 'CUST-002', status: 'PROCESSING' }),
      createMockBeerOrder({ id: 3, customerRef: 'CUST-003', status: 'COMPLETED' }),
    ];
    return Promise.resolve(createMockPage(mockOrders));
  }),

  getBeerOrderById: jest.fn().mockImplementation((id: number) => {
    const mockOrder = createMockBeerOrder({
      id,
      customerRef: `CUST-${id.toString().padStart(3, '0')}`,
    });
    return Promise.resolve(mockOrder);
  }),

  createBeerOrder: jest
    .fn()
    .mockImplementation(
      (orderData: Omit<BeerOrderDto, 'id' | 'version' | 'createdDate' | 'updateDate'>) => {
        const mockOrder = createMockBeerOrder({ id: 999, ...orderData });
        return Promise.resolve(mockOrder);
      }
    ),

  updateBeerOrder: jest.fn().mockImplementation((id: number, orderData: Partial<BeerOrderDto>) => {
    const mockOrder = createMockBeerOrder({ id, ...orderData });
    return Promise.resolve(mockOrder);
  }),

  patchBeerOrder: jest.fn().mockImplementation((id: number, patchData: Partial<BeerOrderDto>) => {
    const mockOrder = createMockBeerOrder({ id, ...patchData });
    return Promise.resolve(mockOrder);
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteBeerOrder: jest.fn().mockImplementation((_id: number) => {
    return Promise.resolve();
  }),

  createBeerOrderShipment: jest
    .fn()
    .mockImplementation(
      (
        _orderId: number,
        shipmentData: Omit<BeerOrderShipmentDto, 'id' | 'version' | 'createdDate' | 'updateDate'>
      ) => {
        const mockShipment: BeerOrderShipmentDto = {
          id: 999,
          version: 1,
          createdDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          ...shipmentData,
        };
        return Promise.resolve(mockShipment);
      }
    ),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBeerOrderShipments: jest.fn().mockImplementation((_orderId: number) => {
    const mockShipments: BeerOrderShipmentDto[] = [
      {
        id: 1,
        version: 1,
        createdDate: '2023-01-01T00:00:00Z',
        updateDate: '2023-01-01T00:00:00Z',
        shipmentDate: '2023-01-02T10:00:00Z',
        carrier: 'FedEx',
        trackingNumber: '123456789',
      },
    ];
    return Promise.resolve(mockShipments);
  }),
};

// Mock API Error Responses
export const mockApiErrors = {
  notFound: {
    response: {
      status: 404,
      data: { message: 'Resource not found' },
    },
  },
  badRequest: {
    response: {
      status: 400,
      data: { message: 'Bad request' },
    },
  },
  unauthorized: {
    response: {
      status: 401,
      data: { message: 'Unauthorized' },
    },
  },
  forbidden: {
    response: {
      status: 403,
      data: { message: 'Forbidden' },
    },
  },
  serverError: {
    response: {
      status: 500,
      data: { message: 'Internal server error' },
    },
  },
};

// Helper function to reset all mocks
export const resetAllMocks = () => {
  Object.values(mockBeerService).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });

  Object.values(mockCustomerService).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });

  Object.values(mockBeerOrderService).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
};

// Helper function to make a mock service method reject with an error
export const makeMockReject = <T = unknown>(
  mockFn: jest.MockedFunction<(...args: unknown[]) => Promise<T>>,
  error: unknown
) => {
  mockFn.mockRejectedValueOnce(error);
};

// Helper function to make a mock service method resolve with custom data
export const makeMockResolve = <T = unknown>(
  mockFn: jest.MockedFunction<(...args: unknown[]) => Promise<T>>,
  data: T
) => {
  mockFn.mockResolvedValueOnce(data);
};
