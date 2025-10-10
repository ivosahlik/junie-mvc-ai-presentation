package cz.ivosahlik.juniemvcaipresentation.mappers;

import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CustomerMapperTest {

    @Autowired
    CustomerMapper customerMapper;

    @Test
    @DisplayName("toDto should correctly map Customer entity to CustomerDto")
    void testToDto() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        Customer customer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main Street")
                .addressLine2("Apt 4B")
                .city("Boston")
                .state("MA")
                .postalCode("02108")
                .build();
        customer.setId(1);
        customer.setVersion(2);
        customer.setCreatedDate(now);
        customer.setUpdateDate(now);

        // When
        CustomerDto dto = customerMapper.toDto(customer);

        // Then
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(1);
        assertThat(dto.getVersion()).isEqualTo(2);
        assertThat(dto.getName()).isEqualTo("John Doe");
        assertThat(dto.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(dto.getPhoneNumber()).isEqualTo("555-123-4567");
        assertThat(dto.getAddressLine1()).isEqualTo("123 Main Street");
        assertThat(dto.getAddressLine2()).isEqualTo("Apt 4B");
        assertThat(dto.getCity()).isEqualTo("Boston");
        assertThat(dto.getState()).isEqualTo("MA");
        assertThat(dto.getPostalCode()).isEqualTo("02108");
        assertThat(dto.getCreatedDate()).isEqualTo(now);
        assertThat(dto.getUpdateDate()).isEqualTo(now);
    }

    @Test
    @DisplayName("toEntity should correctly map CustomerDto to Customer entity")
    void testToEntity() {
        // Given
        CustomerDto dto = CustomerDto.builder()
                .id(1)
                .version(2)
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Avenue")
                .addressLine2(null)
                .city("New York")
                .state("NY")
                .postalCode("10001")
                .build();

        // When
        Customer entity = customerMapper.toEntity(dto);

        // Then
        assertThat(entity).isNotNull();
        assertThat(entity.getName()).isEqualTo("Jane Smith");
        assertThat(entity.getEmail()).isEqualTo("jane.smith@example.com");
        assertThat(entity.getPhoneNumber()).isEqualTo("555-987-6543");
        assertThat(entity.getAddressLine1()).isEqualTo("456 Oak Avenue");
        assertThat(entity.getAddressLine2()).isNull();
        assertThat(entity.getCity()).isEqualTo("New York");
        assertThat(entity.getState()).isEqualTo("NY");
        assertThat(entity.getPostalCode()).isEqualTo("10001");
    }

    @Test
    @DisplayName("updateEntityFromDto should update only non-ignored fields")
    void testUpdateEntityFromDto() {
        // Given
        LocalDateTime originalCreatedDate = LocalDateTime.now().minusDays(1);
        LocalDateTime originalUpdateDate = LocalDateTime.now().minusDays(1);

        Customer existingEntity = Customer.builder()
                .name("Old Name")
                .email("old.email@example.com")
                .phoneNumber("555-111-2222")
                .addressLine1("Old Address")
                .addressLine2("Old Suite")
                .city("Old City")
                .state("OL")
                .postalCode("11111")
                .build();
        existingEntity.setId(1);
        existingEntity.setVersion(2);
        existingEntity.setCreatedDate(originalCreatedDate);
        existingEntity.setUpdateDate(originalUpdateDate);

        CustomerDto dto = CustomerDto.builder()
                .id(999) // Should be ignored
                .version(999) // This should be updated
                .name("New Name")
                .email("new.email@example.com")
                .phoneNumber("555-333-4444")
                .addressLine1("New Address")
                .addressLine2("New Suite")
                .city("New City")
                .state("NW")
                .postalCode("22222")
                .build();

        // When
        customerMapper.updateEntityFromDto(dto, existingEntity);

        // Then
        assertThat(existingEntity.getId()).isEqualTo(1); // Should not be updated
        assertThat(existingEntity.getName()).isEqualTo("New Name");
        assertThat(existingEntity.getEmail()).isEqualTo("new.email@example.com");
        assertThat(existingEntity.getPhoneNumber()).isEqualTo("555-333-4444");
        assertThat(existingEntity.getAddressLine1()).isEqualTo("New Address");
        assertThat(existingEntity.getAddressLine2()).isEqualTo("New Suite");
        assertThat(existingEntity.getCity()).isEqualTo("New City");
        assertThat(existingEntity.getState()).isEqualTo("NW");
        assertThat(existingEntity.getPostalCode()).isEqualTo("22222");
        assertThat(existingEntity.getCreatedDate()).isEqualTo(originalCreatedDate);
    }
}
