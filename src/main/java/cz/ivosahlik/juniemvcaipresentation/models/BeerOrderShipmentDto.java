package cz.ivosahlik.juniemvcaipresentation.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for BeerOrderShipment entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderShipmentDto {

    private Integer id;
    private Integer version;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    @JsonProperty("createdDate")
    private LocalDateTime createdDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    @JsonProperty("updateDate")
    private LocalDateTime updateDate;

    @NotNull(message = "Shipment date is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime shipmentDate;

    private String carrier;
    private String trackingNumber;

    private Integer beerOrderId;
}
