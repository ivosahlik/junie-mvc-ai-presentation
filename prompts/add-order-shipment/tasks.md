# BeerOrderShipment Implementation Tasks

## 1. Database Migration
1. [ ] Create a new Flyway migration script `V3__add_beer_order_shipment_table.sql`
2. [ ] Create the `beer_order_shipment` table with necessary fields:
   - [ ] id, version, created_date, update_date (BaseEntity fields)
   - [ ] shipment_date (not null)
   - [ ] carrier
   - [ ] tracking_number
   - [ ] beer_order_id (foreign key)
3. [ ] Add foreign key constraint referencing the beer_order table

## 2. Entity Creation
1. [ ] Create the `BeerOrderShipment` entity class
2. [ ] Extend BaseEntity
3. [ ] Implement required fields:
   - [ ] shipmentDate (not null)
   - [ ] carrier
   - [ ] trackingNumber
4. [ ] Add Many-to-One relationship with BeerOrder
5. [ ] Add appropriate annotations (JPA, Lombok)

## 3. Update BeerOrder Entity
1. [ ] Add OneToMany relationship to BeerOrderShipment
2. [ ] Create helper methods:
   - [ ] addBeerOrderShipment
   - [ ] removeBeerOrderShipment
3. [ ] Add appropriate annotations

## 4. Data Transfer Objects
1. [ ] Create `BeerOrderShipmentDto` class
2. [ ] Add all necessary fields from the entity
3. [ ] Add appropriate annotations

## 5. Mapper Creation
1. [ ] Create `BeerOrderShipmentMapper` interface
2. [ ] Implement MapStruct annotations
3. [ ] Add mapping methods:
   - [ ] toDto
   - [ ] toEntity
   - [ ] updateEntityFromDto

## 6. Repository Creation
1. [ ] Create `BeerOrderShipmentRepository` interface
2. [ ] Extend JpaRepository
3. [ ] Add method to find shipments by BeerOrder ID

## 7. Service Layer
1. [ ] Create `BeerOrderShipmentService` interface
2. [ ] Define service methods:
   - [ ] createBeerOrderShipment
   - [ ] getBeerOrderShipmentById
   - [ ] getBeerOrderShipmentsByBeerOrderId
   - [ ] updateBeerOrderShipment
   - [ ] deleteBeerOrderShipment
3. [ ] Create `BeerOrderShipmentServiceImpl` class
4. [ ] Implement service interface methods
5. [ ] Add proper transaction management
6. [ ] Implement validation and error handling
7. [ ] Use constructor injection for dependencies

## 8. Controller Implementation
1. [ ] Create `BeerOrderShipmentController` class
2. [ ] Map to path "/api/v1/beer-orders/{beerOrderId}/shipments"
3. [ ] Implement CRUD operations:
   - [ ] POST (create shipment)
   - [ ] GET (retrieve all shipments for a beer order)
   - [ ] GET /{id} (retrieve specific shipment)
   - [ ] PUT /{id} (update shipment)
   - [ ] DELETE /{id} (delete shipment)
4. [ ] Add proper HTTP status codes and responses
5. [ ] Implement validation

## 9. Testing
1. [ ] Repository tests:
   - [ ] Test saving and retrieving shipments
   - [ ] Test finding shipments by beer order ID
2. [ ] Mapper tests:
   - [ ] Test mapping entity to DTO
   - [ ] Test mapping DTO to entity
   - [ ] Test updating entity from DTO
3. [ ] Service unit tests:
   - [ ] Test create shipment
   - [ ] Test get shipment by ID
   - [ ] Test get shipments by beer order ID
   - [ ] Test update shipment
   - [ ] Test delete shipment
   - [ ] Test edge cases and error conditions
4. [ ] Controller unit tests:
   - [ ] Test all CRUD endpoints
   - [ ] Test validation
   - [ ] Test error handling
5. [ ] Integration tests:
   - [ ] Test complete flow from controller to database and back

## 10. OpenAPI Documentation
1. [ ] Add schema definition for BeerOrderShipment
2. [ ] Document API endpoints:
   - [ ] POST endpoint
   - [ ] GET endpoints
   - [ ] PUT endpoint
   - [ ] DELETE endpoint
3. [ ] Add examples and descriptions

## 11. Final Verification
1. [ ] Run all unit tests
2. [ ] Run all integration tests
3. [ ] Manually verify API endpoints
4. [ ] Verify database migration works correctly
5. [ ] Check for any code quality issues
