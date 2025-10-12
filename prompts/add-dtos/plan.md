# Implementation Plan: Replace Entity Exposure with DTOs in Beer API

## Overview
This plan details the steps required to refactor the Beer API to use DTOs instead of directly exposing JPA entities. The implementation will follow the requirements specified in `requirements.md` and is designed to improve encapsulation, validation, and testability while maintaining backward compatibility.

## Implementation Steps

### 1. Create DTO Class
- Create `BeerDto` class in package `cz.ivosahlik.juniemvcaipresentation.models`
- Include all fields corresponding to the Beer entity: id, version, beerName, beerStyle, upc, quantityOnHand, price, createdDate, updateDate
- Add Lombok annotations: `@Builder`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Implement validation constraints:
  - beerName: `@NotBlank`, length <= 255
  - beerStyle: `@NotBlank`, length <= 100
  - upc: `@NotBlank`, length <= 50
  - quantityOnHand: `@NotNull`, `@Min(0)`
  - price: `@NotNull`, `@DecimalMin("0.00")`

### 2. Create MapStruct Mapper
- Create interface `BeerMapper` in package `cz.ivosahlik.juniemvcaipresentation.mappers`
- Annotate with `@Mapper(componentModel = "spring")`
- Define methods:
  - `BeerDto toDto(Beer entity)`
  - `Beer toEntity(BeerDto dto)`
  - `void updateEntityFromDto(BeerDto dto, @MappingTarget Beer entity)`
- Configure mapping rules:
  - Ignore id, createdDate, updateDate when mapping from DTO to entity
  - Let MapStruct map remaining fields by name

### 3. Update Service Interface
- Modify `BeerService` interface to work with `BeerDto` instead of `Beer`:
  - `BeerDto createBeer(BeerDto beer)`
  - `Optional<BeerDto> getBeerById(Integer id)`
  - `List<BeerDto> listBeers()`
  - `Optional<BeerDto> updateBeer(Integer id, BeerDto beer)`
  - `boolean deleteBeer(Integer id)` (unchanged signature, but implementation will change)

### 4. Update Service Implementation
- Refactor `BeerServiceImpl` to use DTOs and the mapper:
  - Inject `BeerRepository` and `BeerMapper` via constructor
  - Update all method implementations to work with DTOs:
    - createBeer: map DTO→entity, save, return entity mapped to DTO
    - getBeerById: find entity by ID, map to DTO if found
    - listBeers: get all entities, map to DTOs
    - updateBeer: find entity, update from DTO, save, return updated entity mapped to DTO
    - deleteBeer: unchanged semantic but with proper transaction
  - Add `@Transactional` annotations:
    - `@Transactional` on write methods (create, update, delete)
    - `@Transactional(readOnly = true)` on read methods (getById, list)

### 5. Update Controller
- Refactor `BeerController` to use `BeerDto` instead of `Beer`:
  - Update method signatures to accept and return `BeerDto` instead of `Beer`
  - Apply `@Valid` annotation to `@RequestBody BeerDto` parameters
  - Maintain existing HTTP semantics and status codes
  - Keep the same REST endpoints and path structure

### 6. Update Tests
- Update controller tests to work with `BeerDto` instead of `Beer`
- Ensure test cases properly verify validation rules
- Verify that REST endpoints maintain backward compatibility

## Validation and Testing
- Build the project to verify compilation: `mvn clean verify`
- Run tests to ensure all functionality works as expected
- Verify that all requirements have been met according to the "Definition of Done"

## Expected Outcome
- Complete separation of web/service layers from persistence layer using DTOs
- Proper validation at the DTO level
- Appropriate transaction boundaries at the service layer
- Backward compatibility for REST API consumers
