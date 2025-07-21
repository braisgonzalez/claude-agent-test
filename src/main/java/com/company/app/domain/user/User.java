package com.company.app.domain.user;

import java.time.Instant;
import java.util.UUID;

/**
 * User domain entity following DDD principles
 */
public class User {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String passwordHash;
    private UserRole role;
    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

    public User() {
        this.id = UUID.randomUUID();
        this.isActive = true;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public User(String username, String email, String firstName, String lastName, 
                String passwordHash, UserRole role) {
        this();
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public void updateProfile(String email, String firstName, String lastName) {
        if (email != null) this.email = email;
        if (firstName != null) this.firstName = firstName;
        if (lastName != null) this.lastName = lastName;
        this.updatedAt = Instant.now();
    }

    public void updateRole(UserRole role) {
        this.role = role;
        this.updatedAt = Instant.now();
    }

    public void activate() {
        this.isActive = true;
        this.updatedAt = Instant.now();
    }

    public void deactivate() {
        this.isActive = false;
        this.updatedAt = Instant.now();
    }

    public void changePassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
        this.updatedAt = Instant.now();
    }

    // Getters
    public UUID getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPasswordHash() { return passwordHash; }
    public UserRole getRole() { return role; }
    public boolean isActive() { return isActive; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // Public setters for persistence (accessible from infrastructure layer)
    public void setId(UUID id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setRole(UserRole role) { this.role = role; }
    public void setActive(boolean active) { this.isActive = active; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}