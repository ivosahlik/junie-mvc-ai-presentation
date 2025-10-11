# Beer Order Management System - Implementation Tasks

## Phase 1: Foundation and Entity Layer

### BaseEntity Implementation
- [x] 1.1. Create `BaseEntity` abstract class with common fields (id, version, timestamps)
- [x] 1.2. Add appropriate JPA and Lombok annotations
- [x] 1.3. Set up optimistic locking with @Version
- [x] 1.4. Configure creation and update timestamps

### Beer Entity Refactoring
- [x] 1.5. Refactor `Beer` entity to extend `BaseEntity`
- [x] 1.6. Remove duplicate fields that are now in `BaseEntity`
- [x] 1.7. Add relationship to `BeerOrderLine` (one-to-many)
- [x] 1.8. Add proper annotations and initialization for collections

### BeerOrder Entity
- [x] 1.9. Create `BeerOrder` entity extending `BaseEntity`
- [x] 1.10. Add fields (customerRef, paymentAmount, status)
- [x] 1.11. Set up relationship with `BeerOrderLine` (one-to-many with cascade)
- [x] 1.12. Implement helper methods for relationship management
- [x] 1.13. Add appropriate JPA and Lombok annotations

### BeerOrderLine Entity
- [x] 1.14. Create `BeerOrderLine` entity extending `BaseEntity`
- [x] 1.15. Add fields (orderQuantity, quantityAllocated, status)
- [x] 1.16. Set up relationships with `Beer` and `BeerOrder` (many-to-one)
- [x] 1.17. Add appropriate JPA and Lombok annotations

## Phase 2: Repository Layer

### BeerOrderRepository
- [x] 2.1. Create `BeerOrderRepository` interface extending JpaRepository
- [x] 2.2. Add custom query method for finding by customerRef

### BeerOrderLineRepository
- [x] 2.3. Create `BeerOrderLineRepository` interface extending JpaRepository
- [x] 2.4. Add custom query methods for finding by beer ID and order ID

## Phase 3: DTO and Mapper Layer

### BeerOrderDto
- [x] 3.1. Create `BeerOrderDto` class with required fields
- [x] 3.2. Add validation annotations
- [x] 3.3. Add Lombok annotations for builder pattern and accessors

### BeerOrderLineDto
- [x] 3.4. Create `BeerOrderLineDto` class with required fields
- [x] 3.5. Add validation annotations
- [x] 3.6. Add Lombok annotations for builder pattern and accessors

### Mappers
- [x] 3.7. Create `BeerOrderMapper` interface with MapStruct annotations
- [x] 3.8. Create `BeerOrderLineMapper` interface with MapStruct annotations
- [x] 3.9. Configure proper mapping rules to prevent circular references
- [x] 3.10. Ensure proper handling of relationships between entities

## Phase 4: Service Layer

### BeerOrderService Interface
- [x] 4.1. Define `BeerOrderService` interface with required methods
- [x] 4.2. Document interface methods

### BeerOrderServiceImpl
- [x] 4.3. Implement `BeerOrderServiceImpl` class
- [x] 4.4. Set up constructor injection for dependencies
- [x] 4.5. Add transaction annotations (@Transactional)
- [x] 4.6. Implement createBeerOrder method
- [x] 4.7. Implement getBeerOrderById method
- [x] 4.8. Implement listBeerOrders method
- [x] 4.9. Implement findBeerOrdersByCustomerRef method
- [x] 4.10. Implement updateBeerOrder method
- [x] 4.11. Implement deleteBeerOrder method
- [x] 4.12. Add error handling and validation

## Phase 5: Controller Layer

### BeerOrderController
- [x] 5.1. Create `BeerOrderController` class
- [x] 5.2. Set up constructor injection for service
- [x] 5.3. Configure base request mapping
- [x] 5.4. Implement endpoint for creating a beer order (POST)
- [x] 5.5. Implement endpoint for getting a beer order by ID (GET /{id})
- [x] 5.6. Implement endpoint for listing all beer orders (GET)
- [x] 5.7. Implement endpoint for searching beer orders (GET /search)
- [x] 5.8. Implement endpoint for updating a beer order (PUT /{id})
- [x] 5.9. Implement endpoint for deleting a beer order (DELETE /{id})
- [x] 5.10. Add validation for request bodies
- [x] 5.11. Configure appropriate response status codes

## Phase 6: Error Handling

### GlobalExceptionHandler
- [x] 6.1. Create or extend `GlobalExceptionHandler` class
- [x] 6.2. Define error response structure
- [x] 6.3. Add handler for validation errors
- [x] 6.4. Add handler for resource not found exceptions
- [x] 6.5. Add handler for optimistic locking failures
- [x] 6.6. Add handler for general server errors

## Phase 7: Testing

### Repository Tests
- [x] 7.1. Create tests for `BeerOrderRepository`
- [x] 7.2. Create tests for `BeerOrderLineRepository`
- [x] 7.3. Test custom query methods

### Service Tests
- [x] 7.4. Create tests for `BeerOrderServiceImpl`
- [x] 7.5. Test CRUD operations
- [x] 7.6. Test error cases and edge conditions
- [x] 7.7. Test business logic validation

### Controller Tests
- [x] 7.8. Create tests for `BeerOrderController`
- [x] 7.9. Test HTTP status codes
- [x] 7.10. Test request validation
- [x] 7.11. Test response body structure

### Integration Tests
- [x] 7.12. Create integration tests for order creation flow
- [x] 7.13. Create integration tests for order update flow
- [x] 7.14. Create integration tests for search functionality

## Phase 8: Configuration and Deployment

### Application Properties
- [x] 8.1. Set `spring.jpa.open-in-view=false`
- [x] 8.2. Configure appropriate Hibernate DDL settings
- [x] 8.3. Set appropriate logging levels

### Final Review
- [x] 8.4. Perform code review for adherence to Spring Boot guidelines
- [x] 8.5. Check for proper relationship management
- [x] 8.6. Ensure appropriate transaction boundaries
- [x] 8.7. Verify validation rules
- [x] 8.8. Run full build to ensure application compiles and tests pass
