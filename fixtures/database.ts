/**
 * Database Fixtures for Playwright Tests
 * 
 * This file defines Playwright test fixtures for database operations.
 * Uses worker scope to initialize pool once for all tests, not per test.
 * 
 * Usage in tests:
 * import { test } from '@fixtures/database';
 * 
 * test('My test', async () => {
 *   const results = await queryDB<any>(DB_QUERIES.GET_ALL_GROUPS);
 * });
 */
import { test as base, expect as baseExpect } from '@playwright/test';
import { initializeDBPool, closeDBPool, healthCheckDB } from '../utils/dbClient';

type DatabaseFixtures = {
  dbReady: void;
};

let poolInitialized = false;

/**
 * Custom test fixture that initializes database pool ONCE for all tests
 * 
 * This fixture (scope: 'worker'):
 * - Initializes the pool once before ALL tests
 * - Verifies database connectivity
 * - Closes the pool after ALL tests complete
 * - Does NOT close pool between tests
 */
export const test = base.extend<DatabaseFixtures>({
  dbReady: [
    async ({}, use) => {
      if (!poolInitialized) {
        console.log("\n🚀 Initializing database pool (global setup)...");
        await initializeDBPool();
        await healthCheckDB();
        console.log("✅ Database pool ready for all tests\n");
        poolInitialized = true;
      }

      await use();

      // Close pool only at the very end
      console.log("\n🧹 Closing database pool (global teardown)...");
      await closeDBPool();
      console.log("✅ Database pool closed\n");
    },
    { scope: 'worker' }
  ],
});

export const expect = baseExpect;
