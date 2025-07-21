package com.company.app.application.customer;

import com.company.app.domain.customer.Address;
import com.company.app.domain.customer.Customer;
import com.company.app.domain.customer.CustomerService;
import com.company.app.domain.customer.CustomerStatus;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Use case for updating an existing customer
 */
@Component
public class UpdateCustomerUseCase {
    
    private final CustomerService customerService;
    
    public UpdateCustomerUseCase(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    public Customer execute(UpdateCustomerCommand command) {
        return customerService.updateCustomer(
            command.id(),
            command.companyName(),
            command.contactPerson(),
            command.email(),
            command.phone(),
            command.address(),
            command.industry(),
            command.status()
        );
    }
    
    public record UpdateCustomerCommand(
        UUID id,
        String companyName,
        String contactPerson,
        String email,
        String phone,
        Address address,
        String industry,
        CustomerStatus status
    ) {}
}