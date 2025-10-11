package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BeerRepository extends JpaRepository<Beer, Integer> {

    /**
     * Find all beers with optional filtering by beer name.
     *
     * @param beerName The beer name to search for (can be null)
     * @param pageable The pagination information
     * @return Page of beers matching the criteria
     */
    Page<Beer> findAllByBeerNameContainingIgnoreCase(String beerName, Pageable pageable);

    /**
     * Find all beers with optional filtering by beer style.
     *
     * @param beerStyle The beer style to search for (can be null)
     * @param pageable The pagination information
     * @return Page of beers matching the criteria
     */
    Page<Beer> findAllByBeerStyleContainingIgnoreCase(String beerStyle, Pageable pageable);

    /**
     * Find all beers with optional filtering by both beer name and beer style.
     *
     * @param beerName The beer name to search for (can be null)
     * @param beerStyle The beer style to search for (can be null)
     * @param pageable The pagination information
     * @return Page of beers matching the criteria
     */
    Page<Beer> findAllByBeerNameContainingIgnoreCaseAndBeerStyleContainingIgnoreCase(
            String beerName, String beerStyle, Pageable pageable);

    /**
     * Find all beers with flexible filtering options for beer name and beer style.
     *
     * @param beerName The beer name to search for (can be null or empty)
     * @param beerStyle The beer style to search for (can be null or empty)
     * @param pageable The pagination information
     * @return Page of beers matching the criteria
     */
    @Query("SELECT b FROM Beer b WHERE " +
           "(:beerName IS NULL OR :beerName = '' OR LOWER(b.beerName) LIKE LOWER(CONCAT('%', :beerName, '%'))) AND " +
           "(:beerStyle IS NULL OR :beerStyle = '' OR LOWER(b.beerStyle) LIKE LOWER(CONCAT('%', :beerStyle, '%')))")
    Page<Beer> findAllByBeerNameAndBeerStyle(
            @Param("beerName") String beerName,
            @Param("beerStyle") String beerStyle,
            Pageable pageable);
}
