package com.company.app.application.customer;

import com.company.app.domain.customer.Address;
import com.company.app.domain.customer.Customer;
import com.company.app.domain.customer.CustomerService;
import com.company.app.domain.customer.CustomerStatus;
import org.springframework.stereotype.Component;

/**
 * Use case for creating a new customer
 */
@Component
public class CreateCustomerUseCase {
    
    private final CustomerService customerService;
    
    public CreateCustomerUseCase(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    public Customer execute(CreateCustomerCommand command) {
        return customerService.createCustomer(
            command.companyName(),
            command.contactPerson(),
            command.email(),
            command.phone(),
            command.address(),
            command.industry(),
            command.status()
        );
    }
    
    public record CreateCustomerCommand(
        String companyName,
        String contactPerson,
        String email,
        String phone,
        Address address,
        String industry,
        CustomerStatus status
    ) {}
}