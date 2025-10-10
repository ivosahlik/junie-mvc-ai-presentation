package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
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
class BeerOrderRepositoryTest {

    @Autowired
    BeerOrderRepository beerOrderRepository;

    @Autowired
    CustomerRepository customerRepository;

    private Customer createSampleCustomer() {
        return Customer.builder()
                .name("Test Customer")
                .email("test@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main Street")
                .city("Boston")
                .state("MA")
                .postalCode("02108")
                .build();
    }

    private BeerOrder sampleBeerOrder(Customer customer) {
        return BeerOrder.builder()
                .customer(customer)
                .paymentAmount(new BigDecimal("39.99"))
                .status("NEW")
                .build();
    }

    @Test
    @DisplayName("save() should persist a new BeerOrder and assign id/version")
    void testSave() {
        Customer customer = customerRepository.save(createSampleCustomer());
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder(customer));

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getVersion()).isNotNull();
        assertThat(saved.getCreatedDate()).isNotNull();
        assertThat(saved.getUpdateDate()).isNotNull();
        assertThat(saved.getCustomer().getName()).isEqualTo("Test Customer");
    }

    @Test
    @DisplayName("findById() should retrieve previously saved BeerOrder")
    void testFindById() {
        Customer customer = customerRepository.save(createSampleCustomer());
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder(customer));

        Optional<BeerOrder> found = beerOrderRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getCustomer().getName()).isEqualTo("Test Customer");
    }

    @Test
    @DisplayName("findAll() should return list with saved entities")
    void testFindAll() {
        Customer customer1 = customerRepository.save(createSampleCustomer());
        beerOrderRepository.save(sampleBeerOrder(customer1));

        Customer customer2 = Customer.builder()
                .name("Another Customer")
                .email("another@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Avenue")
                .city("New York")
                .state("NY")
                .postalCode("10001")
                .build();
        customerRepository.save(customer2);

        BeerOrder another = BeerOrder.builder()
                .customer(customer2)
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
        Customer customer = customerRepository.save(createSampleCustomer());
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder(customer));

        Integer originalVersion = saved.getVersion();
        saved.setStatus("UPDATED-STATUS");
        BeerOrder updated = beerOrderRepository.save(saved);

        assertThat(updated.getStatus()).isEqualTo("UPDATED-STATUS");
        assertThat(updated.getVersion()).isNotNull();
        assertThat(updated.getVersion()).isGreaterThanOrEqualTo(originalVersion);
        assertThat(updated.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("delete should remove entity from repository")
    void testDelete() {
        Customer customer = customerRepository.save(createSampleCustomer());
        BeerOrder saved = beerOrderRepository.save(sampleBeerOrder(customer));

        Integer id = saved.getId();
        beerOrderRepository.delete(saved);
        assertThat(beerOrderRepository.findById(id)).isEmpty();
    }

    @Test
    @DisplayName("findByCustomerNameContainingIgnoreCase should find orders with matching customer name")
    void testFindByCustomerNameContainingIgnoreCase() {
        // Create first customer and order
        Customer customer1 = Customer.builder()
                .name("Test Customer")
                .email("test@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main Street")
                .city("Boston")
                .state("MA")
                .postalCode("02108")
                .build();
        customerRepository.save(customer1);
        beerOrderRepository.save(sampleBeerOrder(customer1));

        // Create second customer and order
        Customer customer2 = Customer.builder()
                .name("Test Customer ABC")
                .email("abc@example.com")
                .phoneNumber("555-222-3333")
                .addressLine1("789 Side Street")
                .city("Chicago")
                .state("IL")
                .postalCode("60601")
                .build();
        customerRepository.save(customer2);
        BeerOrder order2 = BeerOrder.builder()
                .customer(customer2)
                .paymentAmount(new BigDecimal("49.99"))
                .status("NEW")
                .build();
        beerOrderRepository.save(order2);

        // Create third customer and order with different name pattern
        Customer customer3 = Customer.builder()
                .name("Different Person")
                .email("different@example.com")
                .phoneNumber("555-444-5555")
                .addressLine1("321 Back Street")
                .city("Miami")
                .state("FL")
                .postalCode("33101")
                .build();
        customerRepository.save(customer3);
        BeerOrder order3 = BeerOrder.builder()
                .customer(customer3)
                .paymentAmount(new BigDecimal("29.99"))
                .status("NEW")
                .build();
        beerOrderRepository.save(order3);

        // Test case-insensitive search
        List<BeerOrder> result1 = beerOrderRepository.findByCustomerNameContainingIgnoreCase("test");
        assertThat(result1).hasSize(2);

        // Test partial match
        List<BeerOrder> result2 = beerOrderRepository.findByCustomerNameContainingIgnoreCase("ABC");
        assertThat(result2).hasSize(1);
        assertThat(result2.get(0).getCustomer().getName()).isEqualTo("Test Customer ABC");

        // Test no match
        List<BeerOrder> result3 = beerOrderRepository.findByCustomerNameContainingIgnoreCase("NONEXISTENT");
        assertThat(result3).isEmpty();
    }

    @Test
    @DisplayName("findByCustomerId should find all orders for a specific customer")
    void testFindByCustomerId() {
        // Create customer with multiple orders
        Customer customer = customerRepository.save(createSampleCustomer());

        // Create first order
        BeerOrder order1 = BeerOrder.builder()
                .customer(customer)
                .paymentAmount(new BigDecimal("39.99"))
                .status("NEW")
                .build();
        beerOrderRepository.save(order1);

        // Create second order for same customer
        BeerOrder order2 = BeerOrder.builder()
                .customer(customer)
                .paymentAmount(new BigDecimal("59.99"))
                .status("PROCESSING")
                .build();
        beerOrderRepository.save(order2);

        // Create order for different customer
        Customer otherCustomer = Customer.builder()
                .name("Other Customer")
                .email("other@example.com")
                .phoneNumber("555-666-7777")
                .addressLine1("999 Far Street")
                .city("Seattle")
                .state("WA")
                .postalCode("98101")
                .build();
        customerRepository.save(otherCustomer);

        BeerOrder otherOrder = BeerOrder.builder()
                .customer(otherCustomer)
                .paymentAmount(new BigDecimal("19.99"))
                .status("NEW")
                .build();
        beerOrderRepository.save(otherOrder);

        // Test finding by customer ID
        List<BeerOrder> customerOrders = beerOrderRepository.findByCustomerId(customer.getId());
        assertThat(customerOrders).hasSize(2);

        // Verify these are the right orders
        assertThat(customerOrders.stream()
                .allMatch(order -> order.getCustomer().getId().equals(customer.getId())))
                .isTrue();
    }
}
