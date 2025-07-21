package com.company.app.domain.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

/**
 * User repository port (interface) following hexagonal architecture
 */
public interface UserRepository {
    
    User save(User user);
    
    Optional<User> findById(UUID id);
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Page<User> findAll(Pageable pageable);
    
    Page<User> findByRole(UserRole role, Pageable pageable);
    
    Page<User> findByIsActive(boolean isActive, Pageable pageable);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndIdNot(String email, UUID id);
    
    void deleteById(UUID id);
    
    long count();
}