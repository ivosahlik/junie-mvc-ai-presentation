package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderLine;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderLineMapper;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderMapper;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the BeerOrderService interface.
 */
@Service
class BeerOrderServiceImpl implements BeerOrderService {

    private final BeerOrderRepository beerOrderRepository;
    private final BeerOrderMapper beerOrderMapper;
    private final BeerRepository beerRepository;
    private final BeerOrderLineMapper beerOrderLineMapper;

    public BeerOrderServiceImpl(BeerOrderRepository beerOrderRepository,
                               BeerOrderMapper beerOrderMapper,
                               BeerRepository beerRepository,
                               BeerOrderLineMapper beerOrderLineMapper) {
        this.beerOrderRepository = beerOrderRepository;
        this.beerOrderMapper = beerOrderMapper;
        this.beerRepository = beerRepository;
        this.beerOrderLineMapper = beerOrderLineMapper;
    }

    @Override
    @Transactional
    public BeerOrderDto createBeerOrder(BeerOrderDto beerOrderDto) {
        BeerOrder beerOrder = beerOrderMapper.toEntity(beerOrderDto);

        // Handle the relationships and validate beers
        if (beerOrderDto.getBeerOrderLines() != null) {
            beerOrder.setBeerOrderLines(new HashSet<>()); // Reset to ensure proper relationship management

            for (BeerOrderLineDto lineDto : beerOrderDto.getBeerOrderLines()) {
                if (lineDto.getBeer() != null && lineDto.getBeer().getId() != null) {
                    Optional<Beer> beerOptional = beerRepository.findById(lineDto.getBeer().getId());

                    if (beerOptional.isPresent()) {
                        BeerOrderLine line = beerOrderLineMapper.toEntity(lineDto);
                        line.setBeer(beerOptional.get());
                        beerOrder.addBeerOrderLine(line);
                    } else {
                        throw new RuntimeException("Beer not found with ID: " + lineDto.getBeer().getId());
                    }
                } else {
                    throw new RuntimeException("Beer ID is required for order lines");
                }
            }
        }

        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);
        return beerOrderMapper.toDto(savedBeerOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BeerOrderDto> getBeerOrderById(Integer id) {
        return beerOrderRepository.findById(id)
                .map(beerOrderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderDto> listBeerOrders() {
        return beerOrderRepository.findAll()
                .stream()
                .map(beerOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderDto> findBeerOrdersByCustomerRef(String customerRef) {
        return beerOrderRepository.findByCustomerRefContainingIgnoreCase(customerRef)
                .stream()
                .map(beerOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Optional<BeerOrderDto> updateBeerOrder(Integer id, BeerOrderDto beerOrderDto) {
        if (!Objects.equals(id, beerOrderDto.getId())) {
            throw new IllegalArgumentException("ID in path and request body must match");
        }

        return beerOrderRepository.findById(id)
                .map(existingOrder -> {
                    // Update basic properties
                    beerOrderMapper.updateEntityFromDto(beerOrderDto, existingOrder);

                    // Handle order lines - remove existing ones and add new ones
                    existingOrder.getBeerOrderLines().clear();

                    if (beerOrderDto.getBeerOrderLines() != null) {
                        for (BeerOrderLineDto lineDto : beerOrderDto.getBeerOrderLines()) {
                            if (lineDto.getBeer() != null && lineDto.getBeer().getId() != null) {
                                Optional<Beer> beerOptional = beerRepository.findById(lineDto.getBeer().getId());

                                if (beerOptional.isPresent()) {
                                    BeerOrderLine line = beerOrderLineMapper.toEntity(lineDto);
                                    line.setBeer(beerOptional.get());
                                    existingOrder.addBeerOrderLine(line);
                                } else {
                                    throw new RuntimeException("Beer not found with ID: " + lineDto.getBeer().getId());
                                }
                            } else {
                                throw new RuntimeException("Beer ID is required for order lines");
                            }
                        }
                    }

                    BeerOrder savedOrder = beerOrderRepository.save(existingOrder);
                    return beerOrderMapper.toDto(savedOrder);
                });
    }

    @Override
    @Transactional
    public boolean deleteBeerOrder(Integer id) {
        return beerOrderRepository.findById(id)
                .map(order -> {
                    beerOrderRepository.delete(order);
                    return true;
                })
                .orElse(false);
    }
}
