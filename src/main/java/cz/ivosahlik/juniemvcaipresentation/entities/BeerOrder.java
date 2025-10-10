package cz.ivosahlik.juniemvcaipresentation.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a beer order in the system.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beer_order")
@Builder
public class BeerOrder extends BaseEntity {

    @Builder
    public BeerOrder(Integer id, Integer version, Customer customer,
                    BigDecimal paymentAmount, String status, Set<BeerOrderLine> beerOrderLines) {
        super.setId(id);
        super.setVersion(version);
        this.customer = customer;
        this.paymentAmount = paymentAmount;
        this.status = status;
        this.beerOrderLines = beerOrderLines != null ? beerOrderLines : new HashSet<>();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;

    @Column(precision = 19, scale = 2)
    private BigDecimal paymentAmount;

    private String status;

    @OneToMany(mappedBy = "beerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();

    /**
     * Adds a beer order line to this order and maintains the relationship.
     * @param line The beer order line to add
     */
    public void addBeerOrderLine(BeerOrderLine line) {
        if (line != null) {
            if (beerOrderLines == null) {
                beerOrderLines = new HashSet<>();
            }
            beerOrderLines.add(line);
            line.setBeerOrder(this);
        }
    }

    /**
     * Removes a beer order line from this order and maintains the relationship.
     * @param line The beer order line to remove
     */
    public void removeBeerOrderLine(BeerOrderLine line) {
        if (line != null && beerOrderLines != null) {
            beerOrderLines.remove(line);
            line.setBeerOrder(null);
        }
    }
}
