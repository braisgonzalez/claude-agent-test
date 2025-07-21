package com.company.app.infrastructure.web;

import com.company.app.application.user.CreateUserUseCase;
import com.company.app.application.user.DeleteUserUseCase;
import com.company.app.application.user.UpdateUserUseCase;
import com.company.app.domain.user.User;
import com.company.app.domain.user.UserRole;
import com.company.app.domain.user.UserService;
import com.company.app.infrastructure.web.api.UsersApi;
import com.company.app.infrastructure.web.dto.*;
import com.company.app.infrastructure.web.mapper.UserMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * REST controller implementing the generated UsersApi interface
 */
@RestController
@RequestMapping("/api/v1")
public class UserController implements UsersApi {
    
    private final CreateUserUseCase createUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final UserService userService;
    private final UserMapper userMapper;
    
    public UserController(CreateUserUseCase createUserUseCase,
                         UpdateUserUseCase updateUserUseCase,
                         DeleteUserUseCase deleteUserUseCase,
                         UserService userService,
                         UserMapper userMapper) {
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.userService = userService;
        this.userMapper = userMapper;
    }
    
    @Override
    public ResponseEntity<UserPage> _usersGet(Integer page, Integer size, List<String> sort) {
        Pageable pageable = createPageable(page, size, sort);
        Page<User> userPage = userService.getAllUsers(pageable);
        UserPage response = userMapper.toUserPage(userPage);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<com.company.app.infrastructure.web.dto.User> _usersPost(CreateUserRequest createUserRequest) {
        CreateUserUseCase.CreateUserCommand command = new CreateUserUseCase.CreateUserCommand(
            createUserRequest.getUsername(),
            createUserRequest.getEmail(),
            createUserRequest.getFirstName(),
            createUserRequest.getLastName(),
            createUserRequest.getPassword(),
            UserRole.valueOf(createUserRequest.getRole().getValue())
        );
        
        User createdUser = createUserUseCase.execute(command);
        com.company.app.infrastructure.web.dto.User response = userMapper.toDto(createdUser);
        
        return ResponseEntity.created(URI.create("/api/v1/users/" + createdUser.getId()))
                .body(response);
    }
    
    @Override
    public ResponseEntity<com.company.app.infrastructure.web.dto.User> _usersIdGet(UUID id) {
        User user = userService.getUserById(id);
        com.company.app.infrastructure.web.dto.User response = userMapper.toDto(user);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<com.company.app.infrastructure.web.dto.User> _usersIdPut(UUID id, UpdateUserRequest updateUserRequest) {
        UpdateUserUseCase.UpdateUserCommand command = new UpdateUserUseCase.UpdateUserCommand(
            id,
            updateUserRequest.getEmail(),
            updateUserRequest.getFirstName(),
            updateUserRequest.getLastName(),
            updateUserRequest.getRole() != null ? UserRole.valueOf(updateUserRequest.getRole().getValue()) : null,
            updateUserRequest.getIsActive()
        );
        
        User updatedUser = updateUserUseCase.execute(command);
        com.company.app.infrastructure.web.dto.User response = userMapper.toDto(updatedUser);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<Void> _usersIdDelete(UUID id) {
        DeleteUserUseCase.DeleteUserCommand command = new DeleteUserUseCase.DeleteUserCommand(id);
        deleteUserUseCase.execute(command);
        return ResponseEntity.noContent().build();
    }
    
    private Pageable createPageable(Integer page, Integer size, List<String> sort) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 20;
        
        if (sort != null && !sort.isEmpty()) {
            List<Sort.Order> orders = sort.stream()
                .map(this::parseSortString)
                .toList();
            return PageRequest.of(pageNumber, pageSize, Sort.by(orders));
        }
        
        return PageRequest.of(pageNumber, pageSize);
    }
    
    private Sort.Order parseSortString(String sortStr) {
        String[] parts = sortStr.split(",");
        String property = parts[0];
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        return new Sort.Order(direction, property);
    }
}