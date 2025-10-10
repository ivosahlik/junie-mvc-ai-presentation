package cz.ivosahlik.juniemvcaipresentation.models;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "Customer reference is required")
    @Size(max = 255, message = "Customer reference must be at most 255 characters")
    private String customerRef;

    private BigDecimal paymentAmount;
    private String status;

    @Valid
    @Builder.Default
    private List<BeerOrderLineDto> beerOrderLines = new ArrayList<>();

    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
}
