# Requirements: Implement Beer Order Management System

Scope: Extend the existing Beer API to implement a Beer Order Management system. This includes creating entities for BeerOrder and BeerOrderLine according to the ERD diagram, establishing proper relationships between entities, and providing a RESTful API to manage beer orders.

## 1. Entity Structure Implementation

### 1.1 BaseEntity
- Create abstract class: `cz.ivosahlik.juniemvcaipresentation.entities.BaseEntity`
- Fields:
  - `Integer id` - Primary key
  - `Integer version` - Optimistic locking
  - `LocalDateTime createdDate` - Creation timestamp
  - `LocalDateTime updateDate` - Last update timestamp
- Annotations:
  - `@MappedSuperclass` - Marks class as not being an entity itself
  - `@Getter`, `@Setter` - Lombok accessor methods
  - `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)` - For id field
  - `@Version` - For optimistic locking
  - `@CreationTimestamp`, `@Column(updatable = false)` - For createdDate
  - `@UpdateTimestamp` - For updateDate

### 1.2 Beer Entity Refactoring
- Refactor `Beer` to extend `BaseEntity`
- Remove the duplicated fields already in `BaseEntity`
- Retain existing fields:
  - `String beerName`
  - `String beerStyle`
  - `String upc`
  - `Integer quantityOnHand`
  - `BigDecimal price`
- Add relationship:
  - `Set<BeerOrderLine> beerOrderLines` - One-to-many with `BeerOrderLine`
  - Annotate with `@OneToMany(mappedBy = "beer")`
  - Include `@ToString.Exclude` to prevent circular references
  - Initialize with `new HashSet<>()`

### 1.3 BeerOrder Entity
- Create class: `cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder`
- Extend `BaseEntity`
- Fields:
  - `String customerRef` - Reference ID for the customer's order
  - `BigDecimal paymentAmount` - Total payment amount
  - `String status` - Order status
  - `Set<BeerOrderLine> beerOrderLines` - One-to-many with `BeerOrderLine`
- Annotations:
  - `@Entity`, `@Table(name = "beer_order")`
  - `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
  - `@Column(precision = 19, scale = 2)` - For paymentAmount
  - `@OneToMany(mappedBy = "beerOrder", cascade = CascadeType.ALL, orphanRemoval = true)` - For beerOrderLines
  - `@Builder.Default` - For initializing beerOrderLines in builder
  - `@ToString.Exclude` - To prevent circular references
- Helper methods:
  - `void addBeerOrderLine(BeerOrderLine line)` - To maintain relationship consistency
  - `void removeBeerOrderLine(BeerOrderLine line)` - To maintain relationship consistency

### 1.4 BeerOrderLine Entity
- Create class: `cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderLine`
- Extend `BaseEntity`
- Fields:
  - `Integer orderQuantity` - Quantity of beer ordered
  - `Integer quantityAllocated` - Quantity allocated from inventory
  - `String status` - Status of the order line
  - `BeerOrder beerOrder` - Many-to-one with `BeerOrder`
  - `Beer beer` - Many-to-one with `Beer`
- Annotations:
  - `@Entity`, `@Table(name = "beer_order_line")`
  - `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
  - `@ManyToOne(fetch = FetchType.LAZY)` - For beerOrder and beer
  - `@JoinColumn(name = "beer_order_id")` - For beerOrder foreign key
  - `@JoinColumn(name = "beer_id")` - For beer foreign key
  - `@ToString.Exclude` - To prevent circular references

## 2. Data Transfer Objects (DTOs)

### 2.1 BeerOrderDto
- Create class: `cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto`
- Fields:
  - `Integer id`
  - `Integer version`
  - `String customerRef`
  - `BigDecimal paymentAmount`
  - `String status`
  - `List<BeerOrderLineDto> beerOrderLines`
  - `LocalDateTime createdDate`
  - `LocalDateTime updateDate`
- Lombok annotations: `@Builder`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Validation:
  - `customerRef`: `@NotBlank`, length ≤ 255
  - `beerOrderLines`: `@Valid` (validate nested DTOs)

### 2.2 BeerOrderLineDto
- Create class: `cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto`
- Fields:
  - `Integer id`
  - `Integer version`
  - `Integer orderQuantity`
  - `Integer quantityAllocated`
  - `String status`
  - `BeerDto beer` - Nested DTO reference
  - `LocalDateTime createdDate`
  - `LocalDateTime updateDate`
- Lombok annotations: `@Builder`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Validation:
  - `orderQuantity`: `@NotNull`, `@Min(1)`
  - `beer`: `@NotNull`

## 3. MapStruct Mappers

### 3.1 BeerOrderMapper
- Create interface: `cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderMapper`
- Annotation: `@Mapper(componentModel = "spring", uses = {BeerOrderLineMapper.class})`
- Methods:
  - `BeerOrderDto toDto(BeerOrder entity)`
  - `BeerOrder toEntity(BeerOrderDto dto)`
  - `void updateEntityFromDto(BeerOrderDto dto, @MappingTarget BeerOrder entity)`
- Mapping rules:
  - Ignore `id`, `createdDate`, `updateDate` in `updateEntityFromDto`

### 3.2 BeerOrderLineMapper
- Create interface: `cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderLineMapper`
- Annotation: `@Mapper(componentModel = "spring", uses = {BeerMapper.class})`
- Methods:
  - `BeerOrderLineDto toDto(BeerOrderLine entity)`
  - `BeerOrderLine toEntity(BeerOrderLineDto dto)`
  - `void updateEntityFromDto(BeerOrderLineDto dto, @MappingTarget BeerOrderLine entity)`
- Mapping rules:
  - Ignore `id`, `createdDate`, `updateDate` in `updateEntityFromDto`
  - Ignore `beerOrder` in DTO to prevent circular references

## 4. Repository Layer

### 4.1 BeerOrderRepository
- Create interface: `cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository`
- Extend `JpaRepository<BeerOrder, Integer>`
- Annotate with `@Repository`
- Custom query methods:
  - `List<BeerOrder> findByCustomerRefContainingIgnoreCase(String customerRef)`

### 4.2 BeerOrderLineRepository
- Create interface: `cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderLineRepository`
- Extend `JpaRepository<BeerOrderLine, Integer>`
- Annotate with `@Repository`
- Custom query methods:
  - `List<BeerOrderLine> findByBeerId(Integer beerId)`
  - `List<BeerOrderLine> findByBeerOrderId(Integer beerOrderId)`

## 5. Service Layer

### 5.1 BeerOrderService
- Create interface: `cz.ivosahlik.juniemvcaipresentation.services.BeerOrderService`
- Methods:
  - `BeerOrderDto createBeerOrder(BeerOrderDto beerOrderDto)`
  - `Optional<BeerOrderDto> getBeerOrderById(Integer id)`
  - `List<BeerOrderDto> listBeerOrders()`
  - `List<BeerOrderDto> findBeerOrdersByCustomerRef(String customerRef)`
  - `Optional<BeerOrderDto> updateBeerOrder(Integer id, BeerOrderDto beerOrderDto)`
  - `boolean deleteBeerOrder(Integer id)`

### 5.2 BeerOrderServiceImpl
- Create class: `cz.ivosahlik.juniemvcaipresentation.services.BeerOrderServiceImpl`
- Implement `BeerOrderService`
- Use constructor injection with `final` fields for dependencies:
  - `BeerOrderRepository beerOrderRepository`
  - `BeerOrderMapper beerOrderMapper`
  - `BeerRepository beerRepository`
- Transactions:
  - Annotate read methods with `@Transactional(readOnly = true)`
  - Annotate modifying methods with `@Transactional`
- Implement all methods using appropriate business logic and error handling

## 6. Controller Layer

### 6.1 BeerOrderController
- Create class: `cz.ivosahlik.juniemvcaipresentation.controllers.BeerOrderController`
- Base path: `/api/v1/beer-orders`
- Use constructor injection with `final` fields
- Annotate with `@RestController`, `@RequestMapping("/api/v1/beer-orders")`
- Endpoints:
  - `POST /`: Create a new beer order
  - `GET /{id}`: Get beer order by ID
  - `GET /`: List all beer orders
  - `GET /search`: Search beer orders by customer reference
  - `PUT /{id}`: Update an existing beer order
  - `DELETE /{id}`: Delete a beer order
- Use `ResponseEntity` to express proper status codes
- Validate requests with `@Valid`

## 7. Error Handling
- Ensure appropriate error responses for:
  - Invalid data (400 Bad Request)
  - Resource not found (404 Not Found)
  - Concurrent modification conflicts (409 Conflict)
  - Server errors (500 Internal Server Error)
- Create a GlobalExceptionHandler if one doesn't exist

## 8. Testing Expectations
- Unit tests for all layers:
  - Repository tests with test data
  - Service tests with mocked repositories
  - Controller tests with MockMvc or WebTestClient
- Integration tests for end-to-end flows:
  - Creating a beer order
  - Updating a beer order
  - Searching for beer orders

## 9. Non-functional Requirements and Guidelines Alignment
- Follow constructor injection and prefer package-private visibility for Spring components
- Define clear transaction boundaries in the service layer
- Validate inputs at the DTO boundary using Jakarta Validation annotations
- Ensure proper bidirectional relationship management
- Use a proper logging framework with appropriate log levels
- Set `spring.jpa.open-in-view=false` in `application.properties`

## 10. Acceptance Criteria
- All entities are properly implemented with correct relationships
- DTOs and mappers are implemented and correctly handle bidirectional relationships
- Service layer methods perform expected business operations with appropriate transaction boundaries
- Controller endpoints accept requests and return responses with proper status codes
- Beer orders can be created, retrieved, updated, and deleted through the API
- Test coverage is adequate
- Application builds and runs successfully
