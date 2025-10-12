## PROMPTS


## Create service layer and spring mvc controller with junie

In the package controllers, create a new Spring MVC Controller for the Beer Entity. Add operations for create, get by id
and list all. In the package services, create a service interface and implementation. Add methods as needed to support
the controller operations using the Spring Data Repository. The controller should only use the service, and the service
will use the Spring Data JPA repository for persistence operations.

Create Spring MockMVC tests for the controller operations. Verify tests are passing.

---------------------------------------

Refactor BeerController createBeer method, remove httpheader, add @ResponseStatus created
