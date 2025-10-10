package cz.ivosahlik.juniemvcaipresentation.models;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object for beer order information.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderDto {

    private Integer id;
    private Integer version;

    @NotNull(message = "Customer is required")
    @Valid
    private CustomerDto customer;

    private BigDecimal paymentAmount;
    private String status;

    @Valid
    @Builder.Default
    private List<BeerOrderLineDto> beerOrderLines = new ArrayList<>();

    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
}
