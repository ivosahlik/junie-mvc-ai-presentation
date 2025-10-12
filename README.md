## PROMPTS

## Create a JPA Entity with Junie

### 1.

Create a new JPA entity under the package cz.ivosahlik.juniemvcaipresentation.entities called for example Beer. The JPA
entity should use project Lombok Getters, Setters, Builder, NoArgs and AllArgs constructors. Use Integer for the ID and
version. Add the properties String beerName, String beerStyle, String upc, Integer quantityOnHand, BigDecimal price, and
JPA properties for createdDate and updateDate using LocalDateTime.

### 2.

Annotate the createdDate and updated date with JPA annotations.

## Create spring data jpa repository and test with June

### 3.

In the package `repositories` create a Spring Data JPA repository for the Beer entity. Create a test to test basic crud
operations using the repository for the Beer JPA entity. Verify tests are passing

## Plan

1. Inspect current application.properties to confirm its contents and determine if H2 settings are present.
2. Create src/test/resources/application.properties with H2 in-memory configuration suitable for tests:

- datasource URL (jdbc:h2:mem:...), username/password, driver
- JPA ddl-auto=create-drop for clean test schema
- show-sql=true (optional)
- spring.h2.console.enabled=true (optional)
- spring.flyway.enabled=false (avoid migrations during tests)

3. Attempt to run tests; if the runner tool fails due to environment limitations, document how to run mvn test locally.
4. Summarize changes and submit.

### 4.

Add H2 in-memory database configuration for testing

### 5.

Run mvn test locally

## Plan

1. Inspect BeerRepositoryTest for data/assertion mismatch.
2. Correct sampleBeer() values to match assertions.
3. Execute tests using available runner and verify pass.
4. Provide final instructions for running tests locally with Maven and submit.

## Create service layer and spring mvc controller with junie

### 6.

In the package controllers, create a new Spring MVC Controller for the Beer Entity. Add operations for create, get by id
and list all. In the package services, create a service interface and implementation. Add methods as needed to support
the controller operations using the Spring Data Repository. The controller should only use the service, and the service
will use the Spring Data JPA repository for persistence operations.

Create Spring MockMVC tests for the controller operations. Verify tests are passing.

### 7.

Refactor BeerController createBeer method, remove httpheader, add @ResponseStatus created





---------------------------------------------



### 8.
# PROMPT
Inspect the BeerController. Add API Endpoints for update and delete. Create new service methods. Create additional
MockMVC Tests for the new API Operations. Create a unit test to test all service operations.

