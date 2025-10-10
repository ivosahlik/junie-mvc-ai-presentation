package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;

import java.util.List;
import java.util.Optional;

public interface BeerService {

    BeerDto createBeer(BeerDto beer);

    Optional<BeerDto> getBeerById(Integer id);

    List<BeerDto> listBeers();

    Optional<BeerDto> updateBeer(Integer id, BeerDto beer);

    boolean deleteBeer(Integer id);
}
