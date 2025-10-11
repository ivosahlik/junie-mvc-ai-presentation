package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderShipment;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderShipmentMapper;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests for BeerOrderShipmentServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
class BeerOrderShipmentServiceImplTest {

    @Mock
    BeerOrderShipmentRepository beerOrderShipmentRepository;

    @Mock
    BeerOrderRepository beerOrderRepository;

    @Mock
    BeerOrderShipmentMapper beerOrderShipmentMapper;

    @InjectMocks
    BeerOrderShipmentServiceImpl beerOrderShipmentService;

    BeerOrderShipment testShipment;
    BeerOrderShipmentDto testShipmentDto;
    BeerOrder testBeerOrder;

    @BeforeEach
    void setUp() {
        // Setup test beer order
        testBeerOrder = new BeerOrder();
        testBeerOrder.setId(1);

        // Setup test shipment
        testShipment = new BeerOrderShipment();
        testShipment.setId(1);
        testShipment.setVersion(1);
        testShipment.setShipmentDate(LocalDateTime.now());
        testShipment.setCarrier("UPS");
        testShipment.setTrackingNumber("1Z999AA10123456784");
        testShipment.setBeerOrder(testBeerOrder);

        // Setup test shipment DTO
        testShipmentDto = new BeerOrderShipmentDto();
        testShipmentDto.setId(1);
        testShipmentDto.setVersion(1);
        testShipmentDto.setShipmentDate(LocalDateTime.now());
        testShipmentDto.setCarrier("UPS");
        testShipmentDto.setTrackingNumber("1Z999AA10123456784");
        testShipmentDto.setBeerOrderId(1);
    }

    @Test
    @DisplayName("Create beer order shipment - success path")
    void testCreateBeerOrderShipment() {
        // Given
        when(beerOrderRepository.findById(anyInt())).thenReturn(Optional.of(testBeerOrder));
        when(beerOrderShipmentMapper.toEntity(any(BeerOrderShipmentDto.class))).thenReturn(testShipment);
        when(beerOrderShipmentRepository.save(any(BeerOrderShipment.class))).thenReturn(testShipment);
        when(beerOrderShipmentMapper.toDto(any(BeerOrderShipment.class))).thenReturn(testShipmentDto);

        // When
        BeerOrderShipmentDto result = beerOrderShipmentService.createBeerOrderShipment(1, testShipmentDto);

        // Then
        assertNotNull(result);
        assertEquals("UPS", result.getCarrier());
        verify(beerOrderRepository, times(1)).findById(1);
        verify(beerOrderShipmentMapper, times(1)).toEntity(testShipmentDto);
        verify(beerOrderShipmentRepository, times(1)).save(testShipment);
        verify(beerOrderShipmentMapper, times(1)).toDto(testShipment);
    }

    @Test
    @DisplayName("Create beer order shipment - beer order not found")
    void testCreateBeerOrderShipmentBeerOrderNotFound() {
        // Given
        when(beerOrderRepository.findById(anyInt())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            beerOrderShipmentService.createBeerOrderShipment(99, testShipmentDto);
        });
        verify(beerOrderRepository, times(1)).findById(99);
        verify(beerOrderShipmentMapper, never()).toEntity(any());
        verify(beerOrderShipmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Get beer order shipment by ID - found")
    void testGetBeerOrderShipmentByIdFound() {
        // Given
        when(beerOrderShipmentRepository.findById(anyInt())).thenReturn(Optional.of(testShipment));
        when(beerOrderShipmentMapper.toDto(any(BeerOrderShipment.class))).thenReturn(testShipmentDto);

        // When
        Optional<BeerOrderShipmentDto> result = beerOrderShipmentService.getBeerOrderShipmentById(1);

        // Then
        assertTrue(result.isPresent());
        assertEquals("UPS", result.get().getCarrier());
        verify(beerOrderShipmentRepository, times(1)).findById(1);
        verify(beerOrderShipmentMapper, times(1)).toDto(testShipment);
    }

    @Test
    @DisplayName("Get beer order shipment by ID - not found")
    void testGetBeerOrderShipmentByIdNotFound() {
        // Given
        when(beerOrderShipmentRepository.findById(anyInt())).thenReturn(Optional.empty());

        // When
        Optional<BeerOrderShipmentDto> result = beerOrderShipmentService.getBeerOrderShipmentById(99);

        // Then
        assertFalse(result.isPresent());
        verify(beerOrderShipmentRepository, times(1)).findById(99);
        verify(beerOrderShipmentMapper, never()).toDto(any());
    }

    @Test
    @DisplayName("Get shipments by beer order ID")
    void testGetBeerOrderShipmentsByBeerOrderId() {
        // Given
        List<BeerOrderShipment> shipments = Arrays.asList(testShipment);
        when(beerOrderShipmentRepository.findByBeerOrderId(anyInt())).thenReturn(shipments);
        when(beerOrderShipmentMapper.toDto(any(BeerOrderShipment.class))).thenReturn(testShipmentDto);

        // When
        List<BeerOrderShipmentDto> results = beerOrderShipmentService.getBeerOrderShipmentsByBeerOrderId(1);

        // Then
        assertThat(results).hasSize(1);
        assertEquals("UPS", results.get(0).getCarrier());
        verify(beerOrderShipmentRepository, times(1)).findByBeerOrderId(1);
        verify(beerOrderShipmentMapper, times(1)).toDto(any());
    }

    @Test
    @DisplayName("Update beer order shipment - found")
    void testUpdateBeerOrderShipmentFound() {
        // Given
        when(beerOrderShipmentRepository.findById(anyInt())).thenReturn(Optional.of(testShipment));
        when(beerOrderShipmentRepository.save(any(BeerOrderShipment.class))).thenReturn(testShipment);
        when(beerOrderShipmentMapper.toDto(any(BeerOrderShipment.class))).thenReturn(testShipmentDto);

        // When
        Optional<BeerOrderShipmentDto> result = beerOrderShipmentService.updateBeerOrderShipment(1, testShipmentDto);

        // Then
        assertTrue(result.isPresent());
        assertEquals("UPS", result.get().getCarrier());
        verify(beerOrderShipmentRepository, times(1)).findById(1);
        verify(beerOrderShipmentMapper, times(1)).updateEntityFromDto(eq(testShipmentDto), eq(testShipment));
        verify(beerOrderShipmentRepository, times(1)).save(testShipment);
        verify(beerOrderShipmentMapper, times(1)).toDto(testShipment);
    }

    @Test
    @DisplayName("Update beer order shipment - not found")
    void testUpdateBeerOrderShipmentNotFound() {
        // Given
        when(beerOrderShipmentRepository.findById(anyInt())).thenReturn(Optional.empty());

        // When
        Optional<BeerOrderShipmentDto> result = beerOrderShipmentService.updateBeerOrderShipment(99, testShipmentDto);

        // Then
        assertFalse(result.isPresent());
        verify(beerOrderShipmentRepository, times(1)).findById(99);
        verify(beerOrderShipmentMapper, never()).updateEntityFromDto(any(), any());
        verify(beerOrderShipmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Delete beer order shipment - exists")
    void testDeleteBeerOrderShipmentExists() {
        // Given
        when(beerOrderShipmentRepository.existsById(anyInt())).thenReturn(true);
        doNothing().when(beerOrderShipmentRepository).deleteById(anyInt());

        // When
        boolean result = beerOrderShipmentService.deleteBeerOrderShipment(1);

        // Then
        assertTrue(result);
        verify(beerOrderShipmentRepository, times(1)).existsById(1);
        verify(beerOrderShipmentRepository, times(1)).deleteById(1);
    }

    @Test
    @DisplayName("Delete beer order shipment - does not exist")
    void testDeleteBeerOrderShipmentNotExists() {
        // Given
        when(beerOrderShipmentRepository.existsById(anyInt())).thenReturn(false);

        // When
        boolean result = beerOrderShipmentService.deleteBeerOrderShipment(99);

        // Then
        assertFalse(result);
        verify(beerOrderShipmentRepository, times(1)).existsById(99);
        verify(beerOrderShipmentRepository, never()).deleteById(anyInt());
    }
}
