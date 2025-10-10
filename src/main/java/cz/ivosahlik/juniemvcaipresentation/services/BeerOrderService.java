package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for beer order operations.
 */
public interface BeerOrderService {

    /**
     * Create a new beer order.
     *
     * @param beerOrderDto the DTO containing order information
     * @return the created beer order as a DTO
     */
    BeerOrderDto createBeerOrder(BeerOrderDto beerOrderDto);

    /**
     * Get a beer order by its ID.
     *
     * @param id the ID of the beer order to retrieve
     * @return an Optional containing the beer order if found, or empty if not found
     */
    Optional<BeerOrderDto> getBeerOrderById(Integer id);

    /**
     * List all beer orders.
     *
     * @return a list of all beer orders as DTOs
     */
    List<BeerOrderDto> listBeerOrders();

    /**
     * Find beer orders by customer reference.
     *
     * @param customerRef the customer reference to search for
     * @return a list of matching beer orders
     */
    List<BeerOrderDto> findBeerOrdersByCustomerRef(String customerRef);

    /**
     * Update an existing beer order.
     *
     * @param id the ID of the beer order to update
     * @param beerOrderDto the DTO containing updated information
     * @return an Optional containing the updated beer order if found, or empty if not found
     */
    Optional<BeerOrderDto> updateBeerOrder(Integer id, BeerOrderDto beerOrderDto);

    /**
     * Delete a beer order.
     *
     * @param id the ID of the beer order to delete
     * @return true if the beer order was deleted, false if it was not found
     */
    boolean deleteBeerOrder(Integer id);
}
