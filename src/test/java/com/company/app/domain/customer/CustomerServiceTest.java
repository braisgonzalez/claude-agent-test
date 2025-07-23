package com.company.app.domain.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerService Domain Service Tests")
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer testCustomer;
    private Address testAddress;
    private final UUID customerId = UUID.randomUUID();
    private final String companyName = "ACME Corporation";
    private final String contactPerson = "John Doe";
    private final String email = "john.doe@acme.com";
    private final String phone = "+1-555-0123";
    private final String industry = "Technology";
    private final CustomerStatus status = CustomerStatus.ACTIVE;

    @BeforeEach
    void setUp() {
        testAddress = new Address("123 Main St", "New York", "NY", "10001", "USA");
        testCustomer = new Customer(companyName, contactPerson, email, testAddress);
        testCustomer.setId(customerId);
        testCustomer.setPhone(phone);
        testCustomer.setIndustry(industry);
        testCustomer.setStatus(status);
    }

    @Nested
    @DisplayName("Create Customer Tests")
    class CreateCustomerTests {

        @Test
        @DisplayName("should_CreateCustomer_When_ValidDataProvided")
        void should_CreateCustomer_When_ValidDataProvided() {
            // Arrange
            when(customerRepository.existsByEmail(email)).thenReturn(false);
            when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);

            // Act
            Customer result = customerService.createCustomer(companyName, contactPerson, email, 
                    phone, testAddress, industry, status);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getCompanyName()).isEqualTo(companyName);
            assertThat(result.getContactPerson()).isEqualTo(contactPerson);
            assertThat(result.getEmail()).isEqualTo(email);
            assertThat(result.getPhone()).isEqualTo(phone);
            assertThat(result.getAddress()).isEqualTo(testAddress);
            assertThat(result.getIndustry()).isEqualTo(industry);
            assertThat(result.getStatus()).isEqualTo(status);

            verify(customerRepository).existsByEmail(email);
            verify(customerRepository).save(any(Customer.class));
        }

        @Test
        @DisplayName("should_CreateCustomerWithDefaultStatus_When_StatusIsNull")
        void should_CreateCustomerWithDefaultStatus_When_StatusIsNull() {
            // Arrange
            when(customerRepository.existsByEmail(email)).thenReturn(false);
            when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);

            // Act
            Customer result = customerService.createCustomer(companyName, contactPerson, email, 
                    phone, testAddress, industry, null);

            // Assert
            assertThat(result).isNotNull();
            verify(customerRepository).existsByEmail(email);
            verify(customerRepository).save(any(Customer.class));
        }

        @Test
        @DisplayName("should_ThrowException_When_EmailAlreadyExists")
        void should_ThrowException_When_EmailAlreadyExists() {
            // Arrange
            when(customerRepository.existsByEmail(email)).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> customerService.createCustomer(companyName, contactPerson, email, 
                    phone, testAddress, industry, status))
                    .isInstanceOf(CustomerAlreadyExistsException.class)
                    .hasMessage("Customer with email already exists: " + email);

            verify(customerRepository).existsByEmail(email);
            verify(customerRepository, never()).save(any(Customer.class));
        }
    }

    @Nested
    @DisplayName("Get Customer Tests")
    class GetCustomerTests {

        @Test
        @DisplayName("should_ReturnCustomer_When_CustomerExistsById")
        void should_ReturnCustomer_When_CustomerExistsById() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));

            // Act
            Customer result = customerService.getCustomerById(customerId);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findById(customerId);
        }

        @Test
        @DisplayName("should_ThrowException_When_CustomerNotFoundById")
        void should_ThrowException_When_CustomerNotFoundById() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> customerService.getCustomerById(customerId))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessage("Customer not found with id: " + customerId);

            verify(customerRepository).findById(customerId);
        }

        @Test
        @DisplayName("should_ReturnCustomer_When_CustomerExistsByEmail")
        void should_ReturnCustomer_When_CustomerExistsByEmail() {
            // Arrange
            when(customerRepository.findByEmail(email)).thenReturn(Optional.of(testCustomer));

            // Act
            Customer result = customerService.getCustomerByEmail(email);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findByEmail(email);
        }

        @Test
        @DisplayName("should_ThrowException_When_CustomerNotFoundByEmail")
        void should_ThrowException_When_CustomerNotFoundByEmail() {
            // Arrange
            when(customerRepository.findByEmail(email)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> customerService.getCustomerByEmail(email))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessage("Customer not found with email: " + email);

            verify(customerRepository).findByEmail(email);
        }

        @Test
        @DisplayName("should_ReturnPagedCustomers_When_GetAllCustomersCalled")
        void should_ReturnPagedCustomers_When_GetAllCustomersCalled() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            List<Customer> customers = List.of(testCustomer);
            Page<Customer> expectedPage = new PageImpl<>(customers, pageable, 1);
            when(customerRepository.findAll(pageable)).thenReturn(expectedPage);

            // Act
            Page<Customer> result = customerService.getAllCustomers(pageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(testCustomer);
            verify(customerRepository).findAll(pageable);
        }

        @Test
        @DisplayName("should_ReturnPagedCustomersByStatus_When_GetCustomersByStatusCalled")
        void should_ReturnPagedCustomersByStatus_When_GetCustomersByStatusCalled() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            List<Customer> customers = List.of(testCustomer);
            Page<Customer> expectedPage = new PageImpl<>(customers, pageable, 1);
            when(customerRepository.findByStatus(status, pageable)).thenReturn(expectedPage);

            // Act
            Page<Customer> result = customerService.getCustomersByStatus(status, pageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(testCustomer);
            verify(customerRepository).findByStatus(status, pageable);
        }

        @Test
        @DisplayName("should_ReturnPagedCustomersByIndustry_When_GetCustomersByIndustryCalled")
        void should_ReturnPagedCustomersByIndustry_When_GetCustomersByIndustryCalled() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            List<Customer> customers = List.of(testCustomer);
            Page<Customer> expectedPage = new PageImpl<>(customers, pageable, 1);
            when(customerRepository.findByIndustry(industry, pageable)).thenReturn(expectedPage);

            // Act
            Page<Customer> result = customerService.getCustomersByIndustry(industry, pageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(testCustomer);
            verify(customerRepository).findByIndustry(industry, pageable);
        }

        @Test
        @DisplayName("should_ReturnPagedCustomersByStatusAndIndustry_When_GetCustomersByStatusAndIndustryCalled")
        void should_ReturnPagedCustomersByStatusAndIndustry_When_GetCustomersByStatusAndIndustryCalled() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            List<Customer> customers = List.of(testCustomer);
            Page<Customer> expectedPage = new PageImpl<>(customers, pageable, 1);
            when(customerRepository.findByStatusAndIndustry(status, industry, pageable)).thenReturn(expectedPage);

            // Act
            Page<Customer> result = customerService.getCustomersByStatusAndIndustry(status, industry, pageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(testCustomer);
            verify(customerRepository).findByStatusAndIndustry(status, industry, pageable);
        }
    }

    @Nested
    @DisplayName("Update Customer Tests")
    class UpdateCustomerTests {

        @Test
        @DisplayName("should_UpdateCustomer_When_ValidDataProvided")
        void should_UpdateCustomer_When_ValidDataProvided() {
            // Arrange
            String newCompanyName = "Beta Industries";
            String newContactPerson = "Jane Smith";
            String newEmail = "jane@beta.com";
            String newPhone = "+1-555-9999";
            Address newAddress = new Address("456 Oak Ave", "Los Angeles", "CA", "90210", "USA");
            String newIndustry = "Manufacturing";
            CustomerStatus newStatus = CustomerStatus.INACTIVE;

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
            when(customerRepository.existsByEmailAndIdNot(newEmail, customerId)).thenReturn(false);
            when(customerRepository.save(testCustomer)).thenReturn(testCustomer);

            // Act
            Customer result = customerService.updateCustomer(customerId, newCompanyName, newContactPerson, 
                    newEmail, newPhone, newAddress, newIndustry, newStatus);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findById(customerId);
            verify(customerRepository).existsByEmailAndIdNot(newEmail, customerId);
            verify(customerRepository).save(testCustomer);
        }

        @Test
        @DisplayName("should_UpdateOnlyProvidedFields_When_SomeParametersNull")
        void should_UpdateOnlyProvidedFields_When_SomeParametersNull() {
            // Arrange
            String newCompanyName = "Beta Industries";

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
            when(customerRepository.save(testCustomer)).thenReturn(testCustomer);

            // Act
            Customer result = customerService.updateCustomer(customerId, newCompanyName, null, 
                    null, null, null, null, null);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findById(customerId);
            verify(customerRepository).save(testCustomer);
        }

        @Test
        @DisplayName("should_ThrowException_When_EmailAlreadyExistsForDifferentCustomer")
        void should_ThrowException_When_EmailAlreadyExistsForDifferentCustomer() {
            // Arrange
            String newEmail = "existing@example.com";

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
            when(customerRepository.existsByEmailAndIdNot(newEmail, customerId)).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> customerService.updateCustomer(customerId, null, null, 
                    newEmail, null, null, null, null))
                    .isInstanceOf(CustomerAlreadyExistsException.class)
                    .hasMessage("Email already exists: " + newEmail);

            verify(customerRepository).findById(customerId);
            verify(customerRepository).existsByEmailAndIdNot(newEmail, customerId);
            verify(customerRepository, never()).save(any(Customer.class));
        }

        @Test
        @DisplayName("should_NotCheckEmailUniqueness_When_EmailUnchanged")
        void should_NotCheckEmailUniqueness_When_EmailUnchanged() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
            when(customerRepository.save(testCustomer)).thenReturn(testCustomer);

            // Act
            Customer result = customerService.updateCustomer(customerId, null, null, 
                    email, null, null, null, null);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findById(customerId);
            verify(customerRepository, never()).existsByEmailAndIdNot(anyString(), any(UUID.class));
            verify(customerRepository).save(testCustomer);
        }

        @Test
        @DisplayName("should_ThrowException_When_CustomerNotFoundForUpdate")
        void should_ThrowException_When_CustomerNotFoundForUpdate() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> customerService.updateCustomer(customerId, "New Company", null, 
                    null, null, null, null, null))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessage("Customer not found with id: " + customerId);

            verify(customerRepository).findById(customerId);
            verify(customerRepository, never()).save(any(Customer.class));
        }
    }

    @Nested
    @DisplayName("Delete Customer Tests")
    class DeleteCustomerTests {

        @Test
        @DisplayName("should_DeleteCustomer_When_CustomerExists")
        void should_DeleteCustomer_When_CustomerExists() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));

            // Act
            customerService.deleteCustomer(customerId);

            // Assert
            verify(customerRepository).findById(customerId);
            verify(customerRepository).deleteById(customerId);
        }

        @Test
        @DisplayName("should_ThrowException_When_CustomerNotFoundForDeletion")
        void should_ThrowException_When_CustomerNotFoundForDeletion() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> customerService.deleteCustomer(customerId))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessage("Customer not found with id: " + customerId);

            verify(customerRepository).findById(customerId);
            verify(customerRepository, never()).deleteById(any(UUID.class));
        }
    }

    @Nested
    @DisplayName("Activate/Deactivate Customer Tests")
    class ActivateDeactivateTests {

        @Test
        @DisplayName("should_ActivateCustomer_When_CustomerExists")
        void should_ActivateCustomer_When_CustomerExists() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
            when(customerRepository.save(testCustomer)).thenReturn(testCustomer);

            // Act
            Customer result = customerService.activateCustomer(customerId);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findById(customerId);
            verify(customerRepository).save(testCustomer);
        }

        @Test
        @DisplayName("should_DeactivateCustomer_When_CustomerExists")
        void should_DeactivateCustomer_When_CustomerExists() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
            when(customerRepository.save(testCustomer)).thenReturn(testCustomer);

            // Act
            Customer result = customerService.deactivateCustomer(customerId);

            // Assert
            assertThat(result).isEqualTo(testCustomer);
            verify(customerRepository).findById(customerId);
            verify(customerRepository).save(testCustomer);
        }

        @Test
        @DisplayName("should_ThrowException_When_CustomerNotFoundForActivation")
        void should_ThrowException_When_CustomerNotFoundForActivation() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> customerService.activateCustomer(customerId))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessage("Customer not found with id: " + customerId);

            verify(customerRepository).findById(customerId);
            verify(customerRepository, never()).save(any(Customer.class));
        }

        @Test
        @DisplayName("should_ThrowException_When_CustomerNotFoundForDeactivation")
        void should_ThrowException_When_CustomerNotFoundForDeactivation() {
            // Arrange
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> customerService.deactivateCustomer(customerId))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessage("Customer not found with id: " + customerId);

            verify(customerRepository).findById(customerId);
            verify(customerRepository, never()).save(any(Customer.class));
        }
    }
}