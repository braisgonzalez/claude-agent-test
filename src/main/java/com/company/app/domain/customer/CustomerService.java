package com.company.app.domain.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Customer domain service containing business logic
 */
@Service
@Transactional
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    public Customer createCustomer(String companyName, String contactPerson, String email, 
                                 String phone, Address address, String industry, CustomerStatus status) {
        
        if (customerRepository.existsByEmail(email)) {
            throw new CustomerAlreadyExistsException("Customer with email already exists: " + email);
        }
        
        Customer customer = new Customer(companyName, contactPerson, email, address);
        customer.updateBasicInfo(companyName, contactPerson, email, phone);
        customer.updateIndustry(industry);
        if (status != null) {
            customer.updateStatus(status);
        }
        
        return customerRepository.save(customer);
    }
    
    @Transactional(readOnly = true)
    public Customer getCustomerById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with email: " + email));
    }
    
    @Transactional(readOnly = true)
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Customer> getCustomersByStatus(CustomerStatus status, Pageable pageable) {
        return customerRepository.findByStatus(status, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Customer> getCustomersByIndustry(String industry, Pageable pageable) {
        return customerRepository.findByIndustry(industry, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Customer> getCustomersByStatusAndIndustry(CustomerStatus status, String industry, Pageable pageable) {
        return customerRepository.findByStatusAndIndustry(status, industry, pageable);
    }
    
    public Customer updateCustomer(UUID id, String companyName, String contactPerson, String email, 
                                 String phone, Address address, String industry, CustomerStatus status) {
        Customer customer = getCustomerById(id);
        
        if (email != null && !email.equals(customer.getEmail())) {
            if (customerRepository.existsByEmailAndIdNot(email, id)) {
                throw new CustomerAlreadyExistsException("Email already exists: " + email);
            }
        }
        
        customer.updateBasicInfo(companyName, contactPerson, email, phone);
        
        if (address != null) {
            customer.updateAddress(address);
        }
        
        if (industry != null) {
            customer.updateIndustry(industry);
        }
        
        if (status != null) {
            customer.updateStatus(status);
        }
        
        return customerRepository.save(customer);
    }
    
    public void deleteCustomer(UUID id) {
        if (!customerRepository.findById(id).isPresent()) {
            throw new CustomerNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
    
    public Customer activateCustomer(UUID id) {
        Customer customer = getCustomerById(id);
        customer.activate();
        return customerRepository.save(customer);
    }
    
    public Customer deactivateCustomer(UUID id) {
        Customer customer = getCustomerById(id);
        customer.deactivate();
        return customerRepository.save(customer);
    }
}