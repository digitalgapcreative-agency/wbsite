// Optional: run locally with DB_* env vars set to create tables on a remote MySQL.
import 'dotenv/config';
import { ensureSchema, pingDb, getPool } from '../src/db.js';

try {
  if (!getPool()) {
    console.error('FAIL: DB_HOST, DB_USER and DB_NAME must be set.');
    process.exit(1);
  }
  await ensureSchema();
  const ok = await pingDb();
  console.log(ok ? 'SUCCESS: schema applied, database reachable.' : 'FAIL: database unreachable.');
  process.exit(ok ? 0 : 1);
} catch (e) {
  console.error('FAIL:', e.message);
  process.exit(1);
}
