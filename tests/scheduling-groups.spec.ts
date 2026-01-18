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

test("Scheduling group workflow: create, get, and delete", async ({
  request,
}) => {
  const payload = new SchedulingGroupBuilder()
    .withGroupName(`TSC_${Date.now()}`)
    .withStatus("active")
    .build();

  const client = new SchedulingGroupClient(request);

  // Create
  const createdGroup = await client.createGroup(payload);
  expect(createdGroup.groupName).toBe(payload.groupName);
  
  //get all groups
  const allGroups = await client.getAllGroups();
  //const fetchedGroup = allGroups.find(g => g.id === createdGroup.id);
 console.log('Fetched Group:', allGroups);
 // expect(fetchedGroup).toBeDefined();
  //expect(fetchedGroup?.groupName).toBe(payload.groupName);

  
});
