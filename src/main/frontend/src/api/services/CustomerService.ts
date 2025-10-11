/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type {
  paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema
} from '../models/paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema';
import type {CancelablePromise} from '../core/CancelablePromise';
import {OpenAPI} from '../core/OpenAPI';
import {request as __request} from '../core/request';

export class CustomerService {
    /**
     * List all customers
     * Retrieves a list of all customers in the system
     * @returns paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema List of customers successfully retrieved
     * @throws ApiError
     */
    public static listCustomers(): CancelablePromise<Array<paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers',
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
                403: `Forbidden - Not enough permissions to access the resource`,
            },
        });
    }
    /**
     * Create a new customer
     * Creates a new customer with the provided details
     * @param requestBody Customer object to be created
     * @returns paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema Customer successfully created
     * @throws ApiError
     */
    public static createCustomer(
        requestBody: {
            /**
             * Unique identifier for the customer
             */
            readonly id?: number;
            /**
             * Version number for optimistic locking
             */
            readonly version?: number;
            /**
             * Customer's full name
             */
            name: string;
            /**
             * Customer's email address
             */
            email?: string;
            /**
             * Customer's phone number
             */
            phoneNumber?: string;
            /**
             * First line of customer's address
             */
            addressLine1: string;
            /**
             * Second line of customer's address (optional)
             */
            addressLine2?: string;
            /**
             * City of customer's address
             */
            city: string;
            /**
             * State or province of customer's address
             */
            state: string;
            /**
             * Postal code of customer's address
             */
            postalCode: string;
            /**
             * Date and time when the customer was created
             */
            readonly createdDate?: string;
            /**
             * Date and time when the customer was last updated
             */
            readonly updateDate?: string;
        },
    ): CancelablePromise<paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/customers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body - validation errors`,
            },
        });
    }
    /**
     * Get customer by ID
     * Retrieves the details of a specific customer by ID
     * @param id The unique identifier of the customer
     * @returns paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema Customer details successfully retrieved
     * @throws ApiError
     */
    public static getCustomerById(
        id: number,
    ): CancelablePromise<paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
                403: `Forbidden - Not enough permissions to access the resource`,
                404: `Customer not found`,
            },
        });
    }
    /**
     * Update customer
     * Updates an existing customer with the provided details
     * @param id The unique identifier of the customer
     * @param requestBody Customer object with updated details
     * @returns paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema Customer successfully updated
     * @throws ApiError
     */
    public static updateCustomer(
        id: number,
        requestBody: paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/customers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body - validation errors`,
                401: `Unauthorized - Authentication token is missing or invalid`,
                403: `Forbidden - Not enough permissions to access the resource`,
                404: `Customer not found`,
            },
        });
    }
    /**
     * Delete customer
     * Deletes a specific customer by ID
     * @param id The unique identifier of the customer
     * @returns void
     * @throws ApiError
     */
    public static deleteCustomer(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/customers/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
                403: `Forbidden - Not enough permissions to access the resource`,
                404: `Customer not found`,
            },
        });
    }
    /**
     * Search customers by name
     * Searches for customers whose names contain the provided search term (case insensitive)
     * @param name The name or partial name to search for
     * @returns paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema List of matching customers successfully retrieved
     * @throws ApiError
     */
    public static searchCustomersByName(
        name: string,
    ): CancelablePromise<Array<paths_1api_1v1_1customers_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers/search/by-name',
            query: {
                'name': name,
            },
            errors: {
                401: `Unauthorized - Authentication token is missing or invalid`,
                403: `Forbidden - Not enough permissions to access the resource`,
            },
        });
    }
}
