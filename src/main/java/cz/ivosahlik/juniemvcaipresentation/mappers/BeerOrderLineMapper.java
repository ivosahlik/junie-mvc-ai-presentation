package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderLine;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper interface for converting between BeerOrderLine entity and BeerOrderLineDto.
 */
@Mapper(componentModel = "spring", uses = {BeerMapper.class})
public interface BeerOrderLineMapper {

    /**
     * Convert a BeerOrderLine entity to a BeerOrderLineDto.
     * The beerOrder property is ignored to prevent circular references.
     *
     * @param entity the BeerOrderLine entity
     * @return the corresponding DTO
     */
    @Mapping(target = "beer", source = "beer")
    BeerOrderLineDto toDto(BeerOrderLine entity);

    /**
     * Convert a BeerOrderLineDto to a BeerOrderLine entity.
     *
     * @param dto the BeerOrderLineDto
     * @return the corresponding entity
     */
    @Mapping(target = "beerOrder", ignore = true)
    BeerOrderLine toEntity(BeerOrderLineDto dto);

    /**
     * Update an existing BeerOrderLine entity from a BeerOrderLineDto.
     * Ignores id, createdDate, updateDate and beerOrder fields.
     *
     * @param dto the source DTO with updated values
     * @param entity the target entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "beerOrder", ignore = true)
    void updateEntityFromDto(BeerOrderLineDto dto, @MappingTarget BeerOrderLine entity);
}
