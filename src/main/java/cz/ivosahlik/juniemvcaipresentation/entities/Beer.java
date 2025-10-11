package cz.ivosahlik.juniemvcaipresentation.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a beer in the system.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beer")
@Builder
public class Beer extends BaseEntity {

    @Builder
    public Beer(Integer id, Integer version, String beerName, String beerStyle, String upc,
                Integer quantityOnHand, BigDecimal price, Set<BeerOrderLine> beerOrderLines,
                LocalDateTime updateDate, LocalDateTime createdDate, String description) {
        super.setId(id);
        super.setVersion(version);
        this.beerName = beerName;
        this.beerStyle = beerStyle;
        this.upc = upc;
        this.quantityOnHand = quantityOnHand;
        this.price = price;
        this.beerOrderLines = beerOrderLines != null ? beerOrderLines : new HashSet<>();
        this.createdDate = createdDate;
        this.updateDate = updateDate;
        this.description = description;
    }

    @Column(length = 255)
    private String beerName;

    @Column(length = 100)
    private String beerStyle;

    @Column(length = 50, unique = true)
    private String upc;

    private Integer quantityOnHand;

    @Column(precision = 19, scale = 2)
    private BigDecimal price;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "beer")
    @ToString.Exclude
    @Builder.Default
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();
}
