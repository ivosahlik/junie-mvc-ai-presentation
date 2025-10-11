package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.models.BeerDto;
import cz.ivosahlik.juniemvcaipresentation.models.BeerPatchDto;
import cz.ivosahlik.juniemvcaipresentation.services.BeerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = BeerController.class)
class BeerControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    BeerService beerService;

    private BeerDto sampleBeerDtoNoId() {
        return BeerDto.builder()
                .beerName("Sample Lager")
                .beerStyle("Lager")
                .upc("1234567890123")
                .quantityOnHand(10)
                .price(new BigDecimal("4.99"))
                .build();
    }

    private BeerDto sampleBeerDtoWithId(Integer id) {
        BeerDto dto = sampleBeerDtoNoId();
        dto.setId(id);
        return dto;
    }

    @Test
    @DisplayName("POST /api/v1/beers creates a beer and returns 201")
    void testCreateBeer() throws Exception {
        BeerDto request = sampleBeerDtoNoId();
        BeerDto saved = sampleBeerDtoWithId(1);

        given(beerService.createBeer(any(BeerDto.class))).willReturn(saved);

        mockMvc.perform(post("/api/v1/beers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.beerName", is("Sample Lager")));
    }

    @Test
    @DisplayName("GET /api/v1/beers/{id} returns beer when found")
    void testGetBeerByIdFound() throws Exception {
        BeerDto saved = sampleBeerDtoWithId(2);
        given(beerService.getBeerById(eq(2))).willReturn(Optional.of(saved));

        mockMvc.perform(get("/api/v1/beers/2"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.beerName", is("Sample Lager")));
    }

    @Test
    @DisplayName("GET /api/v1/beers/{id} returns 404 when not found")
    void testGetBeerByIdNotFound() throws Exception {
        given(beerService.getBeerById(eq(99))).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/beers/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/beers returns list of beers (deprecated method)")
    void testListBeers() throws Exception {
        List<BeerDto> list = Arrays.asList(sampleBeerDtoWithId(1), sampleBeerDtoWithId(2));
        given(beerService.listBeers()).willReturn(list);

        // The @GetMapping(params = "!beerName") should match when beerName parameter is absent
        mockMvc.perform(get("/api/v1/beers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)));
    }

    @Test
    @DisplayName("PUT /api/v1/beers/{id} updates a beer and returns 200")
    void testUpdateBeerSuccess() throws Exception {
        BeerDto request = sampleBeerDtoNoId();
        BeerDto updated = sampleBeerDtoWithId(5);
        updated.setBeerName("Updated Lager");

        given(beerService.updateBeer(eq(5), any(BeerDto.class))).willReturn(Optional.of(updated));

        mockMvc.perform(put("/api/v1/beers/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(5)))
                .andExpect(jsonPath("$.beerName", is("Updated Lager")));
    }

    @Test
    @DisplayName("PUT /api/v1/beers/{id} returns 404 when beer does not exist")
    void testUpdateBeerNotFound() throws Exception {
        BeerDto request = sampleBeerDtoNoId();
        given(beerService.updateBeer(eq(404), any(BeerDto.class))).willReturn(Optional.empty());

        mockMvc.perform(put("/api/v1/beers/404")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/beers/{id} returns 204 when deleted")
    void testDeleteBeerSuccess() throws Exception {
        given(beerService.deleteBeer(eq(7))).willReturn(true);

        mockMvc.perform(delete("/api/v1/beers/7"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/v1/beers/{id} returns 404 when not found")
    void testDeleteBeerNotFound() throws Exception {
        given(beerService.deleteBeer(eq(888))).willReturn(false);

        mockMvc.perform(delete("/api/v1/beers/888"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/beers with pagination parameters returns paginated results")
    void testListBeersWithPagination() throws Exception {
        // Create sample data
        List<BeerDto> beers = Arrays.asList(
                sampleBeerDtoWithId(1),
                sampleBeerDtoWithId(2),
                sampleBeerDtoWithId(3)
        );

        // Create a Page object with the sample data
        Page<BeerDto> beerPage = new PageImpl<>(beers,
                PageRequest.of(0, 10, Sort.by("beerName").ascending()), 3);

        // Mock the service method with both beerName and beerStyle parameters
        given(beerService.listBeers(eq(null), eq(null), any(Pageable.class))).willReturn(beerPage);

        // Perform the request and verify response
        mockMvc.perform(get("/api/v1/beers")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortField", "beerName")
                        .param("direction", "asc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(3)))
                .andExpect(jsonPath("$.content[0].id", is(1)))
                .andExpect(jsonPath("$.content[1].id", is(2)))
                .andExpect(jsonPath("$.content[2].id", is(3)))
                .andExpect(jsonPath("$.totalElements", is(3)))
                .andExpect(jsonPath("$.totalPages", is(1)))
                .andExpect(jsonPath("$.size", is(10)))
                .andExpect(jsonPath("$.number", is(0)));
    }

    @Test
    @DisplayName("GET /api/v1/beers with beerName filter returns filtered results")
    void testListBeersWithBeerNameFilter() throws Exception {
        // Create sample beer with specific name for testing
        BeerDto targetBeer = BeerDto.builder()
                .id(5)
                .beerName("Special IPA")
                .beerStyle("IPA")
                .upc("9876543210")
                .quantityOnHand(15)
                .price(new BigDecimal("5.99"))
                .build();

        // Create a Page containing only the filtered beer
        Page<BeerDto> filteredPage = new PageImpl<>(
                List.of(targetBeer),
                PageRequest.of(0, 25, Sort.by("beerName").ascending()),
                1);

        // Mock the service method for the filter
        given(beerService.listBeers(eq("IPA"), eq(null), any(Pageable.class))).willReturn(filteredPage);

        // Perform the request with filter and verify response
        mockMvc.perform(get("/api/v1/beers")
                        .param("beerName", "IPA")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].id", is(5)))
                .andExpect(jsonPath("$.content[0].beerName", is("Special IPA")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    @DisplayName("GET /api/v1/beers with no matching beerName returns empty page")
    void testListBeersWithNoMatchingFilter() throws Exception {
        // Create an empty Page
        Page<BeerDto> emptyPage = new PageImpl<>(
                List.of(),
                PageRequest.of(0, 25),
                0);

        // Mock the service method for non-matching filter
        given(beerService.listBeers(eq("NonExistent"), eq(null), any(Pageable.class))).willReturn(emptyPage);

        // Perform the request with filter and verify empty response
        mockMvc.perform(get("/api/v1/beers")
                        .param("beerName", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.totalElements", is(0)));
    }

    @Test
    @DisplayName("GET /api/v1/beers with beerStyle filter returns filtered results")
    void testListBeersWithBeerStyleFilter() throws Exception {
        // Create sample beer with specific style for testing
        BeerDto targetBeer = BeerDto.builder()
                .id(6)
                .beerName("Style Test Beer")
                .beerStyle("Porter")
                .upc("1122334455")
                .quantityOnHand(20)
                .price(new BigDecimal("6.99"))
                .build();

        // Create a Page containing only the filtered beer
        Page<BeerDto> filteredPage = new PageImpl<>(
                List.of(targetBeer),
                PageRequest.of(0, 25, Sort.by("beerName").ascending()),
                1);

        // Mock the service method for the style filter
        given(beerService.listBeers(eq(null), eq("Porter"), any(Pageable.class))).willReturn(filteredPage);

        // Perform the request with filter and verify response
        mockMvc.perform(get("/api/v1/beers")
                        .param("beerStyle", "Porter")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].id", is(6)))
                .andExpect(jsonPath("$.content[0].beerStyle", is("Porter")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    @DisplayName("GET /api/v1/beers with both beerName and beerStyle filters returns filtered results")
    void testListBeersWithBeerNameAndBeerStyleFilters() throws Exception {
        // Create sample beer with specific name and style for testing
        BeerDto targetBeer = BeerDto.builder()
                .id(7)
                .beerName("Combo IPA")
                .beerStyle("IPA")
                .upc("9988776655")
                .quantityOnHand(25)
                .price(new BigDecimal("7.99"))
                .build();

        // Create a Page containing only the filtered beer
        Page<BeerDto> filteredPage = new PageImpl<>(
                List.of(targetBeer),
                PageRequest.of(0, 25, Sort.by("beerName").ascending()),
                1);

        // Mock the service method for both filters
        given(beerService.listBeers(eq("Combo"), eq("IPA"), any(Pageable.class))).willReturn(filteredPage);

        // Perform the request with both filters and verify response
        mockMvc.perform(get("/api/v1/beers")
                        .param("beerName", "Combo")
                        .param("beerStyle", "IPA")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].id", is(7)))
                .andExpect(jsonPath("$.content[0].beerName", is("Combo IPA")))
                .andExpect(jsonPath("$.content[0].beerStyle", is("IPA")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    @DisplayName("PATCH /api/v1/beers/{id} partially updates a beer and returns 200")
    void testPatchBeerSuccess() throws Exception {
        // Create a beer patch with only some fields
        BeerPatchDto patchDto = BeerPatchDto.builder()
                .beerName("Patched Beer Name")
                .price(new BigDecimal("8.99"))
                .build();

        // Create an expected result after patching
        BeerDto patchedBeer = sampleBeerDtoWithId(3);
        patchedBeer.setBeerName("Patched Beer Name");
        patchedBeer.setPrice(new BigDecimal("8.99"));

        // Mock the service method
        given(beerService.patchBeer(eq(3), any(BeerPatchDto.class))).willReturn(Optional.of(patchedBeer));

        // Perform the PATCH request
        mockMvc.perform(patch("/api/v1/beers/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(patchDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.beerName", is("Patched Beer Name")))
                .andExpect(jsonPath("$.price", is(8.99)))
                .andExpect(jsonPath("$.beerStyle", is("Lager"))); // Original value preserved
    }

    @Test
    @DisplayName("PATCH /api/v1/beers/{id} returns 404 when beer does not exist")
    void testPatchBeerNotFound() throws Exception {
        // Create a beer patch
        BeerPatchDto patchDto = BeerPatchDto.builder()
                .beerName("Patched Beer Name")
                .build();

        // Mock the service method to return empty
        given(beerService.patchBeer(eq(999), any(BeerPatchDto.class))).willReturn(Optional.empty());

        // Perform the PATCH request and expect 404
        mockMvc.perform(patch("/api/v1/beers/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(patchDto)))
                .andExpect(status().isNotFound());
    }
}
