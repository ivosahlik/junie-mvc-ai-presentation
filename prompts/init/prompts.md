## PROMPTS

## Create a JPA Entity with Junie

Create a new JPA entity under the package cz.ivosahlik.juniemvcaipresentation.entities called for example Beer. The JPA
entity should use project Lombok Getters, Setters, Builder, NoArgs and AllArgs constructors. Use Integer for the ID and
version. Add the properties String beerName, String beerStyle, String upc, Integer quantityOnHand, BigDecimal price, and
JPA properties for createdDate and updateDate using LocalDateTime.

------------------------------------------------------------------------------------------------------------------------


Annotate the createdDate and updated date with JPA annotations.

------------------------------------------------------------------------------------------------------------------------


## Create spring data jpa repository and test with June

In the package `repositories` create a Spring Data JPA repository for the Beer entity. Create a test to test basic crud
operations using the repository for the Beer JPA entity. Verify tests are passing

------------------------------------------------------------------------------------------------------------------------


Add H2 in-memory database configuration for testing

------------------------------------------------------------------------------------------------------------------------


Run mvn test locally

------------------------------------------------------------------------------------------------------------------------

## Create service layer and spring mvc controller with junie


In the package controllers, create a new Spring MVC Controller for the Beer Entity. Add operations for create, get by id
and list all. In the package services, create a service interface and implementation. Add methods as needed to support
the controller operations using the Spring Data Repository. The controller should only use the service, and the service
will use the Spring Data JPA repository for persistence operations.

Create Spring MockMVC tests for the controller operations. Verify tests are passing.

------------------------------------------------------------------------------------------------------------------------


Refactor BeerController createBeer method, remove httpheader, add @ResponseStatus created

------------------------------------------------------------------------------------------------------------------------

Inspect the BeerController. Add API Endpoints for update and delete. Create new service methods. Create additional
MockMVC Tests for the new API Operations. Create a unit test to test all service operations.

------------------------------------------------------------------------------------------------------------------------


AI CHAT - add mapstruct dependencies
/web check for the latest release of mapstruct, provide the maven dependecy for latest release


------------------------------------------------------------------------------------------------------------------------


Analyze the project structure and tech stack, and create a .junie/guidelines.md file with concise, well-structured
information to help new developers. Include guidance on organizing the structure, running tests, executing scripts, and
following best practices. Keep the content short, clear, and practical.

------------------------------------------------------------------------------------------------------------------------

### Add junie guidelines
https://github.com/jetbrains/junie-guidelines

### Add prompts and requirements-draft.md
### run prompts.md `run prompts/add-dtos/prompts.md` or copy to console and run

------------------------------------------------------------------------------------------------------------------------
