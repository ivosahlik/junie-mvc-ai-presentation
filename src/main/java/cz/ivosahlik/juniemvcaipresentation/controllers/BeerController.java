package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.services.BeerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/beers")
@RequiredArgsConstructor
class BeerController {

    private final BeerService beerService;

    @PostMapping
    public ResponseEntity<BeerDto> createBeer(@Valid @RequestBody BeerDto beerDto) {
        BeerDto created = beerService.createBeer(beerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeerDto> getBeerById(@PathVariable Integer id) {
        return beerService.getBeerById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * @deprecated Use {@link #listBeersWithPagination(String, String, Integer, Integer, String, String)} instead
     */
    @GetMapping(params = {"!beerName", "!beerStyle", "!page", "!size", "!sortField", "!direction"})
    @Deprecated
    public ResponseEntity<List<BeerDto>> listBeers() {
        return ResponseEntity.ok(beerService.listBeers());
    }

    @Operation(
        summary = "List beers with optional filtering",
        description = "Retrieves a page of beers with optional filtering by beer name and beer style",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "List of beers",
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))
            )
        }
    )
    @GetMapping
    public ResponseEntity<Page<BeerDto>> listBeersWithPagination(
            @Parameter(description = "Beer name to filter by (optional)")
            @RequestParam(required = false) String beerName,
            @Parameter(description = "Beer style to filter by (optional)")
            @RequestParam(required = false) String beerStyle,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "25") Integer size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "beerName") String sortField,
            @Parameter(description = "Sort direction (asc or desc)")
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        return ResponseEntity.ok(beerService.listBeers(beerName, beerStyle, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BeerDto> updateBeer(@PathVariable Integer id, @Valid @RequestBody BeerDto beerDto) {
        return beerService.updateBeer(id, beerDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeer(@PathVariable Integer id) {
        boolean deleted = beerService.deleteBeer(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
