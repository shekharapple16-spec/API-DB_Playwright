/**
 * Database Connection Comparison Script
 *
 * This script compares the database configuration used by:
 * 1. The API Server (from ../api-db-app/.env)
 * 2. The Test Script (from ./.env)
 *
 * If the databases differ, this explains why the test cannot find data inserted by the API.
 *
 * Run with: npx ts-node compare-db-connections.ts
 */
import * as fs from 'fs';
import * as path from 'path';

function parseEnvFile(filePath: string): Record<string, string> {
  const config: Record<string, string> = {};
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return config;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');

    if (key) {
      config[key.trim()] = value;
    }
  });

  return config;
}

function main() {
  console.log("================================");
  console.log("🔄 Database Connection Comparison");
  console.log("================================\n");

  // Parse both env files
  const testEnv = parseEnvFile('.env');
  const apiEnv = parseEnvFile('../api-db-app/.env');

  // Extract database configs
  const testDbConfig = {
    host: testEnv.DB_HOST || 'localhost',
    port: testEnv.DB_PORT || '5432',
    user: testEnv.DB_USER || 'postgres',
    password: testEnv.DB_PASSWORD || '',
    database: testEnv.DB_NAME || 'automation_practice',
  };

  const apiDbConfig = {
    host: apiEnv.DB_HOST || 'localhost',
    port: apiEnv.DB_PORT || '5432',
    user: apiEnv.DB_USER || 'postgres',
    password: apiEnv.DB_PASSWORD || '',
    database: apiEnv.DB_NAME || 'automation_practice',
  };

  // Display comparison
  console.log("📋 Test Script Database Configuration (.env):");
  console.log(`   Host: ${testDbConfig.host}`);
  console.log(`   Port: ${testDbConfig.port}`);
  console.log(`   User: ${testDbConfig.user}`);
  console.log(`   Database: ${testDbConfig.database}`);
  console.log(`   Password: ${'*'.repeat(testDbConfig.password.length)}`);
  console.log();

  console.log("📋 API Server Database Configuration (../api-db-app/.env):");
  console.log(`   Host: ${apiDbConfig.host}`);
  console.log(`   Port: ${apiDbConfig.port}`);
  console.log(`   User: ${apiDbConfig.user}`);
  console.log(`   Database: ${apiDbConfig.database}`);
  console.log(`   Password: ${'*'.repeat(apiDbConfig.password.length)}`);
  console.log();

  // Compare
  const isSame =
    testDbConfig.host === apiDbConfig.host &&
    testDbConfig.port === apiDbConfig.port &&
    testDbConfig.user === apiDbConfig.user &&
    testDbConfig.database === apiDbConfig.database &&
    testDbConfig.password === apiDbConfig.password;

  console.log("================================");
  if (isSame) {
    console.log("✅ Both configurations point to the SAME database");
    console.log("✅ API inserts and test queries should use the same data");
  } else {
    console.log("❌ Configurations point to DIFFERENT databases!");
    console.log("❌ This is why the test cannot find API-inserted data");
    console.log();
    console.log("Differences:");
    
    if (testDbConfig.host !== apiDbConfig.host) {
      console.log(`   ❌ Host: Test="${testDbConfig.host}" vs API="${apiDbConfig.host}"`);
    }
    if (testDbConfig.port !== apiDbConfig.port) {
      console.log(`   ❌ Port: Test="${testDbConfig.port}" vs API="${apiDbConfig.port}"`);
    }
    if (testDbConfig.user !== apiDbConfig.user) {
      console.log(`   ❌ User: Test="${testDbConfig.user}" vs API="${apiDbConfig.user}"`);
    }
    if (testDbConfig.database !== apiDbConfig.database) {
      console.log(`   ❌ Database: Test="${testDbConfig.database}" vs API="${apiDbConfig.database}"`);
    }
    if (testDbConfig.password !== apiDbConfig.password) {
      console.log(`   ⚠️  Password differs (masking for security)`);
    }

    console.log();
    console.log("🔧 FIX: Make the configurations identical");
    console.log("   Copy the API Server's .env to the Test Script:");
    console.log("   cp ../api-db-app/.env .env");
  }
  console.log("================================");
}

main();
