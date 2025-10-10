package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper interface for converting between BeerOrder entity and BeerOrderDto.
 */
@Mapper(componentModel = "spring", uses = {BeerOrderLineMapper.class, CustomerMapper.class})
public interface BeerOrderMapper {

    /**
     * Convert a BeerOrder entity to a BeerOrderDto.
     *
     * @param entity the BeerOrder entity
     * @return the corresponding DTO
     */
    BeerOrderDto toDto(BeerOrder entity);

    /**
     * Convert a BeerOrderDto to a BeerOrder entity.
     *
     * @param dto the BeerOrderDto
     * @return the corresponding entity
     */
    BeerOrder toEntity(BeerOrderDto dto);

    /**
     * Update an existing BeerOrder entity from a BeerOrderDto.
     * Ignores id, createdDate, and updateDate fields.
     *
     * @param dto the source DTO with updated values
     * @param entity the target entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    void updateEntityFromDto(BeerOrderDto dto, @MappingTarget BeerOrder entity);
}
