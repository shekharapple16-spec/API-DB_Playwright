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
import { queryDB } from "@utils/dbClient";

// craete a test to get all groups

// craete a new SchedulingGroupClient and pass request and use getAllGroups
test("Get all scheduling groups", async ({ request }) => {
  //add a new entry with status Inactive to the database for testing

  const builder = new SchedulingGroupBuilder();
  const payload = builder
    .withGroupName(`TSCAUto1_${Date.now()}`)
    .withStatus("active")
    .build();
  const client = new SchedulingGroupClient(request);

  const createdGroup = await client.createGroup(payload);

  // if group created successfuly it shoud return id
  expect(createdGroup.id).toBeDefined();
  console.log(createdGroup);

  // // now verify same in db
  const dbGroups = await queryDB(DB_QUERIES.GET_GROUP_BY_ID, [createdGroup.id]);
  expect(dbGroups.length).toBe(1);
  console.log("DB Group:", dbGroups[0]);

//dekete whatever crarted by POSt and saved in db
  const deleteResponse = await client.deleteGroup(createdGroup.id!);
  console.log("Delete Response:", deleteResponse);

  //check dleted post is wrkbg fine as data shoud not be avaible in db as well
  const dbGroupsDeleted = await queryDB(DB_QUERIES.GET_GROUP_BY_ID, [createdGroup.id]);
  expect(dbGroupsDeleted.length).toBe(0);

});
