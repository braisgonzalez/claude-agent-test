package com.company.app.infrastructure.web;

import com.company.app.application.customer.CreateCustomerUseCase;
import com.company.app.application.customer.DeleteCustomerUseCase;
import com.company.app.application.customer.UpdateCustomerUseCase;
import com.company.app.domain.customer.Customer;
import com.company.app.domain.customer.CustomerService;
import com.company.app.domain.customer.CustomerStatus;
import com.company.app.infrastructure.web.api.CustomersApi;
import com.company.app.infrastructure.web.dto.*;
import com.company.app.infrastructure.web.mapper.CustomerMapper;
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
 * REST controller implementing the generated CustomersApi interface
 */
@RestController
@RequestMapping("/api/v1")
public class CustomerController implements CustomersApi {
    
    private final CreateCustomerUseCase createCustomerUseCase;
    private final UpdateCustomerUseCase updateCustomerUseCase;
    private final DeleteCustomerUseCase deleteCustomerUseCase;
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;
    
    public CustomerController(CreateCustomerUseCase createCustomerUseCase,
                            UpdateCustomerUseCase updateCustomerUseCase,
                            DeleteCustomerUseCase deleteCustomerUseCase,
                            CustomerService customerService,
                            CustomerMapper customerMapper) {
        this.createCustomerUseCase = createCustomerUseCase;
        this.updateCustomerUseCase = updateCustomerUseCase;
        this.deleteCustomerUseCase = deleteCustomerUseCase;
        this.customerService = customerService;
        this.customerMapper = customerMapper;
    }
    
    @Override
    public ResponseEntity<CustomerPage> _customersGet(Integer page, Integer size, List<String> sort, String status, String industry) {
        Pageable pageable = createPageable(page, size, sort);
        Page<Customer> customerPage;
        
        if (status != null && industry != null) {
            CustomerStatus customerStatus = CustomerStatus.valueOf(status);
            customerPage = customerService.getCustomersByStatusAndIndustry(customerStatus, industry, pageable);
        } else if (status != null) {
            CustomerStatus customerStatus = CustomerStatus.valueOf(status);
            customerPage = customerService.getCustomersByStatus(customerStatus, pageable);
        } else if (industry != null) {
            customerPage = customerService.getCustomersByIndustry(industry, pageable);
        } else {
            customerPage = customerService.getAllCustomers(pageable);
        }
        
        CustomerPage response = customerMapper.toCustomerPage(customerPage);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<com.company.app.infrastructure.web.dto.Customer> _customersPost(CreateCustomerRequest createCustomerRequest) {
        CreateCustomerUseCase.CreateCustomerCommand command = new CreateCustomerUseCase.CreateCustomerCommand(
            createCustomerRequest.getCompanyName(),
            createCustomerRequest.getContactPerson(),
            createCustomerRequest.getEmail(),
            createCustomerRequest.getPhone(),
            customerMapper.toAddress(createCustomerRequest.getAddress()),
            createCustomerRequest.getIndustry(),
            createCustomerRequest.getStatus() != null ? 
                CustomerStatus.valueOf(createCustomerRequest.getStatus().getValue()) : 
                CustomerStatus.PROSPECT
        );
        
        Customer createdCustomer = createCustomerUseCase.execute(command);
        com.company.app.infrastructure.web.dto.Customer response = customerMapper.toDto(createdCustomer);
        
        return ResponseEntity.created(URI.create("/api/v1/customers/" + createdCustomer.getId()))
                .body(response);
    }
    
    @Override
    public ResponseEntity<com.company.app.infrastructure.web.dto.Customer> _customersIdGet(UUID id) {
        Customer customer = customerService.getCustomerById(id);
        com.company.app.infrastructure.web.dto.Customer response = customerMapper.toDto(customer);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<com.company.app.infrastructure.web.dto.Customer> _customersIdPut(UUID id, UpdateCustomerRequest updateCustomerRequest) {
        UpdateCustomerUseCase.UpdateCustomerCommand command = new UpdateCustomerUseCase.UpdateCustomerCommand(
            id,
            updateCustomerRequest.getCompanyName(),
            updateCustomerRequest.getContactPerson(),
            updateCustomerRequest.getEmail(),
            updateCustomerRequest.getPhone(),
            updateCustomerRequest.getAddress() != null ? 
                customerMapper.toAddress(updateCustomerRequest.getAddress()) : null,
            updateCustomerRequest.getIndustry(),
            updateCustomerRequest.getStatus() != null ? 
                CustomerStatus.valueOf(updateCustomerRequest.getStatus().getValue()) : null
        );
        
        Customer updatedCustomer = updateCustomerUseCase.execute(command);
        com.company.app.infrastructure.web.dto.Customer response = customerMapper.toDto(updatedCustomer);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<Void> _customersIdDelete(UUID id) {
        DeleteCustomerUseCase.DeleteCustomerCommand command = new DeleteCustomerUseCase.DeleteCustomerCommand(id);
        deleteCustomerUseCase.execute(command);
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