Project guidelines

Purpose
- Give new contributors a quick, practical start for this Spring Boot + JPA project.

Tech stack
- Java 21
- Spring Boot (Web, Data JPA)
- Lombok (getters/setters/builders)
- H2 (in-memory DB for tests)
- Maven (wrapper included: mvnw/mvnw.cmd)
- JUnit 5, Spring Test (MockMVC)

Project structure
- src/main/java/.../controllers: REST controllers (HTTP layer only). Use @RestController.
- src/main/java/.../services: Business logic. Interfaces + @Service implementations.
- src/main/java/.../repositories: Spring Data JPA interfaces.
- src/main/java/.../entities: JPA entities with Lombok annotations.
- src/main/resources: application.properties (defaults for runtime/dev).
- src/test/java: Unit/integration tests; prefer package mirroring main structure.
- src/test/resources: test-only config (overrides prod/dev). Uses H2.

Conventions
- Package: cz.ivosahlik.juniemvcaipresentation.*
- Controller rules:
  - No repository access directly; depend on services.
  - Return proper HTTP codes (201 create, 200/404 read/update, 204/404 delete).
- Service rules:
  - Encapsulate transactions and domain logic; depend on repositories.
  - Prefer Optional for lookups. Validate inputs early.
- Entity rules:
  - Use Lombok: @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor.
  - JPA: @Entity, @Id, @Version, auditing timestamps as needed.
- Naming: pluralize collections; avoid abbreviations; prefer immutable DTOs if exposing API models.

Setup
- Prereqs: Java 21, internet access for Maven.
- First build: ./mvnw -q -DskipTests=false clean verify

Run the app
- Dev run: ./mvnw spring-boot:run
- Or jar: ./mvnw -q -DskipTests package && java -jar target/*-SNAPSHOT.jar

Run tests
- All tests: ./mvnw -q -DskipTests=false test
- Single test class: ./mvnw -q -Dtest=BeerControllerTest test
- Single test method: ./mvnw -q -Dtest=BeerControllerTest#shouldCreateBeer test
- What happens: uses H2 in-memory DB; schema auto managed (ddl-auto=create-drop).

Useful scripts/commands
- Dependency tree: ./mvnw -q dependency:tree
- Format via IDE profile; Maven built-in formatter is not enforced here.
- Run with extra logs: ./mvnw -Dspring-boot.run.arguments="--logging.level.root=DEBUG" spring-boot:run

Database notes
- Tests use in-memory H2 (src/test/resources/application.properties).
- Avoid relying on data order; assert by fields/ids.
- Use @Transactional at service layer if methods span multiple repository calls.

Testing best practices
- Controller: use @WebMvcTest + MockMVC for slice tests.
- Service: @SpringBootTest or @DataJpaTest depending on need.
- Repository: @DataJpaTest with H2.
- Keep tests independent; set up data per test; no external state.

API/REST best practices
- Validate inputs with javax/jakarta validation; return 400 on violations.
- Use clear, resource-oriented paths (e.g., /api/v1/beers).
- Return Location header on create when applicable.

CI/CD (optional)
- If adding CI, cache Maven repo and run: ./mvnw -B -DskipTests=false verify

Common issues
- Wrong JDK: run java -version and ./mvnw -v to confirm Java 21.
- Conflicting DB config: ensure tests pick src/test/resources/application.properties.

Where to start
- Read README.md for background and prompts.
- Browse entities -> repositories -> services -> controllers -> tests.
- Pick a small test to run and iterate.
