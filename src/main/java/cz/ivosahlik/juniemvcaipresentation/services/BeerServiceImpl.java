package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.mappers.BeerMapper;
import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.BeerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BeerServiceImpl implements BeerService {

    private final BeerRepository beerRepository;
    private final BeerMapper beerMapper;

    public BeerServiceImpl(BeerRepository beerRepository, BeerMapper beerMapper) {
        this.beerRepository = beerRepository;
        this.beerMapper = beerMapper;
    }

    @Override
    @Transactional
    public BeerDto createBeer(BeerDto beerDto) {
        Beer beer = beerMapper.toEntity(beerDto);
        Beer savedBeer = beerRepository.save(beer);
        return beerMapper.toDto(savedBeer);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BeerDto> getBeerById(Integer id) {
        return beerRepository.findById(id)
                .map(beerMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerDto> listBeers() {
        return beerRepository.findAll().stream()
                .map(beerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BeerDto> listBeers(String beerName, Pageable pageable) {
        String searchTerm = StringUtils.hasText(beerName) ? beerName : "";
        return beerRepository.findAllByBeerNameContainingIgnoreCase(searchTerm, pageable)
                .map(beerMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BeerDto> listBeers(String beerName, String beerStyle, Pageable pageable) {
        // Use the custom repository method that handles all filter combinations
        return beerRepository.findAllByBeerNameAndBeerStyle(beerName, beerStyle, pageable)
                .map(beerMapper::toDto);
    }

    @Override
    @Transactional
    public Optional<BeerDto> updateBeer(Integer id, BeerDto beerDto) {
        return beerRepository.findById(id).map(existing -> {
            beerMapper.updateEntityFromDto(beerDto, existing);
            Beer savedBeer = beerRepository.save(existing);
            return beerMapper.toDto(savedBeer);
        });
    }

    @Override
    @Transactional
    public boolean deleteBeer(Integer id) {
        if (beerRepository.existsById(id)) {
            beerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
