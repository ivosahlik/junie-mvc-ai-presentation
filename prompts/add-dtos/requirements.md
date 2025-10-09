Title: Replace Entity Exposure with DTOs in Beer API

Objective
- Refactor the Beer API so that the web layer (controllers) and service layer work with DTOs instead of exposing JPA entities directly.
- Introduce MapStruct mappers to handle conversions between entity and DTO types.
- Keep the REST URLs and semantics unchanged while improving encapsulation, validation, and testability.

Scope
- Applies to BeerController, BeerService, and BeerServiceImpl.
- Adds a DTO class BeerDto and a MapStruct mapper BeerMapper.
- No database schema changes are required.

Relevant project context
- Current controller and service expose cz.ivosahlik.juniemvcaipresentation.entities.Beer directly.
- Lombok is already used by the entity. MapStruct is configured in pom.xml (processor and default spring component model).
- API base path: /api/v1/beers

Design and implementation requirements
1) DTOs
- Create class: cz.ivosahlik.juniemvcaipresentation.models.BeerDto
- Fields: id, version, beerName, beerStyle, upc, quantityOnHand, price, createdDate, updateDate
  • Use the same Java types as the Beer entity (Integer, String, BigDecimal, LocalDateTime, etc.).
- Lombok: annotate with @Builder, @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor.
- Validation (request payloads):
  • beerName: @NotBlank, length <= 255
  • beerStyle: @NotBlank, length <= 100
  • upc: @NotBlank, length <= 50
  • quantityOnHand: @NotNull, @Min(0)
  • price: @NotNull, @DecimalMin("0.00")
- JSON contract:
  • Keep property names in camelCase (consistent with existing JSON).
  • Accept/return JSON objects for both single resource and collections (standard Spring Web behavior).

2) MapStruct mapper
- Create interface: cz.ivosahlik.juniemvcaipresentation.mappers.BeerMapper
- Annotations: @Mapper(componentModel = "spring")
- Methods:
  • BeerDto toDto(Beer entity)
  • Beer toEntity(BeerDto dto)
  • void updateEntityFromDto(BeerDto dto, @MappingTarget Beer entity)
- Mapping rules:
  • When mapping from DTO to entity (both toEntity and updateEntityFromDto), ignore id, createdDate, updateDate (these are generated/managed by DB/Hibernate).
  • Let MapStruct map remaining fields by name.
- Optional: add @BeanMapping(ignoreByDefault = false) only if you need stricter control; default behavior is fine here.

3) Service layer
- Change interface cz.ivosahlik.juniemvcaipresentation.services.BeerService to work with DTOs:
  • BeerDto createBeer(BeerDto beer)
  • Optional<BeerDto> getBeerById(Integer id)
  • List<BeerDto> listBeers()
  • Optional<BeerDto> updateBeer(Integer id, BeerDto beer)
  • boolean deleteBeer(Integer id)
- Implementation in BeerServiceImpl:
  • Inject BeerRepository and BeerMapper via constructor (prefer constructor injection; mark fields final).
  • Use BeerMapper for all entity↔DTO conversions.
  • For create: map DTO→entity (ignoring id/createdDate/updateDate), save, return saved entity mapped to DTO.
  • For get/list: fetch entity/entities, map to DTO(s).
  • For update: find entity; if present, call mapper.updateEntityFromDto(dto, entity), save, return DTO; else return Optional.empty().
  • For delete: unchanged semantic; return true if deleted, false if not found.
  • Add @Transactional on write methods and @Transactional(readOnly = true) on read methods.

4) Controller
- Keep the same base path /api/v1/beers and HTTP semantics.
- Accept and return BeerDto in all endpoints.
- Use ResponseEntity consistently:
  • POST: return 201 Created and the created BeerDto in body.
  • GET (by id): 200 OK with BeerDto or 404 Not Found.
  • GET (list): 200 OK with List<BeerDto>.
  • PUT: 200 OK with updated BeerDto or 404 Not Found.
  • DELETE: 204 No Content on success; 404 Not Found if the resource doesn’t exist.
- Prefer constructor injection; controller can remain package-private (no need for public visibility), but maintainers may keep public for consistency.
- Apply @Valid to @RequestBody BeerDto parameters to enforce validation rules.

5) Packages and naming
- DTOs in package: cz.ivosahlik.juniemvcaipresentation.models
- Mappers in package: cz.ivosahlik.juniemvcaipresentation.mappers
- Do not rename existing packages beyond those additions.

6) Persistence and timestamps
- Do not set id, createdDate, or updateDate from requests; these are managed by the database and Hibernate.
- Ensure MapStruct ignores these fields on DTO→entity mappings (both create and update), as noted above.

7) Error handling
- Keep existing behavior (404 on missing resource).
- If a validation error occurs (@Valid), rely on Spring’s default MethodArgumentNotValidException handling for now; a future improvement may introduce a centralized error handler with RFC 9457 ProblemDetails.

8) Backward compatibility and tests
- Public REST URLs and shapes remain functionally the same (field names are unchanged), but responses are now serialized from DTOs instead of entities.
- Update or create tests to mock BeerService using DTOs. Existing controller tests will need to switch from Beer to BeerDto.
- No breaking changes to the endpoint paths or required fields.

Definition of done
- A BeerDto class exists in cz.ivosahlik.juniemvcaipresentation.models with Lombok annotations and validation constraints as specified.
- A BeerMapper interface exists in cz.ivosahlik.juniemvcaipresentation.mappers with the three methods and mapping rules specified.
- BeerService and BeerServiceImpl are refactored to use DTOs end-to-end and rely on BeerMapper for conversions, with appropriate @Transactional annotations.
- BeerController accepts and returns BeerDto, applies @Valid where appropriate, and preserves current REST semantics and status codes.
- The project builds successfully (mvn clean verify) without MapStruct/Lombok errors.
- Tests compile and pass after being updated to use DTOs.

Notes and rationale
- This change follows the guideline to separate web and persistence layers by avoiding direct exposure of JPA entities.
- Constructor injection is preferred to keep objects in a valid state and make dependencies explicit.
- Transaction boundaries are defined at the service layer.
- Validation at the DTO level ensures invalid data is rejected before reaching the persistence layer.
