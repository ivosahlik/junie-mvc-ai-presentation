package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Customer operations.
 */
public interface CustomerService {

    /**
     * Create a new customer.
     *
     * @param customerDto the customer data to create
     * @return the created customer
     */
    CustomerDto createCustomer(CustomerDto customerDto);

    /**
     * Get a customer by ID.
     *
     * @param id the customer ID
     * @return an Optional containing the customer if found, or empty if not found
     */
    Optional<CustomerDto> getCustomerById(Integer id);

    /**
     * Get all customers.
     *
     * @return a list of all customers
     */
    List<CustomerDto> listCustomers();

    /**
     * Update an existing customer.
     *
     * @param id the ID of the customer to update
     * @param customerDto the updated customer data
     * @return an Optional containing the updated customer if found, or empty if not found
     */
    Optional<CustomerDto> updateCustomer(Integer id, CustomerDto customerDto);

    /**
     * Delete a customer by ID.
     *
     * @param id the ID of the customer to delete
     * @return true if the customer was deleted, false if the customer was not found
     */
    boolean deleteCustomer(Integer id);

    /**
     * Find customers by name.
     *
     * @param name the name to search for
     * @return a list of customers with names containing the search term
     */
    List<CustomerDto> findCustomersByName(String name);
}
