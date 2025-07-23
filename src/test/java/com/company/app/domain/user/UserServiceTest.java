package com.company.app.domain.user;

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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Domain Service Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private final UUID userId = UUID.randomUUID();
    private final String username = "testuser";
    private final String email = "test@example.com";
    private final String firstName = "John";
    private final String lastName = "Doe";
    private final String password = "password123";
    private final String encodedPassword = "encodedPassword123";
    private final UserRole role = UserRole.USER;

    @BeforeEach
    void setUp() {
        testUser = new User(username, email, firstName, lastName, encodedPassword, role);
        testUser.setId(userId);
    }

    @Nested
    @DisplayName("Create User Tests")
    class CreateUserTests {

        @Test
        @DisplayName("should_CreateUser_When_ValidDataProvided")
        void should_CreateUser_When_ValidDataProvided() {
            // Arrange
            when(userRepository.existsByUsername(username)).thenReturn(false);
            when(userRepository.existsByEmail(email)).thenReturn(false);
            when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            User result = userService.createUser(username, email, firstName, lastName, password, role);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo(username);
            assertThat(result.getEmail()).isEqualTo(email);
            assertThat(result.getFirstName()).isEqualTo(firstName);
            assertThat(result.getLastName()).isEqualTo(lastName);
            assertThat(result.getPasswordHash()).isEqualTo(encodedPassword);
            assertThat(result.getRole()).isEqualTo(role);

            verify(userRepository).existsByUsername(username);
            verify(userRepository).existsByEmail(email);
            verify(passwordEncoder).encode(password);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("should_ThrowException_When_UsernameAlreadyExists")
        void should_ThrowException_When_UsernameAlreadyExists() {
            // Arrange
            when(userRepository.existsByUsername(username)).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> userService.createUser(username, email, firstName, lastName, password, role))
                    .isInstanceOf(UserAlreadyExistsException.class)
                    .hasMessage("Username already exists: " + username);

            verify(userRepository).existsByUsername(username);
            verify(userRepository, never()).existsByEmail(anyString());
            verify(passwordEncoder, never()).encode(anyString());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("should_ThrowException_When_EmailAlreadyExists")
        void should_ThrowException_When_EmailAlreadyExists() {
            // Arrange
            when(userRepository.existsByUsername(username)).thenReturn(false);
            when(userRepository.existsByEmail(email)).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> userService.createUser(username, email, firstName, lastName, password, role))
                    .isInstanceOf(UserAlreadyExistsException.class)
                    .hasMessage("Email already exists: " + email);

            verify(userRepository).existsByUsername(username);
            verify(userRepository).existsByEmail(email);
            verify(passwordEncoder, never()).encode(anyString());
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Get User Tests")
    class GetUserTests {

        @Test
        @DisplayName("should_ReturnUser_When_UserExistsById")
        void should_ReturnUser_When_UserExistsById() {
            // Arrange
            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            // Act
            User result = userService.getUserById(userId);

            // Assert
            assertThat(result).isEqualTo(testUser);
            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("should_ThrowException_When_UserNotFoundById")
        void should_ThrowException_When_UserNotFoundById() {
            // Arrange
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.getUserById(userId))
                    .isInstanceOf(UserNotFoundException.class)
                    .hasMessage("User not found with id: " + userId);

            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("should_ReturnUser_When_UserExistsByUsername")
        void should_ReturnUser_When_UserExistsByUsername() {
            // Arrange
            when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

            // Act
            User result = userService.getUserByUsername(username);

            // Assert
            assertThat(result).isEqualTo(testUser);
            verify(userRepository).findByUsername(username);
        }

        @Test
        @DisplayName("should_ThrowException_When_UserNotFoundByUsername")
        void should_ThrowException_When_UserNotFoundByUsername() {
            // Arrange
            when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.getUserByUsername(username))
                    .isInstanceOf(UserNotFoundException.class)
                    .hasMessage("User not found with username: " + username);

            verify(userRepository).findByUsername(username);
        }

        @Test
        @DisplayName("should_ReturnPagedUsers_When_GetAllUsersCalled")
        void should_ReturnPagedUsers_When_GetAllUsersCalled() {
            // Arrange
            Pageable pageable = PageRequest.of(0, 10);
            List<User> users = List.of(testUser);
            Page<User> expectedPage = new PageImpl<>(users, pageable, 1);
            when(userRepository.findAll(pageable)).thenReturn(expectedPage);

            // Act
            Page<User> result = userService.getAllUsers(pageable);

            // Assert
            assertThat(result).isEqualTo(expectedPage);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0)).isEqualTo(testUser);
            verify(userRepository).findAll(pageable);
        }
    }

    @Nested
    @DisplayName("Update User Tests")
    class UpdateUserTests {

        @Test
        @DisplayName("should_UpdateUserProfile_When_ValidDataProvided")
        void should_UpdateUserProfile_When_ValidDataProvided() {
            // Arrange
            String newEmail = "newemail@example.com";
            String newFirstName = "Jane";
            String newLastName = "Smith";
            UserRole newRole = UserRole.ADMIN;
            Boolean newActive = false;

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmailAndIdNot(newEmail, userId)).thenReturn(false);
            when(userRepository.save(testUser)).thenReturn(testUser);

            // Act
            User result = userService.updateUser(userId, newEmail, newFirstName, newLastName, newRole, newActive);

            // Assert
            assertThat(result).isEqualTo(testUser);
            verify(userRepository).findById(userId);
            verify(userRepository).existsByEmailAndIdNot(newEmail, userId);
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("should_UpdateOnlyProvidedFields_When_SomeParametersNull")
        void should_UpdateOnlyProvidedFields_When_SomeParametersNull() {
            // Arrange
            String newEmail = "newemail@example.com";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmailAndIdNot(newEmail, userId)).thenReturn(false);
            when(userRepository.save(testUser)).thenReturn(testUser);

            // Act
            User result = userService.updateUser(userId, newEmail, null, null, null, null);

            // Assert
            assertThat(result).isEqualTo(testUser);
            verify(userRepository).findById(userId);
            verify(userRepository).existsByEmailAndIdNot(newEmail, userId);
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("should_ThrowException_When_EmailAlreadyExistsForDifferentUser")
        void should_ThrowException_When_EmailAlreadyExistsForDifferentUser() {
            // Arrange
            String newEmail = "existing@example.com";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmailAndIdNot(newEmail, userId)).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> userService.updateUser(userId, newEmail, null, null, null, null))
                    .isInstanceOf(UserAlreadyExistsException.class)
                    .hasMessage("Email already exists: " + newEmail);

            verify(userRepository).findById(userId);
            verify(userRepository).existsByEmailAndIdNot(newEmail, userId);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("should_NotCheckEmailUniqueness_When_EmailUnchanged")
        void should_NotCheckEmailUniqueness_When_EmailUnchanged() {
            // Arrange
            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.save(testUser)).thenReturn(testUser);

            // Act
            User result = userService.updateUser(userId, email, null, null, null, null);

            // Assert
            assertThat(result).isEqualTo(testUser);
            verify(userRepository).findById(userId);
            verify(userRepository, never()).existsByEmailAndIdNot(anyString(), any(UUID.class));
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("should_ThrowException_When_UserNotFoundForUpdate")
        void should_ThrowException_When_UserNotFoundForUpdate() {
            // Arrange
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.updateUser(userId, "new@example.com", null, null, null, null))
                    .isInstanceOf(UserNotFoundException.class)
                    .hasMessage("User not found with id: " + userId);

            verify(userRepository).findById(userId);
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Delete User Tests")
    class DeleteUserTests {

        @Test
        @DisplayName("should_DeleteUser_When_UserExists")
        void should_DeleteUser_When_UserExists() {
            // Arrange
            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            // Act
            userService.deleteUser(userId);

            // Assert
            verify(userRepository).findById(userId);
            verify(userRepository).deleteById(userId);
        }

        @Test
        @DisplayName("should_ThrowException_When_UserNotFoundForDeletion")
        void should_ThrowException_When_UserNotFoundForDeletion() {
            // Arrange
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.deleteUser(userId))
                    .isInstanceOf(UserNotFoundException.class)
                    .hasMessage("User not found with id: " + userId);

            verify(userRepository).findById(userId);
            verify(userRepository, never()).deleteById(any(UUID.class));
        }
    }

    @Nested
    @DisplayName("Change Password Tests")
    class ChangePasswordTests {

        @Test
        @DisplayName("should_ChangePassword_When_UserExistsAndValidPasswordProvided")
        void should_ChangePassword_When_UserExistsAndValidPasswordProvided() {
            // Arrange
            String newPassword = "newPassword123";
            String newEncodedPassword = "newEncodedPassword123";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.encode(newPassword)).thenReturn(newEncodedPassword);
            when(userRepository.save(testUser)).thenReturn(testUser);

            // Act
            userService.changePassword(userId, newPassword);

            // Assert
            verify(userRepository).findById(userId);
            verify(passwordEncoder).encode(newPassword);
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("should_ThrowException_When_UserNotFoundForPasswordChange")
        void should_ThrowException_When_UserNotFoundForPasswordChange() {
            // Arrange
            String newPassword = "newPassword123";
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.changePassword(userId, newPassword))
                    .isInstanceOf(UserNotFoundException.class)
                    .hasMessage("User not found with id: " + userId);

            verify(userRepository).findById(userId);
            verify(passwordEncoder, never()).encode(anyString());
            verify(userRepository, never()).save(any(User.class));
        }
    }
}