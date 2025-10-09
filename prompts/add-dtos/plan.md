# Project Improvement Plan: Replace Entity Exposure with DTOs in Beer API

This plan details the steps to implement the requirements from `prompts/add-dtos/requirements.md`. The goal is to refactor the web and service layers to use DTOs, introduce MapStruct-based mapping, and adjust tests accordingly, without changing public REST URLs or semantics.

## 1) Preparation and Validation
- Verify Lombok and MapStruct are correctly configured in `pom.xml`:
  - Lombok dependency and annotation processor present
  - MapStruct dependency and annotation processor present
  - Component model default set to `spring` (or specify in `@Mapper`)
- Confirm current API base path `/api/v1/beers` and locate files:
  - `controllers/BeerController.java`
  - `services/BeerService.java`, `services/BeerServiceImpl.java`
  - `entities/Beer.java`
  - Tests in `src/test/java/...`
- Optional but recommended: set `spring.jpa.open-in-view=false` in `application.properties` (aligns with guidelines; no immediate impact here).

Deliverable: No code yet, but we are certain the toolchain can generate MapStruct and Lombok code during build.

## 2) Introduce BeerDto
- Create `cz.ivosahlik.juniemvcaipresentation.models.BeerDto` with fields mirroring `entities.Beer`:
  - `Integer id`
  - `Integer version`
  - `String beerName`
  - `String beerStyle`
  - `String upc`
  - `Integer quantityOnHand`
  - `BigDecimal price`
  - `LocalDateTime createdDate`
  - `LocalDateTime updateDate`
- Lombok annotations:
  - `@Builder`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Jakarta Validation annotations for request validation:
  - `@NotBlank` with length <= 255 on `beerName`
  - `@NotBlank` with length <= 100 on `beerStyle`
  - `@NotBlank` with length <= 50 on `upc`
  - `@NotNull` and `@Min(0)` on `quantityOnHand`
  - `@NotNull` and `@DecimalMin("0.00")` on `price`
- JSON contract: keep camelCase property names, same as entity, to avoid client-facing breaking changes.

Deliverable: New DTO class under `src/main/java/cz/ivosahlik/juniemvcaipresentation/models/BeerDto.java`.

## 3) Create MapStruct BeerMapper
- Create `cz.ivosahlik.juniemvcaipresentation.mappers.BeerMapper`:
  - Annotate with `@Mapper(componentModel = "spring")`
  - Methods:
    - `BeerDto toDto(Beer entity)`
    - `Beer toEntity(BeerDto dto)`
    - `void updateEntityFromDto(BeerDto dto, @MappingTarget Beer entity)`
- Mapping rules:
  - For DTO → Entity (both `toEntity` and `updateEntityFromDto`), ignore `id`, `createdDate`, `updateDate` so they’re managed by DB/Hibernate
  - Otherwise, map fields by name

Deliverable: New mapper interface under `src/main/java/cz/ivosahlik/juniemvcaipresentation/mappers/BeerMapper.java`.

## 4) Refactor Service Layer to Use DTOs
- Update `BeerService` signatures:
  - `BeerDto createBeer(BeerDto beer)`
  - `Optional<BeerDto> getBeerById(Integer id)`
  - `List<BeerDto> listBeers()`
  - `Optional<BeerDto> updateBeer(Integer id, BeerDto beer)`
  - `boolean deleteBeer(Integer id)`
- Refactor `BeerServiceImpl`:
  - Use constructor injection with `final` fields for `BeerRepository` and `BeerMapper` (constructor injection per guidelines)
  - Implement conversions via `BeerMapper`:
    - Create: `dto → entity (ignore id/dates) → repository.save(entity) → toDto(saved)`
    - Get/List: `entity/entities → toDto(s)`
    - Update: `findById → if present updateEntityFromDto(dto, entity) → save → toDto`, else `Optional.empty()`
    - Delete: as-is; return true if deleted, false if not found
  - Add transaction boundaries:
    - `@Transactional` on create/update/delete
    - `@Transactional(readOnly = true)` on get/list

Deliverables:
- `BeerService.java` updated to DTO signatures
- `BeerServiceImpl.java` updated implementation using `BeerMapper`

## 5) Refactor Controller to Use DTOs and Validation
- Keep class name and mapping base path `/api/v1/beers`
- Prefer constructor injection; controller may be package-private
- Replace entity types in method signatures with `BeerDto` and collections of `BeerDto`
- Add `@Valid` on `@RequestBody BeerDto` for POST and PUT
- Return types and status codes via `ResponseEntity`:
  - POST: `ResponseEntity.status(HttpStatus.CREATED).body(createdDto)`
  - GET by id: `200 OK` with body or `404 Not Found`
  - GET list: `200 OK` with `List<BeerDto>`
  - PUT: `200 OK` with updated DTO or `404 Not Found`
  - DELETE: `204 No Content` on success; `404 Not Found` if missing

Deliverable: `BeerController.java` updated to consume/produce DTOs.

## 6) Persistence and Timestamp Handling
- Ensure `id`, `createdDate`, and `updateDate` are not set from incoming DTOs
- Rely on DB/Hibernate to populate/manage these fields
- Verified by MapStruct ignore rules in section 3

## 7) Testing Plan and Updates
- Controller tests (`BeerControllerTest`):
  - Update to build and assert `BeerDto` instances instead of `Beer` entities
  - Mock `BeerService` using DTO signatures
  - Validate status codes (201/200/404/204) and JSON content structure
- Service tests (`BeerServiceImplTest`):
  - Use real `BeerMapper` instance if practical or mock mapping behavior
  - Verify entity↔DTO conversions and transactional behaviors (where possible)
- Repository tests (`BeerRepositoryTest`):
  - Unchanged, as repository still works with entities
- Run `mvn clean verify` and ensure compilation of MapStruct-generated mappers; address any annotation processor config issues if they appear

Deliverables:
- Updated tests to align with DTO usage
- All tests passing

## 8) Non-functional and Guidelines Alignment
- Constructor injection in services and controllers
- Package-private visibility where appropriate for Spring components
- Validation at DTO boundary ensures early rejection of invalid input
- Clear transaction boundaries at service layer
- Consider central exception handling (future improvement) using `@RestControllerAdvice` and ProblemDetails (RFC 9457)

## 9) Work Breakdown and File Checklist
- Add: `src/main/java/.../models/BeerDto.java`
- Add: `src/main/java/.../mappers/BeerMapper.java`
- Modify: `src/main/java/.../services/BeerService.java`
- Modify: `src/main/java/.../services/BeerServiceImpl.java`
- Modify: `src/main/java/.../controllers/BeerController.java`
- Modify tests:
  - `src/test/java/.../controllers/BeerControllerTest.java`
  - `src/test/java/.../services/BeerServiceImplTest.java`
  - `src/test/java/.../repositories/BeerRepositoryTest.java` (likely unchanged)
- Optional: `src/main/resources/application.properties` — set `spring.jpa.open-in-view=false`

## 10) Acceptance Criteria (matches Definition of Done)
- BeerDto exists with required fields, Lombok, and validation annotations
- BeerMapper exists with DTO↔Entity methods and ignores id/created/updated on DTO→Entity mappings
- Service layer uses DTOs end-to-end, with transaction annotations and constructor injection
- Controller consumes/produces BeerDto and enforces validation with `@Valid`; preserves REST semantics/status codes
- Project builds successfully with MapStruct and Lombok (no processor errors)
- Tests compile and pass with DTO changes

## 11) Risks and Mitigations
- Risk: MapStruct or Lombok annotation processors not configured → Verify `pom.xml` and IDE settings; run `mvn clean verify`
- Risk: Validation constraints cause test failures → Update tests to provide valid DTO data; adjust tests purposefully for validation scenarios
- Risk: JSON serialization differences → Keep field names and types identical; verify through controller tests

## 12) Rollout Strategy
- Refactor in a feature branch
- Commit in small steps: add DTO + mapper → refactor service → refactor controller → update tests
- Ensure green build after each step

## 13) Time and Effort Estimate
- DTO and mapper: 0.5–1 hour
- Service refactor: 0.5 hour
- Controller refactor: 0.5 hour
- Test updates: 1–2 hours
- Build and fixes: 0.5 hour

Total: ~3–4 hours depending on test complexity.
