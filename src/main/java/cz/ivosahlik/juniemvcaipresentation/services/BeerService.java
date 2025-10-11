package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
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
     * @deprecated Use {@link #listBeers(String, Pageable)} instead
     */
    @Deprecated
    List<BeerDto> listBeers();

    /**
     * List beers with pagination and optional filtering
     *
     * @param beerName Optional beer name filter (can be null)
     * @param pageable Pagination information
     * @return Page of beers matching the criteria
     */
    Page<BeerDto> listBeers(String beerName, Pageable pageable);

    Optional<BeerDto> updateBeer(Integer id, BeerDto beer);

    boolean deleteBeer(Integer id);
}
