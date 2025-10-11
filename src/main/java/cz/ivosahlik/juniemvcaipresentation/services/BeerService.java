package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerPatchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BeerService {

    BeerDto createBeer(BeerDto beer);

    Optional<BeerDto> getBeerById(Integer id);

    /**
     * List all beers with optional filtering
     * @return List of all beers
     * @deprecated Use {@link #listBeers(String, String, Pageable)} instead
     */
    @Deprecated
    List<BeerDto> listBeers();

    /**
     * List beers with pagination and optional filtering by name
     *
     * @param beerName Optional beer name filter (can be null)
     * @param pageable Pagination information
     * @return Page of beers matching the criteria
     * @deprecated Use {@link #listBeers(String, String, Pageable)} instead
     */
    @Deprecated
    Page<BeerDto> listBeers(String beerName, Pageable pageable);

    /**
     * List beers with pagination and optional filtering by name and style
     *
     * @param beerName Optional beer name filter (can be null)
     * @param beerStyle Optional beer style filter (can be null)
     * @param pageable Pagination information
     * @return Page of beers matching the criteria
     */
    Page<BeerDto> listBeers(String beerName, String beerStyle, Pageable pageable);

    Optional<BeerDto> updateBeer(Integer id, BeerDto beer);

    /**
     * Partially updates a beer with the non-null values from the patch DTO.
     *
     * @param id The ID of the beer to patch
     * @param beerPatchDto The DTO containing only the fields to update
     * @return Optional containing the updated beer if found, or empty if not found
     */
    Optional<BeerDto> patchBeer(Integer id, BeerPatchDto beerPatchDto);

    boolean deleteBeer(Integer id);
}
