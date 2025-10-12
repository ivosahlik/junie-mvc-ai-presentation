# Implementation Plan: Replace Entity Exposure with DTOs in Beer API

## Overview
Refactor the Beer API to use DTOs instead of directly exposing JPA entities, implementing proper separation between web, service, and persistence layers while maintaining backward compatibility.

## Implementation Steps

### Phase 1: Create Data Transfer Objects
**Estimated Time: 30 minutes**

#### Step 1.1: Create BeerDto Class
- **File**: `src/main/java/cz/ivosahlik/juniemvcaipresentation/models/BeerDto.java`
- **Package**: `cz.ivosahlik.juniemvcaipresentation.models`
- **Requirements**:
  - Fields: `id`, `version`, `beerName`, `beerStyle`, `upc`, `quantityOnHand`, `price`, `createdDate`, `updateDate`
  - Use same Java types as Beer entity (Integer, String, BigDecimal, LocalDateTime)
  - Lombok annotations: `@Builder`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`
  - Validation annotations:
    - `beerName`: `@NotBlank`, `@Size(max = 255)`
    - `beerStyle`: `@NotBlank`, `@Size(max = 100)`
    - `upc`: `@NotBlank`, `@Size(max = 50)`
    - `quantityOnHand`: `@NotNull`, `@Min(0)`
    - `price`: `@NotNull`, `@DecimalMin("0.00")`

### Phase 2: Create MapStruct Mapper
**Estimated Time: 20 minutes**

#### Step 2.1: Create BeerMapper Interface
- **File**: `src/main/java/cz/ivosahlik/juniemvcaipresentation/mappers/BeerMapper.java`
- **Package**: `cz.ivosahlik.juniemvcaipresentation.mappers`
- **Requirements**:
  - Annotation: `@Mapper(componentModel = "spring")`
  - Methods:
    - `BeerDto toDto(Beer entity)`
    - `Beer toEntity(BeerDto dto)` - ignore `id`, `createdDate`, `updateDate`
    - `void updateEntityFromDto(BeerDto dto, @MappingTarget Beer entity)` - ignore `id`, `createdDate`, `updateDate`
  - Use `@Mapping(target = "field", ignore = true)` for ignored fields

### Phase 3: Refactor Service Layer
**Estimated Time: 45 minutes**

#### Step 3.1: Update BeerService Interface
- **File**: `src/main/java/cz/ivosahlik/juniemvcaipresentation/services/BeerService.java`
- **Changes**:
  - Change all method signatures to use `BeerDto` instead of `Beer`
  - Methods to update:
    - `BeerDto createBeer(BeerDto beer)`
    - `Optional<BeerDto> getBeerById(Integer id)`
    - `List<BeerDto> listBeers()`
    - `Optional<BeerDto> updateBeer(Integer id, BeerDto beer)`
    - `boolean deleteBeer(Integer id)` - signature remains same

#### Step 3.2: Refactor BeerServiceImpl
- **File**: `src/main/java/cz/ivosahlik/juniemvcaipresentation/services/BeerServiceImpl.java`
- **Changes**:
  - Add `BeerMapper` dependency via constructor injection (mark field `final`)
  - Update all method implementations:
    - **createBeer**: DTO→entity mapping, save, return entity→DTO
    - **getBeerById**: fetch entity, map to DTO
    - **listBeers**: fetch entities, map to DTOs
    - **updateBeer**: find entity, use `updateEntityFromDto`, save, return DTO
    - **deleteBeer**: keep current logic
  - Add transaction annotations:
    - `@Transactional` on write methods
    - `@Transactional(readOnly = true)` on read methods

### Phase 4: Refactor Controller Layer
**Estimated Time: 30 minutes**

#### Step 4.1: Update BeerController
- **File**: `src/main/java/cz/ivosahlik/juniemvcaipresentation/controllers/BeerController.java`
- **Changes**:
  - Update all endpoint methods to use `BeerDto`
  - Add `@Valid` annotation to `@RequestBody BeerDto` parameters
  - Ensure proper HTTP status codes:
    - POST: 201 Created with BeerDto body
    - GET (by id): 200 OK with BeerDto or 404 Not Found
    - GET (list): 200 OK with List<BeerDto>
    - PUT: 200 OK with BeerDto or 404 Not Found
    - DELETE: 204 No Content or 404 Not Found
  - Keep constructor injection pattern

### Phase 5: Testing and Validation
**Estimated Time: 45 minutes**

#### Step 5.1: Update Unit Tests
- Update service layer tests to work with DTOs
- Mock `BeerMapper` in service tests
- Update controller tests to use `BeerDto` objects

#### Step 5.2: Integration Testing
- Verify REST endpoints still work with same JSON structure
- Test validation constraints on BeerDto
- Ensure error handling works correctly

#### Step 5.3: Build Verification
- Run `mvn clean verify` to ensure no compilation errors
- Verify MapStruct generates mapper implementation correctly
- Check that all tests pass

## Technical Considerations

### Dependencies
- MapStruct is already configured in `pom.xml`
- Lombok is already in use
- Spring Boot validation starter should be available

### Mapping Strategy
- **Create operations**: Ignore `id`, `createdDate`, `updateDate` when mapping DTO to entity
- **Update operations**: Use `updateEntityFromDto` to merge changes, ignoring managed fields
- **Read operations**: Map all fields from entity to DTO

### Validation Strategy
- Apply validation at DTO level using Bean Validation annotations
- Use `@Valid` in controller to trigger validation
- Let Spring handle `MethodArgumentNotValidException` with default behavior

### Transaction Management
- Service layer methods marked with appropriate `@Transactional` annotations
- Read-only transactions for query methods
- Write transactions for create/update/delete methods

## Risk Assessment

### Low Risk
- DTO creation and basic mapping
- Service interface updates
- Basic controller changes

### Medium Risk
- MapStruct configuration and mapping rules
- Transaction boundary management
- Test updates

### Mitigation Strategies
- Verify MapStruct processor generates code correctly during build
- Test each layer independently
- Keep original entity structure unchanged to avoid persistence issues

## Success Criteria

### Functional Requirements
- ✅ All existing REST endpoints work with same URLs and semantics
- ✅ JSON request/response format remains unchanged (camelCase)
- ✅ Validation errors are properly handled
- ✅ CRUD operations work correctly with DTOs

### Technical Requirements
- ✅ Clean separation between web, service, and persistence layers
- ✅ No direct entity exposure in controllers
- ✅ MapStruct handles all entity↔DTO conversions
- ✅ Proper transaction boundaries in service layer
- ✅ Constructor injection used throughout

### Quality Assurance
- ✅ Project builds successfully with `mvn clean verify`
- ✅ All tests pass
- ✅ No MapStruct or Lombok compilation errors
- ✅ Code follows existing project conventions

## Post-Implementation Tasks

### Documentation
- Update API documentation if necessary
- Add comments for complex mapping scenarios

### Performance Monitoring
- Monitor for any performance impact from additional DTO mapping
- Verify transaction boundaries don't cause N+1 queries

### Future Enhancements
- Consider centralized error handling with ProblemDetails (RFC 9457)
- Add more comprehensive validation messages
- Implement DTO versioning strategy if API evolution is needed

## Estimated Total Time: 2.5 - 3 hours

This plan provides a systematic approach to implementing the DTO refactoring while maintaining backward compatibility and following Spring Boot best practices.
