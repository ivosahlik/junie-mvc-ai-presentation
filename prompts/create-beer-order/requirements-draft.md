### JPA Entity Implementation Instructions with Lombok

Based on the ERD diagram, I'll provide detailed instructions for implementing the three entities (Beer, BeerOrder, and BeerOrderLine) using JPA annotations with Lombok.

#### Common Base Setup

First, let's define a base entity class to handle common fields:

```java
@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Version
    private Integer version;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;
    
    @UpdateTimestamp
    private LocalDateTime updateDate;
}
```

#### Beer Entity

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beer extends BaseEntity {
    
    private String beerName;
    private String beerStyle;
    private String upc;
    private Integer quantityOnHand;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal price;
    
    // Bidirectional relationship with BeerOrderLine
    @OneToMany(mappedBy = "beer")
    @ToString.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();
}
```

#### BeerOrder Entity

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrder extends BaseEntity {
    
    private String customerRef;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal paymentAmount;
    
    private String status;
    
    // Bidirectional relationship with BeerOrderLine
    @OneToMany(mappedBy = "beerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();
    
    // Utility methods to maintain the relationship consistency
    public void addBeerOrderLine(BeerOrderLine beerOrderLine) {
        if (beerOrderLines == null) {
            beerOrderLines = new HashSet<>();
        }
        
        beerOrderLines.add(beerOrderLine);
        beerOrderLine.setBeerOrder(this);
    }
    
    public void removeBeerOrderLine(BeerOrderLine beerOrderLine) {
        beerOrderLines.remove(beerOrderLine);
        beerOrderLine.setBeerOrder(null);
    }
}
```

#### BeerOrderLine Entity

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderLine extends BaseEntity {
    
    private Integer orderQuantity;
    private Integer quantityAllocated;
    private String status;
    
    // Many-to-one relationship with BeerOrder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beer_order_id")
    @ToString.Exclude
    private BeerOrder beerOrder;
    
    // Many-to-one relationship with Beer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beer_id")
    @ToString.Exclude
    private Beer beer;
}
```

### Implementation Notes

1. **Lombok Annotations**:
    - `@Getter` and `@Setter`: Generate getters and setters
    - `@NoArgsConstructor`: Generate a no-args constructor
    - `@AllArgsConstructor`: Generate a constructor with all fields
    - `@Builder`: Enable the builder pattern
    - `@ToString.Exclude`: Prevent circular references in toString()

2. **JPA Annotations**:
    - `@Entity`: Mark class as JPA entity
    - `@MappedSuperclass`: Base class for entities, not an entity itself
    - `@Id`: Primary key field
    - `@GeneratedValue`: Auto-generate primary keys
    - `@Version`: Optimistic locking
    - `@OneToMany`/`@ManyToOne`: Define relationships
    - `@JoinColumn`: Specify the foreign key column
    - `@CreationTimestamp`/`@UpdateTimestamp`: Auto-manage timestamps
    - `@Column`: Configure database column properties

3. **Relationships**:
    - **Beer to BeerOrderLine**: One-to-Many (one beer can be in many order lines)
    - **BeerOrder to BeerOrderLine**: One-to-Many (one order has many order lines)
    - **BeerOrderLine to Beer**: Many-to-One (many order lines can refer to the same beer)
    - **BeerOrderLine to BeerOrder**: Many-to-One (many order lines belong to the same order)

4. **Best Practices**:
    - Use `CascadeType.ALL` and `orphanRemoval = true` for parent-child relationships
    - Use `FetchType.LAZY` for performance optimization
    - Add utility methods in the parent entity to maintain relationship consistency
    - Use `Builder.Default` to initialize collections in builder pattern
    - Exclude bidirectional relationships from `toString()` to prevent infinite recursion

5. **Data Types**:
    - Use `BigDecimal` with proper precision for monetary values
    - Use `LocalDateTime` for date-time fields

This implementation follows Spring Boot best practices for JPA entities using constructor injection and leveraging Lombok to reduce boilerplate code.
