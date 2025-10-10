package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderLine;
import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderLineMapper;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerOrderMapper;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderLineDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerOrderRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerRepository;
import cz.ivosahlik.juniemvcaipresentation.repositories.CustomerRepository;
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
    private final CustomerRepository customerRepository;

    public BeerOrderServiceImpl(BeerOrderRepository beerOrderRepository,
                               BeerOrderMapper beerOrderMapper,
                               BeerRepository beerRepository,
                               BeerOrderLineMapper beerOrderLineMapper,
                               CustomerRepository customerRepository) {
        this.beerOrderRepository = beerOrderRepository;
        this.beerOrderMapper = beerOrderMapper;
        this.beerRepository = beerRepository;
        this.beerOrderLineMapper = beerOrderLineMapper;
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public BeerOrderDto createBeerOrder(BeerOrderDto beerOrderDto) {
        BeerOrder beerOrder = beerOrderMapper.toEntity(beerOrderDto);

        // Handle customer relationship properly
        if (beerOrderDto.getCustomer() != null && beerOrderDto.getCustomer().getId() != null) {
            // Fetch the existing customer from the repository and set it on the order
            Optional<Customer> existingCustomer = customerRepository.findById(beerOrderDto.getCustomer().getId());
            if (existingCustomer.isPresent()) {
                beerOrder.setCustomer(existingCustomer.get());
            } else {
                throw new RuntimeException("Customer not found with ID: " + beerOrderDto.getCustomer().getId());
            }
        } else if (beerOrder.getCustomer() != null) {
            // If customer has no ID but exists as a transient entity, save it first
            Customer savedCustomer = customerRepository.save(beerOrder.getCustomer());
            beerOrder.setCustomer(savedCustomer);
        } else {
            throw new RuntimeException("Customer is required for beer orders");
        }

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
    public List<BeerOrderDto> findBeerOrdersByCustomerName(String customerName) {
        return beerOrderRepository.findByCustomerNameContainingIgnoreCase(customerName)
                .stream()
                .map(beerOrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderDto> findBeerOrdersByCustomerId(Integer customerId) {
        return beerOrderRepository.findByCustomerId(customerId)
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

                    // Handle customer relationship properly
                    if (beerOrderDto.getCustomer() != null && beerOrderDto.getCustomer().getId() != null) {
                        // If the customer ID is changing, fetch the new customer from repository
                        if (!Objects.equals(existingOrder.getCustomer().getId(), beerOrderDto.getCustomer().getId())) {
                            Optional<Customer> newCustomer = customerRepository.findById(beerOrderDto.getCustomer().getId());
                            if (newCustomer.isPresent()) {
                                existingOrder.setCustomer(newCustomer.get());
                            } else {
                                throw new RuntimeException("Customer not found with ID: " + beerOrderDto.getCustomer().getId());
                            }
                        }
                        // If IDs match, keep the existing customer (already set from the database)
                    } else if (beerOrderDto.getCustomer() != null && beerOrderDto.getCustomer().getId() == null) {
                        // If updating with a new transient customer, save it first
                        Customer customerToSave = beerOrderMapper.toEntity(beerOrderDto).getCustomer();
                        if (customerToSave != null) {
                            Customer savedCustomer = customerRepository.save(customerToSave);
                            existingOrder.setCustomer(savedCustomer);
                        }
                    }
                    // Otherwise keep the existing customer

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
