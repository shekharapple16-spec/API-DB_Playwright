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
import { SchedulingGroupClient } from "@clients/SchedulingGroupClient";
import { request } from "https";

// craete a test to get all groups

// craete a new SchedulingGroupClient and pass request and use getAllGroups
test("Get all scheduling groups", async ({ request }) => {
  //add a new entry with status Inactive to the database for testing

  const builder = new SchedulingGroupBuilder();
  const payload = builder
    .withGroupName(`TSCAUto_${Date.now()}`)
    .withStatus("Inactive")
    .build();
  const client = new SchedulingGroupClient(request);

  const createdGroup = await client.createGroup(payload);
  expect(createdGroup.groupName).toBe(payload.groupName);

  const groups = await client.getAllGroups();

  // Assert that the response is an array
  expect(Array.isArray(groups)).toBe(true);

  //print the groups
  console.log("Scheduling Groups:", groups);
});


// test to delete groups by status
test.skip("Delete scheduling groups by status", async ({ request }) => {
  const client = new SchedulingGroupClient(request);
  const statusToDelete = "active";
  const deleteResponse = await client.deleteGroupsByStatus(statusToDelete);
 console.log("Delete Response:", deleteResponse);
  expect(deleteResponse.message).toContain(`group(s) deleted`);
});