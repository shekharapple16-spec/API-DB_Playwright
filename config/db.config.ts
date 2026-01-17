/**
 * Database Configuration
 *
 * This module defines the database connection configuration for PostgreSQL.
 * It loads database credentials from environment variables and provides
 * a typed configuration object used by the database client.
 *
 * Purpose:
 * - Centralizes database connection settings
 * - Loads configuration from environment variables for security
 * - Provides type safety for database config properties
 * - Enables different configurations for different environments
 *
 * Relationships:
 * - Used by utils/dbClient.ts to establish database connections
 * - Environment variables defined in .env file (not committed to git)
 * - Collaborates with db/queries.ts for executing SQL statements
 * - Required for database validation in test files
 *
 * Environment Variables Required:
 * - DB_HOST: PostgreSQL server hostname
 * - DB_PORT: PostgreSQL server port (default: 5432)
 * - DB_USER: Database username
 * - DB_PASSWORD: Database password
 * - DB_NAME: Database name
 */
import dotenv from 'dotenv';

dotenv.config();

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const DB_CONFIG: DbConfig = {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!
};
