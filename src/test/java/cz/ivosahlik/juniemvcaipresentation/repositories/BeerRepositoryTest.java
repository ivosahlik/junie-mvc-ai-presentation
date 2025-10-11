package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BeerRepositoryTest {

    @Autowired
    BeerRepository beerRepository;

    private Beer sampleBeer() {
        return Beer.builder()
                .beerName("Sample Lager")
                .beerStyle("Lager")
                .upc("1234567890123")
                .quantityOnHand(10)
                .price(new BigDecimal("4.99"))
                .build();
    }

    @Test
    @DisplayName("save() should persist a new Beer and assign id/version")
    void testSave() {
        Beer saved = beerRepository.save(sampleBeer());
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getVersion()).isNotNull();
        assertThat(saved.getCreatedDate()).isNotNull();
        assertThat(saved.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("findById() should retrieve previously saved Beer")
    void testFindById() {
        Beer saved = beerRepository.save(sampleBeer());
        Optional<Beer> found = beerRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getBeerName()).isEqualTo("Sample Lager");
    }

    @Test
    @DisplayName("findAll() should return list with saved entities")
    void testFindAll() {
        beerRepository.save(sampleBeer());
        Beer another = Beer.builder()
                .beerName("Pale Ale")
                .beerStyle("Ale")
                .upc("9876543210000")
                .quantityOnHand(5)
                .price(new BigDecimal("5.49"))
                .build();
        beerRepository.save(another);
        List<Beer> all = beerRepository.findAll();
        assertThat(all.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("update should change fields and bump version/updateDate")
    void testUpdate() {
        Beer saved = beerRepository.save(sampleBeer());
        Integer originalVersion = saved.getVersion();
        saved.setBeerName("Updated Lager");
        Beer updated = beerRepository.save(saved);
        assertThat(updated.getBeerName()).isEqualTo("Updated Lager");
        assertThat(updated.getVersion()).isNotNull();
        assertThat(updated.getVersion()).isGreaterThanOrEqualTo(originalVersion);
        assertThat(updated.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("delete should remove entity from repository")
    void testDelete() {
        Beer saved = beerRepository.save(sampleBeer());
        Integer id = saved.getId();
        beerRepository.delete(saved);
        assertThat(beerRepository.findById(id)).isEmpty();
    }

    @Test
    @DisplayName("findAllByBeerNameContainingIgnoreCase should filter by name with pagination")
    void testFindAllByBeerNameContainingIgnoreCase() {
        // Save beers with different names for testing
        createTestBeers();

        // Test filtering by "alpha" (should match 2 beers)
        Page<Beer> alphaBeers = beerRepository.findAllByBeerNameContainingIgnoreCase("alpha",
                PageRequest.of(0, 10, Sort.by("beerName")));

        assertThat(alphaBeers.getContent()).hasSize(2);
        assertThat(alphaBeers.getTotalElements()).isEqualTo(2);
        alphaBeers.getContent().forEach(beer ->
            assertThat(beer.getBeerName().toLowerCase()).contains("alpha")
        );

        // Test filtering by "ipa" (should match 1 beer)
        Page<Beer> ipaBeers = beerRepository.findAllByBeerNameContainingIgnoreCase("ipa",
                PageRequest.of(0, 10));

        assertThat(ipaBeers.getContent()).hasSize(1);
        assertThat(ipaBeers.getTotalElements()).isEqualTo(1);
        assertThat(ipaBeers.getContent().get(0).getBeerName()).contains("IPA");

        // Test filtering with non-existent name
        Page<Beer> nonExistentBeers = beerRepository.findAllByBeerNameContainingIgnoreCase("NonExistent",
                PageRequest.of(0, 10));

        assertThat(nonExistentBeers.getContent()).isEmpty();
        assertThat(nonExistentBeers.getTotalElements()).isZero();

        // Test pagination
        Page<Beer> pagedResult = beerRepository.findAllByBeerNameContainingIgnoreCase("",
                PageRequest.of(0, 2, Sort.by("beerName")));

        assertThat(pagedResult.getContent()).hasSize(2);
        assertThat(pagedResult.getTotalElements()).isGreaterThanOrEqualTo(3);
        assertThat(pagedResult.getTotalPages()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("findAllByBeerStyleContainingIgnoreCase should filter by style with pagination")
    void testFindAllByBeerStyleContainingIgnoreCase() {
        // Save beers with different styles for testing
        createTestBeers();

        // Test filtering by "IPA" style (should match 1 beer)
        Page<Beer> ipaBeers = beerRepository.findAllByBeerStyleContainingIgnoreCase("ipa",
                PageRequest.of(0, 10, Sort.by("beerName")));

        assertThat(ipaBeers.getContent()).hasSize(1);
        assertThat(ipaBeers.getTotalElements()).isEqualTo(1);
        ipaBeers.getContent().forEach(beer ->
            assertThat(beer.getBeerStyle().toLowerCase()).contains("ipa")
        );

        // Test filtering by "ale" style (should match 1 beer)
        Page<Beer> aleBeers = beerRepository.findAllByBeerStyleContainingIgnoreCase("ale",
                PageRequest.of(0, 10));

        assertThat(aleBeers.getContent()).hasSize(1);
        assertThat(aleBeers.getTotalElements()).isEqualTo(1);
        assertThat(aleBeers.getContent().get(0).getBeerStyle()).isEqualTo("Ale");

        // Test filtering with non-existent style
        Page<Beer> nonExistentBeers = beerRepository.findAllByBeerStyleContainingIgnoreCase("NonExistentStyle",
                PageRequest.of(0, 10));

        assertThat(nonExistentBeers.getContent()).isEmpty();
        assertThat(nonExistentBeers.getTotalElements()).isZero();
    }

    @Test
    @DisplayName("findAllByBeerNameAndBeerStyle should filter by name and style with all combinations")
    void testFindAllByBeerNameAndBeerStyle() {
        // Save beers with different names and styles for testing
        createTestBeers();

        // Add another IPA for testing multiple style matches
        beerRepository.save(Beer.builder()
                .beerName("Gamma IPA")
                .beerStyle("IPA")
                .upc("444-555-666")
                .quantityOnHand(30)
                .price(new BigDecimal("6.99"))
                .build());

        // Test filtering by both name and style
        Page<Beer> nameAndStyleBeers = beerRepository.findAllByBeerNameAndBeerStyle("alpha", "ipa",
                PageRequest.of(0, 10));

        assertThat(nameAndStyleBeers.getContent()).hasSize(1);
        assertThat(nameAndStyleBeers.getTotalElements()).isEqualTo(1);
        assertThat(nameAndStyleBeers.getContent().get(0).getBeerName()).isEqualTo("Alpha IPA");
        assertThat(nameAndStyleBeers.getContent().get(0).getBeerStyle()).isEqualTo("IPA");

        // Test filtering by name only
        Page<Beer> nameOnlyBeers = beerRepository.findAllByBeerNameAndBeerStyle("alpha", null,
                PageRequest.of(0, 10));

        assertThat(nameOnlyBeers.getContent()).hasSize(2);
        nameOnlyBeers.getContent().forEach(beer ->
            assertThat(beer.getBeerName().toLowerCase()).contains("alpha")
        );

        // Test filtering by style only
        Page<Beer> styleOnlyBeers = beerRepository.findAllByBeerNameAndBeerStyle(null, "ipa",
                PageRequest.of(0, 10));

        assertThat(styleOnlyBeers.getContent()).hasSize(2);
        styleOnlyBeers.getContent().forEach(beer ->
            assertThat(beer.getBeerStyle()).isEqualTo("IPA")
        );

        // Test with no filters (should return all beers)
        Page<Beer> allBeers = beerRepository.findAllByBeerNameAndBeerStyle(null, null,
                PageRequest.of(0, 10));

        assertThat(allBeers.getTotalElements()).isGreaterThanOrEqualTo(4);

        // Test with empty string filters (should return all beers)
        Page<Beer> emptyFilterBeers = beerRepository.findAllByBeerNameAndBeerStyle("", "",
                PageRequest.of(0, 10));

        assertThat(emptyFilterBeers.getTotalElements()).isGreaterThanOrEqualTo(4);
    }

    private void createTestBeers() {
        // Create standard test beers if they don't exist
        if (beerRepository.count() < 3) {
            beerRepository.save(Beer.builder()
                    .beerName("Alpha IPA")
                    .beerStyle("IPA")
                    .upc("111-222-333")
                    .quantityOnHand(10)
                    .price(new BigDecimal("4.99"))
                    .build());

            beerRepository.save(Beer.builder()
                    .beerName("Beta Lager")
                    .beerStyle("Lager")
                    .upc("222-333-444")
                    .quantityOnHand(15)
                    .price(new BigDecimal("3.99"))
                    .build());

            beerRepository.save(Beer.builder()
                    .beerName("Alpha Ale")
                    .beerStyle("Ale")
                    .upc("333-444-555")
                    .quantityOnHand(20)
                    .price(new BigDecimal("5.99"))
                    .build());
        }
    }
}
