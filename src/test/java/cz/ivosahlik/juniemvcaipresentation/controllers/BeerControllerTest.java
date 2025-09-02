package cz.ivosahlik.juniemvcaipresentation.controllers;

import cz.ivosahlik.juniemvcaipresentation.entities.Beer;
import cz.ivosahlik.juniemvcaipresentation.services.BeerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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

    private Beer sampleBeerNoId() {
        return Beer.builder()
                .beerName("Sample Lager")
                .beerStyle("Lager")
                .upc("1234567890123")
                .quantityOnHand(10)
                .price(new BigDecimal("4.99"))
                .build();
    }

    private Beer sampleBeerWithId(Integer id) {
        Beer b = sampleBeerNoId();
        b.setId(id);
        return b;
    }

    @Test
    @DisplayName("POST /api/v1/beers creates a beer and returns 201")
    void testCreateBeer() throws Exception {
        Beer request = sampleBeerNoId();
        Beer saved = sampleBeerWithId(1);

        given(beerService.createBeer(any(Beer.class))).willReturn(saved);

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
        Beer saved = sampleBeerWithId(2);
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
    @DisplayName("GET /api/v1/beers returns list of beers")
    void testListBeers() throws Exception {
        List<Beer> list = Arrays.asList(sampleBeerWithId(1), sampleBeerWithId(2));
        given(beerService.listBeers()).willReturn(list);

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
        Beer request = sampleBeerNoId();
        Beer updated = sampleBeerWithId(5);
        updated.setBeerName("Updated Lager");

        given(beerService.updateBeer(eq(5), any(Beer.class))).willReturn(Optional.of(updated));

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
        Beer request = sampleBeerNoId();
        given(beerService.updateBeer(eq(404), any(Beer.class))).willReturn(Optional.empty());

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
}
