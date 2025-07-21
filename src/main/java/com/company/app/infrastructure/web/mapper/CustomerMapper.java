package com.company.app.infrastructure.web.mapper;

import com.company.app.domain.customer.Address;
import com.company.app.domain.customer.Customer;
import com.company.app.infrastructure.web.dto.CustomerPage;
import com.company.app.infrastructure.web.dto.PageInfo;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Mapper for converting between Customer domain objects and DTOs
 */
@Component
public class CustomerMapper {
    
    public com.company.app.infrastructure.web.dto.Customer toDto(Customer customer) {
        if (customer == null) return null;
        
        var dto = new com.company.app.infrastructure.web.dto.Customer();
        dto.setId(customer.getId());
        dto.setCompanyName(customer.getCompanyName());
        dto.setContactPerson(customer.getContactPerson());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(toAddressDto(customer.getAddress()));
        dto.setIndustry(customer.getIndustry());
        dto.setStatus(com.company.app.infrastructure.web.dto.Customer.StatusEnum.fromValue(customer.getStatus().name()));
        dto.setCreatedAt(OffsetDateTime.ofInstant(customer.getCreatedAt(), ZoneOffset.UTC));
        dto.setUpdatedAt(OffsetDateTime.ofInstant(customer.getUpdatedAt(), ZoneOffset.UTC));
        return dto;
    }
    
    public com.company.app.infrastructure.web.dto.Address toAddressDto(Address address) {
        if (address == null) return null;
        
        var dto = new com.company.app.infrastructure.web.dto.Address();
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        return dto;
    }
    
    public Address toAddress(com.company.app.infrastructure.web.dto.Address addressDto) {
        if (addressDto == null) return null;
        
        return new Address(
            addressDto.getStreet(),
            addressDto.getCity(),
            addressDto.getState(),
            addressDto.getZipCode(),
            addressDto.getCountry()
        );
    }
    
    public List<com.company.app.infrastructure.web.dto.Customer> toDtoList(List<Customer> customers) {
        return customers.stream()
                .map(this::toDto)
                .toList();
    }
    
    public CustomerPage toCustomerPage(Page<Customer> page) {
        var customerPage = new CustomerPage();
        customerPage.setContent(toDtoList(page.getContent()));
        customerPage.setPage(toPageInfo(page));
        return customerPage;
    }
    
    private PageInfo toPageInfo(Page<?> page) {
        var pageInfo = new PageInfo();
        pageInfo.setNumber(page.getNumber());
        pageInfo.setSize(page.getSize());
        pageInfo.setTotalElements((int) page.getTotalElements());
        pageInfo.setTotalPages(page.getTotalPages());
        pageInfo.setFirst(page.isFirst());
        pageInfo.setLast(page.isLast());
        return pageInfo;
    }
}