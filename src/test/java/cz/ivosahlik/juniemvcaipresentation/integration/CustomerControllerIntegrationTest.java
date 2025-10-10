package cz.ivosahlik.juniemvcaipresentation.integration;

import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.CustomerRepository;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CustomerControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    CustomerRepository customerRepository;

    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        // Clear any existing customers
        customerRepository.deleteAll();

        // Create a test customer
        testCustomer = Customer.builder()
                .name("Integration Test Customer")
                .email("integration.test@example.com")
                .phoneNumber("123-456-7890")
                .addressLine1("123 Integration St")
                .city("Test City")
                .state("TS")
                .postalCode("12345")
                .build();

        testCustomer = customerRepository.save(testCustomer);
    }

    @Test
    @DisplayName("Integration test: Get all customers")
    void testGetAllCustomers() throws Exception {
        mockMvc.perform(get("/api/v1/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].name", is("Integration Test Customer")));
    }

    @Test
    @DisplayName("Integration test: Get customer by ID")
    void testGetCustomerById() throws Exception {
        mockMvc.perform(get("/api/v1/customers/" + testCustomer.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testCustomer.getId())))
                .andExpect(jsonPath("$.name", is("Integration Test Customer")))
                .andExpect(jsonPath("$.email", is("integration.test@example.com")));
    }

    @Test
    @DisplayName("Integration test: Create new customer")
    void testCreateCustomer() throws Exception {
        CustomerDto newCustomer = CustomerDto.builder()
                .name("New Test Customer")
                .email("new.test@example.com")
                .phoneNumber("987-654-3210")
                .addressLine1("456 New St")
                .city("New City")
                .state("NS")
                .postalCode("54321")
                .build();

        String responseJson = mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("New Test Customer")))
                .andReturn()
                .getResponse()
                .getContentAsString();

        CustomerDto createdCustomer = objectMapper.readValue(responseJson, CustomerDto.class);

        // Verify the customer exists in the database
        mockMvc.perform(get("/api/v1/customers/" + createdCustomer.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Test Customer")));
    }

    @Test
    @DisplayName("Integration test: Update existing customer")
    void testUpdateCustomer() throws Exception {
        // Update the test customer
        CustomerDto updateDto = CustomerDto.builder()
                .name("Updated Customer")
                .email("updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("789 Update St")
                .city("Update City")
                .state("US")
                .postalCode("98765")
                .build();

        mockMvc.perform(put("/api/v1/customers/" + testCustomer.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testCustomer.getId())))
                .andExpect(jsonPath("$.name", is("Updated Customer")));

        // Verify the update persisted
        mockMvc.perform(get("/api/v1/customers/" + testCustomer.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Customer")))
                .andExpect(jsonPath("$.email", is("updated@example.com")));
    }

    @Test
    @DisplayName("Integration test: Delete customer")
    void testDeleteCustomer() throws Exception {
        // Delete the test customer
        mockMvc.perform(delete("/api/v1/customers/" + testCustomer.getId()))
                .andExpect(status().isNoContent());

        // Verify it's gone
        mockMvc.perform(get("/api/v1/customers/" + testCustomer.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Integration test: Search customers by name")
    void testSearchCustomersByName() throws Exception {
        // Add another customer with a different name
        Customer anotherCustomer = Customer.builder()
                .name("Another Different Customer")
                .addressLine1("Another Street")
                .city("Another City")
                .state("AS")
                .postalCode("11111")
                .build();
        customerRepository.save(anotherCustomer);

        // Search for the test customer by name
        mockMvc.perform(get("/api/v1/customers/search/by-name")
                .param("name", "Integration"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testCustomer.getId())));

        // Search for non-existent customer
        mockMvc.perform(get("/api/v1/customers/search/by-name")
                .param("name", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Integration test: Create customer with invalid data returns 400")
    void testCreateInvalidCustomer() throws Exception {
        CustomerDto invalidCustomer = new CustomerDto();
        // Missing required fields

        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidCustomer)))
                .andExpect(status().isBadRequest());
    }
}
