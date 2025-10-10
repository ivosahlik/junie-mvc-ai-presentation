package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for BeerOrderLine entity operations.
 */
@Repository
public interface BeerOrderLineRepository extends JpaRepository<BeerOrderLine, Integer> {

    /**
     * Find order lines for a specific beer.
     *
     * @param beerId the beer ID to search for
     * @return list of order lines containing the specified beer
     */
    List<BeerOrderLine> findByBeerId(Integer beerId);

    /**
     * Find order lines for a specific order.
     *
     * @param beerOrderId the order ID to search for
     * @return list of order lines belonging to the specified order
     */
    List<BeerOrderLine> findByBeerOrderId(Integer beerOrderId);
}
