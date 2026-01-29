/**
 * Database Migration: Add Missing Columns to scheduling_groups table
 * 
 * This script adds the missing optional columns that were defined in init-db.sql
 * but not present in the existing table.
 * 
 * Run with: npx ts-node migrate-add-columns.ts
 */
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'automation_practice',
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Starting database migration...\n');

    // Check existing columns
    console.log('Step 1️⃣: Checking existing columns...');
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'scheduling_groups'
      ORDER BY ordinal_position
    `);

    const existingColumns = checkResult.rows.map(row => row.column_name);
    console.log('Existing columns:', existingColumns);
    console.log();

    // Define columns to add
    const columnsToAdd = [
      { name: 'area', type: 'VARCHAR(255)', exists: existingColumns.includes('area') },
      { name: 'notes', type: 'TEXT', exists: existingColumns.includes('notes') },
      { name: 'allocations_menu', type: 'VARCHAR(255)', exists: existingColumns.includes('allocations_menu') },
      { name: 'last_amended_by', type: 'VARCHAR(255)', exists: existingColumns.includes('last_amended_by') },
      { name: 'last_amended_date', type: 'TIMESTAMP', exists: existingColumns.includes('last_amended_date') },
      { name: 'updated_at', type: 'TIMESTAMP', exists: existingColumns.includes('updated_at') },
    ];

    const missingColumns = columnsToAdd.filter(col => !col.exists);

    if (missingColumns.length === 0) {
      console.log('✅ All columns already exist in the table');
      return;
    }

    console.log(`Step 2️⃣: Adding ${missingColumns.length} missing column(s)...\n`);

    // Add each missing column
    for (const col of missingColumns) {
      console.log(`   Adding column: ${col.name} (${col.type})`);
      try {
        const query = `ALTER TABLE scheduling_groups ADD COLUMN ${col.name} ${col.type}`;
        await client.query(query);
        console.log(`   ✅ Successfully added ${col.name}`);
      } catch (err: any) {
        if (err.message.includes('already exists')) {
          console.log(`   ⚠️  Column ${col.name} already exists`);
        } else {
          throw err;
        }
      }
    }

    console.log('\nStep 3️⃣: Verifying final schema...');
    const finalResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'scheduling_groups'
      ORDER BY ordinal_position
    `);

    console.log('Updated table schema:');
    finalResult.rows.forEach((row, index) => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`  ${index + 1}. ${row.column_name}: ${row.data_type} ${nullable}`);
    });

    console.log('\n================================');
    console.log('✅ Migration completed successfully!');
    console.log('================================');
    console.log('\nYou can now:');
    console.log('1. Run the tests: npm test');
    console.log('2. Or run a quick diagnostic: npm run test:db');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.release();
    await pool.end();
  }
}

runMigration();
