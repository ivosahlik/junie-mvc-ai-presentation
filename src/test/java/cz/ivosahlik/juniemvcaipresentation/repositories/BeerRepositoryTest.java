package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
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
}
