# Beer Order Management System - Implementation Tasks

## Phase 1: Foundation and Entity Layer

### BaseEntity Implementation
- [ ] 1.1. Create `BaseEntity` abstract class with common fields (id, version, timestamps)
- [ ] 1.2. Add appropriate JPA and Lombok annotations
- [ ] 1.3. Set up optimistic locking with @Version
- [ ] 1.4. Configure creation and update timestamps

### Beer Entity Refactoring
- [ ] 1.5. Refactor `Beer` entity to extend `BaseEntity`
- [ ] 1.6. Remove duplicate fields that are now in `BaseEntity`
- [ ] 1.7. Add relationship to `BeerOrderLine` (one-to-many)
- [ ] 1.8. Add proper annotations and initialization for collections

### BeerOrder Entity
- [ ] 1.9. Create `BeerOrder` entity extending `BaseEntity`
- [ ] 1.10. Add fields (customerRef, paymentAmount, status)
- [ ] 1.11. Set up relationship with `BeerOrderLine` (one-to-many with cascade)
- [ ] 1.12. Implement helper methods for relationship management
- [ ] 1.13. Add appropriate JPA and Lombok annotations

### BeerOrderLine Entity
- [ ] 1.14. Create `BeerOrderLine` entity extending `BaseEntity`
- [ ] 1.15. Add fields (orderQuantity, quantityAllocated, status)
- [ ] 1.16. Set up relationships with `Beer` and `BeerOrder` (many-to-one)
- [ ] 1.17. Add appropriate JPA and Lombok annotations

## Phase 2: Repository Layer

### BeerOrderRepository
- [ ] 2.1. Create `BeerOrderRepository` interface extending JpaRepository
- [ ] 2.2. Add custom query method for finding by customerRef

### BeerOrderLineRepository
- [ ] 2.3. Create `BeerOrderLineRepository` interface extending JpaRepository
- [ ] 2.4. Add custom query methods for finding by beer ID and order ID

## Phase 3: DTO and Mapper Layer

### BeerOrderDto
- [ ] 3.1. Create `BeerOrderDto` class with required fields
- [ ] 3.2. Add validation annotations
- [ ] 3.3. Add Lombok annotations for builder pattern and accessors

### BeerOrderLineDto
- [ ] 3.4. Create `BeerOrderLineDto` class with required fields
- [ ] 3.5. Add validation annotations
- [ ] 3.6. Add Lombok annotations for builder pattern and accessors

### Mappers
- [ ] 3.7. Create `BeerOrderMapper` interface with MapStruct annotations
- [ ] 3.8. Create `BeerOrderLineMapper` interface with MapStruct annotations
- [ ] 3.9. Configure proper mapping rules to prevent circular references
- [ ] 3.10. Ensure proper handling of relationships between entities

## Phase 4: Service Layer

### BeerOrderService Interface
- [ ] 4.1. Define `BeerOrderService` interface with required methods
- [ ] 4.2. Document interface methods

### BeerOrderServiceImpl
- [ ] 4.3. Implement `BeerOrderServiceImpl` class
- [ ] 4.4. Set up constructor injection for dependencies
- [ ] 4.5. Add transaction annotations (@Transactional)
- [ ] 4.6. Implement createBeerOrder method
- [ ] 4.7. Implement getBeerOrderById method
- [ ] 4.8. Implement listBeerOrders method
- [ ] 4.9. Implement findBeerOrdersByCustomerRef method
- [ ] 4.10. Implement updateBeerOrder method
- [ ] 4.11. Implement deleteBeerOrder method
- [ ] 4.12. Add error handling and validation

## Phase 5: Controller Layer

### BeerOrderController
- [ ] 5.1. Create `BeerOrderController` class
- [ ] 5.2. Set up constructor injection for service
- [ ] 5.3. Configure base request mapping
- [ ] 5.4. Implement endpoint for creating a beer order (POST)
- [ ] 5.5. Implement endpoint for getting a beer order by ID (GET /{id})
- [ ] 5.6. Implement endpoint for listing all beer orders (GET)
- [ ] 5.7. Implement endpoint for searching beer orders (GET /search)
- [ ] 5.8. Implement endpoint for updating a beer order (PUT /{id})
- [ ] 5.9. Implement endpoint for deleting a beer order (DELETE /{id})
- [ ] 5.10. Add validation for request bodies
- [ ] 5.11. Configure appropriate response status codes

## Phase 6: Error Handling

### GlobalExceptionHandler
- [ ] 6.1. Create or extend `GlobalExceptionHandler` class
- [ ] 6.2. Define error response structure
- [ ] 6.3. Add handler for validation errors
- [ ] 6.4. Add handler for resource not found exceptions
- [ ] 6.5. Add handler for optimistic locking failures
- [ ] 6.6. Add handler for general server errors

## Phase 7: Testing

### Repository Tests
- [ ] 7.1. Create tests for `BeerOrderRepository`
- [ ] 7.2. Create tests for `BeerOrderLineRepository`
- [ ] 7.3. Test custom query methods

### Service Tests
- [ ] 7.4. Create tests for `BeerOrderServiceImpl`
- [ ] 7.5. Test CRUD operations
- [ ] 7.6. Test error cases and edge conditions
- [ ] 7.7. Test business logic validation

### Controller Tests
- [ ] 7.8. Create tests for `BeerOrderController`
- [ ] 7.9. Test HTTP status codes
- [ ] 7.10. Test request validation
- [ ] 7.11. Test response body structure

### Integration Tests
- [ ] 7.12. Create integration tests for order creation flow
- [ ] 7.13. Create integration tests for order update flow
- [ ] 7.14. Create integration tests for search functionality

## Phase 8: Configuration and Deployment

### Application Properties
- [ ] 8.1. Set `spring.jpa.open-in-view=false`
- [ ] 8.2. Configure appropriate Hibernate DDL settings
- [ ] 8.3. Set appropriate logging levels

### Final Review
- [ ] 8.4. Perform code review for adherence to Spring Boot guidelines
- [ ] 8.5. Check for proper relationship management
- [ ] 8.6. Ensure appropriate transaction boundaries
- [ ] 8.7. Verify validation rules
- [ ] 8.8. Run full build to ensure application compiles and tests pass
