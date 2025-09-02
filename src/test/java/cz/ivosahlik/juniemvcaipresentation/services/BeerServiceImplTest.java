package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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

    private Beer sampleBeerNoId() {
        return Beer.builder()
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
        Beer saved = beerService.createBeer(sampleBeerNoId());
        assertThat(saved.getId()).isNotNull();

        // list
        List<Beer> list = beerService.listBeers();
        assertThat(list).isNotEmpty();

        // get by id (found)
        Optional<Beer> byId = beerService.getBeerById(saved.getId());
        assertThat(byId).isPresent();
        assertThat(byId.get().getBeerName()).isEqualTo("Service Lager");

        // get by id (not found)
        assertThat(beerService.getBeerById(999999)).isNotPresent();

        // update (found)
        Beer updateRequest = Beer.builder()
                .beerName("Service Lager Updated")
                .beerStyle("Pilsner")
                .upc("svc-0001-upd")
                .quantityOnHand(30)
                .price(new BigDecimal("6.00"))
                .build();
        Optional<Beer> updated = beerService.updateBeer(saved.getId(), updateRequest);
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
}
