package cz.ivosahlik.juniemvcaipresentation.integration;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderLineRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerRepository;
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

@SpringBootTest
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

    private Beer testBeer;

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

        BeerOrderDto orderDto = BeerOrderDto.builder()
                .customerRef("INTEGRATION-TEST-CUSTOMER")
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
                .andExpect(jsonPath("$.customerRef", is("INTEGRATION-TEST-CUSTOMER")))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract the created order ID from response
        BeerOrderDto createdOrder = objectMapper.readValue(responseJson, BeerOrderDto.class);
        Integer orderId = createdOrder.getId();

        // Verify the order exists in the repository
        assertThat(beerOrderRepository.findById(orderId)).isPresent();

        // Verify the order line was created with correct beer reference
        assertThat(beerOrderLineRepository.findByBeerOrderId(orderId)).hasSize(1);
        assertThat(beerOrderLineRepository.findByBeerOrderId(orderId).get(0).getBeer().getId())
                .isEqualTo(testBeer.getId());

        // Verify we can retrieve the order via the API
        mockMvc.perform(get("/api/v1/beer-orders/" + orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(orderId)))
                .andExpect(jsonPath("$.customerRef", is("INTEGRATION-TEST-CUSTOMER")))
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

        BeerOrderDto orderDto = BeerOrderDto.builder()
                .customerRef("UPDATE-TEST-CUSTOMER")
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

        // Modify the order
        createdOrder.setCustomerRef("UPDATED-CUSTOMER-REF");
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
                .andExpect(jsonPath("$.customerRef", is("UPDATED-CUSTOMER-REF")))
                .andExpect(jsonPath("$.status", is("PROCESSING")));

        // Verify changes in repository
        assertThat(beerOrderRepository.findById(orderId).get().getCustomerRef())
                .isEqualTo("UPDATED-CUSTOMER-REF");
        assertThat(beerOrderRepository.findById(orderId).get().getStatus())
                .isEqualTo("PROCESSING");

        // Verify order line was updated
        assertThat(beerOrderLineRepository.findByBeerOrderId(orderId).get(0).getOrderQuantity())
                .isEqualTo(15);
    }

    @Test
    @DisplayName("Integration test: Search beer orders flow")
    void testSearchBeerOrdersFlow() throws Exception {
        // Create multiple orders with different customer refs
        BeerDto beerDto = BeerDto.builder()
                .id(testBeer.getId())
                .beerName(testBeer.getBeerName())
                .beerStyle(testBeer.getBeerStyle())
                .upc(testBeer.getUpc())
                .price(testBeer.getPrice())
                .build();

        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .orderQuantity(3)
                .beer(beerDto)
                .build();

        // First order
        BeerOrderDto order1 = BeerOrderDto.builder()
                .customerRef("SEARCH-TEST-PREMIUM")
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        // Second order
        BeerOrderDto order2 = BeerOrderDto.builder()
                .customerRef("SEARCH-TEST-REGULAR")
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        // Third order with different prefix
        BeerOrderDto order3 = BeerOrderDto.builder()
                .customerRef("DIFFERENT-PREFIX")
                .beerOrderLines(Collections.singletonList(lineDto))
                .build();

        // Create all orders
        mockMvc.perform(post("/api/v1/beer-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/beer-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order2)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/beer-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order3)))
                .andExpect(status().isCreated());

        // Search for SEARCH-TEST prefix
        mockMvc.perform(get("/api/v1/beer-orders/search")
                .param("customerRef", "SEARCH-TEST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].customerRef", containsString("SEARCH-TEST")))
                .andExpect(jsonPath("$[1].customerRef", containsString("SEARCH-TEST")));

        // Search for PREMIUM
        mockMvc.perform(get("/api/v1/beer-orders/search")
                .param("customerRef", "PREMIUM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].customerRef", is("SEARCH-TEST-PREMIUM")));

        // Search for non-existent customer ref
        mockMvc.perform(get("/api/v1/beer-orders/search")
                .param("customerRef", "NONEXISTENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
