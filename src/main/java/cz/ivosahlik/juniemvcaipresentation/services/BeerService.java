package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;

import java.util.List;
import java.util.Optional;

public interface BeerService {

    Beer createBeer(Beer beer);

    Optional<Beer> getBeerById(Integer id);

    List<Beer> listBeers();
}
