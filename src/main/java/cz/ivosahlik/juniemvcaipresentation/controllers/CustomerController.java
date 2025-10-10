package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import cz.ivosahlik.juniemvcaipresentation.services.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Customer operations.
 */
@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
class CustomerController {

    private final CustomerService customerService;

    /**
     * Create a new customer.
     *
     * @param customerDto the customer data
     * @return the created customer with CREATED status
     */
    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        CustomerDto created = customerService.createCustomer(customerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Get a customer by ID.
     *
     * @param id the customer ID
     * @return the customer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Integer id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get all customers.
     *
     * @return a list of all customers
     */
    @GetMapping
    public ResponseEntity<List<CustomerDto>> listCustomers() {
        return ResponseEntity.ok(customerService.listCustomers());
    }

    /**
     * Search for customers by name.
     *
     * @param name the name to search for
     * @return a list of matching customers
     */
    @GetMapping("/search/by-name")
    public ResponseEntity<List<CustomerDto>> searchCustomers(@RequestParam String name) {
        return ResponseEntity.ok(customerService.findCustomersByName(name));
    }

    /**
     * Update an existing customer.
     *
     * @param id the customer ID
     * @param customerDto the updated customer data
     * @return the updated customer if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerDto customerDto) {
        return customerService.updateCustomer(id, customerDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete a customer by ID.
     *
     * @param id the customer ID
     * @return 204 No Content if deleted, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        boolean deleted = customerService.deleteCustomer(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
