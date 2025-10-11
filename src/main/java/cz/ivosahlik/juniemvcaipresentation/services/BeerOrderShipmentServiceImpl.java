package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderShipment;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderShipmentMapper;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderShipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of BeerOrderShipmentService interface for managing beer order shipments.
 */
@Service
public class BeerOrderShipmentServiceImpl implements BeerOrderShipmentService {

    private final BeerOrderShipmentRepository beerOrderShipmentRepository;
    private final BeerOrderRepository beerOrderRepository;
    private final BeerOrderShipmentMapper beerOrderShipmentMapper;

    /**
     * Constructor with dependency injection.
     *
     * @param beerOrderShipmentRepository the beer order shipment repository
     * @param beerOrderRepository the beer order repository
     * @param beerOrderShipmentMapper the beer order shipment mapper
     */
    public BeerOrderShipmentServiceImpl(BeerOrderShipmentRepository beerOrderShipmentRepository,
                                        BeerOrderRepository beerOrderRepository,
                                        BeerOrderShipmentMapper beerOrderShipmentMapper) {
        this.beerOrderShipmentRepository = beerOrderShipmentRepository;
        this.beerOrderRepository = beerOrderRepository;
        this.beerOrderShipmentMapper = beerOrderShipmentMapper;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public BeerOrderShipmentDto createBeerOrderShipment(Integer beerOrderId, BeerOrderShipmentDto shipmentDto) {
        BeerOrder beerOrder = beerOrderRepository.findById(beerOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Beer Order with ID " + beerOrderId + " not found"));

        BeerOrderShipment shipment = beerOrderShipmentMapper.toEntity(shipmentDto);
        shipment.setBeerOrder(beerOrder);

        BeerOrderShipment savedShipment = beerOrderShipmentRepository.save(shipment);

        // Get the DTO from the mapper
        BeerOrderShipmentDto resultDto = beerOrderShipmentMapper.toDto(savedShipment);

        // Explicitly set the beerOrderId in case the mapper doesn't set it properly
        resultDto.setBeerOrderId(beerOrderId);

        return resultDto;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<BeerOrderShipmentDto> getBeerOrderShipmentById(Integer id) {
        return beerOrderShipmentRepository.findById(id)
                .map(shipment -> {
                    BeerOrderShipmentDto dto = beerOrderShipmentMapper.toDto(shipment);
                    if (shipment.getBeerOrder() != null) {
                        dto.setBeerOrderId(shipment.getBeerOrder().getId());
                    }
                    return dto;
                });
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderShipmentDto> getBeerOrderShipmentsByBeerOrderId(Integer beerOrderId) {
        return beerOrderShipmentRepository.findByBeerOrderId(beerOrderId).stream()
                .map(shipment -> {
                    BeerOrderShipmentDto dto = beerOrderShipmentMapper.toDto(shipment);
                    // Explicitly set the beerOrderId to ensure it's populated
                    dto.setBeerOrderId(beerOrderId);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Optional<BeerOrderShipmentDto> updateBeerOrderShipment(Integer id, BeerOrderShipmentDto shipmentDto) {
        return beerOrderShipmentRepository.findById(id)
                .map(existingShipment -> {
                    beerOrderShipmentMapper.updateEntityFromDto(shipmentDto, existingShipment);
                    BeerOrderShipment savedShipment = beerOrderShipmentRepository.save(existingShipment);

                    // Create the DTO and manually set the beerOrderId
                    BeerOrderShipmentDto resultDto = beerOrderShipmentMapper.toDto(savedShipment);
                    if (savedShipment.getBeerOrder() != null) {
                        resultDto.setBeerOrderId(savedShipment.getBeerOrder().getId());
                    }
                    return resultDto;
                });
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public boolean deleteBeerOrderShipment(Integer id) {
        if (beerOrderShipmentRepository.existsById(id)) {
            beerOrderShipmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
