package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderDto;
import cz.ivosahlik.juniemvcaipresentation.services.BeerOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for beer order operations.
 */
@RestController
@RequestMapping("/api/v1/beer-orders")
class BeerOrderController {

    private final BeerOrderService beerOrderService;

    BeerOrderController(BeerOrderService beerOrderService) {
        this.beerOrderService = beerOrderService;
    }

    /**
     * Create a new beer order.
     *
     * @param beerOrderDto the DTO containing order information
     * @return the created beer order with HTTP 201 Created status
     */
    @PostMapping
    ResponseEntity<BeerOrderDto> createBeerOrder(@Valid @RequestBody BeerOrderDto beerOrderDto) {
        BeerOrderDto savedDto = beerOrderService.createBeerOrder(beerOrderDto);
        return new ResponseEntity<>(savedDto, HttpStatus.CREATED);
    }

    /**
     * Get a beer order by ID.
     *
     * @param id the ID of the beer order to retrieve
     * @return the beer order if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    ResponseEntity<BeerOrderDto> getBeerOrderById(@PathVariable Integer id) {
        return beerOrderService.getBeerOrderById(id)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * List all beer orders.
     *
     * @return list of all beer orders
     */
    @GetMapping
    ResponseEntity<List<BeerOrderDto>> listBeerOrders() {
        return new ResponseEntity<>(beerOrderService.listBeerOrders(), HttpStatus.OK);
    }

    /**
     * Search beer orders by customer name (case-insensitive partial match).
     *
     * @param customerName the customer name to search for
     * @return list of matching beer orders
     */
    @GetMapping("/search/by-name")
    ResponseEntity<List<BeerOrderDto>> searchBeerOrdersByCustomerName(@RequestParam String customerName) {
        return new ResponseEntity<>(
                beerOrderService.findBeerOrdersByCustomerName(customerName),
                HttpStatus.OK
        );
    }

    /**
     * Get all beer orders for a specific customer.
     *
     * @param customerId the ID of the customer
     * @return list of beer orders for the specified customer
     */
    @GetMapping("/search/by-customer")
    ResponseEntity<List<BeerOrderDto>> getBeerOrdersByCustomerId(@RequestParam Integer customerId) {
        return new ResponseEntity<>(
                beerOrderService.findBeerOrdersByCustomerId(customerId),
                HttpStatus.OK
        );
    }

    /**
     * Update an existing beer order.
     *
     * @param id the ID of the beer order to update
     * @param beerOrderDto the updated beer order data
     * @return the updated beer order if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    ResponseEntity<BeerOrderDto> updateBeerOrder(@PathVariable Integer id,
                                               @Valid @RequestBody BeerOrderDto beerOrderDto) {
        return beerOrderService.updateBeerOrder(id, beerOrderDto)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a beer order.
     *
     * @param id the ID of the beer order to delete
     * @return 204 No Content if successful, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteBeerOrder(@PathVariable Integer id) {
        return beerOrderService.deleteBeerOrder(id)
                ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
