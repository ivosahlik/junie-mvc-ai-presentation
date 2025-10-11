package cz.ivosahlik.juniemvcaipresentation.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Simplified version of BeerOrderShipmentDto for testing purposes without JsonFormat annotations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderShipmentDtoForTest {

    private Integer id;
    private Integer version;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private LocalDateTime shipmentDate;
    private String carrier;
    private String trackingNumber;
    private Integer beerOrderId;
}
