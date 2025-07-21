package com.company.app.application.user;

import com.company.app.domain.user.User;
import com.company.app.domain.user.UserRole;
import com.company.app.domain.user.UserService;
import org.springframework.stereotype.Component;

/**
 * Use case for creating a new user
 */
@Component
public class CreateUserUseCase {
    
    private final UserService userService;
    
    public CreateUserUseCase(UserService userService) {
        this.userService = userService;
    }
    
    public User execute(CreateUserCommand command) {
        return userService.createUser(
            command.username(),
            command.email(),
            command.firstName(),
            command.lastName(),
            command.password(),
            command.role()
        );
    }
    
    public record CreateUserCommand(
        String username,
        String email,
        String firstName,
        String lastName,
        String password,
        UserRole role
    ) {}
}