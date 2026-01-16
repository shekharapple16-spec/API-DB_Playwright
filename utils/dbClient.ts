import { Pool } from 'pg';
import { DB_CONFIG } from '../config/db.config';

const pool = new Pool(DB_CONFIG);

export async function queryDB<T>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}
