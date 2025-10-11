/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema } from '../models/paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BeerOrderShipmentsService {
    /**
     * Get all shipments for a beer order
     * Retrieves all shipments associated with a specific beer order
     * @param beerOrderId ID of the beer order
     * @returns paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema OK
     * @throws ApiError
     */
    public static getBeerOrderShipments(
        beerOrderId: number,
    ): CancelablePromise<Array<paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beer-orders/{beerOrderId}/shipments',
            path: {
                'beerOrderId': beerOrderId,
            },
            errors: {
                404: `Beer order not found`,
            },
        });
    }
    /**
     * Create a new shipment for a beer order
     * Creates a new shipment record associated with a specific beer order
     * @param beerOrderId ID of the beer order
     * @param requestBody
     * @returns paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema Created
     * @throws ApiError
     */
    public static createBeerOrderShipment(
        beerOrderId: number,
        requestBody: {
            /**
             * Unique identifier for the shipment
             */
            readonly id?: number;
            /**
             * Version number for optimistic locking
             */
            readonly version?: number;
            /**
             * Date and time when the shipment was created
             */
            readonly createdDate?: string;
            /**
             * Date and time when the shipment was last updated
             */
            readonly updateDate?: string;
            /**
             * Date and time when the shipment was sent
             */
            shipmentDate: string;
            /**
             * Name of the shipping carrier (e.g., UPS, FedEx)
             */
            carrier?: string;
            /**
             * Tracking number assigned by the carrier
             */
            trackingNumber?: string;
            /**
             * ID of the associated beer order
             */
            readonly beerOrderId?: number;
        },
    ): CancelablePromise<paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/beer-orders/{beerOrderId}/shipments',
            path: {
                'beerOrderId': beerOrderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Beer order not found`,
            },
        });
    }
    /**
     * Get a specific shipment
     * Retrieves a specific shipment by its ID
     * @param beerOrderId ID of the beer order
     * @param id ID of the shipment
     * @returns paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema OK
     * @throws ApiError
     */
    public static getBeerOrderShipmentById(
        beerOrderId: number,
        id: number,
    ): CancelablePromise<paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/beer-orders/{beerOrderId}/shipments/{id}',
            path: {
                'beerOrderId': beerOrderId,
                'id': id,
            },
            errors: {
                404: `Shipment not found`,
            },
        });
    }
    /**
     * Update a shipment
     * Updates an existing shipment with the provided information
     * @param beerOrderId ID of the beer order
     * @param id ID of the shipment to update
     * @param requestBody
     * @returns paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema OK
     * @throws ApiError
     */
    public static updateBeerOrderShipment(
        beerOrderId: number,
        id: number,
        requestBody: paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<paths_1api_1v1_1beer_orders_1_beerOrderId_1shipments_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/beer-orders/{beerOrderId}/shipments/{id}',
            path: {
                'beerOrderId': beerOrderId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Shipment not found`,
            },
        });
    }
    /**
     * Delete a shipment
     * Deletes a specific shipment by its ID
     * @param beerOrderId ID of the beer order
     * @param id ID of the shipment to delete
     * @returns void
     * @throws ApiError
     */
    public static deleteBeerOrderShipment(
        beerOrderId: number,
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/beer-orders/{beerOrderId}/shipments/{id}',
            path: {
                'beerOrderId': beerOrderId,
                'id': id,
            },
            errors: {
                404: `Shipment not found`,
            },
        });
    }
}
