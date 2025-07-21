package com.company.app.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Database configuration
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.company.app.infrastructure.persistence")
@EnableTransactionManagement
public class DatabaseConfig {
}