# Task List for DTO Implementation

## 1. Preparation and Validation
1. [x] Verify Lombok configuration in pom.xml
2. [x] Verify MapStruct configuration in pom.xml
3. [x] Confirm component model is set to "spring"
4. [x] Verify current API base path (/api/v1/beers)
5. [x] Locate and review key files (controllers, services, entities, tests)
6. [x] Set spring.jpa.open-in-view=false in application.properties

## 2. Introduce BeerDto
7. [x] Create package structure for models (cz.ivosahlik.juniemvcaipresentation.models)
8. [x] Create BeerDto class with fields matching Beer entity
9. [x] Add Lombok annotations (@Builder, @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor)
10. [x] Add validation annotations for beerName (@NotBlank, length <= 255)
11. [x] Add validation annotations for beerStyle (@NotBlank, length <= 100)
12. [x] Add validation annotations for upc (@NotBlank, length <= 50)
13. [x] Add validation annotations for quantityOnHand (@NotNull, @Min(0))
14. [x] Add validation annotations for price (@NotNull, @DecimalMin("0.00"))
15. [x] Ensure camelCase property naming for JSON serialization

## 3. Create MapStruct BeerMapper
16. [x] Create package structure for mappers (cz.ivosahlik.juniemvcaipresentation.mappers)
17. [x] Create BeerMapper interface with @Mapper annotation
18. [x] Define toDto method (Beer entity to BeerDto)
19. [x] Define toEntity method (BeerDto to Beer)
20. [x] Define updateEntityFromDto method (BeerDto updates existing Beer)
21. [x] Configure mapping to ignore id, createdDate, updateDate in DTO to Entity conversion

## 4. Refactor Service Layer
22. [x] Update BeerService interface to use BeerDto instead of Beer
23. [x] Modify createBeer method signature
24. [x] Modify getBeerById method signature
25. [x] Modify listBeers method signature
26. [x] Modify updateBeer method signature
27. [x] Modify deleteBeer method signature
28. [x] Refactor BeerServiceImpl to use constructor injection for BeerRepository and BeerMapper
29. [x] Implement entity-to-DTO conversion in createBeer
30. [x] Implement entity-to-DTO conversion in getBeerById
31. [x] Implement entity-to-DTO conversion in listBeers
32. [x] Implement entity-to-DTO conversion in updateBeer
33. [x] Keep deleteBeer implementation as-is with boolean return
34. [x] Add @Transactional to data-modifying methods (create/update/delete)
35. [x] Add @Transactional(readOnly = true) to query methods (get/list)

## 5. Refactor Controller Layer
36. [x] Update BeerController to use DTOs instead of entities
37. [x] Keep the same URL mapping (/api/v1/beers)
38. [x] Implement constructor injection for BeerService
39. [x] Add @Valid annotation to POST request body
40. [x] Add @Valid annotation to PUT request body
41. [x] Update POST handler to return ResponseEntity with CREATED status
42. [x] Update GET by ID handler to return ResponseEntity with OK or NOT_FOUND
43. [x] Update GET all handler to return ResponseEntity with OK status
44. [x] Update PUT handler to return ResponseEntity with OK or NOT_FOUND
45. [x] Update DELETE handler to return ResponseEntity with NO_CONTENT or NOT_FOUND

## 6. Refactor BeerController with Lombok
46. [x] Add @RequiredArgsConstructor to BeerController
    - [x] Add import for lombok.RequiredArgsConstructor
    - [x] Apply @RequiredArgsConstructor annotation to BeerController class
    - [x] Remove explicit constructor in BeerController

## 7. Update Tests
47. [x] Update BeerControllerTest to work with DTOs instead of entities
48. [x] Mock BeerService using DTO signatures
49. [x] Update test assertions to validate correct status codes
50. [x] Update BeerServiceImplTest to work with DTOs
51. [x] Test entity↔DTO conversions
52. [x] Verify BeerRepositoryTest still works (likely unchanged)
53. [x] Run full test suite to ensure all tests pass

## 8. Build and Verify
54. [x] Run mvn clean verify to ensure project builds successfully
55. [x] Verify MapStruct generates mapper implementations correctly
56. [x] Verify Lombok generates boilerplate code correctly
57. [x] Ensure all tests pass
58. [x] Verify API functionality manually if possible

## 9. Compliance with Guidelines
59. [x] Ensure constructor injection is used throughout
60. [x] Make classes/methods package-private where appropriate
61. [x] Verify validation is properly enforced at DTO boundary
62. [x] Confirm transaction boundaries are clearly defined at service layer
63. [x] Document any suggestions for future improvements (e.g., centralized exception handling)
