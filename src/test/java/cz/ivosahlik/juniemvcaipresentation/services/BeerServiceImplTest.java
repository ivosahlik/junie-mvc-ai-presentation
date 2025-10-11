package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class BeerServiceImplTest {

    @Autowired
    BeerService beerService;

    private BeerDto sampleBeerDtoNoId() {
        return BeerDto.builder()
                .beerName("Service Lager")
                .beerStyle("Lager")
                .upc("svc-0001")
                .quantityOnHand(25)
                .price(new BigDecimal("5.50"))
                .build();
    }

    @BeforeEach
    void setUp() {
        // No setup necessary; each test runs in a rollbacked transaction
    }

    @Test
    @DisplayName("Service operations: create, list, getById, update, delete")
    void testServiceOperations() {
        // create
        BeerDto saved = beerService.createBeer(sampleBeerDtoNoId());
        assertThat(saved.getId()).isNotNull();

        // list
        List<BeerDto> list = beerService.listBeers();
        assertThat(list).isNotEmpty();

        // get by id (found)
        Optional<BeerDto> byId = beerService.getBeerById(saved.getId());
        assertThat(byId).isPresent();
        assertThat(byId.get().getBeerName()).isEqualTo("Service Lager");

        // get by id (not found)
        assertThat(beerService.getBeerById(999999)).isNotPresent();

        // update (found)
        BeerDto updateRequest = BeerDto.builder()
                .beerName("Service Lager Updated")
                .beerStyle("Pilsner")
                .upc("svc-0001-upd")
                .quantityOnHand(30)
                .price(new BigDecimal("6.00"))
                .build();
        Optional<BeerDto> updated = beerService.updateBeer(saved.getId(), updateRequest);
        assertThat(updated).isPresent();
        assertThat(updated.get().getBeerName()).isEqualTo("Service Lager Updated");
        assertThat(updated.get().getBeerStyle()).isEqualTo("Pilsner");

        // update (not found)
        assertThat(beerService.updateBeer(123456, updateRequest)).isNotPresent();

        // delete (found)
        boolean deleted = beerService.deleteBeer(saved.getId());
        assertThat(deleted).isTrue();
        assertThat(beerService.getBeerById(saved.getId())).isNotPresent();

        // delete (not found)
        assertThat(beerService.deleteBeer(123456)).isFalse();
    }

    @Test
    @DisplayName("Paginated list of beers")
    void testListBeersWithPagination() {
        // Create several beers to test pagination
        BeerDto beer1 = createTestBeer("Alpha Beer", "IPA");
        BeerDto beer2 = createTestBeer("Beta Brew", "Lager");
        BeerDto beer3 = createTestBeer("Alpha Ale", "Ale");

        // Test default pagination without filter
        Page<BeerDto> firstPage = beerService.listBeers(null,
                PageRequest.of(0, 2, Sort.by("beerName")));

        // Verify pagination works
        assertThat(firstPage.getContent()).hasSize(2);
        assertThat(firstPage.getTotalElements()).isGreaterThanOrEqualTo(3);
        assertThat(firstPage.getTotalPages()).isGreaterThanOrEqualTo(2);

        // Verify sorting works
        assertThat(firstPage.getContent().get(0).getBeerName()).startsWith("A");
    }

    @Test
    @DisplayName("Filtered list of beers by beer name")
    void testListBeersWithNameFilter() {
        // Create beers with specific names to test filtering
        BeerDto beer1 = createTestBeer("Special Test IPA", "IPA");
        BeerDto beer2 = createTestBeer("Another Beer", "Lager");
        BeerDto beer3 = createTestBeer("Test Ale", "Ale");

        // Test filtering by "Test" in the name
        Page<BeerDto> filteredPage = beerService.listBeers("Test", null,
                PageRequest.of(0, 10));

        // Verify filtering works
        assertThat(filteredPage.getTotalElements()).isGreaterThanOrEqualTo(2);
        filteredPage.getContent().forEach(beer ->
            assertThat(beer.getBeerName().toLowerCase()).contains("test")
        );

        // Test with a specific non-matching name
        Page<BeerDto> emptyResult = beerService.listBeers("NonExistentBeerName", null,
                PageRequest.of(0, 10));
        assertThat(emptyResult.getTotalElements()).isEqualTo(0);
        assertThat(emptyResult.getContent()).isEmpty();
    }

    @Test
    @DisplayName("Filtered list of beers by beer style")
    void testListBeersWithStyleFilter() {
        // Create beers with specific styles to test filtering
        BeerDto beer1 = createTestBeer("First IPA", "IPA");
        BeerDto beer2 = createTestBeer("Second IPA", "IPA");
        BeerDto beer3 = createTestBeer("Style Test Beer", "Stout");

        // Test filtering by "IPA" style
        Page<BeerDto> filteredPage = beerService.listBeers(null, "IPA",
                PageRequest.of(0, 10));

        // Verify filtering works
        assertThat(filteredPage.getTotalElements()).isGreaterThanOrEqualTo(2);
        filteredPage.getContent().forEach(beer ->
            assertThat(beer.getBeerStyle()).isEqualTo("IPA")
        );

        // Test with a specific non-matching style
        Page<BeerDto> emptyResult = beerService.listBeers(null, "NonExistentStyle",
                PageRequest.of(0, 10));
        assertThat(emptyResult.getTotalElements()).isEqualTo(0);
        assertThat(emptyResult.getContent()).isEmpty();
    }

    @Test
    @DisplayName("Filtered list of beers by both name and style")
    void testListBeersWithNameAndStyleFilters() {
        // Create beers with various names and styles for testing
        BeerDto beer1 = createTestBeer("Special IPA", "IPA");
        BeerDto beer2 = createTestBeer("Regular Lager", "Lager");
        BeerDto beer3 = createTestBeer("Special Stout", "Stout");
        BeerDto beer4 = createTestBeer("Another IPA", "IPA");

        // Test filtering by both name and style
        Page<BeerDto> filteredPage = beerService.listBeers("Special", "IPA",
                PageRequest.of(0, 10));

        // Verify filtering works (should only return "Special IPA")
        assertThat(filteredPage.getTotalElements()).isEqualTo(1);
        assertThat(filteredPage.getContent().get(0).getBeerName()).isEqualTo("Special IPA");
        assertThat(filteredPage.getContent().get(0).getBeerStyle()).isEqualTo("IPA");

        // Test with matching style but non-matching name
        Page<BeerDto> emptyResult = beerService.listBeers("NonExistent", "IPA",
                PageRequest.of(0, 10));
        assertThat(emptyResult.getTotalElements()).isEqualTo(0);
        assertThat(emptyResult.getContent()).isEmpty();
    }

    private BeerDto createTestBeer(String name, String style) {
        // Ensure unique UPC by using both name and current time
        return beerService.createBeer(BeerDto.builder()
                .beerName(name)
                .beerStyle(style)
                .upc("test-" + name.replace(" ", "-").toLowerCase() + "-" + System.nanoTime())
                .quantityOnHand(10)
                .price(new BigDecimal("4.99"))
                .build());
    }
}
