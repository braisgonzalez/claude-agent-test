package com.company.app.domain.customer;

import java.time.Instant;
import java.util.UUID;

/**
 * Customer domain entity following DDD principles
 */
public class Customer {
    private UUID id;
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private Address address;
    private String industry;
    private CustomerStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public Customer() {
        this.id = UUID.randomUUID();
        this.status = CustomerStatus.PROSPECT;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Customer(String companyName, String contactPerson, String email, 
                   Address address) {
        this();
        this.companyName = companyName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.address = address;
    }

    public void updateBasicInfo(String companyName, String contactPerson, String email, String phone) {
        if (companyName != null) this.companyName = companyName;
        if (contactPerson != null) this.contactPerson = contactPerson;
        if (email != null) this.email = email;
        if (phone != null) this.phone = phone;
        this.updatedAt = Instant.now();
    }

    public void updateAddress(Address address) {
        this.address = address;
        this.updatedAt = Instant.now();
    }

    public void updateIndustry(String industry) {
        this.industry = industry;
        this.updatedAt = Instant.now();
    }

    public void updateStatus(CustomerStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public void activate() {
        this.status = CustomerStatus.ACTIVE;
        this.updatedAt = Instant.now();
    }

    public void deactivate() {
        this.status = CustomerStatus.INACTIVE;
        this.updatedAt = Instant.now();
    }

    public void convertToCustomer() {
        this.status = CustomerStatus.ACTIVE;
        this.updatedAt = Instant.now();
    }

    // Getters
    public UUID getId() { return id; }
    public String getCompanyName() { return companyName; }
    public String getContactPerson() { return contactPerson; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Address getAddress() { return address; }
    public String getIndustry() { return industry; }
    public CustomerStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // Public setters for persistence (accessible from infrastructure layer)
    public void setId(UUID id) { this.id = id; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAddress(Address address) { this.address = address; }
    public void setIndustry(String industry) { this.industry = industry; }
    public void setStatus(CustomerStatus status) { this.status = status; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}