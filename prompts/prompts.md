## PROMPTS

## Create a JPA Entity with Junie


Create a new JPA entity under the package cz.ivosahlik.juniemvcaipresentation.entities called for example Beer. The JPA
entity should use project Lombok Getters, Setters, Builder, NoArgs and AllArgs constructors. Use Integer for the ID and
version. Add the properties String beerName, String beerStyle, String upc, Integer quantityOnHand, BigDecimal price, and
JPA properties for createdDate and updateDate using LocalDateTime.

----------------------------------------------------

Annotate the createdDate and updated date with JPA annotations.

----------------------------------------------------

## Create spring data jpa repository and test with June

In the package `repositories` create a Spring Data JPA repository for the Beer entity. Create a test to test basic crud
operations using the repository for the Beer JPA entity. Verify tests are passing

----------------------------------------------------

Add H2 in-memory database configuration for testing

----------------------------------------------------

Run mvn test locally

----------------------------------------------------

## Create service layer and spring mvc controller with junie

In the package controllers, create a new Spring MVC Controller for the Beer Entity. Add operations for create, get by id
and list all. In the package services, create a service interface and implementation. Add methods as needed to support
the controller operations using the Spring Data Repository. The controller should only use the service, and the service
will use the Spring Data JPA repository for persistence operations.

Create Spring MockMVC tests for the controller operations. Verify tests are passing.

----------------------------------------------------

Refactor BeerController createBeer method, remove httpheader, add @ResponseStatus created

---------------------------------------------------


AI CHAT OLD - add mapstruct dependencies
/web check for the latest release of mapstruct, provide the maven dependecy for latest release
<version>1.5.5.Final</version>

AI CHAT - claude agent - add mapstruct dependencies
check for the latest release of mapstruct, provide the maven dependecy for latest release
<version>1.6.3</version>


Github copilot
check for the latest release of mapstruct, provide the maven dependecy for latest release, could be not final
<version>1.6.3</version>

