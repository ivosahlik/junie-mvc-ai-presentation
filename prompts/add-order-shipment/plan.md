# Implementation Plan for Adding BeerOrderShipment Functionality

This plan outlines the steps required to implement the BeerOrderShipment functionality as specified in the requirements.

## 1. Database Migration

Create a new Flyway migration script `V3__add_beer_order_shipment_table.sql` to:
- Create the `beer_order_shipment` table with the required fields (shipment_date, carrier, tracking_number)
- Ensure it has proper foreign key relationship with the `beer_order` table
- Include all fields from BaseEntity (id, version, created_date, update_date)

## 2. Entity Creation

Create the `BeerOrderShipment` entity class that:
- Extends BaseEntity
- Has required fields: shipmentDate (not null), carrier, trackingNumber
- Maintains a Many-to-One relationship with BeerOrder

## 3. Update BeerOrder Entity

Modify the `BeerOrder` entity to:
- Add a OneToMany relationship with BeerOrderShipment
- Create helper methods for adding/removing shipments (similar to the existing BeerOrderLine methods)

## 4. Data Transfer Objects

Create a `BeerOrderShipmentDto` class that:
- Contains all necessary fields from the entity
- Uses appropriate data types and annotations

## 5. Mapper Creation

Create a `BeerOrderShipmentMapper` interface using MapStruct that:
- Maps between BeerOrderShipment entity and BeerOrderShipmentDto
- Handles bidirectional mapping
- Contains methods for updates

## 6. Repository Creation

Create a `BeerOrderShipmentRepository` interface that:
- Extends JpaRepository
- Includes any necessary custom query methods
- Supports finding shipments by BeerOrder ID

## 7. Service Layer

Create the service interfaces and implementations:
1. `BeerOrderShipmentService` interface with methods for:
   - Creating a shipment for a beer order
   - Retrieving shipments for a beer order
   - Updating a shipment
   - Deleting a shipment

2. `BeerOrderShipmentServiceImpl` that:
   - Implements all methods from the service interface
   - Uses proper transaction management
   - Validates inputs and handles edge cases
   - Utilizes constructor injection for dependencies

## 8. Controller Implementation

Create a `BeerOrderShipmentController` that:
- Follows RESTful principles
- Maps to the path "/api/v1/beer-orders/{beerOrderId}/shipments"
- Implements standard CRUD operations
- Uses proper HTTP status codes
- Includes validation

## 9. Testing

Create comprehensive tests for all new components:
1. Repository tests
2. Mapper tests
3. Service unit tests
4. Controller unit tests
5. Integration tests

## 10. OpenAPI Documentation

Update the OpenAPI documentation:
- Add new schema definition for BeerOrderShipment
- Document all new API endpoints
- Include examples and descriptions

## 11. Final Verification

- Run all tests to ensure everything passes
- Verify the API with manual testing
- Check database migrations work correctly

This implementation plan follows the Spring Boot guidelines, including constructor injection, proper transaction boundaries, and separation of web and persistence layers. It also ensures all components are well-tested and documented.
