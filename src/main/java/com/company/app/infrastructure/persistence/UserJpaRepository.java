package com.company.app.infrastructure.persistence;

import com.company.app.domain.user.User;
import com.company.app.domain.user.UserRepository;
import com.company.app.domain.user.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository interface for UserEntity
 */
@Repository
interface UserJpaRepositoryInterface extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    Page<UserEntity> findByRole(UserRole role, Pageable pageable);
    Page<UserEntity> findByIsActive(boolean isActive, Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, UUID id);
}

/**
 * Implementation of UserRepository using JPA
 */
@Repository
public class UserJpaRepository implements UserRepository {
    
    private final UserJpaRepositoryInterface jpaRepository;
    
    public UserJpaRepository(UserJpaRepositoryInterface jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public User save(User user) {
        UserEntity entity = jpaRepository.findById(user.getId())
                .map(existing -> {
                    existing.updateFromDomain(user);
                    return existing;
                })
                .orElse(new UserEntity(user));
        
        UserEntity saved = jpaRepository.save(entity);
        return saved.toDomain();
    }
    
    @Override
    public Optional<User> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(UserEntity::toDomain);
    }
    
    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepository.findByUsername(username)
                .map(UserEntity::toDomain);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(UserEntity::toDomain);
    }
    
    @Override
    public Page<User> findAll(Pageable pageable) {
        return jpaRepository.findAll(pageable)
                .map(UserEntity::toDomain);
    }
    
    @Override
    public Page<User> findByRole(UserRole role, Pageable pageable) {
        return jpaRepository.findByRole(role, pageable)
                .map(UserEntity::toDomain);
    }
    
    @Override
    public Page<User> findByIsActive(boolean isActive, Pageable pageable) {
        return jpaRepository.findByIsActive(isActive, pageable)
                .map(UserEntity::toDomain);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
    
    @Override
    public boolean existsByEmailAndIdNot(String email, UUID id) {
        return jpaRepository.existsByEmailAndIdNot(email, id);
    }
    
    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public long count() {
        return jpaRepository.count();
    }
}