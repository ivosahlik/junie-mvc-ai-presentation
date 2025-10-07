## PROMPTS

## Create a JPA Entity with Junie

### 1.

Create a new JPA entity under the package cz.ivosahlik.juniemvcaipresentation.entities called for example Beer. The JPA
entity should use project Lombok Getters, Setters, Builder, NoArgs and AllArgs constructors. Use Integer for the ID and
version. Add the properties String beerName, String beerStyle, String upc, Integer quantityOnHand, BigDecimal price, and
JPA properties for createdDate and updateDate using LocalDateTime.


### Edit

The Beer entity has been successfully created using JPA and Lombok annotations. It includes functionality for automatic
timestamp management.

### 2.

Annotate the createdDate and updated date with JPA annotations.

## Create spring data jpa repository and test with June

### 3.

In the package `repositories` create a Spring Data JPA repository for the Beer entity. Create a test to test basic crud
operations using the repository for the Beer JPA entity. Verify tests are passing

### 4.

Add H2 in-memory database configuration for testing

### 5.

Run mvn test locally





## Create service layer and spring mvc controller with junie

### 6.

In the package controllers, create a new Spring MVC Controller for the Beer Entity. Add operations for create, get by id
and list all. In the package services, create a service interface and implementation. Add methods as needed to support
the controller operations using the Spring Data Repository. The controller should only use the service, and the service
will use the Spring Data JPA repository for persistence operations.

Create Spring MockMVC tests for the controller operations. Verify tests are passing.

## Plan

1. Explore project for existing controllers/services to avoid duplicates.
2. Implement service layer.
3. Implement controller.
4. Add MockMVC tests for controller.
5. Run test suite to verify all tests pass.
6. Summarize changes and submit.

### 7.

Refactor BeerController createBeer method, remove httpheader, add @ResponseStatus created
