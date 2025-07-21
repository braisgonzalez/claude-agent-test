package com.company.app.infrastructure.persistence;

import com.company.app.domain.customer.Address;
import com.company.app.domain.customer.Customer;
import com.company.app.domain.customer.CustomerStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA entity for Customer persistence
 */
@Entity
@Table(name = "customers", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
public class CustomerEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;
    
    @Column(name = "contact_person", nullable = false, length = 255)
    private String contactPerson;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(length = 20)
    private String phone;
    
    @Embedded
    private AddressEmbeddable address;
    
    @Column(length = 100)
    private String industry;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerStatus status;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    protected CustomerEntity() {}
    
    public CustomerEntity(Customer customer) {
        this.id = customer.getId();
        this.companyName = customer.getCompanyName();
        this.contactPerson = customer.getContactPerson();
        this.email = customer.getEmail();
        this.phone = customer.getPhone();
        this.address = customer.getAddress() != null ? new AddressEmbeddable(customer.getAddress()) : null;
        this.industry = customer.getIndustry();
        this.status = customer.getStatus();
        this.createdAt = customer.getCreatedAt();
        this.updatedAt = customer.getUpdatedAt();
    }
    
    public Customer toDomain() {
        Customer customer = new Customer();
        customer.setId(this.id);
        customer.setCompanyName(this.companyName);
        customer.setContactPerson(this.contactPerson);
        customer.setEmail(this.email);
        customer.setPhone(this.phone);
        customer.setAddress(this.address != null ? this.address.toDomain() : null);
        customer.setIndustry(this.industry);
        customer.setStatus(this.status);
        customer.setCreatedAt(this.createdAt);
        customer.setUpdatedAt(this.updatedAt);
        return customer;
    }
    
    public void updateFromDomain(Customer customer) {
        this.companyName = customer.getCompanyName();
        this.contactPerson = customer.getContactPerson();
        this.email = customer.getEmail();
        this.phone = customer.getPhone();
        this.address = customer.getAddress() != null ? new AddressEmbeddable(customer.getAddress()) : null;
        this.industry = customer.getIndustry();
        this.status = customer.getStatus();
        this.updatedAt = customer.getUpdatedAt();
    }
    
    // Getters and setters
    public UUID getId() { return id; }
    public String getCompanyName() { return companyName; }
    public String getContactPerson() { return contactPerson; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public AddressEmbeddable getAddress() { return address; }
    public String getIndustry() { return industry; }
    public CustomerStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    
    @Embeddable
    public static class AddressEmbeddable {
        @Column(name = "address_street", length = 255)
        private String street;
        
        @Column(name = "address_city", length = 100)
        private String city;
        
        @Column(name = "address_state", length = 100)
        private String state;
        
        @Column(name = "address_zip_code", length = 20)
        private String zipCode;
        
        @Column(name = "address_country", length = 100)
        private String country;
        
        protected AddressEmbeddable() {}
        
        public AddressEmbeddable(Address address) {
            this.street = address.getStreet();
            this.city = address.getCity();
            this.state = address.getState();
            this.zipCode = address.getZipCode();
            this.country = address.getCountry();
        }
        
        public Address toDomain() {
            return new Address(street, city, state, zipCode, country);
        }
        
        // Getters and setters
        public String getStreet() { return street; }
        public String getCity() { return city; }
        public String getState() { return state; }
        public String getZipCode() { return zipCode; }
        public String getCountry() { return country; }
    }
}