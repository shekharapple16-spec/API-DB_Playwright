import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'automation_practice'
});

async function debug() {
  try {
    console.log('📌 Database Configuration:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log('\n');

    const result = await pool.query('SELECT id, group_name, created_at FROM scheduling_groups ORDER BY id DESC LIMIT 15;');
    
    console.log(`✅ Database connected! Found ${result.rows.length} records:`);
    console.log(JSON.stringify(result.rows, null, 2));
    
    console.log('\n📊 ID Gap Analysis:');
    const ids = result.rows.map(r => r.id).sort((a, b) => a - b);
    console.log(`ID Range: ${ids[0]} to ${ids[ids.length - 1]}`);
    console.log(`Expected sequence: ${ids.length} consecutive IDs`);
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

debug();
