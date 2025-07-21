package com.company.app.infrastructure.persistence;

import com.company.app.domain.customer.Customer;
import com.company.app.domain.customer.CustomerRepository;
import com.company.app.domain.customer.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository interface for CustomerEntity
 */
@Repository
interface CustomerJpaRepositoryInterface extends JpaRepository<CustomerEntity, UUID> {
    Optional<CustomerEntity> findByEmail(String email);
    Page<CustomerEntity> findByStatus(CustomerStatus status, Pageable pageable);
    Page<CustomerEntity> findByIndustry(String industry, Pageable pageable);
    Page<CustomerEntity> findByStatusAndIndustry(CustomerStatus status, String industry, Pageable pageable);
    Page<CustomerEntity> findByCompanyNameContainingIgnoreCase(String companyName, Pageable pageable);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, UUID id);
    long countByStatus(CustomerStatus status);
}

/**
 * Implementation of CustomerRepository using JPA
 */
@Repository
public class CustomerJpaRepository implements CustomerRepository {
    
    private final CustomerJpaRepositoryInterface jpaRepository;
    
    public CustomerJpaRepository(CustomerJpaRepositoryInterface jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public Customer save(Customer customer) {
        CustomerEntity entity = jpaRepository.findById(customer.getId())
                .map(existing -> {
                    existing.updateFromDomain(customer);
                    return existing;
                })
                .orElse(new CustomerEntity(customer));
        
        CustomerEntity saved = jpaRepository.save(entity);
        return saved.toDomain();
    }
    
    @Override
    public Optional<Customer> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(CustomerEntity::toDomain);
    }
    
    @Override
    public Optional<Customer> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(CustomerEntity::toDomain);
    }
    
    @Override
    public Page<Customer> findAll(Pageable pageable) {
        return jpaRepository.findAll(pageable)
                .map(CustomerEntity::toDomain);
    }
    
    @Override
    public Page<Customer> findByStatus(CustomerStatus status, Pageable pageable) {
        return jpaRepository.findByStatus(status, pageable)
                .map(CustomerEntity::toDomain);
    }
    
    @Override
    public Page<Customer> findByIndustry(String industry, Pageable pageable) {
        return jpaRepository.findByIndustry(industry, pageable)
                .map(CustomerEntity::toDomain);
    }
    
    @Override
    public Page<Customer> findByStatusAndIndustry(CustomerStatus status, String industry, Pageable pageable) {
        return jpaRepository.findByStatusAndIndustry(status, industry, pageable)
                .map(CustomerEntity::toDomain);
    }
    
    @Override
    public Page<Customer> findByCompanyNameContainingIgnoreCase(String companyName, Pageable pageable) {
        return jpaRepository.findByCompanyNameContainingIgnoreCase(companyName, pageable)
                .map(CustomerEntity::toDomain);
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
    
    @Override
    public long countByStatus(CustomerStatus status) {
        return jpaRepository.countByStatus(status);
    }
}