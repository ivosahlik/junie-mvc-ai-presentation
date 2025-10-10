# Customer Entity Implementation Tasks

## 1. Create Customer Entity
1. [ ] Create a new Customer JPA entity class that extends BaseEntity
2. [ ] Add required properties:
   - [ ] name (String, not null)
   - [ ] email (String)
   - [ ] phoneNumber (String)
   - [ ] addressLine1 (String, not null)
   - [ ] addressLine2 (String)
   - [ ] city (String, not null)
   - [ ] state (String, not null)
   - [ ] postalCode (String, not null)
3. [ ] Implement OneToMany relationship with BeerOrder
4. [ ] Add appropriate annotations for JPA mappings
5. [ ] Add validation annotations for required fields

## 2. Update BeerOrder Entity
1. [ ] Add ManyToOne relationship to Customer
2. [ ] Replace the existing customerRef field with Customer reference
3. [ ] Update annotations for proper JPA mapping
4. [ ] Create/update foreign key constraints

## 3. Create Flyway Migration Script
1. [ ] Create new migration script V2__add_customer_table.sql
2. [ ] Add SQL to create customer table with all required fields
3. [ ] Add SQL to alter beer_order table to add customer_id column
4. [ ] Add SQL to create foreign key constraint from beer_order to customer
5. [ ] Add indexes for improved query performance

## 4. Create DTO and Mapper
1. [ ] Create CustomerDto class extending BaseEntityDto
   - [ ] Include all fields from Customer entity
   - [ ] Add validation annotations for required fields
2. [ ] Create CustomerMapper interface using MapStruct
3. [ ] Implement bidirectional mapping methods:
   - [ ] customerToCustomerDto
   - [ ] customerDtoToCustomer
4. [ ] Add any necessary custom mapping logic

## 5. Create Repository
1. [ ] Create CustomerRepository interface extending JpaRepository
2. [ ] Add findByName method for searching by customer name
3. [ ] Add findByEmail method for searching by email
4. [ ] Add any other necessary query methods

## 6. Create Service Layer
1. [ ] Create CustomerService interface
2. [ ] Create CustomerServiceImpl class implementing CustomerService
3. [ ] Implement CRUD operations:
   - [ ] getAllCustomers (with pagination support)
   - [ ] getCustomerById
   - [ ] saveCustomer
   - [ ] updateCustomer
   - [ ] deleteCustomer
4. [ ] Add appropriate exception handling
5. [ ] Add transaction annotations

## 7. Create Controller
1. [ ] Create CustomerController class
2. [ ] Implement RESTful endpoints:
   - [ ] GET /api/v1/customers - Get all customers (with pagination)
   - [ ] GET /api/v1/customers/{id} - Get customer by ID
   - [ ] POST /api/v1/customers - Create new customer
   - [ ] PUT /api/v1/customers/{id} - Update existing customer
   - [ ] DELETE /api/v1/customers/{id} - Delete customer
3. [ ] Add appropriate response status codes
4. [ ] Implement validation handling
5. [ ] Add OpenAPI documentation annotations

## 8. Update OpenAPI Documentation
1. [ ] Add Customer tag to openapi.yaml
2. [ ] Create path files for Customer operations:
   - [ ] customers.yaml (GET all, POST)
   - [ ] customers_{id}.yaml (GET by ID, PUT, DELETE)
3. [ ] Create schema file for CustomerDto
4. [ ] Add response examples
5. [ ] Document error responses

## 9. Write Tests
1. [ ] Write unit tests for CustomerMapper
   - [ ] Test customerToCustomerDto
   - [ ] Test customerDtoToCustomer
2. [ ] Write unit tests for CustomerService
   - [ ] Test getAllCustomers
   - [ ] Test getCustomerById
   - [ ] Test saveCustomer
   - [ ] Test updateCustomer
   - [ ] Test deleteCustomer
3. [ ] Write unit tests for CustomerController
   - [ ] Test all endpoints with MockMvc
4. [ ] Write integration tests for CustomerRepository
   - [ ] Test findById
   - [ ] Test findByName
   - [ ] Test findByEmail
   - [ ] Test save/update/delete
5. [ ] Write integration tests for CustomerController
   - [ ] Test all endpoints with actual HTTP requests

## 10. Verify Implementation
1. [ ] Run all tests to ensure they pass
2. [ ] Verify that the application builds successfully
3. [ ] Test the API endpoints manually
4. [ ] Verify proper error handling
5. [ ] Check API documentation is accurate and complete
