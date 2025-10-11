package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.models.BeerPatchDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class BeerMapperTest {

    @Autowired
    BeerMapper beerMapper;

    @Test
    @DisplayName("Patch mapper should ignore null values")
    void testPatchMapperIgnoresNullValues() {
        // Create an original beer entity
        Beer originalBeer = Beer.builder()
                .beerName("Original Beer")
                .beerStyle("IPA")
                .upc("12345")
                .price(new BigDecimal("9.99"))
                .quantityOnHand(100)
                .description("Original description")
                .build();

        // Create a patch with only some fields set
        BeerPatchDto patchDto = BeerPatchDto.builder()
                .beerName("Updated Beer")
                .price(new BigDecimal("10.99"))
                // beerStyle, upc, quantityOnHand and description are deliberately null
                .build();

        // Apply the patch
        beerMapper.patchEntityFromDto(patchDto, originalBeer);

        // Verify that only non-null fields were updated
        assertThat(originalBeer.getBeerName()).isEqualTo("Updated Beer"); // Updated
        assertThat(originalBeer.getPrice()).isEqualTo(new BigDecimal("10.99")); // Updated

        // These should remain unchanged
        assertThat(originalBeer.getBeerStyle()).isEqualTo("IPA");
        assertThat(originalBeer.getUpc()).isEqualTo("12345");
        assertThat(originalBeer.getQuantityOnHand()).isEqualTo(100);
        assertThat(originalBeer.getDescription()).isEqualTo("Original description");
    }

    @Test
    @DisplayName("Patch mapper should update all non-null values")
    void testPatchMapperUpdatesAllNonNullValues() {
        // Create an original beer entity
        Beer originalBeer = Beer.builder()
                .beerName("Original Beer")
                .beerStyle("IPA")
                .upc("12345")
                .price(new BigDecimal("9.99"))
                .quantityOnHand(100)
                .description("Original description")
                .build();

        // Create a patch with all fields set
        BeerPatchDto patchDto = BeerPatchDto.builder()
                .beerName("Fully Updated Beer")
                .beerStyle("Lager")
                .upc("54321")
                .price(new BigDecimal("11.99"))
                .quantityOnHand(50)
                .description("Updated description")
                .build();

        // Apply the patch
        beerMapper.patchEntityFromDto(patchDto, originalBeer);

        // Verify that all fields were updated
        assertThat(originalBeer.getBeerName()).isEqualTo("Fully Updated Beer");
        assertThat(originalBeer.getBeerStyle()).isEqualTo("Lager");
        assertThat(originalBeer.getUpc()).isEqualTo("54321");
        assertThat(originalBeer.getPrice()).isEqualTo(new BigDecimal("11.99"));
        assertThat(originalBeer.getQuantityOnHand()).isEqualTo(50);
        assertThat(originalBeer.getDescription()).isEqualTo("Updated description");
    }
}
