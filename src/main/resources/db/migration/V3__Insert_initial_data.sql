-- Insert initial admin user
-- Password: admin123 (hashed with BCrypt)
INSERT INTO users (id, username, email, first_name, last_name, password_hash, role) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'admin', 'admin@company.com', 'System', 'Administrator', 
     '$2a$10$DJJCgBeSDMJJLnN5sBJ9S.HTBaGKs1E8QjTW3vGZ5jYgLsz1J5v/e', 'ADMIN'),
    ('00000000-0000-0000-0000-000000000002', 'demo', 'demo@company.com', 'Demo', 'User', 
     '$2a$10$DJJCgBeSDMJJLnN5sBJ9S.HTBaGKs1E8QjTW3vGZ5jYgLsz1J5v/e', 'USER');

-- Insert sample customers
INSERT INTO customers (company_name, contact_person, email, phone, address_street, address_city, address_country, industry, status)
VALUES 
    ('ACME Corporation', 'John Doe', 'john.doe@acme.com', '+1-555-0123', '123 Main St', 'New York', 'USA', 'Technology', 'ACTIVE'),
    ('Beta Industries', 'Jane Smith', 'jane.smith@beta.com', '+1-555-0124', '456 Oak Ave', 'Los Angeles', 'USA', 'Manufacturing', 'PROSPECT'),
    ('Gamma Solutions', 'Bob Johnson', 'bob.johnson@gamma.com', '+1-555-0125', '789 Pine Rd', 'Chicago', 'USA', 'Consulting', 'ACTIVE');