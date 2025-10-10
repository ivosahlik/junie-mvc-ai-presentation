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
     * Find beer orders for a customer with a name containing the given string (case-insensitive).
     *
     * @param customerName the customer name to search for
     * @return list of matching beer orders
     */
    List<BeerOrder> findByCustomerNameContainingIgnoreCase(String customerName);

    /**
     * Find all beer orders for a specific customer.
     *
     * @param customerId the customer ID
     * @return list of beer orders for that customer
     */
    List<BeerOrder> findByCustomerId(Integer customerId);
}
