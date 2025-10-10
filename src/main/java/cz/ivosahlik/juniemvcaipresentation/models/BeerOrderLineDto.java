package cz.ivosahlik.juniemvcaipresentation.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for beer order line information.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderLineDto {

    private Integer id;
    private Integer version;

    @NotNull(message = "Order quantity is required")
    @Min(value = 1, message = "Order quantity must be at least 1")
    private Integer orderQuantity;

    private Integer quantityAllocated;
    private String status;

    @NotNull(message = "Beer is required")
    private BeerDto beer;

    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
}
