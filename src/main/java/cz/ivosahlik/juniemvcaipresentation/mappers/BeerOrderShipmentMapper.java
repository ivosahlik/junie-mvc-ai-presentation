package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderShipment;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for converting between BeerOrderShipment entity and BeerOrderShipmentDto.
 */
@Mapper(componentModel = "spring")
public interface BeerOrderShipmentMapper {

    @Mapping(target = "beerOrderId", source = "beerOrder.id")
    BeerOrderShipmentDto toDto(BeerOrderShipment entity);

    @Mapping(target = "beerOrder", ignore = true)
    BeerOrderShipment toEntity(BeerOrderShipmentDto dto);

    default BeerOrderShipment mapIdManually(BeerOrderShipmentDto dto) {
        if (dto == null) {
            return null;
        }
        BeerOrderShipment shipment = toEntity(dto);
        shipment.setId(dto.getId());
        shipment.setVersion(dto.getVersion());
        return shipment;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "beerOrder", ignore = true)
    void updateEntityFromDto(BeerOrderShipmentDto dto, @MappingTarget BeerOrderShipment entity);
}
