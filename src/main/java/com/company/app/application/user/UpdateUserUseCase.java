package com.company.app.application.user;

import com.company.app.domain.user.User;
import com.company.app.domain.user.UserRole;
import com.company.app.domain.user.UserService;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Use case for updating an existing user
 */
@Component
public class UpdateUserUseCase {
    
    private final UserService userService;
    
    public UpdateUserUseCase(UserService userService) {
        this.userService = userService;
    }
    
    public User execute(UpdateUserCommand command) {
        return userService.updateUser(
            command.id(),
            command.email(),
            command.firstName(),
            command.lastName(),
            command.role(),
            command.isActive()
        );
    }
    
    public record UpdateUserCommand(
        UUID id,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        Boolean isActive
    ) {}
}