package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BeerServiceImpl implements BeerService {

    private final BeerRepository beerRepository;

    public BeerServiceImpl(BeerRepository beerRepository) {
        this.beerRepository = beerRepository;
    }

    @Override
    public Beer createBeer(Beer beer) {
        return beerRepository.save(beer);
    }

    @Override
    public Optional<Beer> getBeerById(Integer id) {
        return beerRepository.findById(id);
    }

    @Override
    public List<Beer> listBeers() {
        return beerRepository.findAll();
    }

    @Override
    public Optional<Beer> updateBeer(Integer id, Beer beer) {
        return beerRepository
                .findById(id)
                .map(existing -> getBeer(beer, existing));
    }

    private Beer getBeer(Beer beer, Beer existing) {
        // Update mutable fields; ignore id/version/createdDate which are managed by JPA
        existing.setBeerName(beer.getBeerName());
        existing.setBeerStyle(beer.getBeerStyle());
        existing.setUpc(beer.getUpc());
        existing.setQuantityOnHand(beer.getQuantityOnHand());
        existing.setPrice(beer.getPrice());
        return beerRepository.save(existing);
    }

    @Override
    public boolean deleteBeer(Integer id) {
        if (!beerRepository.existsById(id)) {
            return false;
        }
        beerRepository.deleteById(id);
        return true;
    }
}
