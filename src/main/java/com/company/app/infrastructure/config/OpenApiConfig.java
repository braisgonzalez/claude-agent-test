package com.company.app.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI configuration for Swagger UI
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("User Management API")
                        .description("API for managing users and customers with hexagonal architecture")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Development Team")
                                .email("dev@company.com")))
                .addServersItem(new Server()
                        .url("https://d31mot4ub2zsod.cloudfront.net")
                        .description("Production server"))
                .addServersItem(new Server()
                        .url("http://localhost:8080")
                        .description("Development server"))
                .components(new Components()
                        .addSecuritySchemes("BasicAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("basic")
                                .description("Basic Authentication with username and password")))
                .addSecurityItem(new SecurityRequirement().addList("BasicAuth"));
    }
}