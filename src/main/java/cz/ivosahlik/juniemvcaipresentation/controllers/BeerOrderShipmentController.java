package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;
import cz.ivosahlik.juniemvcaipresentation.services.BeerOrderShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing beer order shipments.
 */
@RestController
@RequestMapping("/api/v1/beer-orders/{beerOrderId}/shipments")
public class BeerOrderShipmentController {

    private final BeerOrderShipmentService beerOrderShipmentService;

    /**
     * Constructor with dependency injection.
     *
     * @param beerOrderShipmentService the beer order shipment service
     */
    public BeerOrderShipmentController(BeerOrderShipmentService beerOrderShipmentService) {
        this.beerOrderShipmentService = beerOrderShipmentService;
    }

    /**
     * Creates a new beer order shipment.
     *
     * @param beerOrderId the ID of the beer order
     * @param shipmentDto the shipment data
     * @return the created shipment with HTTP 201 status
     */
    @PostMapping
    public ResponseEntity<BeerOrderShipmentDto> createBeerOrderShipment(
            @PathVariable Integer beerOrderId,
            @Valid @RequestBody BeerOrderShipmentDto shipmentDto) {
        BeerOrderShipmentDto createdShipment = beerOrderShipmentService.createBeerOrderShipment(beerOrderId, shipmentDto);

        // Ensure beerOrderId is set in the response
        if (createdShipment.getBeerOrderId() == null) {
            createdShipment.setBeerOrderId(beerOrderId);
        }

        return new ResponseEntity<>(createdShipment, HttpStatus.CREATED);
    }

    /**
     * Retrieves all shipments for a specific beer order.
     *
     * @param beerOrderId the ID of the beer order
     * @return list of shipments
     */
    @GetMapping
    public ResponseEntity<List<BeerOrderShipmentDto>> getBeerOrderShipments(@PathVariable Integer beerOrderId) {
        List<BeerOrderShipmentDto> shipments = beerOrderShipmentService.getBeerOrderShipmentsByBeerOrderId(beerOrderId);

        // Ensure beerOrderId is set in all shipments
        shipments.forEach(dto -> {
            if (dto.getBeerOrderId() == null) {
                dto.setBeerOrderId(beerOrderId);
            }
        });

        return ResponseEntity.ok(shipments);
    }

    /**
     * Retrieves a specific shipment by ID.
     *
     * @param beerOrderId the ID of the beer order
     * @param id the ID of the shipment
     * @return the shipment if found, or HTTP 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<BeerOrderShipmentDto> getBeerOrderShipmentById(
            @PathVariable Integer beerOrderId,
            @PathVariable Integer id) {
        return beerOrderShipmentService.getBeerOrderShipmentById(id)
                .map(dto -> {
                    // Ensure beerOrderId is set in the response
                    if (dto.getBeerOrderId() == null) {
                        dto.setBeerOrderId(beerOrderId);
                    }
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing shipment.
     *
     * @param beerOrderId the ID of the beer order
     * @param id the ID of the shipment
     * @param shipmentDto the updated shipment data
     * @return the updated shipment if found, or HTTP 404
     */
    @PutMapping("/{id}")
    public ResponseEntity<BeerOrderShipmentDto> updateBeerOrderShipment(
            @PathVariable Integer beerOrderId,
            @PathVariable Integer id,
            @Valid @RequestBody BeerOrderShipmentDto shipmentDto) {
        return beerOrderShipmentService.updateBeerOrderShipment(id, shipmentDto)
                .map(dto -> {
                    // Ensure beerOrderId is set in the response
                    if (dto.getBeerOrderId() == null) {
                        dto.setBeerOrderId(beerOrderId);
                    }
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a shipment.
     *
     * @param beerOrderId the ID of the beer order
     * @param id the ID of the shipment
     * @return HTTP 204 if deleted, or HTTP 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeerOrderShipment(
            @PathVariable Integer beerOrderId,
            @PathVariable Integer id) {
        if (beerOrderShipmentService.deleteBeerOrderShipment(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
