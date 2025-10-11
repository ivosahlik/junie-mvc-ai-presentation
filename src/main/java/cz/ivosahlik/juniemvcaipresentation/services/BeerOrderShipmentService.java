package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerOrderShipmentDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing beer order shipments.
 */
public interface BeerOrderShipmentService {

    /**
     * Creates a new beer order shipment for the specified beer order.
     *
     * @param beerOrderId the ID of the beer order
     * @param shipmentDto the shipment data
     * @return the created shipment
     */
    BeerOrderShipmentDto createBeerOrderShipment(Integer beerOrderId, BeerOrderShipmentDto shipmentDto);

    /**
     * Retrieves a shipment by its ID.
     *
     * @param id the shipment ID
     * @return an Optional containing the shipment, or empty if not found
     */
    Optional<BeerOrderShipmentDto> getBeerOrderShipmentById(Integer id);

    /**
     * Retrieves all shipments for a specific beer order.
     *
     * @param beerOrderId the ID of the beer order
     * @return list of shipments for the beer order
     */
    List<BeerOrderShipmentDto> getBeerOrderShipmentsByBeerOrderId(Integer beerOrderId);

    /**
     * Updates an existing shipment.
     *
     * @param id the shipment ID
     * @param shipmentDto the updated shipment data
     * @return an Optional containing the updated shipment, or empty if not found
     */
    Optional<BeerOrderShipmentDto> updateBeerOrderShipment(Integer id, BeerOrderShipmentDto shipmentDto);

    /**
     * Deletes a shipment.
     *
     * @param id the shipment ID
     * @return true if the shipment was deleted, false if it wasn't found
     */
    boolean deleteBeerOrderShipment(Integer id);
}
