package com.company.app.application.customer;

import com.company.app.domain.customer.CustomerService;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Use case for deleting a customer
 */
@Component
public class DeleteCustomerUseCase {
    
    private final CustomerService customerService;
    
    public DeleteCustomerUseCase(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    public void execute(DeleteCustomerCommand command) {
        customerService.deleteCustomer(command.id());
    }
    
    public record DeleteCustomerCommand(UUID id) {}
}