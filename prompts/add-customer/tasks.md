# Customer Entity Implementation Tasks

## 1. Create Customer Entity
- [ ] Create Customer JPA entity that extends BaseEntity
- [ ] Add required properties (name, email, phoneNumber, addressLine1, addressLine2, city, state, postalCode)
- [ ] Add proper validation annotations (@NotNull, etc.) to required fields
- [ ] Implement OneToMany relationship with BeerOrder

## 2. Update BeerOrder Entity
- [ ] Add ManyToOne relationship to Customer
- [ ] Replace customerRef field with Customer reference
- [ ] Update any methods that use customerRef

## 3. Create Flyway Migration Script
- [ ] Create V2__add_customer_table.sql migration script
- [ ] Implement customer table creation with all required fields
- [ ] Modify beer_order table to add customer_id foreign key
- [ ] Add appropriate constraints and indexes

## 4. Create DTO and Mapper
- [ ] Create CustomerDto class extending BaseEntityDto
- [ ] Add all necessary properties to DTO
- [ ] Create CustomerMapper interface using MapStruct
- [ ] Implement bidirectional mapping between Customer entity and DTO
- [ ] Add validation annotations to DTO fields

## 5. Create Repository
- [ ] Create CustomerRepository interface extending JpaRepository
- [ ] Add any necessary custom query methods
- [ ] Add appropriate query annotations

## 6. Create Service Layer
- [ ] Create CustomerService interface
- [ ] Define CRUD method signatures
- [ ] Create CustomerServiceImpl class
- [ ] Implement getAllCustomers method
- [ ] Implement getCustomerById method
- [ ] Implement saveCustomer method
- [ ] Implement updateCustomer method
- [ ] Implement deleteCustomer method
- [ ] Add proper transaction annotations

## 7. Create Controller
- [ ] Create CustomerController class
- [ ] Implement GET endpoint for all customers
- [ ] Implement GET endpoint for customer by ID
- [ ] Implement POST endpoint to create customer
- [ ] Implement PUT endpoint to update customer
- [ ] Implement DELETE endpoint to delete customer
- [ ] Add proper response status annotations
- [ ] Handle not found exceptions

## 8. Update OpenAPI Documentation
- [ ] Add Customer tag to openapi.yaml
- [ ] Create customers.yaml path file for GET all and POST operations
- [ ] Create customers_{id}.yaml path file for GET by ID, PUT, and DELETE operations
- [ ] Create Customer.yaml schema file for CustomerDto
- [ ] Validate OpenAPI documentation with linting tool

## 9. Write Tests
- [ ] Create CustomerMapperTest
- [ ] Create CustomerServiceTest
- [ ] Create CustomerControllerTest
- [ ] Create CustomerRepositoryIntegrationTest
- [ ] Create CustomerControllerIntegrationTest
- [ ] Test all CRUD operations
- [ ] Test error handling

## 10. Verify Implementation
- [ ] Run all tests to ensure they pass
- [ ] Verify the application builds successfully
- [ ] Test the API endpoints manually
- [ ] Verify proper error handling
- [ ] Check database schema after migration
