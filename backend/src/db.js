import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let pool = null;
let schemaState = 'unknown'; // unknown | ok | error

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'spam'];

export function getPool() {
  if (!config.db.configured) return null;
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60000,
      enableKeepAlive: true,
      charset: 'utf8mb4',
      timezone: 'Z',
      dateStrings: false
    });
  }
  return pool;
}

export async function pingDb() {
  const p = getPool();
  if (!p) return false;
  try {
    await p.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export const getSchemaState = () => schemaState;

/** Applies schema.sql and small additive migrations. Safe to run on every boot. */
export async function ensureSchema() {
  const p = getPool();
  if (!p) return;
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, '../database/schema.sql'), 'utf8');
    const statements = sql
      .replace(/--.*$/gm, '')
      .split(/;\s*(?:\r?\n|$)/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) await p.query(stmt);

    // Migrations for databases created by an earlier version of the schema
    const [cols] = await p.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'leads'`
    );
    const have = new Set(cols.map((c) => c.COLUMN_NAME));
    if (!have.has('notes')) await p.query('ALTER TABLE leads ADD COLUMN notes TEXT NULL AFTER status');
    if (!have.has('updated_at'))
      await p.query(
        'ALTER TABLE leads ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'
      );
    schemaState = 'ok';
  } catch (e) {
    schemaState = 'error';
    throw e;
  }
}

export async function schemaReady() {
  const p = getPool();
  if (!p) return false;
  try {
    const [rows] = await p.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('leads','sessions','admin_audit')`
    );
    return rows.length === 3;
  } catch {
    return false;
  }
}

export async function insertLead(lead) {
  const p = getPool();
  if (!p) return null;
  const [result] = await p.execute(
    `INSERT INTO leads (name, company, email, phone, stage, message, locale, source_path, ip_hash, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lead.name,
      lead.company,
      lead.email,
      lead.phone || null,
      lead.stage || null,
      lead.message || null,
      lead.locale,
      lead.sourcePath || null,
      lead.ipHash || null,
      lead.userAgent || null
    ]
  );
  return result.insertId;
}

function leadFilters({ status, q }) {
  const where = [];
  const params = [];
  if (status && LEAD_STATUSES.includes(status)) {
    where.push('status = ?');
    params.push(status);
  } else if (status !== 'all') {
    where.push("status <> 'spam'");
  }
  if (q) {
    where.push('(name LIKE ? OR company LIKE ? OR email LIKE ? OR message LIKE ?)');
    const like = `%${String(q).replace(/[%_\\]/g, '\\$&')}%`;
    params.push(like, like, like, like);
  }
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

export async function listLeads({ status, q, page = 1, limit = 25 }) {
  const p = getPool();
  const { sql, params } = leadFilters({ status, q });
  const lim = Math.min(100, Math.max(1, Number(limit) || 25));
  const off = (Math.max(1, Number(page) || 1) - 1) * lim;
  const [rows] = await p.query(
    `SELECT id, name, company, email, phone, stage, message, locale, source_path, status, notes, created_at, updated_at
     FROM leads ${sql} ORDER BY created_at DESC, id DESC LIMIT ${lim} OFFSET ${off}`,
    params
  );
  const [[{ total }]] = await p.query(`SELECT COUNT(*) AS total FROM leads ${sql}`, params);
  return { rows, total: Number(total), page: Math.max(1, Number(page) || 1), limit: lim };
}

export async function leadStats() {
  const p = getPool();
  const [byStatus] = await p.query('SELECT status, COUNT(*) AS n FROM leads GROUP BY status');
  const [[{ last30 }]] = await p.query(
    "SELECT COUNT(*) AS last30 FROM leads WHERE created_at >= (UTC_TIMESTAMP() - INTERVAL 30 DAY) AND status <> 'spam'"
  );
  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  for (const r of byStatus) counts[r.status] = Number(r.n);
  return { counts, last30: Number(last30) };
}

export async function updateLead(id, { status, notes }) {
  const p = getPool();
  const sets = [];
  const params = [];
  if (status !== undefined) {
    if (!LEAD_STATUSES.includes(status)) throw Object.assign(new Error('invalid status'), { status: 422 });
    sets.push('status = ?');
    params.push(status);
  }
  if (notes !== undefined) {
    sets.push('notes = ?');
    params.push(String(notes).slice(0, 4000) || null);
  }
  if (!sets.length) return 0;
  params.push(Number(id));
  const [r] = await p.execute(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`, params);
  return r.affectedRows;
}

export async function deleteLead(id) {
  const p = getPool();
  const [r] = await p.execute('DELETE FROM leads WHERE id = ?', [Number(id)]);
  return r.affectedRows;
}

export async function exportLeads({ status, q }) {
  const p = getPool();
  const { sql, params } = leadFilters({ status, q });
  const [rows] = await p.query(
    `SELECT id, created_at, status, name, company, email, phone, stage, locale, source_path, message, notes
     FROM leads ${sql} ORDER BY created_at DESC LIMIT 5000`,
    params
  );
  return rows;
}

export async function audit(actor, action, { leadId = null, detail = null, ipHash = null } = {}) {
  const p = getPool();
  if (!p) return;
  try {
    await p.execute('INSERT INTO admin_audit (actor, action, lead_id, detail, ip_hash) VALUES (?, ?, ?, ?, ?)', [
      actor,
      action,
      leadId,
      detail ? String(detail).slice(0, 255) : null,
      ipHash
    ]);
  } catch (e) {
    console.error('[audit]', e.message);
  }
}
