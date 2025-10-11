package cz.ivosahlik.juniemvcaipresentation.integration;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderShipmentRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Integration tests for BeerOrderShipment API.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BeerOrderShipmentIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BeerOrderRepository beerOrderRepository;

    @Autowired
    private BeerOrderShipmentRepository beerOrderShipmentRepository;

    private ObjectMapper objectMapper;

    private BeerOrder testBeerOrder;
    private String baseUrl;

    @BeforeEach
    void setUp() {
        // Initialize ObjectMapper with JavaTimeModule for handling LocalDateTime
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Configure RestTemplate to use our custom ObjectMapper
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);
        restTemplate.getRestTemplate().getMessageConverters().add(0, converter);

        // Clear any existing data
        beerOrderShipmentRepository.deleteAll();
        beerOrderRepository.deleteAll();
        customerRepository.deleteAll();

        // Create a customer
        Customer customer = Customer.builder()
                .name("Integration Test Customer")
                .email("integration@example.com")
                .addressLine1("123 Integration St")
                .city("Test City")
                .state("TS")
                .postalCode("12345")
                .build();
        Customer savedCustomer = customerRepository.save(customer);

        // Create a beer order
        BeerOrder order = BeerOrder.builder()
                .customer(savedCustomer)
                .paymentAmount(new BigDecimal("99.99"))
                .status("NEW")
                .build();
        testBeerOrder = beerOrderRepository.save(order);

        // Debug: Verify the beer order was saved with a valid ID
        System.out.println("[DEBUG_LOG] Beer Order saved with ID: " + testBeerOrder.getId());

        // Verify the beer order can be found in the database
        BeerOrder foundOrder = beerOrderRepository.findById(testBeerOrder.getId()).orElse(null);
        System.out.println("[DEBUG_LOG] Beer Order found in database: " + (foundOrder != null));
        if (foundOrder != null) {
            System.out.println("[DEBUG_LOG] Found Beer Order ID: " + foundOrder.getId());
        }

        baseUrl = "/api/v1/beer-orders/" + testBeerOrder.getId() + "/shipments";
    }

    @Test
    @DisplayName("Integration test - Create and retrieve shipment")
    void testCreateAndRetrieveShipment() {
        // Debug: Add another check right before the request
        BeerOrder foundOrderAgain = beerOrderRepository.findById(testBeerOrder.getId()).orElse(null);
        System.out.println("[DEBUG_LOG] Beer Order still found before request: " + (foundOrderAgain != null));
        if (foundOrderAgain != null) {
            System.out.println("[DEBUG_LOG] Found Beer Order ID again: " + foundOrderAgain.getId());
        }
        // Create shipment DTO with explicitly set beerOrderId
        BeerOrderShipmentDto shipmentDto = BeerOrderShipmentDto.builder()
                .shipmentDate(LocalDateTime.now())
                .carrier("UPS")
                .trackingNumber("1Z999AA10123456784")
                .beerOrderId(testBeerOrder.getId())  // Explicitly set beerOrderId
                .build();

        // POST the shipment directly now that we have proper date handling
        System.out.println("[DEBUG_LOG] Posting to URL: " + baseUrl);
        ResponseEntity<BeerOrderShipmentDto> createResponse = restTemplate
                .postForEntity(baseUrl, shipmentDto, BeerOrderShipmentDto.class);

        System.out.println("[DEBUG_LOG] Response status: " + createResponse.getStatusCode());

        BeerOrderShipmentDto responseBody = createResponse.getBody();
        System.out.println("[DEBUG_LOG] Response body: " + responseBody);

        if (responseBody != null) {
            System.out.println("[DEBUG_LOG] Response beerOrderId: " + responseBody.getBeerOrderId());
            System.out.println("[DEBUG_LOG] Response shipmentDate: " + responseBody.getShipmentDate());
            System.out.println("[DEBUG_LOG] Response carrier: " + responseBody.getCarrier());
            System.out.println("[DEBUG_LOG] Response trackingNumber: " + responseBody.getTrackingNumber());
        }

        // Validate response
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        BeerOrderShipmentDto createdShipment = createResponse.getBody();
        assertNotNull(createdShipment);
        assertNotNull(createdShipment.getId());
        assertThat(createdShipment.getCarrier()).isEqualTo("UPS");
        assertThat(createdShipment.getTrackingNumber()).isEqualTo("1Z999AA10123456784");
        assertThat(createdShipment.getBeerOrderId()).isEqualTo(testBeerOrder.getId());

        // GET the shipment by ID
        ResponseEntity<BeerOrderShipmentDto> getResponse = restTemplate
                .getForEntity(baseUrl + "/" + createdShipment.getId(), BeerOrderShipmentDto.class);

        // Validate get response
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        BeerOrderShipmentDto retrievedShipment = getResponse.getBody();
        assertNotNull(retrievedShipment);
        assertThat(retrievedShipment.getId()).isEqualTo(createdShipment.getId());
        assertThat(retrievedShipment.getCarrier()).isEqualTo(createdShipment.getCarrier());
        assertThat(retrievedShipment.getTrackingNumber()).isEqualTo(createdShipment.getTrackingNumber());

        // GET all shipments for beer order
        ResponseEntity<List> getAllResponse = restTemplate.getForEntity(baseUrl, List.class);

        // Validate get all response
        assertThat(getAllResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<?> shipments = getAllResponse.getBody();
        assertNotNull(shipments);
        assertThat(shipments.size()).isEqualTo(1);

        // Update the shipment
        shipmentDto.setId(createdShipment.getId());
        shipmentDto.setCarrier("FedEx");
        shipmentDto.setTrackingNumber("789456123");

        ResponseEntity<BeerOrderShipmentDto> updateResponse = restTemplate.exchange(
                baseUrl + "/" + createdShipment.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(shipmentDto),
                BeerOrderShipmentDto.class
        );

        // Validate update response
        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        BeerOrderShipmentDto updatedShipment = updateResponse.getBody();
        assertNotNull(updatedShipment);
        assertThat(updatedShipment.getId()).isEqualTo(createdShipment.getId());
        assertThat(updatedShipment.getCarrier()).isEqualTo("FedEx");
        assertThat(updatedShipment.getTrackingNumber()).isEqualTo("789456123");

        // DELETE the shipment
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                baseUrl + "/" + createdShipment.getId(),
                HttpMethod.DELETE,
                null,
                Void.class
        );

        // Validate delete response
        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // Verify the shipment is gone
        ResponseEntity<BeerOrderShipmentDto> getDeletedResponse = restTemplate
                .getForEntity(baseUrl + "/" + createdShipment.getId(), BeerOrderShipmentDto.class);

        assertThat(getDeletedResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Integration test - Bad request with invalid data")
    @Transactional
    @Rollback
    void testBadRequestWithInvalidData() {
        // Create invalid shipment DTO (missing required shipmentDate)
        BeerOrderShipmentDto invalidDto = BeerOrderShipmentDto.builder()
                .carrier("UPS")
                .trackingNumber("1Z999AA10123456784")
                .build();

        // Attempt to POST the invalid shipment
        ResponseEntity<Object> response = restTemplate
                .postForEntity(baseUrl, invalidDto, Object.class);

        // Validate response is bad request
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Integration test - Not found for non-existent resource")
    void testNotFoundForNonExistentResource() {
        // Attempt to GET a non-existent shipment
        ResponseEntity<BeerOrderShipmentDto> response = restTemplate
                .getForEntity(baseUrl + "/9999", BeerOrderShipmentDto.class);

        // Validate response is not found
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
