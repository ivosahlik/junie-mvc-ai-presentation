package cz.ivosahlik.juniemvcaipresentation.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
public class TestBeerOrderShipmentJson {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BeerOrderRepository beerOrderRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void testEndpointAccess() throws Exception {
        // First create a customer
        Customer customer = Customer.builder()
                .name("Test Customer")
                .email("test@example.com")
                .addressLine1("123 Test St")
                .city("Test City")
                .state("TS")
                .postalCode("12345")
                .build();
        Customer savedCustomer = customerRepository.save(customer);

        // Then create a beer order
        BeerOrder order = BeerOrder.builder()
                .customer(savedCustomer)
                .paymentAmount(new BigDecimal("25.99"))
                .status("NEW")
                .build();
        BeerOrder savedOrder = beerOrderRepository.save(order);

        Integer beerOrderId = savedOrder.getId();
        System.out.println("Created Beer Order with ID: " + beerOrderId);

        // Create a shipment DTO
        BeerOrderShipmentDto dto = new BeerOrderShipmentDto();
        dto.setShipmentDate(LocalDateTime.now());
        dto.setCarrier("UPS");
        dto.setTrackingNumber("123456789");

        // Convert to JSON
        String jsonContent = objectMapper.writeValueAsString(dto);

        System.out.println("Sending JSON: " + jsonContent);

        // Test if the endpoint is accessible
        mockMvc.perform(post("/api/v1/beer-orders/" + beerOrderId + "/shipments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonContent))
                .andDo(print()) // Print request and response for debugging
                .andExpect(status().isCreated()); // If endpoint exists, should return 201
    }
}
