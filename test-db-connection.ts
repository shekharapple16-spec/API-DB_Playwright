/**
 * Database Connection Diagnostic Script
 *
 * This script tests database connectivity and verifies that the pool is working correctly.
 * It also compares the database being used by both API and test script.
 * Run with: npx ts-node test-db-connection.ts
 */
import { initializeDBPool, queryDB, healthCheckDB, closeDBPool } from "./utils/dbClient";
import { DB_QUERIES } from "./db/queries";
import { DB_CONFIG } from "./config/db.config";

async function runDiagnostics() {
  console.log("================================");
  console.log("🔍 Database Connection Diagnostics");
  console.log("================================\n");

  // Display connection config
  console.log("📋 Test Script Database Configuration:");
  console.log(`   Host: ${DB_CONFIG.host}`);
  console.log(`   Port: ${DB_CONFIG.port}`);
  console.log(`   User: ${DB_CONFIG.user}`);
  console.log(`   Database: ${DB_CONFIG.database}`);
  console.log();

  try {
    // Step 1: Initialize pool
    console.log("Step 1️⃣: Initializing database pool...");
    await initializeDBPool();
    console.log("✅ Pool initialized\n");

    // Step 2: Health check
    console.log("Step 2️⃣: Running health check...");
    await healthCheckDB();
    console.log("✅ Health check passed\n");

    // Step 3: Query connection info
    console.log("Step 3️⃣: Verifying database version and connection...");
    const versionResult = await queryDB<any>(
      `SELECT version(), current_database(), current_user, now()`
    );
    if (versionResult.length > 0) {
      const info = versionResult[0];
      console.log(`   Database: ${info.current_database}`);
      console.log(`   User: ${info.current_user}`);
      console.log(`   Version: ${info.version.split(',')[0]}`);
      console.log(`   Server Time: ${info.now}`);
    }
    console.log();

    // Step 4: Query all groups
    console.log("Step 4️⃣: Querying all scheduling groups...");
    const allGroups = await queryDB<any>(DB_QUERIES.GET_ALL_GROUPS);
    console.log(`✅ Found ${allGroups.length} groups in database\n`);

    if (allGroups.length > 0) {
      console.log("Latest 5 groups:");
      allGroups.slice(-5).forEach((group, index) => {
        console.log(
          `  ${index + 1}. ID: ${group.id}, Name: ${group.group_name}, Area: ${group.area}, Status: ${group.status}`
        );
      });
      console.log();

      // Step 5: Query specific group by ID (the most recent one)
      const testId = allGroups[allGroups.length - 1].id;
      console.log(`Step 5️⃣: Testing query by ID (${testId})...`);
      console.log(`Executing: SELECT * FROM scheduling_groups WHERE id = ${testId}`);
      
      const specificGroup = await queryDB<any>(DB_QUERIES.GET_GROUP_BY_ID, [testId]);
      
      console.log(`✅ Query returned ${specificGroup.length} rows`);
      if (specificGroup.length > 0) {
        const row = specificGroup[0];
        console.log("   Record details:");
        console.log(`   - ID: ${row.id}`);
        console.log(`   - Name: ${row.group_name}`);
        console.log(`   - Area: ${row.area || 'NULL'}`);
        console.log(`   - Notes: ${row.notes || 'NULL'}`);
        console.log(`   - Status: ${row.status}`);
        console.log(`   - Allocations Menu: ${row.allocations_menu || 'NULL'}`);
        console.log(`   - Created By: ${row.created_by}`);
        console.log(`   - Created At: ${row.created_at}`);
        console.log();
      } else {
        console.log(`❌ ERROR: Record with ID ${testId} not found!`);
        console.log("This indicates a database connection or isolation issue.\n");
      }

      // Step 6: Schema inspection
      console.log("Step 6️⃣: Verifying table schema...");
      const schemaResult = await queryDB<any>(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'scheduling_groups'
        ORDER BY ordinal_position
      `);
      
      if (schemaResult.length > 0) {
        console.log("   Table columns:");
        schemaResult.forEach((col) => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}`);
        });
      }
      console.log();
    } else {
      console.log("⚠️  No groups found in database. Create some test data first.\n");
    }

    console.log("================================");
    console.log("✅ All diagnostics completed!");
    console.log("================================");

    console.log("\n📌 NEXT STEPS:");
    console.log("1. If the query above returned 0 rows for recent records:");
    console.log("   - The API and test script may be using different databases");
    console.log("   - Check that the API server's .env is identical to test script's .env");
    console.log("   - Run: npm test -- --grep 'optional' to test the optional fields");
    console.log("\n2. To verify API and test use same database:");
    console.log("   - Get the API DB config from e:\\api-db-app\\.env");
    console.log("   - Compare with e:\\playwright-api-tests\\.env");
    console.log("   - They must be identical!");
  } catch (error) {
    console.error("\n================================");
    console.error("❌ Diagnostic failed:");
    console.error(error);
    console.error("================================");
    process.exit(1);
  } finally {
    await closeDBPool();
  }
}

runDiagnostics();
