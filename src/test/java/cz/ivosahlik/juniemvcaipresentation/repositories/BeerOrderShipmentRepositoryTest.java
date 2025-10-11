package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderShipment;
import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Tests for BeerOrderShipmentRepository.
 */
@DataJpaTest
@ActiveProfiles("test")
class BeerOrderShipmentRepositoryTest {

    @Autowired
    private BeerOrderShipmentRepository beerOrderShipmentRepository;

    @Autowired
    private BeerOrderRepository beerOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private BeerOrder beerOrder;

    @BeforeEach
    void setUp() {
        // Create a customer
        Customer customer = Customer.builder()
                .name("Test Customer")
                .email("test@example.com")
                .addressLine1("123 Test St")
                .city("Test City")
                .state("TS")
                .postalCode("12345")
                .build();
        Customer savedCustomer = customerRepository.save(customer);

        // Create a beer order
        BeerOrder order = BeerOrder.builder()
                .customer(savedCustomer)
                .paymentAmount(new BigDecimal("25.99"))
                .status("NEW")
                .build();
        beerOrder = beerOrderRepository.save(order);
    }

    @Test
    @DisplayName("Test saving and retrieving a shipment")
    void testSaveAndRetrieveShipment() {
        // Create and save a shipment
        BeerOrderShipment shipment = BeerOrderShipment.builder()
                .shipmentDate(LocalDateTime.now())
                .carrier("UPS")
                .trackingNumber("1Z999AA10123456784")
                .beerOrder(beerOrder)
                .build();

        BeerOrderShipment savedShipment = beerOrderShipmentRepository.save(shipment);

        // Retrieve the shipment
        BeerOrderShipment retrievedShipment = beerOrderShipmentRepository.findById(savedShipment.getId()).orElse(null);

        // Assertions
        assertNotNull(retrievedShipment);
        assertThat(retrievedShipment.getCarrier()).isEqualTo("UPS");
        assertThat(retrievedShipment.getTrackingNumber()).isEqualTo("1Z999AA10123456784");
        assertThat(retrievedShipment.getBeerOrder().getId()).isEqualTo(beerOrder.getId());
    }

    @Test
    @DisplayName("Test finding shipments by beer order ID")
    void testFindByBeerOrderId() {
        // Create and save multiple shipments
        BeerOrderShipment shipment1 = BeerOrderShipment.builder()
                .shipmentDate(LocalDateTime.now())
                .carrier("UPS")
                .trackingNumber("1Z999AA10123456784")
                .beerOrder(beerOrder)
                .build();

        BeerOrderShipment shipment2 = BeerOrderShipment.builder()
                .shipmentDate(LocalDateTime.now().plusDays(1))
                .carrier("FedEx")
                .trackingNumber("7891011121314")
                .beerOrder(beerOrder)
                .build();

        beerOrderShipmentRepository.save(shipment1);
        beerOrderShipmentRepository.save(shipment2);

        // Find shipments by beer order ID
        List<BeerOrderShipment> shipments = beerOrderShipmentRepository.findByBeerOrderId(beerOrder.getId());

        // Assertions
        assertThat(shipments).isNotNull();
        assertThat(shipments).hasSize(2);
        assertThat(shipments.get(0).getBeerOrder().getId()).isEqualTo(beerOrder.getId());
        assertThat(shipments.get(1).getBeerOrder().getId()).isEqualTo(beerOrder.getId());
    }
}
