package com.company.app.infrastructure.web.mapper;

import com.company.app.domain.user.User;
import com.company.app.infrastructure.web.dto.PageInfo;
import com.company.app.infrastructure.web.dto.UserPage;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Mapper for converting between User domain objects and DTOs
 */
@Component
public class UserMapper {
    
    public com.company.app.infrastructure.web.dto.User toDto(User user) {
        if (user == null) return null;
        
        var dto = new com.company.app.infrastructure.web.dto.User();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(com.company.app.infrastructure.web.dto.User.RoleEnum.fromValue(user.getRole().name()));
        dto.setIsActive(user.isActive());
        dto.setCreatedAt(OffsetDateTime.ofInstant(user.getCreatedAt(), ZoneOffset.UTC));
        dto.setUpdatedAt(OffsetDateTime.ofInstant(user.getUpdatedAt(), ZoneOffset.UTC));
        return dto;
    }
    
    public List<com.company.app.infrastructure.web.dto.User> toDtoList(List<User> users) {
        return users.stream()
                .map(this::toDto)
                .toList();
    }
    
    public UserPage toUserPage(Page<User> page) {
        var userPage = new UserPage();
        userPage.setContent(toDtoList(page.getContent()));
        userPage.setPage(toPageInfo(page));
        return userPage;
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