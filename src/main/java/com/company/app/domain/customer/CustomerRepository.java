package com.company.app.domain.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

/**
 * Customer repository port (interface) following hexagonal architecture
 */
public interface CustomerRepository {
    
    Customer save(Customer customer);
    
    Optional<Customer> findById(UUID id);
    
    Optional<Customer> findByEmail(String email);
    
    Page<Customer> findAll(Pageable pageable);
    
    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);
    
    Page<Customer> findByIndustry(String industry, Pageable pageable);
    
    Page<Customer> findByStatusAndIndustry(CustomerStatus status, String industry, Pageable pageable);
    
    Page<Customer> findByCompanyNameContainingIgnoreCase(String companyName, Pageable pageable);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndIdNot(String email, UUID id);
    
    void deleteById(UUID id);
    
    long count();
    
    long countByStatus(CustomerStatus status);
}