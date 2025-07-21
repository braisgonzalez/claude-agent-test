# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository contains a complete Java Spring Boot backend application implementing hexagonal architecture with API First approach for user and customer management.

## Architecture

This is a full-featured Spring Boot application that contains:
- **Hexagonal Architecture**: Domain, Application, and Infrastructure layers
- **API First Approach**: OpenAPI-driven development with code generation
- **Database Layer**: PostgreSQL with Flyway migrations
- **Web Layer**: REST controllers implementing generated API interfaces
- **Testing**: Unit and integration tests with H2 for testing

### Technology Stack
- Java 17+
- Spring Boot 3.x
- PostgreSQL (production) / H2 (testing)
- Flyway for database migrations
- OpenAPI 3.0 with code generation
- Maven for build management

## Claude Code Configuration

The repository has specific permissions configured in `.claude/settings.local.json`:
- Allowed: `Bash(find:*)`, `Bash(ls:*)`, `Bash(tree:*)`
- No denied permissions

## Development Commands

### Build and Test
- `mvn clean compile` - Compile the application and generate OpenAPI code
- `mvn test` - Run all tests
- `mvn clean install` - Full build with tests

### Database
- PostgreSQL required for production (configured in application.yml)
- H2 used automatically for tests
- Flyway migrations in `src/main/resources/db/migration/`

### API Documentation
- OpenAPI specification: `src/main/resources/api/openapi.yaml`
- Swagger UI available at: `http://localhost:8080/swagger-ui.html` (when running)
- Generated code in: `target/generated-sources/openapi/`

## Git Workflow

- Main branch: `main`
- Repository implements issue #1: Java Spring Boot Backend with Hexagonal Architecture
- Standard Git operations available for testing Claude Code git integration

## Project Structure

```
src/main/java/com/company/app/
├── domain/                 # Domain layer (entities, repositories, services)
│   ├── user/              # User domain
│   └── customer/          # Customer domain
├── application/           # Application layer (use cases)
│   ├── user/
│   └── customer/
└── infrastructure/        # Infrastructure layer
    ├── web/               # Controllers, DTOs, mappers
    ├── persistence/       # JPA entities and repositories
    └── config/            # Configuration classes
```

## API Endpoints

### Users API
- `GET /api/v1/users` - List users with pagination
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Customers API  
- `GET /api/v1/customers` - List customers with pagination and filtering
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers/{id}` - Get customer by ID
- `PUT /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Delete customer