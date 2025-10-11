package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderShipment;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for BeerOrderShipmentMapper.
 */
@SpringBootTest
class BeerOrderShipmentMapperTest {

    @Autowired
    BeerOrderShipmentMapper mapper;

    private BeerOrderShipment shipment;
    private BeerOrderShipmentDto shipmentDto;
    private LocalDateTime testDate;

    @BeforeEach
    void setUp() {
        testDate = LocalDateTime.now();

        // Create test BeerOrder
        BeerOrder beerOrder = new BeerOrder();
        beerOrder.setId(1);

        // Create test shipment entity
        shipment = new BeerOrderShipment();
        shipment.setId(1);
        shipment.setVersion(1);
        shipment.setShipmentDate(testDate);
        shipment.setCarrier("UPS");
        shipment.setTrackingNumber("1Z999AA10123456784");
        shipment.setBeerOrder(beerOrder);

        // Create test shipment DTO
        shipmentDto = new BeerOrderShipmentDto();
        shipmentDto.setId(1);
        shipmentDto.setVersion(1);
        shipmentDto.setShipmentDate(testDate);
        shipmentDto.setCarrier("UPS");
        shipmentDto.setTrackingNumber("1Z999AA10123456784");
        shipmentDto.setBeerOrderId(1);
    }

    @Test
    @DisplayName("Test mapping from entity to DTO")
    void testMapEntityToDto() {
        // Map from entity to DTO
        BeerOrderShipmentDto dto = mapper.toDto(shipment);

        // Assertions
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(shipment.getId());
        assertThat(dto.getVersion()).isEqualTo(shipment.getVersion());
        assertThat(dto.getShipmentDate()).isEqualTo(shipment.getShipmentDate());
        assertThat(dto.getCarrier()).isEqualTo(shipment.getCarrier());
        assertThat(dto.getTrackingNumber()).isEqualTo(shipment.getTrackingNumber());
        assertThat(dto.getBeerOrderId()).isEqualTo(shipment.getBeerOrder().getId());
    }

    @Test
    @DisplayName("Test mapping from DTO to entity")
    void testMapDtoToEntity() {
        // Map from DTO to entity
        BeerOrderShipment entity = mapper.mapIdManually(shipmentDto);

        // Assertions
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(shipmentDto.getId());
        assertThat(entity.getVersion()).isEqualTo(shipmentDto.getVersion());
        assertThat(entity.getShipmentDate()).isEqualTo(shipmentDto.getShipmentDate());
        assertThat(entity.getCarrier()).isEqualTo(shipmentDto.getCarrier());
        assertThat(entity.getTrackingNumber()).isEqualTo(shipmentDto.getTrackingNumber());

        // beerOrder should be null as it's ignored in the mapper
        assertThat(entity.getBeerOrder()).isNull();
    }

    @Test
    @DisplayName("Test updating entity from DTO")
    void testUpdateEntityFromDto() {
        // Create a shipment to be updated
        BeerOrderShipment shipmentToUpdate = new BeerOrderShipment();
        shipmentToUpdate.setId(1);
        shipmentToUpdate.setVersion(1);
        shipmentToUpdate.setShipmentDate(testDate.minusDays(1)); // Different date
        shipmentToUpdate.setCarrier("FedEx"); // Different carrier
        shipmentToUpdate.setTrackingNumber("OLD-TRACKING-NUMBER"); // Different tracking number

        BeerOrder beerOrder = new BeerOrder();
        beerOrder.setId(2); // Different beer order
        shipmentToUpdate.setBeerOrder(beerOrder);

        // Update the entity from DTO
        mapper.updateEntityFromDto(shipmentDto, shipmentToUpdate);

        // Assertions - id, version, and beerOrder should not be updated
        assertThat(shipmentToUpdate.getId()).isEqualTo(1);
        assertThat(shipmentToUpdate.getVersion()).isEqualTo(1);
        assertThat(shipmentToUpdate.getBeerOrder().getId()).isEqualTo(2); // Should still be the original beer order

        // These fields should be updated
        assertThat(shipmentToUpdate.getShipmentDate()).isEqualTo(shipmentDto.getShipmentDate());
        assertThat(shipmentToUpdate.getCarrier()).isEqualTo(shipmentDto.getCarrier());
        assertThat(shipmentToUpdate.getTrackingNumber()).isEqualTo(shipmentDto.getTrackingNumber());
    }
}
