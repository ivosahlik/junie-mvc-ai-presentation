## PROMPTS

## Create a JPA Entity with Junie

### 1.

Create a new JPA entity under the package cz.ivosahlik.juniemvcaipresentation.entities called for example Beer. The JPA
entity should use project Lombok Getters, Setters, Builder, NoArgs and AllArgs constructors. Use Integer for the ID and
version. Add the properties String beerName, String beerStyle, String upc, Integer quantityOnHand, BigDecimal price, and
JPA properties for createdDate and updateDate using LocalDateTime.

## Plan

1. Inspect pom.xml to ensure Lombok, Spring Data JPA, and necessary dependencies exist.
2. Create Beer entity class under src/main/java/cz/ivosahlik/juniemvcaipresentation/entities with required fields and
   annotations.
3. Build the project to verify compilation.
4. Run tests (if any) to ensure no regressions.
5. Summarize changes and submit.

### Get structure pom.xml

The pom.xml file has been opened to verify the presence of Lombok and JPA dependencies, which will inform the decision
on annotation strategies for created and updated timestamps.

### Edit

The Beer entity has been successfully created using JPA and Lombok annotations. It includes functionality for automatic
timestamp management.

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

## Plan

1. Explore project for existing controllers/services to avoid duplicates.
2. Implement service layer.
3. Implement controller.
4. Add MockMVC tests for controller.
5. Run test suite to verify all tests pass.
6. Summarize changes and submit.

### 7.

Refactor BeerController createBeer method, remove httpheader, add @ResponseStatus created

### 8.

Inspect the BeerController. Add API Endpoints for update and delete. Create new service methods. Create additional
MockMVC Tests for the new API Operations. Create a unit test to test all service operations.

## Plan

1. Inspect current BeerService and BeerServiceImpl to see available methods and patterns.
2. Update service layer.

- Add updateBeer(Integer id, Beer beer) to BeerService and implement in BeerServiceImpl returning Optional<Beer>.
- Add deleteBeer(Integer id) to BeerService and implement in BeerServiceImpl returning boolean.

3. Update BeerController with PUT and DELETE endpoints, including proper HTTP status handling (200 for update success,
   404 when not found; 204 for delete success, 404 when not found).
4. Add MockMVC tests for update and delete scenarios (success and not found).
5. Add a unit test for BeerService covering create, getById, list, update, and delete using in-memory H2 with
   @SpringBootTest.
6. Run all tests and verify passing.
7. Summarize changes and submit.

### 9.

AI CHAT - add mapstruct dependencies
/web check for the latest release of mapstruct, provide the maven dependecy for latest release


### 10.

Analyze the project structure and tech stack, and create a .junie/guidelines.md file with concise, well-structured
information to help new developers. Include guidance on organizing the structure, running tests, executing scripts, and
following best practices. Keep the content short, clear, and practical.


------------------------------------------------------------------------------------------------------------------------

## 11. 
### Add junie guidelines
https://github.com/jetbrains/junie-guidelines



















------------------------------------------------------------------------------------------------------------------------

Ask ChatGPT

## How to run tests locally

Prerequisites:

- Java 21 installed (JAVA_HOME pointing to JDK 21)
- Maven 3.9+ installed (or use the Maven Wrapper provided in the repo)

Commands:

- Using installed Maven:
    - mvn -q -DskipTests=false test
- Using Maven Wrapper (recommended, cross-platform):
    - macOS/Linux: ./mvnw -q -DskipTests=false test
    - Windows (PowerShell/CMD): mvnw.cmd -q -DskipTests=false test

What this does:

- Starts an in-memory H2 database for tests (configured via src/test/resources/application.properties)
- Creates and tears down schema automatically (spring.jpa.hibernate.ddl-auto=create-drop)
- Runs JUnit 5 tests (Spring Boot manages Surefire/JUnit versions)

Troubleshooting:

- Ensure no local database configuration overrides are present in environment variables or IDE run configurations.
- If you see Flyway errors about missing migrations, confirm tests are using src/test/resources/application.properties
  where spring.flyway.enabled=false.
- If you have multiple JDKs, run: java -version and mvn -v to verify Java 21 is active.
