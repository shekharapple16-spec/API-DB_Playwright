/**
 * Database Query Constants
 *
 * This module contains all SQL queries used for database validation in tests.
 * Queries are parameterized to prevent SQL injection and are centralized here
 * for maintainability and consistency.
 *
 * Purpose:
 * - Defines SQL queries as string constants
 * - Uses parameterized queries for security
 * - Centralizes database query definitions
 * - Enables easy query management and updates
 *
 * Relationships:
 * - Used by utils/dbClient.ts for query execution
 * - Called by test files in tests/ directory for data validation
 * - Corresponds to database schema defined in PostgreSQL
 * - Works with database configuration from config/db.config.ts
 *
 * Queries Defined:
 * - GET_GROUP_BY_ID: Retrieves a scheduling group by its ID
 *   Parameters: $1 (group ID)
 *   Returns: All columns from scheduling_groups table
 */
export const DB_QUERIES = {
  GET_GROUP_BY_ID:
    'SELECT group_name FROM scheduling_groups WHERE id = $1'
};
