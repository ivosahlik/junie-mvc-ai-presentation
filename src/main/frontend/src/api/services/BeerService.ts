/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema } from '../models/paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BeerService {
    /**
     * List all beers
     * Retrieves a list of all beers in the system
     * @returns paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema List of beers successfully retrieved
     * @throws ApiError
     */
    public static listBeers(): CancelablePromise<Array<paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beers',
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
                403: `Forbidden - Not enough permissions to access the resource`,
            },
        });
    }
    /**
     * Create a new beer
     * Creates a new beer with the provided details
     * @param requestBody Beer object to be created
     * @returns paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema Beer successfully created
     * @throws ApiError
     */
    public static createBeer(
        requestBody: {
            /**
             * Unique identifier for the beer
             */
            readonly id?: number;
            /**
             * Version number for optimistic locking
             */
            readonly version?: number;
            /**
             * Name of the beer
             */
            beerName: string;
            /**
             * Style or category of the beer
             */
            beerStyle: string;
            /**
             * Universal Product Code - unique product identifier
             */
            upc: string;
            /**
             * Current inventory quantity available
             */
            quantityOnHand: number;
            /**
             * Price per unit in the default currency
             */
            price: number;
            /**
             * Detailed description of the beer
             */
            description?: string;
            /**
             * Date and time when the beer was created
             */
            readonly createdDate?: string;
            /**
             * Date and time when the beer was last updated
             */
            readonly updateDate?: string;
        },
    ): CancelablePromise<paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/beers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body - validation errors`,
            },
        });
    }
    /**
     * Get beer by ID
     * Retrieves a specific beer by its unique identifier
     * @param id Unique identifier of the beer
     * @returns paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema Beer successfully retrieved
     * @throws ApiError
     */
    public static getBeerById(
        id: number,
    ): CancelablePromise<paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Beer with the specified ID not found`,
            },
        });
    }
    /**
     * Update an existing beer
     * Updates an existing beer with the provided details
     * @param id Unique identifier of the beer
     * @param requestBody Updated beer object
     * @returns paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema Beer successfully updated
     * @throws ApiError
     */
    public static updateBeer(
        id: number,
        requestBody: paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/beers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body - validation errors`,
                404: `Beer with the specified ID not found`,
            },
        });
    }
    /**
     * Partially update a beer
     * Updates only the provided non-null fields of a beer
     * @param id Unique identifier of the beer
     * @param requestBody Beer patch object containing only the fields to update
     * @returns paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema Beer successfully updated
     * @throws ApiError
     */
    public static patchBeer(
        id: number,
        requestBody: {
            /**
             * Unique identifier for the beer
             */
            readonly id?: number;
            /**
             * Version number for optimistic locking
             */
            readonly version?: number;
            /**
             * Name of the beer
             */
            beerName?: string;
            /**
             * Style or category of the beer
             */
            beerStyle?: string;
            /**
             * Universal Product Code - unique product identifier
             */
            upc?: string;
            /**
             * Current inventory quantity available
             */
            quantityOnHand?: number;
            /**
             * Price per unit in the default currency
             */
            price?: number;
            /**
             * Detailed description of the beer
             */
            description?: string;
            /**
             * Date and time when the beer was created
             */
            readonly createdDate?: string;
            /**
             * Date and time when the beer was last updated
             */
            readonly updateDate?: string;
        },
    ): CancelablePromise<paths_1api_1v1_1beers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/beers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Beer with the specified ID not found`,
            },
        });
    }
    /**
     * Delete a beer
     * Deletes a beer with the specified ID
     * @param id Unique identifier of the beer
     * @returns void
     * @throws ApiError
     */
    public static deleteBeer(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/beers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Beer with the specified ID not found`,
            },
        });
    }
}
