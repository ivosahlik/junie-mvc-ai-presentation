package cz.ivosahlik.juniemvcaipresentation.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for partial updates of Beer entities.
 * No validation constraints are applied to allow null values for fields that shouldn't be updated.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerPatchDto {

    private Integer id;
    private Integer version;
    private String beerName;
    private String beerStyle;
    private String upc;
    private Integer quantityOnHand;
    private BigDecimal price;
    private String description;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
}
