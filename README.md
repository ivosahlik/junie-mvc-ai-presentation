## PROMPTS

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
