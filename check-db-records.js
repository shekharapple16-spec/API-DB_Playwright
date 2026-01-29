const { Pool } = require('pg');
require('dotenv').config();

async function checkDB() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔌 Connecting to database...\n');
    
    // Count records
    const countResult = await pool.query('SELECT COUNT(*) as total_records FROM scheduling_groups');
    const totalRecords = countResult.rows[0].total_records;
    
    console.log(`📊 Total Records in Database: ${totalRecords}\n`);
    
    if (totalRecords > 0) {
      // Get all records
      const result = await pool.query('SELECT id, group_name, created_by, status, area, created_at FROM scheduling_groups ORDER BY created_at DESC');
      
      console.log(`📋 All ${result.rows.length} Records:\n`);
      console.table(result.rows);
    } else {
      console.log('⚠️  No records found in the database');
    }
    
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await pool.end();
    console.log('\n✅ Connection closed');
  }
}

checkDB();
