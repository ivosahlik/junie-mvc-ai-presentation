# JPA Relationship Implementation Requirements

## Overview
Based on the provided Entity Relationship Diagram (ERD), this document outlines the requirements for implementing JPA entities with Lombok for a beer ordering system. The system consists of three main entities: `Beer`, `BeerOrder`, and `BeerOrderLine`, with specific relationships between them.

## Entities and Relationships

### 1. Beer Entity
The existing `Beer` entity should be maintained with its current structure:
- Primary Key: `id` (Integer)
- Version: `version` (Integer) for optimistic locking
- Properties:
  - `beerName` (String)
  - `beerStyle` (String)
  - `upc` (String, unique)
  - `quantityOnHand` (Integer)
  - `price` (BigDecimal)
  - `createdDate` (LocalDateTime)
  - `updateDate` (LocalDateTime)

**New Relationship:**
- One-to-Many relationship with `BeerOrderLine`

### 2. BeerOrder Entity
Create a new `BeerOrder` entity with the following:
- Primary Key: `id` (Integer)
- Version: `version` (Integer) for optimistic locking
- Properties:
  - `customerRef` (String)
  - `paymentAmount` (BigDecimal)
  - `status` (String)
  - `createdDate` (LocalDateTime)
  - `updateDate` (LocalDateTime)

**Relationships:**
- One-to-Many relationship with `BeerOrderLine`

### 3. BeerOrderLine Entity
Create a new `BeerOrderLine` entity with the following:
- Primary Key: `id` (Integer)
- Version: `version` (Integer) for optimistic locking
- Properties:
  - `orderQuantity` (Integer)
  - `quantityAllocated` (Integer)
  - `status` (String)
  - `createdDate` (LocalDateTime)
  - `updateDate` (LocalDateTime)

**Relationships:**
- Many-to-One relationship with `Beer`
- Many-to-One relationship with `BeerOrder`

## Implementation Guidelines

### JPA Annotations
1. **Entity Annotations:**
   - Use `@Entity` for all entity classes
   - Use `@Table(name = "entity_name")` to specify table names

2. **Primary Key:**
   - Use `@Id` and `@GeneratedValue(strategy = GenerationType.IDENTITY)` for primary keys

3. **Version Control:**
   - Use `@Version` for optimistic locking

4. **Timestamp Fields:**
   - Use `@CreationTimestamp` for `createdDate` fields
   - Use `@UpdateTimestamp` for `updateDate` fields
   - Mark `createdDate` as non-updatable with `@Column(updatable = false)`

5. **Relationship Mappings:**
   - For One-to-Many relationships:
     - Use `@OneToMany(mappedBy = "parentEntity", cascade = CascadeType.ALL)` on the parent side
     - Initialize collections to empty collections in constructors or with field initialization
   
   - For Many-to-One relationships:
     - Use `@ManyToOne` on the child side
     - Use `@JoinColumn(name = "parent_id")` to specify the foreign key column

### Lombok Annotations
1. **Class-level Annotations:**
   - Use `@Getter` and `@Setter` for all entity classes
   - Use `@NoArgsConstructor` and `@AllArgsConstructor`
   - Use `@Builder` for builder pattern support
   - Consider using `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` with `@EqualsAndHashCode.Include` on ID fields

2. **Avoid Lombok Circular References:**
   - Use `@ToString.Exclude` on collection fields to prevent circular references
   - Similarly, exclude bidirectional relationship fields from `@EqualsAndHashCode` calculations

## Code Example (Beer Entity with Relationship)

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beer")
public class Beer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Version
    private Integer version;

    @Column(length = 255)
    private String beerName;

    @Column(length = 100)
    private String beerStyle;

    @Column(length = 50, unique = true)
    private String upc;

    private Integer quantityOnHand;

    @Column(precision = 19, scale = 2)
    private BigDecimal price;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;
    
    @OneToMany(mappedBy = "beer")
    @Builder.Default
    @ToString.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();
}
```

## Additional Considerations

1. **Data Integrity:**
   - Ensure proper cascade types are used to maintain data integrity
   - Consider using `@JoinColumn` with `foreignKey` attribute to define foreign key constraints

2. **Bidirectional Relationship Management:**
   - Implement helper methods to manage both sides of bidirectional relationships
   - Example: addBeerOrderLine(BeerOrderLine line) that sets both sides of the relationship

3. **Database Indexing:**
   - Consider adding indexes for frequently queried columns using `@Index` in the `@Table` annotation

4. **Audit Information:**
   - The `createdDate` and `updateDate` fields provide basic auditing
   - Consider implementing JPA Auditing with `@CreatedBy` and `@LastModifiedBy` for enhanced auditing

5. **Status Management:**
   - Consider using an enum for the `status` field in both `BeerOrder` and `BeerOrderLine` instead of a String
