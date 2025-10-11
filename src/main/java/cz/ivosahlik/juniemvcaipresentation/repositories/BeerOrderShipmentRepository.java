package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrderShipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing BeerOrderShipment entities.
 */
@Repository
public interface BeerOrderShipmentRepository extends JpaRepository<BeerOrderShipment, Integer> {

    /**
     * Finds all shipments for a specific beer order.
     *
     * @param beerOrderId the ID of the beer order
     * @return list of shipments associated with the beer order
     */
    List<BeerOrderShipment> findByBeerOrderId(Integer beerOrderId);
}
