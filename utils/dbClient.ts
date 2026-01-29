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
 * const results = await healthCheckDB();
 */
import { Pool, QueryResultRow } from 'pg';
import { DB_CONFIG } from '../config/db.config';

let pool: Pool | null = null;

/**
 * Initialize the database pool
 * Called once before tests to establish the connection
 */
export async function initializeDBPool(): Promise<void> {
  if (pool) {
    return; // Already initialized
  }

  console.log(`🔌 Initializing database pool with config:`, {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    database: DB_CONFIG.database,
  });

  pool = new Pool({
    ...DB_CONFIG,
    // Add connection retry and timeout settings for Docker
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20, // Maximum connections in pool
  });

  pool.on('error', (err) => {
    console.error('🔴 Unexpected error on idle client', err);
  });

  // Retry logic for initial connection
  let retries = 5;
  let lastError: Error | null = null;

  while (retries > 0) {
    try {
      console.log(`⏳ Attempting database connection (${6 - retries}/5)...`);
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('✅ Database connection successful at:', result.rows[0].now);
      client.release();
      return; // Success!
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️  Connection attempt failed: ${lastError.message}`);
      console.warn(`📍 Error code: ${(error as any).code}`);
      console.warn(`📍 Error details:`, {
        message: lastError.message,
        code: (error as any).code,
        errno: (error as any).errno,
        syscall: (error as any).syscall,
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
      });
      retries--;
      if (retries > 0) {
        console.log(`⏳ Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // All retries exhausted
  console.error('❌ Failed to connect to database after 5 attempts');
  console.error('💡 Docker connection troubleshooting:');
  console.error('- Ensure Docker container is running: docker ps');
  console.error('- Check Docker logs: docker logs scheduling-api');
  console.error('- Verify port 5432 is exposed: docker ps | grep 5432');
  console.error('- Try connecting from inside container: docker exec scheduling-api psql -U postgres -c "SELECT 1"');
  throw lastError;
}

/**
 * Health check to verify database connectivity
 */
export async function healthCheckDB(): Promise<void> {
  if (!pool) {
    await initializeDBPool();
  }

  const client = await pool!.connect();
  try {
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database health check passed at:', result.rows[0].now);
  } finally {
    client.release();
  }
}

/**
 * Execute a parameterized query against the database
 */
export async function queryDB<T extends QueryResultRow>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!pool) {
    await initializeDBPool();
  }

  const client = await pool!.connect();
  try {
    console.log(`📡 Executing query with params:`, params);
    const result = await client.query<T>(query, params);
    console.log(`✅ Query returned ${result.rows.length} rows`);
    return result.rows;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close the database pool
 * Call this after tests complete
 */
export async function closeDBPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ Database pool closed');
  }
}

