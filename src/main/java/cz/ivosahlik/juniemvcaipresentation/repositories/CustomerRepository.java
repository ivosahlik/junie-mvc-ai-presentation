package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Customer entity operations.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    /**
     * Find a customer by their email address.
     *
     * @param email the email address to search for
     * @return an optional containing the customer if found, or empty if not found
     */
    Optional<Customer> findByEmail(String email);

    /**
     * Find customers by their name containing the given string (case insensitive).
     *
     * @param name the name substring to search for
     * @return a list of customers whose names contain the given string
     */
    java.util.List<Customer> findByNameContainingIgnoreCase(String name);
}
