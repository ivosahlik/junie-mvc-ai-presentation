package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import cz.ivosahlik.juniemvcaipresentation.services.BeerOrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = BeerOrderController.class)
class BeerOrderControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    BeerOrderService beerOrderService;

    private BeerDto sampleBeerDto() {
        return BeerDto.builder()
                .id(1)
                .beerName("Sample Beer")
                .beerStyle("IPA")
                .upc("123456789")
                .price(new BigDecimal("5.99"))
                .quantityOnHand(10)
                .build();
    }

    private BeerOrderLineDto sampleOrderLineDto() {
        return BeerOrderLineDto.builder()
                .id(1)
                .orderQuantity(5)
                .quantityAllocated(0)
                .status("NEW")
                .beer(sampleBeerDto())
                .build();
    }

    private BeerOrderDto sampleBeerOrderDtoNoId() {
        return BeerOrderDto.builder()
                .customerRef("CUSTOMER-123")
                .status("NEW")
                .paymentAmount(new BigDecimal("29.95"))
                .beerOrderLines(Collections.singletonList(sampleOrderLineDto()))
                .build();
    }

    private BeerOrderDto sampleBeerOrderDtoWithId(Integer id) {
        BeerOrderDto dto = sampleBeerOrderDtoNoId();
        dto.setId(id);
        return dto;
    }

    @Test
    @DisplayName("POST /api/v1/beer-orders creates a beer order and returns 201")
    void testCreateBeerOrder() throws Exception {
        BeerOrderDto request = sampleBeerOrderDtoNoId();
        BeerOrderDto saved = sampleBeerOrderDtoWithId(1);

        given(beerOrderService.createBeerOrder(any(BeerOrderDto.class))).willReturn(saved);

        mockMvc.perform(post("/api/v1/beer-orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.customerRef", is("CUSTOMER-123")))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andExpect(jsonPath("$.beerOrderLines[0].beer.beerName", is("Sample Beer")));
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders/{id} returns beer order when found")
    void testGetBeerOrderByIdFound() throws Exception {
        BeerOrderDto saved = sampleBeerOrderDtoWithId(2);
        given(beerOrderService.getBeerOrderById(eq(2))).willReturn(Optional.of(saved));

        mockMvc.perform(get("/api/v1/beer-orders/2"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.customerRef", is("CUSTOMER-123")));
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders/{id} returns 404 when not found")
    void testGetBeerOrderByIdNotFound() throws Exception {
        given(beerOrderService.getBeerOrderById(eq(99))).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/beer-orders/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders returns list of beer orders")
    void testListBeerOrders() throws Exception {
        List<BeerOrderDto> list = Arrays.asList(
                sampleBeerOrderDtoWithId(1),
                sampleBeerOrderDtoWithId(2)
        );
        given(beerOrderService.listBeerOrders()).willReturn(list);

        mockMvc.perform(get("/api/v1/beer-orders"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)));
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders/search finds orders by customer reference")
    void testSearchBeerOrders() throws Exception {
        List<BeerOrderDto> orders = Collections.singletonList(sampleBeerOrderDtoWithId(3));
        given(beerOrderService.findBeerOrdersByCustomerRef(eq("CUSTOMER"))).willReturn(orders);

        mockMvc.perform(get("/api/v1/beer-orders/search")
                        .param("customerRef", "CUSTOMER"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(3)));
    }

    @Test
    @DisplayName("PUT /api/v1/beer-orders/{id} updates a beer order and returns 200")
    void testUpdateBeerOrderSuccess() throws Exception {
        BeerOrderDto request = sampleBeerOrderDtoWithId(5); // Use the same ID as in the path parameter
        BeerOrderDto updated = sampleBeerOrderDtoWithId(5);
        updated.setCustomerRef("UPDATED-CUSTOMER");
        updated.setStatus("PROCESSING");

        given(beerOrderService.updateBeerOrder(eq(5), any(BeerOrderDto.class))).willReturn(Optional.of(updated));

        mockMvc.perform(put("/api/v1/beer-orders/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(5)))
                .andExpect(jsonPath("$.customerRef", is("UPDATED-CUSTOMER")))
                .andExpect(jsonPath("$.status", is("PROCESSING")));
    }

    @Test
    @DisplayName("PUT /api/v1/beer-orders/{id} returns 404 when beer order does not exist")
    void testUpdateBeerOrderNotFound() throws Exception {
        BeerOrderDto request = sampleBeerOrderDtoWithId(404); // Use the same ID as in the path parameter
        given(beerOrderService.updateBeerOrder(eq(404), any(BeerOrderDto.class))).willReturn(Optional.empty());

        mockMvc.perform(put("/api/v1/beer-orders/404")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/beer-orders/{id} returns 204 when deleted")
    void testDeleteBeerOrderSuccess() throws Exception {
        given(beerOrderService.deleteBeerOrder(eq(7))).willReturn(true);

        mockMvc.perform(delete("/api/v1/beer-orders/7"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/v1/beer-orders/{id} returns 404 when not found")
    void testDeleteBeerOrderNotFound() throws Exception {
        given(beerOrderService.deleteBeerOrder(eq(888))).willReturn(false);

        mockMvc.perform(delete("/api/v1/beer-orders/888"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/beer-orders with invalid data returns 400")
    void testCreateBeerOrderValidationFailure() throws Exception {
        // Create an invalid request with missing required fields
        BeerOrderDto invalidRequest = new BeerOrderDto();
        // Missing customerRef which is required

        mockMvc.perform(post("/api/v1/beer-orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
