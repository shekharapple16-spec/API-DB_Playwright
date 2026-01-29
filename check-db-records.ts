import { queryDB, initializeDBPool, closeDBPool } from './utils/dbClient';

async function main() {
  try {
    await initializeDBPool();
    
    // Count all records
    const countResult = await queryDB('SELECT COUNT(*) as total_records FROM scheduling_groups');
    console.log('\n📊 Total Records in Database:', countResult[0].total_records);

    // Get all records with details
    const allRecords = await queryDB('SELECT id, group_name, created_by, status, created_at FROM scheduling_groups ORDER BY created_at DESC');
    
    if (allRecords.length > 0) {
      console.log(`\n📋 All Records (${allRecords.length} total):\n`);
      console.table(allRecords);
    } else {
      console.log('\n⚠️  No records found in database');
    }
    
    await closeDBPool();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
