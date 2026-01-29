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
import { test, expect } from "fixtures/database";
import { APIRequestContext } from "@playwright/test";
import { SchedulingGroupBuilder } from "@builders/SchedulingGroupBuilder";
//import { UpdateSchedulingGroupBuilder } from "@builders/UpdateSchedulingGroupBuilder";
import { DB_QUERIES } from "@db/queries";
import { SchedulingGroupClient } from "@clients/SchedulingGroupClient";
import { queryDB } from "@utils/dbClient";
import {
  CreateSchedulingGroupRequestStatusEnum,
  UpdateSchedulingGroupRequestStatusEnum,
} from "@generated/models";
// import { logCreate, logUpdate, logDelete, getAuditHistory } from "@utils/auditHelper";

test("NP035.03: Create Scheduling Group with optional fields (area, notes, allocationsMenu)", async ({
  request,
  dbReady,
}: {
  request: APIRequestContext;
  dbReady: void;
}) => {
  const client = new SchedulingGroupClient(request);
  const now = Date.now();

  try {
    // Arrange: Build payload with optional fields
    const testGroupName = `OptionalFields_Group_${now}`;
    const testArea = "Area-North";
    const testNotes = "This is a test group with all optional fields populated";
    const testAllocationsMenu = "true";

    const payload = new SchedulingGroupBuilder()
      .withGroupName(testGroupName)
      .withArea(testArea)
      .withNotes(testNotes)
      .withAllocationsMenu(testAllocationsMenu)
      .withStatus(CreateSchedulingGroupRequestStatusEnum.Active)
      .build();

    console.log("📝 Request Payload:", JSON.stringify(payload, null, 2));

    // Act: Create the group via API
    const apiResponse = await client.createGroup(payload);

    //console apiResponse creted Id
    console.log("📥 API Response:", JSON.stringify(apiResponse, null, 2));
    console.log("🔍 API Response ID:", apiResponse.id);
    console.log("🔍 API Response Type:", typeof apiResponse.id);

    // Verify ID exists
    console.log("🔍 Checking apiResponse structure:", Object.keys(apiResponse));
    console.log("🔍 Full apiResponse:", apiResponse);
    
    expect(apiResponse.id).toBeDefined();
    expect(apiResponse.id).toBeGreaterThan(0);

    // Wait for transaction to commit (database consistency delay)
    console.log("⏳ Waiting 1000ms for database transaction to commit...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate in database - Debug query
    console.log("📡 Executing query with ID:", apiResponse.id);
    console.log("📡 Query:", DB_QUERIES.GET_GROUP_BY_ID);
    const dbResults = await queryDB<any>(DB_QUERIES.GET_GROUP_BY_ID, [apiResponse.id]);
    console.log("📊 DB Query Result:", dbResults);
    console.log("📊 DB Results Length:", dbResults.length);

    // Get ALL records to debug
    const allRecords = await queryDB<any>(DB_QUERIES.GET_ALL_GROUPS);
    console.log("📊 ALL Records in DB:", allRecords.length);
    console.log("📊 Latest 5 records:", allRecords.slice(0, 5).map(r => ({ id: r.id, group_name: r.group_name })));

    // Assert database result
    expect(dbResults.length).toBeGreaterThan(0);
    expect(dbResults[0].group_name).toBe(testGroupName);
    console.log("✅ Test passed - record found in database");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
});
