# BeerOrderShipment Implementation Tasks

## 1. Database Migration
1. [x] Create a new Flyway migration script `V3__add_beer_order_shipment_table.sql`
2. [x] Create the `beer_order_shipment` table with necessary fields:
   - [x] id, version, created_date, update_date (BaseEntity fields)
   - [x] shipment_date (not null)
   - [x] carrier
   - [x] tracking_number
   - [x] beer_order_id (foreign key)
3. [x] Add foreign key constraint referencing the beer_order table

## 2. Entity Creation
1. [x] Create the `BeerOrderShipment` entity class
2. [x] Extend BaseEntity
3. [x] Implement required fields:
   - [x] shipmentDate (not null)
   - [x] carrier
   - [x] trackingNumber
4. [x] Add Many-to-One relationship with BeerOrder
5. [x] Add appropriate annotations (JPA, Lombok)

## 3. Update BeerOrder Entity
1. [x] Add OneToMany relationship to BeerOrderShipment
2. [x] Create helper methods:
   - [x] addBeerOrderShipment
   - [x] removeBeerOrderShipment
3. [x] Add appropriate annotations

## 4. Data Transfer Objects
1. [x] Create `BeerOrderShipmentDto` class
2. [x] Add all necessary fields from the entity
3. [x] Add appropriate annotations

## 5. Mapper Creation
1. [x] Create `BeerOrderShipmentMapper` interface
2. [x] Implement MapStruct annotations
3. [x] Add mapping methods:
   - [x] toDto
   - [x] toEntity
   - [x] updateEntityFromDto

## 6. Repository Creation
1. [x] Create `BeerOrderShipmentRepository` interface
2. [x] Extend JpaRepository
3. [x] Add method to find shipments by BeerOrder ID

## 7. Service Layer
1. [x] Create `BeerOrderShipmentService` interface
2. [x] Define service methods:
   - [x] createBeerOrderShipment
   - [x] getBeerOrderShipmentById
   - [x] getBeerOrderShipmentsByBeerOrderId
   - [x] updateBeerOrderShipment
   - [x] deleteBeerOrderShipment
3. [x] Create `BeerOrderShipmentServiceImpl` class
4. [x] Implement service interface methods
5. [x] Add proper transaction management
6. [x] Implement validation and error handling
7. [x] Use constructor injection for dependencies

## 8. Controller Implementation
1. [x] Create `BeerOrderShipmentController` class
2. [x] Map to path "/api/v1/beer-orders/{beerOrderId}/shipments"
3. [x] Implement CRUD operations:
   - [x] POST (create shipment)
   - [x] GET (retrieve all shipments for a beer order)
   - [x] GET /{id} (retrieve specific shipment)
   - [x] PUT /{id} (update shipment)
   - [x] DELETE /{id} (delete shipment)
4. [x] Add proper HTTP status codes and responses
5. [x] Implement validation

## 9. Testing
1. [x] Repository tests:
   - [x] Test saving and retrieving shipments
   - [x] Test finding shipments by beer order ID
2. [x] Mapper tests:
   - [x] Test mapping entity to DTO
   - [x] Test mapping DTO to entity
   - [x] Test updating entity from DTO
3. [x] Service unit tests:
   - [x] Test create shipment
   - [x] Test get shipment by ID
   - [x] Test get shipments by beer order ID
   - [x] Test update shipment
   - [x] Test delete shipment
   - [x] Test edge cases and error conditions
4. [x] Controller unit tests:
   - [x] Test all CRUD endpoints
   - [x] Test validation
   - [x] Test error handling
5. [x] Integration tests:
   - [x] Test complete flow from controller to database and back

## 10. OpenAPI Documentation
1. [x] Add schema definition for BeerOrderShipment
2. [x] Document API endpoints:
   - [x] POST endpoint
   - [x] GET endpoints
   - [x] PUT endpoint
   - [x] DELETE endpoint
3. [x] Add examples and descriptions

## 11. Final Verification
1. [x] Run all unit tests
2. [x] Run all integration tests
3. [x] Manually verify API endpoints
4. [x] Verify database migration works correctly
5. [x] Check for any code quality issues
