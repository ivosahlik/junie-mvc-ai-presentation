package cz.ivosahlik.juniemvcaipresentation.services;

import cz.ivosahlik.juniemvcaipresentation.entities.Customer;
import cz.ivosahlik.juniemvcaipresentation.mappers.CustomerMapper;
import cz.ivosahlik.juniemvcaipresentation.models.CustomerDto;
import cz.ivosahlik.juniemvcaipresentation.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    CustomerRepository customerRepository;

    @Mock
    CustomerMapper customerMapper;

    @InjectMocks
    CustomerServiceImpl customerService;

    Customer testCustomer;
    CustomerDto testCustomerDto;

    @BeforeEach
    void setUp() {
        // Setup test customer entity
        testCustomer = new Customer();
        testCustomer.setId(1);
        testCustomer.setVersion(1);
        testCustomer.setName("Test Customer");
        testCustomer.setEmail("test@example.com");
        testCustomer.setPhoneNumber("123-456-7890");
        testCustomer.setAddressLine1("123 Test St");
        testCustomer.setCity("Test City");
        testCustomer.setState("TS");
        testCustomer.setPostalCode("12345");

        // Setup test customer DTO
        testCustomerDto = new CustomerDto();
        testCustomerDto.setId(1);
        testCustomerDto.setVersion(1);
        testCustomerDto.setName("Test Customer");
        testCustomerDto.setEmail("test@example.com");
        testCustomerDto.setPhoneNumber("123-456-7890");
        testCustomerDto.setAddressLine1("123 Test St");
        testCustomerDto.setCity("Test City");
        testCustomerDto.setState("TS");
        testCustomerDto.setPostalCode("12345");
    }

    @Test
    @DisplayName("List customers returns list of customers")
    void testListCustomers() {
        // Given
        List<Customer> customers = Arrays.asList(testCustomer);
        when(customerRepository.findAll()).thenReturn(customers);
        when(customerMapper.toDto(any(Customer.class))).thenReturn(testCustomerDto);

        // When
        List<CustomerDto> result = customerService.listCustomers();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Customer");
        verify(customerRepository, times(1)).findAll();
        verify(customerMapper, times(1)).toDto(any(Customer.class));
    }

    @Test
    @DisplayName("Get customer by ID returns customer when found")
    void testGetCustomerByIdFound() {
        // Given
        when(customerRepository.findById(anyInt())).thenReturn(Optional.of(testCustomer));
        when(customerMapper.toDto(any(Customer.class))).thenReturn(testCustomerDto);

        // When
        Optional<CustomerDto> result = customerService.getCustomerById(1);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Customer");
        verify(customerRepository, times(1)).findById(1);
        verify(customerMapper, times(1)).toDto(testCustomer);
    }

    @Test
    @DisplayName("Get customer by ID returns empty when not found")
    void testGetCustomerByIdNotFound() {
        // Given
        when(customerRepository.findById(anyInt())).thenReturn(Optional.empty());

        // When
        Optional<CustomerDto> result = customerService.getCustomerById(99);

        // Then
        assertThat(result).isEmpty();
        verify(customerRepository, times(1)).findById(99);
        verify(customerMapper, never()).toDto(any(Customer.class));
    }

    @Test
    @DisplayName("Create customer saves and returns new customer")
    void testCreateCustomer() {
        // Given
        when(customerMapper.toEntity(any(CustomerDto.class))).thenReturn(testCustomer);
        when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);
        when(customerMapper.toDto(any(Customer.class))).thenReturn(testCustomerDto);

        // When
        CustomerDto result = customerService.createCustomer(testCustomerDto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Customer");
        verify(customerMapper, times(1)).toEntity(testCustomerDto);
        verify(customerRepository, times(1)).save(testCustomer);
        verify(customerMapper, times(1)).toDto(testCustomer);
    }

    @Test
    @DisplayName("Update customer updates and returns customer when found")
    void testUpdateCustomerFound() {
        // Given
        Customer existingCustomer = testCustomer;
        CustomerDto updatedDto = new CustomerDto();
        updatedDto.setName("Updated Customer");
        updatedDto.setEmail("updated@example.com");
        updatedDto.setAddressLine1("456 Update St");
        updatedDto.setCity("Update City");
        updatedDto.setState("US");
        updatedDto.setPostalCode("54321");

        when(customerRepository.findById(anyInt())).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

        CustomerDto responseDto = new CustomerDto();
        responseDto.setId(1);
        responseDto.setName("Updated Customer");
        responseDto.setEmail("updated@example.com");
        when(customerMapper.toDto(any(Customer.class))).thenReturn(responseDto);

        // When
        Optional<CustomerDto> result = customerService.updateCustomer(1, updatedDto);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Updated Customer");
        verify(customerRepository, times(1)).findById(1);
        verify(customerMapper, times(1)).updateEntityFromDto(eq(updatedDto), eq(existingCustomer));
        verify(customerRepository, times(1)).save(existingCustomer);
        verify(customerMapper, times(1)).toDto(existingCustomer);
    }

    @Test
    @DisplayName("Update customer returns empty when not found")
    void testUpdateCustomerNotFound() {
        // Given
        when(customerRepository.findById(anyInt())).thenReturn(Optional.empty());

        // When
        Optional<CustomerDto> result = customerService.updateCustomer(99, testCustomerDto);

        // Then
        assertThat(result).isEmpty();
        verify(customerRepository, times(1)).findById(99);
        verify(customerMapper, never()).updateEntityFromDto(any(), any());
        verify(customerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Delete customer returns true when customer exists")
    void testDeleteCustomerExists() {
        // Given
        when(customerRepository.existsById(anyInt())).thenReturn(true);
        doNothing().when(customerRepository).deleteById(anyInt());

        // When
        boolean result = customerService.deleteCustomer(1);

        // Then
        assertThat(result).isTrue();
        verify(customerRepository, times(1)).existsById(1);
        verify(customerRepository, times(1)).deleteById(1);
    }

    @Test
    @DisplayName("Delete customer returns false when customer does not exist")
    void testDeleteCustomerNotExists() {
        // Given
        when(customerRepository.existsById(anyInt())).thenReturn(false);

        // When
        boolean result = customerService.deleteCustomer(99);

        // Then
        assertThat(result).isFalse();
        verify(customerRepository, times(1)).existsById(99);
        verify(customerRepository, never()).deleteById(anyInt());
    }

    @Test
    @DisplayName("Find customers by name returns matching customers")
    void testFindCustomersByName() {
        // Given
        List<Customer> matchingCustomers = Arrays.asList(testCustomer);
        when(customerRepository.findByNameContainingIgnoreCase(anyString())).thenReturn(matchingCustomers);
        when(customerMapper.toDto(any(Customer.class))).thenReturn(testCustomerDto);

        // When
        List<CustomerDto> result = customerService.findCustomersByName("Test");

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Customer");
        verify(customerRepository, times(1)).findByNameContainingIgnoreCase("Test");
        verify(customerMapper, times(1)).toDto(any(Customer.class));
    }
}
