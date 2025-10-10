package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.BeerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for BeerOrder entity operations.
 */
@Repository
public interface BeerOrderRepository extends JpaRepository<BeerOrder, Integer> {

    /**
     * Find beer orders containing the given customer reference (case-insensitive).
     *
     * @param customerRef the customer reference to search for
     * @return list of matching beer orders
     */
    List<BeerOrder> findByCustomerRefContainingIgnoreCase(String customerRef);
}
