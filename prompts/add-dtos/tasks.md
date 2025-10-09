# Task List for DTO Implementation

## 1. Preparation and Validation
1. [ ] Verify Lombok configuration in pom.xml
2. [ ] Verify MapStruct configuration in pom.xml
3. [ ] Confirm component model is set to "spring"
4. [ ] Verify current API base path (/api/v1/beers)
5. [ ] Locate and review key files (controllers, services, entities, tests)
6. [ ] Set spring.jpa.open-in-view=false in application.properties

## 2. Introduce BeerDto
7. [ ] Create package structure for models (cz.ivosahlik.juniemvcaipresentation.models)
8. [ ] Create BeerDto class with fields matching Beer entity
9. [ ] Add Lombok annotations (@Builder, @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor)
10. [ ] Add validation annotations for beerName (@NotBlank, length <= 255)
11. [ ] Add validation annotations for beerStyle (@NotBlank, length <= 100)
12. [ ] Add validation annotations for upc (@NotBlank, length <= 50)
13. [ ] Add validation annotations for quantityOnHand (@NotNull, @Min(0))
14. [ ] Add validation annotations for price (@NotNull, @DecimalMin("0.00"))
15. [ ] Ensure camelCase property naming for JSON serialization

## 3. Create MapStruct BeerMapper
16. [ ] Create package structure for mappers (cz.ivosahlik.juniemvcaipresentation.mappers)
17. [ ] Create BeerMapper interface with @Mapper annotation
18. [ ] Define toDto method (Beer entity to BeerDto)
19. [ ] Define toEntity method (BeerDto to Beer)
20. [ ] Define updateEntityFromDto method (BeerDto updates existing Beer)
21. [ ] Configure mapping to ignore id, createdDate, updateDate in DTO to Entity conversion

## 4. Refactor Service Layer
22. [ ] Update BeerService interface to use BeerDto instead of Beer
23. [ ] Modify createBeer method signature
24. [ ] Modify getBeerById method signature
25. [ ] Modify listBeers method signature
26. [ ] Modify updateBeer method signature
27. [ ] Modify deleteBeer method signature
28. [ ] Refactor BeerServiceImpl to use constructor injection for BeerRepository and BeerMapper
29. [ ] Implement entity-to-DTO conversion in createBeer
30. [ ] Implement entity-to-DTO conversion in getBeerById
31. [ ] Implement entity-to-DTO conversion in listBeers
32. [ ] Implement entity-to-DTO conversion in updateBeer
33. [ ] Keep deleteBeer implementation as-is with boolean return
34. [ ] Add @Transactional to data-modifying methods (create/update/delete)
35. [ ] Add @Transactional(readOnly = true) to query methods (get/list)

## 5. Refactor Controller Layer
36. [ ] Update BeerController to use DTOs instead of entities
37. [ ] Keep the same URL mapping (/api/v1/beers)
38. [ ] Implement constructor injection for BeerService
39. [ ] Add @Valid annotation to POST request body
40. [ ] Add @Valid annotation to PUT request body
41. [ ] Update POST handler to return ResponseEntity with CREATED status
42. [ ] Update GET by ID handler to return ResponseEntity with OK or NOT_FOUND
43. [ ] Update GET all handler to return ResponseEntity with OK status
44. [ ] Update PUT handler to return ResponseEntity with OK or NOT_FOUND
45. [ ] Update DELETE handler to return ResponseEntity with NO_CONTENT or NOT_FOUND

## 6. Update Tests
46. [ ] Update BeerControllerTest to work with DTOs instead of entities
47. [ ] Mock BeerService using DTO signatures
48. [ ] Update test assertions to validate correct status codes
49. [ ] Update BeerServiceImplTest to work with DTOs
50. [ ] Test entity↔DTO conversions
51. [ ] Verify BeerRepositoryTest still works (likely unchanged)
52. [ ] Run full test suite to ensure all tests pass

## 7. Build and Verify
53. [ ] Run mvn clean verify to ensure project builds successfully
54. [ ] Verify MapStruct generates mapper implementations correctly
55. [ ] Verify Lombok generates boilerplate code correctly
56. [ ] Ensure all tests pass
57. [ ] Verify API functionality manually if possible

## 8. Compliance with Guidelines
58. [ ] Ensure constructor injection is used throughout
59. [ ] Make classes/methods package-private where appropriate
60. [ ] Verify validation is properly enforced at DTO boundary
61. [ ] Confirm transaction boundaries are clearly defined at service layer
62. [ ] Document any suggestions for future improvements (e.g., centralized exception handling)
