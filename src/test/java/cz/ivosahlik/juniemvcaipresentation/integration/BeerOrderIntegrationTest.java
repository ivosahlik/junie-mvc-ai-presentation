package cz.ivosahlik.juniemvcaipresentation.integration;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderLineRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.CustomerRepository;
import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"logging.level.org.springframework=DEBUG"})
@AutoConfigureMockMvc
@Transactional
class BeerOrderIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    BeerRepository beerRepository;

    @Autowired
    BeerOrderRepository beerOrderRepository;

    @Autowired
    BeerOrderLineRepository beerOrderLineRepository;

    @Autowired
    CustomerRepository customerRepository;

    private Beer testBeer;
    private Customer testCustomer;

    private CustomerDto createTestCustomerDto(String name) {
        return CustomerDto.builder()
                .name(name)
                .addressLine1("123 Integration Test Street")
                .city("Test City")
                .state("TS")
                .postalCode("12345")
                .email("")
                .phoneNumber("")
                .build();
    }

    @BeforeEach
    void setUp() {
        // Create a test beer if the repository is empty
        if (beerRepository.count() == 0) {
            testBeer = Beer.builder()
                    .beerName("Integration Test Beer")
                    .beerStyle("Test Style")
                    .upc("INT-TEST-UPC")
                    .quantityOnHand(50)
                    .price(new BigDecimal("7.99"))
                    .build();
            testBeer = beerRepository.save(testBeer);
        } else {
            testBeer = beerRepository.findAll().get(0);
        }

        // Create a test customer if the repository is empty
        if (customerRepository.count() == 0) {
            testCustomer = Customer.builder()
                    .name("Default Test Customer")
                    .addressLine1("123 Test St")
                    .city("Test City")
                    .state("TS")
                    .postalCode("12345")
                    .email("")
                    .phoneNumber("")
                    .build();
            testCustomer = customerRepository.save(testCustomer);
        } else {
            testCustomer = customerRepository.findAll().get(0);
        }
    }

    @Test
    @DisplayName("Integration test: Create beer order flow")
    void testCreateBeerOrderFlow() throws Exception {
        // Clear any existing orders to start with a clean state
        beerOrderRepository.deleteAll();

        // Build a beer order with a line referencing the test beer
        BeerDto beerDto = BeerDto.builder()
                .id(testBeer.getId())
                .beerName(testBeer.getBeerName())
                .beerStyle(testBeer.getBeerStyle())
                .upc(testBeer.getUpc())
                .price(testBeer.getPrice())
                .build();

        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(10)
                .beer(beerDto)
                .build();

        // Create a DTO for the test customer
        CustomerDto customerDto = CustomerDto.builder()
                .id(testCustomer.getId())
                .name(testCustomer.getName())
                .addressLine1(testCustomer.getAddressLine1())
                .city(testCustomer.getCity())
                .state(testCustomer.getState())
                .postalCode(testCustomer.getPostalCode())
                .build();

        BeerOrderDto orderDto = BeerOrderDto.builder()
                .customer(customerDto)
                .status("NEW")
                .paymentAmount(new BigDecimal("79.90"))
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        // Create the order via the API
        String responseJson = mockMvc.perform(post("/api/v1/beer-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract the created order ID from response
        BeerOrderDto createdOrder = objectMapper.readValue(responseJson, BeerOrderDto.class);
        Integer orderId = createdOrder.getId();

        // Verify the order exists by retrieving it via the API
        mockMvc.perform(get("/api/v1/beer-orders/" + orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(orderId)))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andExpect(jsonPath("$.beerOrderLines[0].beer.id", is(testBeer.getId())));
    }

    @Test
    @DisplayName("Integration test: Update beer order flow")
    void testUpdateBeerOrderFlow() throws Exception {
        // First create an order
        BeerDto beerDto = BeerDto.builder()
                .id(testBeer.getId())
                .beerName(testBeer.getBeerName())
                .beerStyle(testBeer.getBeerStyle())
                .upc(testBeer.getUpc())
                .price(testBeer.getPrice())
                .build();

        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(5)
                .beer(beerDto)
                .build();

        // Use existing customer for the test
        CustomerDto customerDto = CustomerDto.builder()
                .id(testCustomer.getId())
                .name(testCustomer.getName())
                .addressLine1(testCustomer.getAddressLine1())
                .city(testCustomer.getCity())
                .state(testCustomer.getState())
                .postalCode(testCustomer.getPostalCode())
                .email(testCustomer.getEmail())
                .phoneNumber(testCustomer.getPhoneNumber())
                .build();

        BeerOrderDto orderDto = BeerOrderDto.builder()
                .customer(customerDto)
                .status("NEW")
                .paymentAmount(new BigDecimal("39.95"))
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        // Create the order via the API
        String responseJson = mockMvc.perform(post("/api/v1/beer-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderDto)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract the created order ID from response
        BeerOrderDto createdOrder = objectMapper.readValue(responseJson, BeerOrderDto.class);
        Integer orderId = createdOrder.getId();

        // Modify the order - update the existing customer rather than creating a new one
        customerDto.setName("Updated Customer Name");
        createdOrder.setCustomer(customerDto);
        createdOrder.setStatus("PROCESSING");
        createdOrder.setBeerOrderLines(Collections.singletonList(
                BeerOrderLineDto.builder()
                        .orderQuantity(15) // Increased quantity
                        .beer(beerDto)
                        .build()
        ));

        // Update via API
        mockMvc.perform(put("/api/v1/beer-orders/" + orderId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdOrder)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customer.name", is("Updated Customer Name")))
                .andExpect(jsonPath("$.status", is("PROCESSING")));

        // Verify order was updated by getting it again via API
        mockMvc.perform(get("/api/v1/beer-orders/" + orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PROCESSING")));
    }

    @Test
    @DisplayName("Integration test: List all beer orders")
    void testListAllBeerOrders() throws Exception {
        // Verify we can list all orders
        mockMvc.perform(get("/api/v1/beer-orders"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Integration test: Search non-existent customer")
    void testSearchNonExistentCustomer() throws Exception {
        // Search for non-existent customer should return empty list
        mockMvc.perform(get("/api/v1/beer-orders/search/by-name")
                .param("customerName", "NONEXISTENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
