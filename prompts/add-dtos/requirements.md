# DTO Implementation Requirements

## Overview
This document defines the requirements for implementing Data Transfer Objects (DTOs) in the Beer management APIs to properly separate the web layer from the persistence layer according to Spring Boot best practices.

## Requirements

### 1. Create Beer DTO Classes
- Create a `BeerDto` class in the `cz.ivosahlik.juniemvcaipresentation.models` package with properties matching the Beer JPA entity:
  - id (Integer)
  - version (Integer)
  - beerName (String)
  - beerStyle (String)
  - upc (String)
  - quantityOnHand (Integer)
  - price (BigDecimal)
  - createdDate (LocalDateTime)
  - updateDate (LocalDateTime)
- Apply Lombok annotations to reduce boilerplate:
  - `@Builder` - For builder pattern implementation
  - `@NoArgsConstructor` - For default constructor
  - `@AllArgsConstructor` - For constructor with all fields
  - `@Getter` - For getter methods
  - `@Setter` - For setter methods
- Add proper validation annotations from Jakarta Validation API where appropriate:
  - `@NotBlank` for required string fields (beerName, beerStyle, upc)
  - `@NotNull` for other required fields (price, quantityOnHand)
  - `@Size` constraints for strings where appropriate

### 2. Implement MapStruct Mapper
- Create or enhance the `BeerMapper` interface in the `cz.ivosahlik.juniemvcaipresentation.mappers` package (if not already exists)
- The mapper should have these methods:
  - `BeerDto toDto(Beer entity)` - Convert entity to DTO
  - `Beer toEntity(BeerDto dto)` - Convert DTO to entity, ignoring id, version, createdDate, and updateDate fields
  - `void updateEntityFromDto(BeerDto dto, Beer entity)` - Update an existing entity from DTO, preserving managed fields

### 3. Update Service Layer
- Modify the `BeerService` interface to use DTOs instead of entities:
  - `BeerDto createBeer(BeerDto beerDto)`
  - `Optional<BeerDto> getBeerById(Integer id)`
  - `List<BeerDto> listBeers()`
  - `Optional<BeerDto> updateBeer(Integer id, BeerDto beerDto)`
  - `boolean deleteBeer(Integer id)` (unchanged)
- Update `BeerServiceImpl` to:
  - Use the mapper for converting between entities and DTOs
  - Preserve proper transaction boundaries
  - Apply `@Transactional(readOnly = true)` for query operations
  - Apply `@Transactional` for operations that modify data

### 4. Update Controller Layer
- Modify `BeerController` to work with DTOs:
  - Accept DTOs in request bodies instead of entities
  - Return DTOs in responses instead of entities
  - Maintain the same REST endpoint structure and HTTP status codes
  - Keep response data consistent with current implementation

### 5. Tests
- Update existing controller and service tests to work with DTOs
- Ensure all tests pass with the new implementation
- Maintain test coverage for all CRUD operations

## Benefits
Implementing these requirements will:
- Separate the web layer from the persistence layer
- Allow future independent evolution of API and domain models
- Provide clear and explicit input validation
- Maintain security by controlling which fields are exposed to clients
- Conform to Spring Boot best practices as outlined in the guidelines

## Implementation Notes
- Follow package-private visibility for implementation classes
- Use constructor injection for dependencies
- Provide explicit HTTP status codes in controller responses
- Maintain a consistent response format
