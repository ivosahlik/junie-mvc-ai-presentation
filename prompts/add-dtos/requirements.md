# Requirements: Replace Entity Exposure with DTOs in Beer API

Scope: Refactor the Beer API so the web and service layers use explicit DTOs instead of exposing JPA entities. Introduce a MapStruct mapper to convert between the DTO and the JPA entity. Keep public REST URLs and overall behavior unchanged while aligning with the Spring Boot guidelines provided in this repository.

## 1. Data Transfer Object (DTO)
- Create class: `cz.ivosahlik.juniemvcaipresentation.models.BeerDto`.
- Fields (mirror `entities.Beer`):
  - `Integer id`
  - `Integer version`
  - `String beerName`
  - `String beerStyle`
  - `String upc`
  - `Integer quantityOnHand`
  - `BigDecimal price`
  - `LocalDateTime createdDate`
  - `LocalDateTime updateDate`
- Lombok annotations: `@Builder`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`.
- Validation (Jakarta Validation) for incoming requests:
  - `beerName`: `@NotBlank`, length ≤ 255.
  - `beerStyle`: `@NotBlank`, length ≤ 100.
  - `upc`: `@NotBlank`, length ≤ 50.
  - `quantityOnHand`: `@NotNull`, `@Min(0)`.
  - `price`: `@NotNull`, `@DecimalMin("0.00")`.
- JSON: keep camelCase property names consistent with current API to avoid breaking changes.

## 2. MapStruct Mapper
- Create interface: `cz.ivosahlik.juniemvcaipresentation.mappers.BeerMapper`.
- Annotation: `@Mapper(componentModel = "spring")`.
- Methods:
  - `BeerDto toDto(Beer entity)`
  - `Beer toEntity(BeerDto dto)`
  - `void updateEntityFromDto(BeerDto dto, @MappingTarget Beer entity)`
- Mapping rules for DTO → Entity (both `toEntity` and `updateEntityFromDto`):
  - Ignore `id`, `createdDate`, and `updateDate` so they are managed by the database/Hibernate.
  - Map remaining fields by name.

## 3. Service Layer Refactor (use DTOs end-to-end)
- Update `cz.ivosahlik.juniemvcaipresentation.services.BeerService` method signatures to use DTOs:
  - `BeerDto createBeer(BeerDto beer)`
  - `Optional<BeerDto> getBeerById(Integer id)`
  - `List<BeerDto> listBeers()`
  - `Optional<BeerDto> updateBeer(Integer id, BeerDto beer)`
  - `boolean deleteBeer(Integer id)`
- Implementation (`BeerServiceImpl`):
  - Use constructor injection with `final` fields for dependencies (`BeerRepository`, `BeerMapper`).
  - Transactions:
    - Annotate read methods with `@Transactional(readOnly = true)`.
    - Annotate modifying methods (create/update/delete) with `@Transactional`.
  - Conversions via `BeerMapper`:
    - Create: `dto → entity (id/dates ignored) → repository.save(entity) → toDto(saved)`.
    - Get/List: `entity/entities → toDto(s)`.
    - Update: `findById → if present updateEntityFromDto(dto, entity) → save → toDto`, else `Optional.empty()`.
    - Delete: return `true` if deletion performed; `false` if id not found.

## 4. Controller Refactor (consume/produce DTOs)
- Keep base path and semantics unchanged (e.g., `/api/v1/beers`).
- Prefer constructor injection; controller can be package‑private.
- Replace entity types in method signatures and responses with `BeerDto` (or collections thereof).
- Validate inputs: annotate `@RequestBody BeerDto` with `@Valid` for POST/PUT.
- Use `ResponseEntity` to express status codes:
  - POST create: `201 Created` with created `BeerDto` in body.
  - GET by id: `200 OK` with `BeerDto` or `404 Not Found` if missing.
  - GET list: `200 OK` with `List<BeerDto>`.
  - PUT update: `200 OK` with updated `BeerDto` or `404 Not Found`.
  - DELETE: `204 No Content` if deleted; `404 Not Found` if missing.
- Content type: JSON request/response bodies.

## 5. Persistence and Timestamps
- Do not accept `id`, `createdDate`, or `updateDate` from clients for persistence purposes.
- Ensure DTO → Entity mapping ignores these fields; they should be set/managed by the persistence layer.

## 6. Build and Dependencies
- Ensure Lombok and MapStruct are configured in `pom.xml` with annotation processors enabled so generated code is produced during compilation.
- Recommended MapStruct config: either global processor option or per‑mapper `componentModel = "spring"`.

## 7. Testing Expectations
- Adjust controller tests to send/receive `BeerDto` JSON payloads and assert correct status codes and response structures.
- Adjust service tests to operate with DTO signatures and verify mapper usage where applicable.
- Repository tests stay unchanged (repositories continue working with entities).
- Project must build (`mvn clean verify`) with MapStruct/Lombok code generation succeeding.

## 8. Non‑functional Requirements and Guidelines Alignment
- Follow constructor injection and prefer package‑private visibility for Spring components where possible.
- Define clear transaction boundaries in the service layer.
- Validate inputs at the DTO boundary using Jakarta Validation annotations.
- Optional (future): centralize exception handling using `@RestControllerAdvice` with ProblemDetails (RFC 9457).
- Optional (recommended): set `spring.jpa.open-in-view=false` in `application.properties` per guidelines.

## 9. Acceptance Criteria
- BeerDto exists with fields, Lombok, and validation as specified.
- BeerMapper exists with DTO↔Entity methods, ignoring id/createdDate/updateDate on DTO→Entity mappings.
- Service layer uses DTOs end‑to‑end with appropriate transaction annotations and constructor injection.
- Controller consumes/produces `BeerDto`, validates requests, and returns correct HTTP status codes.
- The application builds successfully with MapStruct and Lombok; updated tests compile and pass.

## 10. Add lombok to controllers
- Edit BeerController with lombok, add @RequireArgsConstructor
