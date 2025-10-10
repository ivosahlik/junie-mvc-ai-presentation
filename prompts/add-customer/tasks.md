# Customer Entity Implementation Tasks

## 1. Create Customer Entity
- [x] Create Customer JPA entity that extends BaseEntity
- [x] Add required properties (name, email, phoneNumber, addressLine1, addressLine2, city, state, postalCode)
- [x] Add proper validation annotations (@NotNull, etc.) to required fields
- [x] Implement OneToMany relationship with BeerOrder

## 2. Update BeerOrder Entity
- [x] Add ManyToOne relationship to Customer
- [x] Replace customerRef field with Customer reference
- [x] Update any methods that use customerRef

## 3. Create Flyway Migration Script
- [x] Create V2__add_customer_table.sql migration script
- [x] Implement customer table creation with all required fields
- [x] Modify beer_order table to add customer_id foreign key
- [x] Add appropriate constraints and indexes

## 4. Create DTO and Mapper
- [x] Create CustomerDto class extending BaseEntityDto
- [x] Add all necessary properties to DTO
- [x] Create CustomerMapper interface using MapStruct
- [x] Implement bidirectional mapping between Customer entity and DTO
- [x] Add validation annotations to DTO fields

## 5. Create Repository
- [x] Create CustomerRepository interface extending JpaRepository
- [x] Add any necessary custom query methods
- [x] Add appropriate query annotations

## 6. Create Service Layer
- [x] Create CustomerService interface
- [x] Define CRUD method signatures
- [x] Create CustomerServiceImpl class
- [x] Implement getAllCustomers method
- [x] Implement getCustomerById method
- [x] Implement saveCustomer method
- [x] Implement updateCustomer method
- [x] Implement deleteCustomer method
- [x] Add proper transaction annotations

## 7. Create Controller
- [x] Create CustomerController class
- [x] Implement GET endpoint for all customers
- [x] Implement GET endpoint for customer by ID
- [x] Implement POST endpoint to create customer
- [x] Implement PUT endpoint to update customer
- [x] Implement DELETE endpoint to delete customer
- [x] Add proper response status annotations
- [x] Handle not found exceptions

## 8. Update OpenAPI Documentation
- [x] Add Customer tag to openapi.yaml
- [x] Create customers.yaml path file for GET all and POST operations
- [x] Create customers_{id}.yaml path file for GET by ID, PUT, and DELETE operations
- [x] Create Customer.yaml schema file for CustomerDto
- [x] Validate OpenAPI documentation with linting tool

## 9. Write Tests
- [x] Create CustomerMapperTest
- [x] Create CustomerServiceTest
- [x] Create CustomerControllerTest
- [x] Create CustomerRepositoryIntegrationTest
- [x] Create CustomerControllerIntegrationTest
- [x] Test all CRUD operations
- [x] Test error handling

## 10. Verify Implementation
- [x] Run all tests to ensure they pass
- [x] Verify the application builds successfully
- [x] Test the API endpoints manually
- [x] Verify proper error handling
- [x] Check database schema after migration
