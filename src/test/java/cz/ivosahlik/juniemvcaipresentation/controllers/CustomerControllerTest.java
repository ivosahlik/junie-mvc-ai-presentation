package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import cz.ivosahlik.juniemvcaipresentation.services.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CustomerController.class)
class CustomerControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    CustomerService customerService;

    private CustomerDto sampleCustomerDto(Integer id) {
        CustomerDto dto = new CustomerDto();
        dto.setId(id);
        dto.setName("Test Customer " + id);
        dto.setEmail("test" + id + "@example.com");
        dto.setPhoneNumber("123-456-789" + id);
        dto.setAddressLine1("123 Test St");
        dto.setCity("Test City");
        dto.setState("TS");
        dto.setPostalCode("12345");
        return dto;
    }

    @Test
    @DisplayName("GET /api/v1/customers returns list of customers")
    void testListCustomers() throws Exception {
        // Given
        List<CustomerDto> customers = Arrays.asList(
                sampleCustomerDto(1),
                sampleCustomerDto(2)
        );

        given(customerService.listCustomers()).willReturn(customers);

        // When/Then
        mockMvc.perform(get("/api/v1/customers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Test Customer 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Test Customer 2")));
    }

    @Test
    @DisplayName("GET /api/v1/customers/{id} returns customer when found")
    void testGetCustomerByIdFound() throws Exception {
        // Given
        CustomerDto customer = sampleCustomerDto(1);
        given(customerService.getCustomerById(eq(1))).willReturn(Optional.of(customer));

        // When/Then
        mockMvc.perform(get("/api/v1/customers/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Customer 1")));
    }

    @Test
    @DisplayName("GET /api/v1/customers/{id} returns 404 when not found")
    void testGetCustomerByIdNotFound() throws Exception {
        // Given
        given(customerService.getCustomerById(eq(99))).willReturn(Optional.empty());

        // When/Then
        mockMvc.perform(get("/api/v1/customers/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/customers creates a customer and returns 201")
    void testCreateCustomer() throws Exception {
        // Given
        CustomerDto requestDto = sampleCustomerDto(null); // No ID in request
        CustomerDto createdDto = sampleCustomerDto(1); // ID assigned after creation

        given(customerService.createCustomer(any(CustomerDto.class))).willReturn(createdDto);

        // When/Then
        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Customer 1")));
    }

    @Test
    @DisplayName("PUT /api/v1/customers/{id} updates customer and returns 200")
    void testUpdateCustomerSuccess() throws Exception {
        // Given
        CustomerDto requestDto = new CustomerDto();
        requestDto.setName("Updated Customer");
        requestDto.setEmail("updated@example.com");
        requestDto.setAddressLine1("456 Update St");
        requestDto.setCity("Update City");
        requestDto.setState("US");
        requestDto.setPostalCode("54321");

        CustomerDto updatedDto = new CustomerDto();
        updatedDto.setId(1);
        updatedDto.setName("Updated Customer");
        updatedDto.setEmail("updated@example.com");
        updatedDto.setAddressLine1("456 Update St");
        updatedDto.setCity("Update City");
        updatedDto.setState("US");
        updatedDto.setPostalCode("54321");

        given(customerService.updateCustomer(eq(1), any(CustomerDto.class))).willReturn(Optional.of(updatedDto));

        // When/Then
        mockMvc.perform(put("/api/v1/customers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Updated Customer")));
    }

    @Test
    @DisplayName("PUT /api/v1/customers/{id} returns 404 when not found")
    void testUpdateCustomerNotFound() throws Exception {
        // Given
        CustomerDto requestDto = sampleCustomerDto(null);
        given(customerService.updateCustomer(eq(99), any(CustomerDto.class))).willReturn(Optional.empty());

        // When/Then
        mockMvc.perform(put("/api/v1/customers/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/customers/{id} returns 204 when deleted")
    void testDeleteCustomerSuccess() throws Exception {
        // Given
        given(customerService.deleteCustomer(eq(1))).willReturn(true);

        // When/Then
        mockMvc.perform(delete("/api/v1/customers/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/v1/customers/{id} returns 404 when not found")
    void testDeleteCustomerNotFound() throws Exception {
        // Given
        given(customerService.deleteCustomer(eq(99))).willReturn(false);

        // When/Then
        mockMvc.perform(delete("/api/v1/customers/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/customers/search/by-name returns customers matching name")
    void testSearchCustomersByName() throws Exception {
        // Given
        CustomerDto customer = sampleCustomerDto(1);
        given(customerService.findCustomersByName(eq("Test"))).willReturn(Collections.singletonList(customer));

        // When/Then
        mockMvc.perform(get("/api/v1/customers/search/by-name")
                .param("name", "Test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Test Customer 1")));
    }

    @Test
    @DisplayName("POST /api/v1/customers with invalid data returns 400")
    void testCreateCustomerValidationFailure() throws Exception {
        // Given - create an invalid customer with null required fields
        CustomerDto invalidCustomer = new CustomerDto();
        // Missing required name field

        // When/Then
        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidCustomer)))
                .andExpect(status().isBadRequest());
    }
}
