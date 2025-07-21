package com.company.app.domain.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * User domain service containing business logic
 */
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User createUser(String username, String email, String firstName, 
                          String lastName, String password, UserRole role) {
        
        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username already exists: " + username);
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists: " + email);
        }
        
        String passwordHash = passwordEncoder.encode(password);
        User user = new User(username, email, firstName, lastName, passwordHash, role);
        
        return userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }
    
    @Transactional(readOnly = true)
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    public User updateUser(UUID id, String email, String firstName, String lastName, UserRole role, Boolean isActive) {
        User user = getUserById(id);
        
        if (email != null && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(email, id)) {
                throw new UserAlreadyExistsException("Email already exists: " + email);
            }
        }
        
        user.updateProfile(email, firstName, lastName);
        
        if (role != null) {
            user.updateRole(role);
        }
        
        if (isActive != null) {
            if (isActive) {
                user.activate();
            } else {
                user.deactivate();
            }
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(UUID id) {
        if (!userRepository.findById(id).isPresent()) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    public void changePassword(UUID id, String newPassword) {
        User user = getUserById(id);
        String newPasswordHash = passwordEncoder.encode(newPassword);
        user.changePassword(newPasswordHash);
        userRepository.save(user);
    }
}