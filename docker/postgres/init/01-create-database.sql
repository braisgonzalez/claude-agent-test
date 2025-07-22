-- Initialize the database for development
-- This script runs when the PostgreSQL container starts for the first time

-- Enable UUID extension for the userdb database (main database)
\c userdb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log successful initialization
\echo 'Database initialization completed successfully for userdb'