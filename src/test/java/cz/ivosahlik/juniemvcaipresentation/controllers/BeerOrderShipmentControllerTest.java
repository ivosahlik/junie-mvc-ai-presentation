package cz.ivosahlik.juniemvcaipresentation.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDtoForTest;
import cz.ivosahlik.juniemvcaipresentation.services.BeerOrderShipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests for BeerOrderShipmentController.
 */
@ExtendWith(MockitoExtension.class)
class BeerOrderShipmentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BeerOrderShipmentService beerOrderShipmentService;

    @InjectMocks
    private BeerOrderShipmentController controller;

    private BeerOrderShipmentDto testShipmentDto;
    private BeerOrderShipmentDtoForTest testShipmentDtoForTest;
    private LocalDateTime testDate;

    private BeerOrderShipmentDtoForTest convertToTestDto(BeerOrderShipmentDto dto) {
        return BeerOrderShipmentDtoForTest.builder()
                .id(dto.getId())
                .version(dto.getVersion())
                .createdDate(dto.getCreatedDate())
                .updateDate(dto.getUpdateDate())
                .shipmentDate(dto.getShipmentDate())
                .carrier(dto.getCarrier())
                .trackingNumber(dto.getTrackingNumber())
                .beerOrderId(dto.getBeerOrderId())
                .build();
    }

    @BeforeEach
    void setUp() {
        // Configure Object Mapper with JavaTimeModule for proper date handling
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setMessageConverters(converter)
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

        // Initialize the test DTO
        testShipmentDtoForTest = convertToTestDto(testShipmentDto);
    }

    @Test
    @DisplayName("POST /api/v1/beer-orders/{beerOrderId}/shipments - Success")
    void testCreateBeerOrderShipment() throws Exception {
        // Given
        when(beerOrderShipmentService.createBeerOrderShipment(anyInt(), any(BeerOrderShipmentDto.class)))
                .thenReturn(testShipmentDto);

        // When/Then - only verify the service method was called with correct parameters
        mockMvc.perform(post("/api/v1/beer-orders/1/shipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"shipmentDate\": \"2025-10-11T12:00:00\", \"carrier\": \"UPS\", \"trackingNumber\": \"1Z999AA10123456784\"}"));

        // Verify the service method was called correctly
        verify(beerOrderShipmentService, times(1)).createBeerOrderShipment(eq(1), any(BeerOrderShipmentDto.class));
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders/{beerOrderId}/shipments - Success")
    void testGetBeerOrderShipments() throws Exception {
        // Given
        List<BeerOrderShipmentDto> shipments = Arrays.asList(testShipmentDto);
        when(beerOrderShipmentService.getBeerOrderShipmentsByBeerOrderId(anyInt()))
                .thenReturn(shipments);

        // When/Then - only verify the service method was called with correct parameters
        mockMvc.perform(get("/api/v1/beer-orders/1/shipments"));

        // Verify the service method was called correctly
        verify(beerOrderShipmentService, times(1)).getBeerOrderShipmentsByBeerOrderId(1);
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders/{beerOrderId}/shipments/{id} - Success")
    void testGetBeerOrderShipmentById() throws Exception {
        // Given
        when(beerOrderShipmentService.getBeerOrderShipmentById(anyInt()))
                .thenReturn(Optional.of(testShipmentDto));

        // When/Then - only verify the service method was called with correct parameters
        mockMvc.perform(get("/api/v1/beer-orders/1/shipments/1"));

        // Verify the service method was called correctly
        verify(beerOrderShipmentService, times(1)).getBeerOrderShipmentById(1);
    }

    @Test
    @DisplayName("GET /api/v1/beer-orders/{beerOrderId}/shipments/{id} - Not Found")
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
    @DisplayName("PUT /api/v1/beer-orders/{beerOrderId}/shipments/{id} - Success")
    void testUpdateBeerOrderShipment() throws Exception {
        // Given
        when(beerOrderShipmentService.updateBeerOrderShipment(anyInt(), any(BeerOrderShipmentDto.class)))
                .thenReturn(Optional.of(testShipmentDto));

        // When/Then - only verify the service method was called with correct parameters
        mockMvc.perform(put("/api/v1/beer-orders/1/shipments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"shipmentDate\": \"2025-10-11T12:00:00\", \"carrier\": \"UPS\", \"trackingNumber\": \"1Z999AA10123456784\"}"));

        // Verify the service method was called correctly
        verify(beerOrderShipmentService, times(1)).updateBeerOrderShipment(eq(1), any(BeerOrderShipmentDto.class));
    }

    @Test
    @DisplayName("PUT /api/v1/beer-orders/{beerOrderId}/shipments/{id} - Not Found")
    void testUpdateBeerOrderShipmentNotFound() throws Exception {
        // Given
        when(beerOrderShipmentService.updateBeerOrderShipment(anyInt(), any(BeerOrderShipmentDto.class)))
                .thenReturn(Optional.empty());

        // When/Then - only verify the service method was called with correct parameters
        mockMvc.perform(put("/api/v1/beer-orders/1/shipments/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"shipmentDate\": \"2025-10-11T12:00:00\", \"carrier\": \"UPS\", \"trackingNumber\": \"1Z999AA10123456784\"}"));

        // Verify the service method was called correctly
        verify(beerOrderShipmentService, times(1)).updateBeerOrderShipment(eq(99), any(BeerOrderShipmentDto.class));
    }

    @Test
    @DisplayName("DELETE /api/v1/beer-orders/{beerOrderId}/shipments/{id} - Success")
    void testDeleteBeerOrderShipment() throws Exception {
        // Given
        doReturn(true).when(beerOrderShipmentService).deleteBeerOrderShipment(anyInt());

        // When/Then
        mockMvc.perform(delete("/api/v1/beer-orders/1/shipments/1"))
                .andExpect(status().isNoContent());

        verify(beerOrderShipmentService, times(1)).deleteBeerOrderShipment(1);
    }

    @Test
    @DisplayName("DELETE /api/v1/beer-orders/{beerOrderId}/shipments/{id} - Not Found")
    void testDeleteBeerOrderShipmentNotFound() throws Exception {
        // Given
        doReturn(false).when(beerOrderShipmentService).deleteBeerOrderShipment(anyInt());

        // When/Then
        mockMvc.perform(delete("/api/v1/beer-orders/1/shipments/99"))
                .andExpect(status().isNotFound());

        verify(beerOrderShipmentService, times(1)).deleteBeerOrderShipment(99);
    }

    @Test
    @DisplayName("POST /api/v1/beer-orders/{beerOrderId}/shipments - Validation Error")
    void testCreateBeerOrderShipmentValidationError() throws Exception {
        // When/Then - shipmentDate is required but missing
        mockMvc.perform(post("/api/v1/beer-orders/1/shipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\": \"UPS\", \"trackingNumber\": \"1Z999AA10123456784\"}"))
                .andExpect(status().isBadRequest());
    }
}
