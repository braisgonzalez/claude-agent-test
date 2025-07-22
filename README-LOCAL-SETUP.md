# Local Development Setup

This document provides step-by-step instructions for setting up the User Management Application locally.

## Prerequisites

- Java 17 or later
- Maven 3.6 or later
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd claude-agent-test
   ```

2. **Start the PostgreSQL database**
   ```bash
   docker-compose up -d postgres
   ```

3. **Wait for the database to be ready**
   ```bash
   # Check if PostgreSQL is ready
   docker-compose logs postgres
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

## Detailed Setup

### 1. Database Setup

The application uses PostgreSQL as its primary database. For local development, we use Docker Compose to run PostgreSQL.

#### Start PostgreSQL
```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Or start all services (PostgreSQL + pgAdmin)
docker-compose up -d
```

#### Database Details
- **Host**: localhost
- **Port**: 5432
- **Database**: userdb
- **Username**: postgres
- **Password**: postgres

#### pgAdmin (Optional)
If you started all services, pgAdmin is available at:
- **URL**: http://localhost:8081
- **Email**: admin@company.com
- **Password**: admin123

### 2. Application Configuration

The application supports multiple profiles:

#### Development Profile (default)
```bash
# Run with development profile (default)
./mvnw spring-boot:run

# Or explicitly set the profile
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

#### Test Profile
```bash
# Run tests (uses H2 in-memory database)
./mvnw test
```

#### Production Profile
```bash
# Run with production profile
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

### 3. Environment Variables

You can override configuration using environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env
```

Available environment variables:
- `SPRING_PROFILES_ACTIVE`: Spring profile to use (dev, prod, test)
- `DB_URL`: Database connection URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_POOL_MAX_SIZE`: Maximum database connection pool size
- `DB_POOL_MIN_IDLE`: Minimum idle connections in pool
- `SECURITY_USER_NAME`: Basic auth username
- `SECURITY_USER_PASSWORD`: Basic auth password
- `SERVER_PORT`: Application server port

### 4. Database Migrations

The application uses Flyway for database migrations. Migrations run automatically when the application starts.

#### Migration Files
Migrations are located in `src/main/resources/db/migration/`:
- `V1__Create_users_table.sql`
- `V2__Create_customers_table.sql`
- `V3__Create_customer_addresses_table.sql`
- And more...

#### Manual Migration Commands
```bash
# Run migrations manually
./mvnw flyway:migrate

# Get migration info
./mvnw flyway:info

# Validate migrations
./mvnw flyway:validate
```

### 5. Application Endpoints

Once the application is running:

#### API Documentation
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs

#### Management Endpoints
- **Health Check**: http://localhost:8080/actuator/health
- **Application Info**: http://localhost:8080/actuator/info
- **Metrics**: http://localhost:8080/actuator/metrics
- **Flyway Info**: http://localhost:8080/actuator/flyway
- **Database Pool**: http://localhost:8080/actuator/hikaricp

#### API Endpoints
- **Users API**: http://localhost:8080/users
- **Customers API**: http://localhost:8080/customers

### 6. Authentication

The application uses basic authentication for API access:
- **Username**: admin
- **Password**: admin123

## Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Refused
```
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5432 refused
```

**Solution**: Make sure PostgreSQL is running
```bash
# Check if PostgreSQL container is running
docker-compose ps

# Start PostgreSQL if not running
docker-compose up -d postgres

# Check logs for any errors
docker-compose logs postgres
```

#### 2. Database Does Not Exist
```
org.postgresql.util.PSQLException: FATAL: database "userdb" does not exist
```

**Solution**: The database should be created automatically. If not:
```bash
# Stop and remove containers
docker-compose down

# Remove volumes to start fresh
docker-compose down -v

# Start again
docker-compose up -d postgres
```

#### 3. Port Already in Use
```
Port 5432 is already allocated
```

**Solution**: Stop other PostgreSQL instances or change the port
```bash
# Check what's using port 5432
lsof -i :5432

# Stop other PostgreSQL services
brew services stop postgresql  # On macOS with Homebrew
sudo service postgresql stop   # On Linux

# Or change the port in docker-compose.yml
```

#### 4. Flyway Migration Issues
```
FlywayException: Validate failed: Migration checksum mismatch
```

**Solution**: Reset the database and migrations
```bash
# Stop the application
# Clean the database
docker-compose down -v
docker-compose up -d postgres

# Restart the application
./mvnw spring-boot:run
```

### Development Tips

1. **Use pgAdmin**: Access pgAdmin at http://localhost:8081 to browse the database
2. **Enable SQL Logging**: Set `spring.jpa.show-sql=true` in development profile
3. **Monitor Connections**: Check http://localhost:8080/actuator/hikaricp for connection pool status
4. **API Testing**: Use Swagger UI for interactive API testing

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (database data will be lost)
docker-compose down -v

# Stop only PostgreSQL
docker-compose stop postgres
```

## Next Steps

- Review the API documentation at http://localhost:8080/swagger-ui.html
- Test the endpoints using Swagger UI or your preferred HTTP client
- Check the management endpoints for application health and metrics
- Explore the database schema using pgAdmin