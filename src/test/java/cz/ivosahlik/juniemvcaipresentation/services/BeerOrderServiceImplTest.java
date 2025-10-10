package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class BeerOrderServiceImplTest {

    @Autowired
    BeerOrderService beerOrderService;

    @Autowired
    BeerService beerService;

    @Autowired
    CustomerService customerService;

    private CustomerDto createTestCustomer(String name) {
        CustomerDto customerDto = CustomerDto.builder()
                .name(name)
                .addressLine1("123 Test Street")
                .city("Test City")
                .state("TS")
                .postalCode("12345")
                .build();
        return customerService.createCustomer(customerDto);
    }

    private BeerOrderDto createSampleBeerOrderDto() {
        // First get a real beer from the database to associate with the order
        List<BeerDto> beers = beerService.listBeers();
        if (beers.isEmpty()) {
            // Create a beer if none exists
            BeerDto beerDto = BeerDto.builder()
                    .beerName("Test Beer")
                    .beerStyle("IPA")
                    .upc("123456789")
                    .price(new BigDecimal("5.99"))
                    .quantityOnHand(10)
                    .build();
            beers = Collections.singletonList(beerService.createBeer(beerDto));
        }

        BeerDto beer = beers.get(0);

        // Create a test customer
        CustomerDto customer = createTestCustomer("Test Customer");

        // Create a beer order line using the real beer
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(5)
                .quantityAllocated(0)
                .status("NEW")
                .beer(beer)
                .build();

        // Create a beer order with the line
        return BeerOrderDto.builder()
                .customer(customer)
                .status("NEW")
                .paymentAmount(new BigDecimal("29.95"))
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();
    }

    @Test
    @DisplayName("Create beer order should persist and return with generated ID")
    void testCreateBeerOrder() {
        BeerOrderDto orderDto = createSampleBeerOrderDto();
        BeerOrderDto created = beerOrderService.createBeerOrder(orderDto);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getVersion()).isNotNull();
        assertThat(created.getCustomer()).isNotNull();
        assertThat(created.getCustomer().getName()).isEqualTo("Test Customer");
        assertThat(created.getCreatedDate()).isNotNull();
        assertThat(created.getUpdateDate()).isNotNull();
        assertThat(created.getBeerOrderLines()).hasSize(1);
    }

    @Test
    @DisplayName("Get beer order by ID should retrieve previously created order")
    void testGetBeerOrderById() {
        // Create an order
        BeerOrderDto orderDto = createSampleBeerOrderDto();
        BeerOrderDto created = beerOrderService.createBeerOrder(orderDto);

        // Get the order by ID
        Optional<BeerOrderDto> found = beerOrderService.getBeerOrderById(created.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(created.getId());
        assertThat(found.get().getCustomer()).isNotNull();
        assertThat(found.get().getCustomer().getName()).isEqualTo("Test Customer");
        assertThat(found.get().getBeerOrderLines()).hasSize(1);

        // Test with non-existent ID
        Optional<BeerOrderDto> notFound = beerOrderService.getBeerOrderById(999999);
        assertThat(notFound).isEmpty();
    }

    @Test
    @DisplayName("List beer orders should return all orders")
    void testListBeerOrders() {
        // Create some orders
        int initialCount = beerOrderService.listBeerOrders().size();

        beerOrderService.createBeerOrder(createSampleBeerOrderDto());
        beerOrderService.createBeerOrder(createSampleBeerOrderDto());

        List<BeerOrderDto> orders = beerOrderService.listBeerOrders();
        assertThat(orders.size()).isEqualTo(initialCount + 2);
    }

    @Test
    @DisplayName("Find beer orders by customer name should return matching orders")
    void testFindBeerOrdersByCustomerName() {
        // Create customers with different names
        CustomerDto specialCustomer1 = createTestCustomer("Special Customer One");
        CustomerDto regularCustomer = createTestCustomer("Regular Customer");
        CustomerDto specialCustomer2 = createTestCustomer("Special Customer Two");

        // Create a beer if none exists
        List<BeerDto> beers = beerService.listBeers();
        BeerDto beer;
        if (beers.isEmpty()) {
            // Create a beer if none exists
            BeerDto beerDto = BeerDto.builder()
                    .beerName("Test Beer")
                    .beerStyle("IPA")
                    .upc("123456789")
                    .price(new BigDecimal("5.99"))
                    .quantityOnHand(10)
                    .build();
            beer = beerService.createBeer(beerDto);
        } else {
            beer = beers.get(0);
        }

        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(5)
                .quantityAllocated(0)
                .status("NEW")
                .beer(beer)
                .build();

        BeerOrderDto order1 = BeerOrderDto.builder()
                .customer(specialCustomer1)
                .status("NEW")
                .paymentAmount(new BigDecimal("29.95"))
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        BeerOrderDto order2 = BeerOrderDto.builder()
                .customer(regularCustomer)
                .status("NEW")
                .paymentAmount(new BigDecimal("19.95"))
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        BeerOrderDto order3 = BeerOrderDto.builder()
                .customer(specialCustomer2)
                .status("NEW")
                .paymentAmount(new BigDecimal("39.95"))
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        beerOrderService.createBeerOrder(order1);
        beerOrderService.createBeerOrder(order2);
        beerOrderService.createBeerOrder(order3);

        // Search for orders by customer name
        List<BeerOrderDto> specialOrders = beerOrderService.findBeerOrdersByCustomerName("Special");
        List<BeerOrderDto> regularOrders = beerOrderService.findBeerOrdersByCustomerName("Regular");
        List<BeerOrderDto> nonExistentOrders = beerOrderService.findBeerOrdersByCustomerName("Nonexistent");

        assertThat(specialOrders).hasSize(2);
        assertThat(regularOrders).hasSize(1);
        assertThat(nonExistentOrders).isEmpty();
    }

    @Test
    @DisplayName("Update beer order should modify fields and return updated order")
    void testUpdateBeerOrder() {
        // Create an order
        BeerOrderDto created = beerOrderService.createBeerOrder(createSampleBeerOrderDto());
        Integer orderId = created.getId();

        // Create a new customer for the update
        CustomerDto updatedCustomer = createTestCustomer("Updated Customer");

        // Prepare update
        created.setCustomer(updatedCustomer);
        created.setStatus("PROCESSING");
        created.setPaymentAmount(new BigDecimal("39.95"));

        // Add another beer line
        List<BeerDto> beers = beerService.listBeers();
        if (beers.size() > 1) {
            BeerOrderLineDto newLine = BeerOrderLineDto.builder()
                    .orderQuantity(3)
                    .quantityAllocated(0)
                    .status("NEW")
                    .beer(beers.get(1))
                    .build();

            created.getBeerOrderLines().add(newLine);
        }

        // Update the order
        Optional<BeerOrderDto> updated = beerOrderService.updateBeerOrder(orderId, created);

        assertThat(updated).isPresent();
        assertThat(updated.get().getCustomer()).isNotNull();
        assertThat(updated.get().getCustomer().getName()).isEqualTo("Updated Customer");
        assertThat(updated.get().getStatus()).isEqualTo("PROCESSING");
        assertThat(updated.get().getPaymentAmount()).isEqualTo(new BigDecimal("39.95"));

        if (beers.size() > 1) {
            assertThat(updated.get().getBeerOrderLines()).hasSize(2);
        }

        // Test with ID mismatch
        BeerOrderDto invalidDto = createSampleBeerOrderDto();
        invalidDto.setId(999);  // Different from the ID we're passing

        assertThrows(IllegalArgumentException.class, () -> {
            beerOrderService.updateBeerOrder(orderId, invalidDto);
        });

        // Test with non-existent ID
        BeerOrderDto nonExistentOrderDto = createSampleBeerOrderDto();
        nonExistentOrderDto.setId(999999); // Set matching ID
        Optional<BeerOrderDto> notFound = beerOrderService.updateBeerOrder(999999, nonExistentOrderDto);
        assertThat(notFound).isEmpty();
    }

    @Test
    @DisplayName("Delete beer order should remove order")
    void testDeleteBeerOrder() {
        // Create an order
        BeerOrderDto created = beerOrderService.createBeerOrder(createSampleBeerOrderDto());
        Integer orderId = created.getId();

        // Verify it exists
        assertThat(beerOrderService.getBeerOrderById(orderId)).isPresent();

        // Delete it
        boolean deleted = beerOrderService.deleteBeerOrder(orderId);
        assertThat(deleted).isTrue();

        // Verify it no longer exists
        assertThat(beerOrderService.getBeerOrderById(orderId)).isEmpty();

        // Test with non-existent ID
        boolean notDeleted = beerOrderService.deleteBeerOrder(999999);
        assertThat(notDeleted).isFalse();
    }

    @Test
    @DisplayName("Create beer order with invalid beer ID should throw exception")
    void testCreateBeerOrderWithInvalidBeerId() {
        // Create a beer order with an invalid beer ID
        BeerOrderDto orderDto = createSampleBeerOrderDto();
        BeerDto invalidBeer = BeerDto.builder()
                .id(999999)  // Non-existent ID
                .beerName("Invalid Beer")
                .beerStyle("Invalid")
                .upc("999999")
                .price(new BigDecimal("9.99"))
                .quantityOnHand(0)
                .build();

        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(5)
                .quantityAllocated(0)
                .status("NEW")
                .beer(invalidBeer)
                .build();

        orderDto.setBeerOrderLines(Collections.singletonList(lineDto));

        // Expect exception when creating
        assertThrows(RuntimeException.class, () -> {
            beerOrderService.createBeerOrder(orderDto);
        });
    }

    @Test
    @DisplayName("Create beer order with null beer should throw exception")
    void testCreateBeerOrderWithNullBeer() {
        // Create a beer order with a null beer
        BeerOrderDto orderDto = createSampleBeerOrderDto();
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(5)
                .quantityAllocated(0)
                .status("NEW")
                .beer(null)  // Null beer
                .build();

        orderDto.setBeerOrderLines(Collections.singletonList(lineDto));

        // Expect exception when creating
        assertThrows(RuntimeException.class, () -> {
            beerOrderService.createBeerOrder(orderDto);
        });
    }
}
