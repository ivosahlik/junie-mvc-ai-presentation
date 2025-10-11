package cz.ivosahlik.juniemvcaipresentation.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing a shipment for a beer order.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beer_order_shipment")
@Builder(toBuilder = true)
public class BeerOrderShipment extends BaseEntity {

    @Builder
    public BeerOrderShipment(Integer id, Integer version, LocalDateTime shipmentDate,
                            String carrier, String trackingNumber, BeerOrder beerOrder) {
        super.setId(id);
        super.setVersion(version);
        this.shipmentDate = shipmentDate;
        this.carrier = carrier;
        this.trackingNumber = trackingNumber;
        this.beerOrder = beerOrder;
    }

    @Column(name = "shipment_date", nullable = false)
    private LocalDateTime shipmentDate;

    private String carrier;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beer_order_id")
    private BeerOrder beerOrder;
}
