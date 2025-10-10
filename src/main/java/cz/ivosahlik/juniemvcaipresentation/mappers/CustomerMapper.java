package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "beerOrders", ignore = true)
    CustomerDto toDto(Customer entity);

    @Mapping(target = "beerOrders", ignore = true)
    Customer toEntity(CustomerDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "beerOrders", ignore = true)
    void updateEntityFromDto(CustomerDto dto, @MappingTarget Customer entity);
}
