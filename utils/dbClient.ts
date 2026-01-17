/**
 * Database Client Utilities
 *
 * This module provides database connectivity and query execution utilities using pg (node-postgres).
 * It manages connection pooling and provides a simple interface for executing parameterized SQL queries.
 *
 * Purpose:
 * - Manages PostgreSQL connection pooling
 * - Provides type-safe query execution
 * - Handles connection lifecycle (acquire/release)
 * - Enables parameterized queries for security
 * - Abstracts database operations from business logic
 *
 * Relationships:
 * - Uses database configuration from config/db.config.ts
 * - Executes queries defined in db/queries.ts
 * - Called by test files for database validation
 * - Collaborates with generated models for type annotations
 * - Provides data for API-to-database consistency checks
 *
 * Key Features:
 * - Connection Pooling: Efficient connection reuse
 * - Parameterized Queries: Prevents SQL injection
 * - Type Safety: Generic return types extending QueryResultRow
 * - Error Handling: Automatic connection release
 * - Async/Await: Modern JavaScript patterns
 *
 * Usage:
 * const results = await queryDB<MyType>(DB_QUERIES.GET_GROUP_BY_ID, [id]);
 */
import { Pool, QueryResultRow } from 'pg';
import { DB_CONFIG } from '../config/db.config';

const pool = new Pool(DB_CONFIG);

export async function queryDB<T extends QueryResultRow>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}
