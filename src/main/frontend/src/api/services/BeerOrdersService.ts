/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema } from '../models/paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema';
import type { paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema } from '../models/paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BeerOrdersService {
    /**
     * List all beer orders
     * Retrieves a list of all beer orders in the system
     * @returns paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema List of beer orders successfully retrieved
     * @throws ApiError
     */
    public static listBeerOrders(): CancelablePromise<Array<paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beer-orders',
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
            },
        });
    }
    /**
     * Create a new beer order
     * Creates a new beer order with the provided details
     * @param requestBody Beer order object to be created
     * @returns paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema Beer order successfully created
     * @throws ApiError
     */
    public static createBeerOrder(
        requestBody: {
            /**
             * Unique identifier for the beer order
             */
            readonly id?: number;
            /**
             * Version number for optimistic locking
             */
            readonly version?: number;
            /**
             * Reference identifier for the customer
             */
            customerRef: string;
            /**
             * Total payment amount for this order
             */
            paymentAmount?: number;
            /**
             * Current status of the beer order
             */
            status?: string;
            /**
             * List of beer order line items
             */
            beerOrderLines?: Array<{
                /**
                 * Unique identifier for the beer order line
                 */
                readonly id?: number;
                /**
                 * Version number for optimistic locking
                 */
                readonly version?: number;
                /**
                 * Quantity of beer ordered
                 */
                orderQuantity: number;
                /**
                 * Quantity allocated from inventory
                 */
                quantityAllocated?: number;
                /**
                 * Current status of the beer order line
                 */
                status?: string;
                /**
                 * The beer being ordered
                 */
                beer: paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema;
                /**
                 * Date and time when the beer order line was created
                 */
                readonly createdDate?: string;
                /**
                 * Date and time when the beer order line was last updated
                 */
                readonly updateDate?: string;
            }>;
            /**
             * Date and time when the beer order was created
             */
            readonly createdDate?: string;
            /**
             * Date and time when the beer order was last updated
             */
            readonly updateDate?: string;
        },
    ): CancelablePromise<paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/beer-orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body - validation errors`,
            },
        });
    }
    /**
     * Get beer order by ID
     * Retrieves a specific beer order by its unique identifier
     * @param id Unique identifier of the beer order
     * @returns paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema Beer order successfully retrieved
     * @throws ApiError
     */
    public static getBeerOrderById(
        id: number,
    ): CancelablePromise<paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beer-orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Beer order with the specified ID not found`,
            },
        });
    }
    /**
     * Update an existing beer order
     * Updates an existing beer order with the provided details
     * @param id Unique identifier of the beer order
     * @param requestBody Updated beer order object
     * @returns paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema Beer order successfully updated
     * @throws ApiError
     */
    public static updateBeerOrder(
        id: number,
        requestBody: paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/beer-orders/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body - validation errors`,
                404: `Beer order with the specified ID not found`,
            },
        });
    }
    /**
     * Delete a beer order
     * Deletes a beer order with the specified ID
     * @param id Unique identifier of the beer order
     * @returns void
     * @throws ApiError
     */
    public static deleteBeerOrder(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/beer-orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Beer order with the specified ID not found`,
            },
        });
    }
    /**
     * Search beer orders by customer name
     * Search for beer orders by customer name (case-insensitive partial match)
     * @param customerName Customer name to search for
     * @returns paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema List of matching beer orders
     * @throws ApiError
     */
    public static searchBeerOrdersByCustomerName(
        customerName: string,
    ): CancelablePromise<Array<paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beer-orders/search/by-name',
            query: {
                'customerName': customerName,
            },
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
            },
        });
    }
    /**
     * Get beer orders by customer ID
     * Get all beer orders for a specific customer
     * @param customerId ID of the customer
     * @returns paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema List of beer orders for the specified customer
     * @throws ApiError
     */
    public static getBeerOrdersByCustomerId(
        customerId: number,
    ): CancelablePromise<Array<paths_1api_1v1_1beer_orders_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beer-orders/search/by-customer',
            query: {
                'customerId': customerId,
            },
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
            },
        });
    }
}
