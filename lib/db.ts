import 'server-only';
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { env } from './env';

declare global {
  var __dbPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = env().DATABASE_URL;

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: connectionString.includes('sslmode=disable')
      ? false
      : {
          rejectUnauthorized: false,
        },
  });

  pool.on('error', (err) => {
    console.error('[db] Unexpected idle client error:', err);
  });

  return pool;
}

export function getPool(): Pool {
  if (!globalThis.__dbPool) {
    globalThis.__dbPool = createPool();
  }
  return globalThis.__dbPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const start = Date.now();
  const pool = getPool();
  try {
    const res = await pool.query<T>(text, params);
    return res;
  } catch (err) {
    console.error('[db] Query error:', { text, duration: Date.now() - start, err });
    throw err;
  }
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function healthCheck(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await query('SELECT 1 as alive');
    const latencyMs = Date.now() - start;
    if (res.rows[0]?.alive === 1) {
      return { ok: true, latencyMs };
    }
    return { ok: false, latencyMs, error: 'Unexpected response' };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
