package com.company.app.domain.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Address Value Object Tests")
class AddressTest {

    private Address address;
    private final String street = "123 Main St";
    private final String city = "New York";
    private final String state = "NY";
    private final String zipCode = "10001";
    private final String country = "USA";

    @BeforeEach
    void setUp() {
        address = new Address(street, city, state, zipCode, country);
    }

    @Nested
    @DisplayName("Constructor Tests")
    class ConstructorTests {

        @Test
        @DisplayName("should_CreateAddressWithNullValues_When_UsingNoArgsConstructor")
        void should_CreateAddressWithNullValues_When_UsingNoArgsConstructor() {
            // Arrange & Act
            Address address = new Address();

            // Assert
            assertThat(address.getStreet()).isNull();
            assertThat(address.getCity()).isNull();
            assertThat(address.getState()).isNull();
            assertThat(address.getZipCode()).isNull();
            assertThat(address.getCountry()).isNull();
        }

        @Test
        @DisplayName("should_CreateAddressWithAllProperties_When_UsingParameterizedConstructor")
        void should_CreateAddressWithAllProperties_When_UsingParameterizedConstructor() {
            // Arrange & Act
            Address address = new Address(street, city, state, zipCode, country);

            // Assert
            assertThat(address.getStreet()).isEqualTo(street);
            assertThat(address.getCity()).isEqualTo(city);
            assertThat(address.getState()).isEqualTo(state);
            assertThat(address.getZipCode()).isEqualTo(zipCode);
            assertThat(address.getCountry()).isEqualTo(country);
        }
    }

    @Nested
    @DisplayName("Getter Tests")
    class GetterTests {

        @Test
        @DisplayName("should_ReturnCorrectValues_When_GettersUsed")
        void should_ReturnCorrectValues_When_GettersUsed() {
            // Assert
            assertThat(address.getStreet()).isEqualTo(street);
            assertThat(address.getCity()).isEqualTo(city);
            assertThat(address.getState()).isEqualTo(state);
            assertThat(address.getZipCode()).isEqualTo(zipCode);
            assertThat(address.getCountry()).isEqualTo(country);
        }
    }

    @Nested
    @DisplayName("Setter Tests")
    class SetterTests {

        @Test
        @DisplayName("should_SetValues_When_SettersUsed")
        void should_SetValues_When_SettersUsed() {
            // Arrange
            String newStreet = "456 Oak Ave";
            String newCity = "Los Angeles";
            String newState = "CA";
            String newZipCode = "90210";
            String newCountry = "USA";

            // Act
            address.setStreet(newStreet);
            address.setCity(newCity);
            address.setState(newState);
            address.setZipCode(newZipCode);
            address.setCountry(newCountry);

            // Assert
            assertThat(address.getStreet()).isEqualTo(newStreet);
            assertThat(address.getCity()).isEqualTo(newCity);
            assertThat(address.getState()).isEqualTo(newState);
            assertThat(address.getZipCode()).isEqualTo(newZipCode);
            assertThat(address.getCountry()).isEqualTo(newCountry);
        }
    }

    @Nested
    @DisplayName("Equals and HashCode Tests")
    class EqualsAndHashCodeTests {

        @Test
        @DisplayName("should_BeEqual_When_AllFieldsMatch")
        void should_BeEqual_When_AllFieldsMatch() {
            // Arrange
            Address other = new Address(street, city, state, zipCode, country);

            // Act & Assert
            assertThat(address).isEqualTo(other);
            assertThat(address.hashCode()).isEqualTo(other.hashCode());
        }

        @Test
        @DisplayName("should_NotBeEqual_When_StreetDiffers")
        void should_NotBeEqual_When_StreetDiffers() {
            // Arrange
            Address other = new Address("456 Oak Ave", city, state, zipCode, country);

            // Act & Assert
            assertThat(address).isNotEqualTo(other);
        }

        @Test
        @DisplayName("should_NotBeEqual_When_CityDiffers")
        void should_NotBeEqual_When_CityDiffers() {
            // Arrange
            Address other = new Address(street, "Los Angeles", state, zipCode, country);

            // Act & Assert
            assertThat(address).isNotEqualTo(other);
        }

        @Test
        @DisplayName("should_NotBeEqual_When_StateDiffers")
        void should_NotBeEqual_When_StateDiffers() {
            // Arrange
            Address other = new Address(street, city, "CA", zipCode, country);

            // Act & Assert
            assertThat(address).isNotEqualTo(other);
        }

        @Test
        @DisplayName("should_NotBeEqual_When_ZipCodeDiffers")
        void should_NotBeEqual_When_ZipCodeDiffers() {
            // Arrange
            Address other = new Address(street, city, state, "90210", country);

            // Act & Assert
            assertThat(address).isNotEqualTo(other);
        }

        @Test
        @DisplayName("should_NotBeEqual_When_CountryDiffers")
        void should_NotBeEqual_When_CountryDiffers() {
            // Arrange
            Address other = new Address(street, city, state, zipCode, "Canada");

            // Act & Assert
            assertThat(address).isNotEqualTo(other);
        }

        @Test
        @DisplayName("should_BeEqual_When_ComparedToItself")
        void should_BeEqual_When_ComparedToItself() {
            // Act & Assert
            assertThat(address).isEqualTo(address);
        }

        @Test
        @DisplayName("should_NotBeEqual_When_ComparedToNull")
        void should_NotBeEqual_When_ComparedToNull() {
            // Act & Assert
            assertThat(address).isNotEqualTo(null);
        }

        @Test
        @DisplayName("should_NotBeEqual_When_ComparedToDifferentClass")
        void should_NotBeEqual_When_ComparedToDifferentClass() {
            // Act & Assert
            assertThat(address).isNotEqualTo("not an address");
        }

        @Test
        @DisplayName("should_HandleNullFields_When_ComparingForEquality")
        void should_HandleNullFields_When_ComparingForEquality() {
            // Arrange
            Address address1 = new Address(null, null, null, null, null);
            Address address2 = new Address(null, null, null, null, null);

            // Act & Assert
            assertThat(address1).isEqualTo(address2);
            assertThat(address1.hashCode()).isEqualTo(address2.hashCode());
        }

        @Test
        @DisplayName("should_NotBeEqual_When_OneFieldIsNull")
        void should_NotBeEqual_When_OneFieldIsNull() {
            // Arrange
            Address other = new Address(null, city, state, zipCode, country);

            // Act & Assert
            assertThat(address).isNotEqualTo(other);
        }
    }

    @Nested
    @DisplayName("ToString Tests")
    class ToStringTests {

        @Test
        @DisplayName("should_ReturnFormattedString_When_ToStringCalled")
        void should_ReturnFormattedString_When_ToStringCalled() {
            // Act
            String result = address.toString();

            // Assert
            assertThat(result).contains("Address{");
            assertThat(result).contains("street='" + street + "'");
            assertThat(result).contains("city='" + city + "'");
            assertThat(result).contains("state='" + state + "'");
            assertThat(result).contains("zipCode='" + zipCode + "'");
            assertThat(result).contains("country='" + country + "'");
        }

        @Test
        @DisplayName("should_HandleNullValues_When_ToStringCalled")
        void should_HandleNullValues_When_ToStringCalled() {
            // Arrange
            Address nullAddress = new Address();

            // Act
            String result = nullAddress.toString();

            // Assert
            assertThat(result).contains("Address{");
            assertThat(result).contains("street='null'");
            assertThat(result).contains("city='null'");
            assertThat(result).contains("state='null'");
            assertThat(result).contains("zipCode='null'");
            assertThat(result).contains("country='null'");
        }
    }
}