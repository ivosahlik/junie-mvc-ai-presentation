package cz.ivosahlik.juniemvcaipresentation.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a customer in the system.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer")
@Builder
public class Customer extends BaseEntity {

    @Builder
    public Customer(Integer id, Integer version, String name, String email, String phoneNumber,
                   String addressLine1, String addressLine2, String city, String state, String postalCode,
                   Set<BeerOrder> beerOrders) {
        super.setId(id);
        super.setVersion(version);
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.beerOrders = beerOrders != null ? beerOrders : new HashSet<>();
    }

    @NotNull
    private String name;

    private String email;

    private String phoneNumber;

    @NotNull
    private String addressLine1;

    private String addressLine2;

    @NotNull
    private String city;

    @NotNull
    private String state;

    @NotNull
    private String postalCode;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private Set<BeerOrder> beerOrders = new HashSet<>();

    /**
     * Adds a beer order to this customer and maintains the relationship.
     * @param beerOrder The beer order to add
     */
    public void addBeerOrder(BeerOrder beerOrder) {
        if (beerOrder != null) {
            if (beerOrders == null) {
                beerOrders = new HashSet<>();
            }
            beerOrders.add(beerOrder);
            beerOrder.setCustomer(this);
        }
    }

    /**
     * Removes a beer order from this customer and maintains the relationship.
     * @param beerOrder The beer order to remove
     */
    public void removeBeerOrder(BeerOrder beerOrder) {
        if (beerOrder != null && beerOrders != null) {
            beerOrders.remove(beerOrder);
            beerOrder.setCustomer(null);
        }
    }
}
