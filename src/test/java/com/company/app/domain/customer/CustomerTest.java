package com.company.app.domain.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Customer Domain Entity Tests")
class CustomerTest {

    private Customer customer;
    private Address address;
    private final String companyName = "ACME Corporation";
    private final String contactPerson = "John Doe";
    private final String email = "john.doe@acme.com";

    @BeforeEach
    void setUp() {
        address = new Address("123 Main St", "New York", "NY", "10001", "USA");
        customer = new Customer(companyName, contactPerson, email, address);
    }

    @Nested
    @DisplayName("Constructor Tests")
    class ConstructorTests {

        @Test
        @DisplayName("should_CreateCustomerWithDefaultValues_When_UsingNoArgsConstructor")
        void should_CreateCustomerWithDefaultValues_When_UsingNoArgsConstructor() {
            // Arrange & Act
            Customer customer = new Customer();

            // Assert
            assertThat(customer.getId()).isNotNull();
            assertThat(customer.getStatus()).isEqualTo(CustomerStatus.PROSPECT);
            assertThat(customer.getCreatedAt()).isNotNull();
            assertThat(customer.getUpdatedAt()).isNotNull();
            assertThat(customer.getCreatedAt()).isBeforeOrEqualTo(customer.getUpdatedAt());
        }

        @Test
        @DisplayName("should_CreateCustomerWithAllProperties_When_UsingParameterizedConstructor")
        void should_CreateCustomerWithAllProperties_When_UsingParameterizedConstructor() {
            // Arrange & Act
            Customer customer = new Customer(companyName, contactPerson, email, address);

            // Assert
            assertThat(customer.getId()).isNotNull();
            assertThat(customer.getCompanyName()).isEqualTo(companyName);
            assertThat(customer.getContactPerson()).isEqualTo(contactPerson);
            assertThat(customer.getEmail()).isEqualTo(email);
            assertThat(customer.getAddress()).isEqualTo(address);
            assertThat(customer.getStatus()).isEqualTo(CustomerStatus.PROSPECT);
            assertThat(customer.getCreatedAt()).isNotNull();
            assertThat(customer.getUpdatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should_GenerateUniqueIds_When_CreatingMultipleCustomers")
        void should_GenerateUniqueIds_When_CreatingMultipleCustomers() {
            // Arrange & Act
            Customer customer1 = new Customer();
            Customer customer2 = new Customer();

            // Assert
            assertThat(customer1.getId()).isNotEqualTo(customer2.getId());
        }
    }

    @Nested
    @DisplayName("Basic Info Update Tests")
    class BasicInfoUpdateTests {

        @Test
        @DisplayName("should_UpdateAllFields_When_AllParametersProvided")
        void should_UpdateAllFields_When_AllParametersProvided() {
            // Arrange
            String newCompanyName = "Beta Industries";
            String newContactPerson = "Jane Smith";
            String newEmail = "jane@beta.com";
            String newPhone = "+1-555-0123";
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateBasicInfo(newCompanyName, newContactPerson, newEmail, newPhone);

            // Assert
            assertThat(customer.getCompanyName()).isEqualTo(newCompanyName);
            assertThat(customer.getContactPerson()).isEqualTo(newContactPerson);
            assertThat(customer.getEmail()).isEqualTo(newEmail);
            assertThat(customer.getPhone()).isEqualTo(newPhone);
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateOnlyProvidedFields_When_SomeParametersNull")
        void should_UpdateOnlyProvidedFields_When_SomeParametersNull() {
            // Arrange
            String newCompanyName = "Beta Industries";
            String originalContactPerson = customer.getContactPerson();
            String originalEmail = customer.getEmail();

            // Act
            customer.updateBasicInfo(newCompanyName, null, null, "+1-555-0123");

            // Assert
            assertThat(customer.getCompanyName()).isEqualTo(newCompanyName);
            assertThat(customer.getContactPerson()).isEqualTo(originalContactPerson);
            assertThat(customer.getEmail()).isEqualTo(originalEmail);
            assertThat(customer.getPhone()).isEqualTo("+1-555-0123");
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_BasicInfoUpdated")
        void should_UpdateTimestamp_When_BasicInfoUpdated() {
            // Arrange
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateBasicInfo("New Company", null, null, null);

            // Assert
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Address Update Tests")
    class AddressUpdateTests {

        @Test
        @DisplayName("should_UpdateAddress_When_NewAddressProvided")
        void should_UpdateAddress_When_NewAddressProvided() {
            // Arrange
            Address newAddress = new Address("456 Oak Ave", "Los Angeles", "CA", "90210", "USA");
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateAddress(newAddress);

            // Assert
            assertThat(customer.getAddress()).isEqualTo(newAddress);
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_AddressUpdated")
        void should_UpdateTimestamp_When_AddressUpdated() {
            // Arrange
            Address newAddress = new Address("789 Pine Rd", "Chicago", "IL", "60601", "USA");
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateAddress(newAddress);

            // Assert
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Industry Update Tests")
    class IndustryUpdateTests {

        @Test
        @DisplayName("should_UpdateIndustry_When_NewIndustryProvided")
        void should_UpdateIndustry_When_NewIndustryProvided() {
            // Arrange
            String newIndustry = "Technology";
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateIndustry(newIndustry);

            // Assert
            assertThat(customer.getIndustry()).isEqualTo(newIndustry);
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_IndustryUpdated")
        void should_UpdateTimestamp_When_IndustryUpdated() {
            // Arrange
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateIndustry("Manufacturing");

            // Assert
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Status Management Tests")
    class StatusManagementTests {

        @Test
        @DisplayName("should_UpdateStatus_When_NewStatusProvided")
        void should_UpdateStatus_When_NewStatusProvided() {
            // Arrange
            CustomerStatus newStatus = CustomerStatus.ACTIVE;
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.updateStatus(newStatus);

            // Assert
            assertThat(customer.getStatus()).isEqualTo(newStatus);
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_ActivateCustomer_When_ActivateCalled")
        void should_ActivateCustomer_When_ActivateCalled() {
            // Arrange
            customer.updateStatus(CustomerStatus.INACTIVE);
            Instant originalUpdatedAt = customer.getUpdatedAt();
            
            // Small delay to ensure timestamp difference
            try { Thread.sleep(1); } catch (InterruptedException e) {}

            // Act
            customer.activate();

            // Assert
            assertThat(customer.getStatus()).isEqualTo(CustomerStatus.ACTIVE);
            assertThat(customer.getUpdatedAt()).isAfterOrEqualTo(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_DeactivateCustomer_When_DeactivateCalled")
        void should_DeactivateCustomer_When_DeactivateCalled() {
            // Arrange
            customer.updateStatus(CustomerStatus.ACTIVE);
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.deactivate();

            // Assert
            assertThat(customer.getStatus()).isEqualTo(CustomerStatus.INACTIVE);
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_ConvertToCustomer_When_ConvertToCustomerCalled")
        void should_ConvertToCustomer_When_ConvertToCustomerCalled() {
            // Arrange
            customer.updateStatus(CustomerStatus.PROSPECT);
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.convertToCustomer();

            // Assert
            assertThat(customer.getStatus()).isEqualTo(CustomerStatus.ACTIVE);
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_StatusChanged")
        void should_UpdateTimestamp_When_StatusChanged() {
            // Arrange
            Instant originalUpdatedAt = customer.getUpdatedAt();

            // Act
            customer.activate();

            // Assert
            assertThat(customer.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Getter Tests")
    class GetterTests {

        @Test
        @DisplayName("should_ReturnCorrectValues_When_GettersUsed")
        void should_ReturnCorrectValues_When_GettersUsed() {
            // Assert
            assertThat(customer.getCompanyName()).isEqualTo(companyName);
            assertThat(customer.getContactPerson()).isEqualTo(contactPerson);
            assertThat(customer.getEmail()).isEqualTo(email);
            assertThat(customer.getAddress()).isEqualTo(address);
            assertThat(customer.getStatus()).isEqualTo(CustomerStatus.PROSPECT);
        }
    }

    @Nested
    @DisplayName("Setter Tests")
    class SetterTests {

        @Test
        @DisplayName("should_SetValues_When_SettersUsed")
        void should_SetValues_When_SettersUsed() {
            // Arrange
            UUID newId = UUID.randomUUID();
            String newCompanyName = "New Company";
            String newContactPerson = "Jane Smith";
            String newEmail = "new@company.com";
            String newPhone = "+1-555-9999";
            Address newAddress = new Address("789 Pine Rd", "Chicago", "IL", "60601", "USA");
            String newIndustry = "Technology";
            CustomerStatus newStatus = CustomerStatus.ACTIVE;
            Instant newCreatedAt = Instant.now().minusSeconds(3600);
            Instant newUpdatedAt = Instant.now().minusSeconds(1800);

            // Act
            customer.setId(newId);
            customer.setCompanyName(newCompanyName);
            customer.setContactPerson(newContactPerson);
            customer.setEmail(newEmail);
            customer.setPhone(newPhone);
            customer.setAddress(newAddress);
            customer.setIndustry(newIndustry);
            customer.setStatus(newStatus);
            customer.setCreatedAt(newCreatedAt);
            customer.setUpdatedAt(newUpdatedAt);

            // Assert
            assertThat(customer.getId()).isEqualTo(newId);
            assertThat(customer.getCompanyName()).isEqualTo(newCompanyName);
            assertThat(customer.getContactPerson()).isEqualTo(newContactPerson);
            assertThat(customer.getEmail()).isEqualTo(newEmail);
            assertThat(customer.getPhone()).isEqualTo(newPhone);
            assertThat(customer.getAddress()).isEqualTo(newAddress);
            assertThat(customer.getIndustry()).isEqualTo(newIndustry);
            assertThat(customer.getStatus()).isEqualTo(newStatus);
            assertThat(customer.getCreatedAt()).isEqualTo(newCreatedAt);
            assertThat(customer.getUpdatedAt()).isEqualTo(newUpdatedAt);
        }
    }
}