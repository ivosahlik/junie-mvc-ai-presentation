package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import cz.ivosahlik.juniemvcaipresentation.services.BeerOrderShipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Simplified tests for BeerOrderShipmentController.
 */
@ExtendWith(MockitoExtension.class)
class BeerOrderShipmentControllerTestSimple {

    private MockMvc mockMvc;

    @Mock
    private BeerOrderShipmentService beerOrderShipmentService;

    @InjectMocks
    private BeerOrderShipmentController controller;

    private BeerOrderShipmentDto testShipmentDto;
    private LocalDateTime testDate;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .build();

        testDate = LocalDateTime.of(2025, 10, 11, 12, 0);

        // Setup test shipment DTO
        testShipmentDto = new BeerOrderShipmentDto();
        testShipmentDto.setId(1);
        testShipmentDto.setVersion(1);
        testShipmentDto.setShipmentDate(testDate);
        testShipmentDto.setCarrier("UPS");
        testShipmentDto.setTrackingNumber("1Z999AA10123456784");
        testShipmentDto.setBeerOrderId(1);
    }

    @Test
    @DisplayName("GET beer orders shipments - Success")
    void testGetBeerOrderShipments() throws Exception {
        // Given
        List<BeerOrderShipmentDto> shipments = Arrays.asList(testShipmentDto);
        when(beerOrderShipmentService.getBeerOrderShipmentsByBeerOrderId(anyInt()))
                .thenReturn(shipments);

        // When/Then
        mockMvc.perform(get("/api/v1/beer-orders/1/shipments"));

        // Verify
        verify(beerOrderShipmentService, times(1)).getBeerOrderShipmentsByBeerOrderId(1);
    }

    @Test
    @DisplayName("GET beer orders shipment by ID - Success")
    void testGetBeerOrderShipmentById() throws Exception {
        // Given
        when(beerOrderShipmentService.getBeerOrderShipmentById(anyInt()))
                .thenReturn(Optional.of(testShipmentDto));

        // When/Then
        mockMvc.perform(get("/api/v1/beer-orders/1/shipments/1"));

        // Verify
        verify(beerOrderShipmentService, times(1)).getBeerOrderShipmentById(1);
    }

    @Test
    @DisplayName("GET beer orders shipment by ID - Not Found")
    void testGetBeerOrderShipmentByIdNotFound() throws Exception {
        // Given
        when(beerOrderShipmentService.getBeerOrderShipmentById(anyInt()))
                .thenReturn(Optional.empty());

        // When/Then
        mockMvc.perform(get("/api/v1/beer-orders/1/shipments/99"))
                .andExpect(status().isNotFound());

        verify(beerOrderShipmentService, times(1)).getBeerOrderShipmentById(99);
    }

    @Test
    @DisplayName("DELETE beer orders shipment - Success")
    void testDeleteBeerOrderShipment() throws Exception {
        // Given
        doReturn(true).when(beerOrderShipmentService).deleteBeerOrderShipment(anyInt());

        // When/Then
        mockMvc.perform(delete("/api/v1/beer-orders/1/shipments/1"))
                .andExpect(status().isNoContent());

        verify(beerOrderShipmentService, times(1)).deleteBeerOrderShipment(1);
    }

    @Test
    @DisplayName("DELETE beer orders shipment - Not Found")
    void testDeleteBeerOrderShipmentNotFound() throws Exception {
        // Given
        doReturn(false).when(beerOrderShipmentService).deleteBeerOrderShipment(anyInt());

        // When/Then
        mockMvc.perform(delete("/api/v1/beer-orders/1/shipments/99"))
                .andExpect(status().isNotFound());

        verify(beerOrderShipmentService, times(1)).deleteBeerOrderShipment(99);
    }
}
