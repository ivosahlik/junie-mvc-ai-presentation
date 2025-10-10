package cz.ivosahlik.juniemvcaipresentation.entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a line item in a beer order.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "beer_order_line")
public class BeerOrderLine extends BaseEntity {

    private Integer orderQuantity;
    private Integer quantityAllocated;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beer_order_id")
    @ToString.Exclude
    private BeerOrder beerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beer_id")
    @ToString.Exclude
    private Beer beer;
}
