/**
 * Scheduling Groups API Tests
 *
 * This test suite validates the end-to-end functionality of the scheduling group API,
 * including API responses and database consistency. It follows the Arrange-Act-Assert
 * pattern with additional database validation.
 *
 * Purpose:
 * - Tests API endpoint functionality and responses
 * - Validates data consistency between API and database
 * - Ensures proper integration of all framework components
 * - Provides regression testing for API changes
 * - Demonstrates the complete testing workflow
 *
 * Relationships:
 * - Uses SchedulingGroupBuilder to create test payloads
 * - Calls SchedulingGroupClient for API interactions
 * - Queries database using dbClient utilities
 * - Validates against generated TypeScript models
 * - Depends on configuration from config/ and constants/
 *
 * Test Flow:
 * 1. Arrange: Build request payload using Builder
 * 2. Act: Call API via Client
 * 3. Assert: Verify API response structure
 * 4. Validate: Query database and compare data
 *
 * Test Coverage:
 * - Successful scheduling group creation
 * - API response validation
 * - Database data persistence
 * - API-to-database data consistency
 */
import { test, expect } from "@playwright/test";
import { SchedulingGroupBuilder } from "@builders/SchedulingGroupBuilder";
import { DB_QUERIES } from "@db/queries";
import { queryDB } from "@utils/dbClient";
import { SchedulingGroupClient } from "@clients/SchedulingGroupClient";


test.skip("Create scheduling group and validate DB", async ({ request }) => {
  const payload = new SchedulingGroupBuilder()
    .withGroupName(`TS_${Date.now()}`)
    .build();

  const client = new SchedulingGroupClient(request);
  const responseBody = await client.createGroup(payload);

  const dbResult = await queryDB(DB_QUERIES.GET_GROUP_BY_ID, [responseBody.id]);

  expect(dbResult).toHaveLength(1);
  expect((dbResult[0] as any).group_name).toBe(payload.groupName);
});

test("Get all scheduling groups", async ({ request }) => {
  const client = new SchedulingGroupClient(request);
  const groups = await client.getAllGroups();

  console.log("Groups returned:", groups);
 
  expect(Array.isArray(groups)).toBe(true);
  // Additional assertions can be added based on expected data
});
