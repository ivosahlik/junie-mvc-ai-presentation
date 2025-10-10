package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BeerOrderRepositoryTest {

    @Autowired
    BeerOrderRepository beerOrderRepository;

    private BeerOrder sampleBeerOrder() {
        return BeerOrder.builder()
                .customerRef("TEST-REF-123")
                .paymentAmount(new BigDecimal("39.99"))
                .status("NEW")
                .build();
    }

    @Test
    @DisplayName("save() should persist a new BeerOrder and assign id/version")
    void testSave() {
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder());
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getVersion()).isNotNull();
        assertThat(saved.getCreatedDate()).isNotNull();
        assertThat(saved.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("findById() should retrieve previously saved BeerOrder")
    void testFindById() {
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder());
        Optional<BeerOrder> found = beerOrderRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getCustomerRef()).isEqualTo("TEST-REF-123");
    }

    @Test
    @DisplayName("findAll() should return list with saved entities")
    void testFindAll() {
        beerOrderRepository.save(sampleBeerOrder());
        BeerOrder another = BeerOrder.builder()
                .customerRef("TEST-REF-456")
                .paymentAmount(new BigDecimal("59.99"))
                .status("PROCESSING")
                .build();
        beerOrderRepository.save(another);
        List<BeerOrder> all = beerOrderRepository.findAll();
        assertThat(all.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("update should change fields and bump version/updateDate")
    void testUpdate() {
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder());
        Integer originalVersion = saved.getVersion();
        saved.setCustomerRef("UPDATED-REF");
        BeerOrder updated = beerOrderRepository.save(saved);
        assertThat(updated.getCustomerRef()).isEqualTo("UPDATED-REF");
        assertThat(updated.getVersion()).isNotNull();
        assertThat(updated.getVersion()).isGreaterThanOrEqualTo(originalVersion);
        assertThat(updated.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("delete should remove entity from repository")
    void testDelete() {
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder());
        Integer id = saved.getId();
        beerOrderRepository.delete(saved);
        assertThat(beerOrderRepository.findById(id)).isEmpty();
    }

    @Test
    @DisplayName("findByCustomerRefContainingIgnoreCase should find orders with matching customer reference")
    void testFindByCustomerRefContainingIgnoreCase() {
        beerOrderRepository.save(sampleBeerOrder());
        BeerOrder order2 = BeerOrder.builder()
                .customerRef("TEST-CUSTOMER-ABC")
                .paymentAmount(new BigDecimal("49.99"))
                .status("NEW")
                .build();
        BeerOrder order3 = BeerOrder.builder()
                .customerRef("DIFFERENT-ORDER")
                .paymentAmount(new BigDecimal("29.99"))
                .status("NEW")
                .build();
        beerOrderRepository.save(order2);
        beerOrderRepository.save(order3);

        // Test case-insensitive search
        List<BeerOrder> result1 = beerOrderRepository.findByCustomerRefContainingIgnoreCase("test");
        assertThat(result1).hasSize(2);

        // Test partial match
        List<BeerOrder> result2 = beerOrderRepository.findByCustomerRefContainingIgnoreCase("CUSTOMER");
        assertThat(result2).hasSize(1);
        assertThat(result2.get(0).getCustomerRef()).isEqualTo("TEST-CUSTOMER-ABC");

        // Test no match
        List<BeerOrder> result3 = beerOrderRepository.findByCustomerRefContainingIgnoreCase("NONEXISTENT");
        assertThat(result3).isEmpty();
    }
}
