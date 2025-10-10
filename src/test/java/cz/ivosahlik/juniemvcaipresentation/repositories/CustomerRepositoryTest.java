package cz.ivosahlik.juniemvcaipresentation.repositories;

import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CustomerRepositoryTest {

    @Autowired
    CustomerRepository customerRepository;

    private Customer sampleCustomer() {
        return Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main Street")
                .addressLine2("Apt 4B")
                .city("Boston")
                .state("MA")
                .postalCode("02108")
                .build();
    }

    @Test
    @DisplayName("save() should persist a new Customer and assign id/version")
    void testSave() {
        Customer saved = customerRepository.save(sampleCustomer());
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getVersion()).isNotNull();
        assertThat(saved.getCreatedDate()).isNotNull();
        assertThat(saved.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("findById() should retrieve previously saved Customer")
    void testFindById() {
        Customer saved = customerRepository.save(sampleCustomer());
        Optional<Customer> found = customerRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John Doe");
        assertThat(found.get().getEmail()).isEqualTo("john.doe@example.com");
        assertThat(found.get().getAddressLine1()).isEqualTo("123 Main Street");
    }

    @Test
    @DisplayName("findAll() should return list with saved entities")
    void testFindAll() {
        customerRepository.save(sampleCustomer());
        Customer another = Customer.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Avenue")
                .city("New York")
                .state("NY")
                .postalCode("10001")
                .build();
        customerRepository.save(another);
        List<Customer> all = customerRepository.findAll();
        assertThat(all.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("update should change fields and bump version/updateDate")
    void testUpdate() {
        Customer saved = customerRepository.save(sampleCustomer());
        Integer originalVersion = saved.getVersion();
        saved.setName("John Smith");
        saved.setEmail("john.smith@example.com");
        Customer updated = customerRepository.save(saved);
        assertThat(updated.getName()).isEqualTo("John Smith");
        assertThat(updated.getEmail()).isEqualTo("john.smith@example.com");
        assertThat(updated.getVersion()).isNotNull();
        assertThat(updated.getVersion()).isGreaterThanOrEqualTo(originalVersion);
        assertThat(updated.getUpdateDate()).isNotNull();
    }

    @Test
    @DisplayName("delete should remove entity from repository")
    void testDelete() {
        Customer saved = customerRepository.save(sampleCustomer());
        Integer id = saved.getId();
        customerRepository.delete(saved);
        assertThat(customerRepository.findById(id)).isEmpty();
    }
}
