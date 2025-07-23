package com.company.app.domain.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@DisplayName("User Domain Entity Tests")
class UserTest {

    private User user;
    private final String username = "testuser";
    private final String email = "test@example.com";
    private final String firstName = "John";
    private final String lastName = "Doe";
    private final String passwordHash = "hashedPassword";
    private final UserRole role = UserRole.USER;

    @BeforeEach
    void setUp() {
        user = new User(username, email, firstName, lastName, passwordHash, role);
    }

    @Nested
    @DisplayName("Constructor Tests")
    class ConstructorTests {

        @Test
        @DisplayName("should_CreateUserWithDefaultValues_When_UsingNoArgsConstructor")
        void should_CreateUserWithDefaultValues_When_UsingNoArgsConstructor() {
            // Arrange & Act
            User user = new User();

            // Assert
            assertThat(user.getId()).isNotNull();
            assertThat(user.isActive()).isTrue();
            assertThat(user.getCreatedAt()).isNotNull();
            assertThat(user.getUpdatedAt()).isNotNull();
            assertThat(user.getCreatedAt()).isBeforeOrEqualTo(user.getUpdatedAt());
        }

        @Test
        @DisplayName("should_CreateUserWithAllProperties_When_UsingParameterizedConstructor")
        void should_CreateUserWithAllProperties_When_UsingParameterizedConstructor() {
            // Arrange & Act
            User user = new User(username, email, firstName, lastName, passwordHash, role);

            // Assert
            assertThat(user.getId()).isNotNull();
            assertThat(user.getUsername()).isEqualTo(username);
            assertThat(user.getEmail()).isEqualTo(email);
            assertThat(user.getFirstName()).isEqualTo(firstName);
            assertThat(user.getLastName()).isEqualTo(lastName);
            assertThat(user.getPasswordHash()).isEqualTo(passwordHash);
            assertThat(user.getRole()).isEqualTo(role);
            assertThat(user.isActive()).isTrue();
            assertThat(user.getCreatedAt()).isNotNull();
            assertThat(user.getUpdatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should_GenerateUniqueIds_When_CreatingMultipleUsers")
        void should_GenerateUniqueIds_When_CreatingMultipleUsers() {
            // Arrange & Act
            User user1 = new User();
            User user2 = new User();

            // Assert
            assertThat(user1.getId()).isNotEqualTo(user2.getId());
        }
    }

    @Nested
    @DisplayName("Profile Update Tests")
    class ProfileUpdateTests {

        @Test
        @DisplayName("should_UpdateAllFields_When_AllParametersProvided")
        void should_UpdateAllFields_When_AllParametersProvided() {
            // Arrange
            String newEmail = "newemail@example.com";
            String newFirstName = "Jane";
            String newLastName = "Smith";
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.updateProfile(newEmail, newFirstName, newLastName);

            // Assert
            assertThat(user.getEmail()).isEqualTo(newEmail);
            assertThat(user.getFirstName()).isEqualTo(newFirstName);
            assertThat(user.getLastName()).isEqualTo(newLastName);
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateOnlyProvidedFields_When_SomeParametersNull")
        void should_UpdateOnlyProvidedFields_When_SomeParametersNull() {
            // Arrange
            String newEmail = "newemail@example.com";
            String originalFirstName = user.getFirstName();
            String originalLastName = user.getLastName();

            // Act
            user.updateProfile(newEmail, null, null);

            // Assert
            assertThat(user.getEmail()).isEqualTo(newEmail);
            assertThat(user.getFirstName()).isEqualTo(originalFirstName);
            assertThat(user.getLastName()).isEqualTo(originalLastName);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_UpdateProfileCalled")
        void should_UpdateTimestamp_When_UpdateProfileCalled() {
            // Arrange
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.updateProfile("new@example.com", "New", "Name");

            // Assert
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Role Management Tests")
    class RoleManagementTests {

        @Test
        @DisplayName("should_UpdateRole_When_NewRoleProvided")
        void should_UpdateRole_When_NewRoleProvided() {
            // Arrange
            UserRole newRole = UserRole.ADMIN;
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.updateRole(newRole);

            // Assert
            assertThat(user.getRole()).isEqualTo(newRole);
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_RoleUpdated")
        void should_UpdateTimestamp_When_RoleUpdated() {
            // Arrange
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.updateRole(UserRole.ADMIN);

            // Assert
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Activation/Deactivation Tests")
    class ActivationTests {

        @Test
        @DisplayName("should_ActivateUser_When_ActivateCalled")
        void should_ActivateUser_When_ActivateCalled() {
            // Arrange
            user.setActive(false);
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.activate();

            // Assert
            assertThat(user.isActive()).isTrue();
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_DeactivateUser_When_DeactivateCalled")
        void should_DeactivateUser_When_DeactivateCalled() {
            // Arrange
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.deactivate();

            // Assert
            assertThat(user.isActive()).isFalse();
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_StatusChanged")
        void should_UpdateTimestamp_When_StatusChanged() {
            // Arrange
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.deactivate();

            // Assert
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Password Management Tests")
    class PasswordManagementTests {

        @Test
        @DisplayName("should_UpdatePassword_When_NewPasswordProvided")
        void should_UpdatePassword_When_NewPasswordProvided() {
            // Arrange
            String newPasswordHash = "newHashedPassword";
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.changePassword(newPasswordHash);

            // Assert
            assertThat(user.getPasswordHash()).isEqualTo(newPasswordHash);
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }

        @Test
        @DisplayName("should_UpdateTimestamp_When_PasswordChanged")
        void should_UpdateTimestamp_When_PasswordChanged() {
            // Arrange
            Instant originalUpdatedAt = user.getUpdatedAt();

            // Act
            user.changePassword("newHash");

            // Assert
            assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
        }
    }

    @Nested
    @DisplayName("Getter Tests")
    class GetterTests {

        @Test
        @DisplayName("should_ReturnCorrectValues_When_GettersUsed")
        void should_ReturnCorrectValues_When_GettersUsed() {
            // Assert
            assertThat(user.getUsername()).isEqualTo(username);
            assertThat(user.getEmail()).isEqualTo(email);
            assertThat(user.getFirstName()).isEqualTo(firstName);
            assertThat(user.getLastName()).isEqualTo(lastName);
            assertThat(user.getPasswordHash()).isEqualTo(passwordHash);
            assertThat(user.getRole()).isEqualTo(role);
            assertThat(user.isActive()).isTrue();
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
            String newUsername = "newuser";
            String newEmail = "new@example.com";
            String newFirstName = "Jane";
            String newLastName = "Smith";
            String newPasswordHash = "newHash";
            UserRole newRole = UserRole.ADMIN;
            boolean newActive = false;
            Instant newCreatedAt = Instant.now().minusSeconds(3600);
            Instant newUpdatedAt = Instant.now().minusSeconds(1800);

            // Act
            user.setId(newId);
            user.setUsername(newUsername);
            user.setEmail(newEmail);
            user.setFirstName(newFirstName);
            user.setLastName(newLastName);
            user.setPasswordHash(newPasswordHash);
            user.setRole(newRole);
            user.setActive(newActive);
            user.setCreatedAt(newCreatedAt);
            user.setUpdatedAt(newUpdatedAt);

            // Assert
            assertThat(user.getId()).isEqualTo(newId);
            assertThat(user.getUsername()).isEqualTo(newUsername);
            assertThat(user.getEmail()).isEqualTo(newEmail);
            assertThat(user.getFirstName()).isEqualTo(newFirstName);
            assertThat(user.getLastName()).isEqualTo(newLastName);
            assertThat(user.getPasswordHash()).isEqualTo(newPasswordHash);
            assertThat(user.getRole()).isEqualTo(newRole);
            assertThat(user.isActive()).isEqualTo(newActive);
            assertThat(user.getCreatedAt()).isEqualTo(newCreatedAt);
            assertThat(user.getUpdatedAt()).isEqualTo(newUpdatedAt);
        }
    }
}