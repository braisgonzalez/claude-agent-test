package com.company.app.application.user;

import com.company.app.domain.user.UserService;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Use case for deleting a user
 */
@Component
public class DeleteUserUseCase {
    
    private final UserService userService;
    
    public DeleteUserUseCase(UserService userService) {
        this.userService = userService;
    }
    
    public void execute(DeleteUserCommand command) {
        userService.deleteUser(command.id());
    }
    
    public record DeleteUserCommand(UUID id) {}
}