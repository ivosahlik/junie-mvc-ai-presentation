package cz.ivosahlik.juniemvcaipresentation.models;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerDto {

    private Integer id;

    private Integer version;

    @NotBlank
    @Size(max = 255)
    private String beerName;

    @NotBlank
    @Size(max = 100)
    private String beerStyle;

    @NotBlank
    @Size(max = 50)
    private String upc;

    @NotNull
    @Min(0)
    private Integer quantityOnHand;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    @Size(max = 1000)
    private String description;

    private LocalDateTime createdDate;

    private LocalDateTime updateDate;
}
