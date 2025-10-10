package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderLine;
import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BeerOrderLineRepositoryTest {

    @Autowired
    BeerOrderLineRepository beerOrderLineRepository;

    @Autowired
    BeerRepository beerRepository;

    @Autowired
    BeerOrderRepository beerOrderRepository;

    @Autowired
    CustomerRepository customerRepository;

    private Beer createAndSaveBeer(String name, String style) {
        Beer beer = Beer.builder()
                .beerName(name)
                .beerStyle(style)
                .upc("UPC-" + name)
                .quantityOnHand(10)
                .price(new BigDecimal("4.99"))
                .build();
        return beerRepository.save(beer);
    }

    private Customer createAndSaveCustomer(String name) {
        Customer customer = Customer.builder()
                .name(name)
                .addressLine1("123 Test St")
                .city("Test City")
                .state("Test State")
                .postalCode("12345")
                .build();
        return customerRepository.save(customer);
    }

    private BeerOrder createAndSaveBeerOrder(String customerName) {
        Customer customer = createAndSaveCustomer(customerName);
        BeerOrder beerOrder = BeerOrder.builder()
                .customer(customer)
                .paymentAmount(new BigDecimal("39.99"))
                .status("NEW")
                .build();
        return beerOrderRepository.save(beerOrder);
    }

    private BeerOrderLine createSampleBeerOrderLine(BeerOrder order, Beer beer) {
        return BeerOrderLine.builder()
                .orderQuantity(5)
                .quantityAllocated(2)
                .status("NEW")
                .beerOrder(order)
                .beer(beer)
                .build();
    }

    @Test
    @DisplayName("save() should persist a new BeerOrderLine and assign id/version")
    void testSave() {
        Beer beer = createAndSaveBeer("Test Lager", "Lager");
        BeerOrder order = createAndSaveBeerOrder("TEST-REF-123");

        BeerOrderLine line = createSampleBeerOrderLine(order, beer);
        BeerOrderLine saved = beerOrderLineRepository.save(line);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getVersion()).isNotNull();
        assertThat(saved.getCreatedDate()).isNotNull();
        assertThat(saved.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("findById() should retrieve previously saved BeerOrderLine")
    void testFindById() {
        Beer beer = createAndSaveBeer("Test Lager", "Lager");
        BeerOrder order = createAndSaveBeerOrder("TEST-REF-123");

        BeerOrderLine line = createSampleBeerOrderLine(order, beer);
        BeerOrderLine saved = beerOrderLineRepository.save(line);

        Optional<BeerOrderLine> found = beerOrderLineRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getOrderQuantity()).isEqualTo(5);
        assertThat(found.get().getBeer().getId()).isEqualTo(beer.getId());
        assertThat(found.get().getBeerOrder().getId()).isEqualTo(order.getId());
    }

    @Test
    @DisplayName("findAll() should return list with saved entities")
    void testFindAll() {
        Beer beer1 = createAndSaveBeer("Test Lager", "Lager");
        Beer beer2 = createAndSaveBeer("Test Ale", "Ale");
        BeerOrder order = createAndSaveBeerOrder("TEST-REF-123");

        BeerOrderLine line1 = createSampleBeerOrderLine(order, beer1);
        BeerOrderLine line2 = BeerOrderLine.builder()
                .orderQuantity(3)
                .quantityAllocated(1)
                .status("NEW")
                .beerOrder(order)
                .beer(beer2)
                .build();

        beerOrderLineRepository.save(line1);
        beerOrderLineRepository.save(line2);

        List<BeerOrderLine> all = beerOrderLineRepository.findAll();
        assertThat(all.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("update should change fields and bump version/updateDate")
    void testUpdate() {
        Beer beer = createAndSaveBeer("Test Lager", "Lager");
        BeerOrder order = createAndSaveBeerOrder("TEST-REF-123");

        BeerOrderLine line = createSampleBeerOrderLine(order, beer);
        BeerOrderLine saved = beerOrderLineRepository.save(line);

        Integer originalVersion = saved.getVersion();
        saved.setOrderQuantity(10);
        BeerOrderLine updated = beerOrderLineRepository.save(saved);

        assertThat(updated.getOrderQuantity()).isEqualTo(10);
        assertThat(updated.getVersion()).isNotNull();
        assertThat(updated.getVersion()).isGreaterThanOrEqualTo(originalVersion);
        assertThat(updated.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("delete should remove entity from repository")
    void testDelete() {
        Beer beer = createAndSaveBeer("Test Lager", "Lager");
        BeerOrder order = createAndSaveBeerOrder("TEST-REF-123");

        BeerOrderLine line = createSampleBeerOrderLine(order, beer);
        BeerOrderLine saved = beerOrderLineRepository.save(line);

        Integer id = saved.getId();
        beerOrderLineRepository.delete(saved);
        assertThat(beerOrderLineRepository.findById(id)).isEmpty();
    }

    @Test
    @DisplayName("findByBeerId should find order lines for a specific beer")
    void testFindByBeerId() {
        Beer beer1 = createAndSaveBeer("Test Lager", "Lager");
        Beer beer2 = createAndSaveBeer("Test Ale", "Ale");
        BeerOrder order = createAndSaveBeerOrder("TEST-REF-123");

        BeerOrderLine line1 = createSampleBeerOrderLine(order, beer1);
        BeerOrderLine line2 = BeerOrderLine.builder()
                .orderQuantity(3)
                .quantityAllocated(1)
                .status("NEW")
                .beerOrder(order)
                .beer(beer1)  // Same beer as line1
                .build();
        BeerOrderLine line3 = BeerOrderLine.builder()
                .orderQuantity(2)
                .quantityAllocated(0)
                .status("NEW")
                .beerOrder(order)
                .beer(beer2)  // Different beer
                .build();

        beerOrderLineRepository.save(line1);
        beerOrderLineRepository.save(line2);
        beerOrderLineRepository.save(line3);

        List<BeerOrderLine> beerLines = beerOrderLineRepository.findByBeerId(beer1.getId());
        assertThat(beerLines).hasSize(2);

        List<BeerOrderLine> beerLines2 = beerOrderLineRepository.findByBeerId(beer2.getId());
        assertThat(beerLines2).hasSize(1);
    }

    @Test
    @DisplayName("findByBeerOrderId should find order lines for a specific order")
    void testFindByBeerOrderId() {
        Beer beer1 = createAndSaveBeer("Test Lager", "Lager");
        Beer beer2 = createAndSaveBeer("Test Ale", "Ale");

        BeerOrder order1 = createAndSaveBeerOrder("TEST-REF-123");
        BeerOrder order2 = createAndSaveBeerOrder("TEST-REF-456");

        // Two lines for order1
        BeerOrderLine line1 = createSampleBeerOrderLine(order1, beer1);
        BeerOrderLine line2 = BeerOrderLine.builder()
                .orderQuantity(3)
                .quantityAllocated(1)
                .status("NEW")
                .beerOrder(order1)
                .beer(beer2)
                .build();

        // One line for order2
        BeerOrderLine line3 = BeerOrderLine.builder()
                .orderQuantity(2)
                .quantityAllocated(0)
                .status("NEW")
                .beerOrder(order2)
                .beer(beer1)
                .build();

        beerOrderLineRepository.save(line1);
        beerOrderLineRepository.save(line2);
        beerOrderLineRepository.save(line3);

        List<BeerOrderLine> orderLines1 = beerOrderLineRepository.findByBeerOrderId(order1.getId());
        assertThat(orderLines1).hasSize(2);

        List<BeerOrderLine> orderLines2 = beerOrderLineRepository.findByBeerOrderId(order2.getId());
        assertThat(orderLines2).hasSize(1);
    }
}
