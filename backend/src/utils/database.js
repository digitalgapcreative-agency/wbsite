import mysql from 'mysql2/promise';
import crypto from 'node:crypto';
import {
    appendToCollection as appendJsonCollection,
    readCollection as readJsonCollection,
    writeCollection as writeJsonCollection,
} from './jsonStore.js';

let mysqlReady = false;
let mysqlPool = null;
let mysqlInitPromise = null;

const allowedTables = new Set(['admins', 'contacts', 'consultations']);

const normalizeStatus = (status) => {
    if (status === 'pending' || !status) {
        return 'NEW';
    }

    return status;
};

const normalizeDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;
        return trimmed.replace(' ', 'T');
    }

    return value;
};

const normalizeRecord = (record) => {
    if (!record) return null;

    return {
        ...record,
        status: normalizeStatus(record.status),
        createdAt: normalizeDate(record.createdAt),
        lastContactedAt: normalizeDate(record.lastContactedAt),
        nextFollowUpAt: normalizeDate(record.nextFollowUpAt),
    };
};

const dateColumns = new Set([
    'createdAt',
    'lastLoginAt',
    'lastContactedAt',
    'nextFollowUpAt'
]);

const normalizeSqlValue = (value, key) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    if (dateColumns.has(key)) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            throw new Error(`Invalid date for ${key}: ${value}`);
        }

        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    if (value instanceof Date) {
        return value.toISOString().slice(0, 19).replace('T', ' ');
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }

    return value;
};

const getMysqlConfig = () => ({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'dgap',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4_general_ci',
});

const isPlaceholderMysqlValue = (value) => {
    if (value === undefined || value === null) return false;

    return /your_mysql|mysql_password|changeme|placeholder|example|dummy|replace_me|test_password/i.test(
        String(value).trim()
    );
};

const hasUsableMysqlConfig = () => {
    const { host, user, password, database } = getMysqlConfig();

    if (!host || !database) {
        return false;
    }

    if (isPlaceholderMysqlValue(password) || isPlaceholderMysqlValue(database) || isPlaceholderMysqlValue(host) || isPlaceholderMysqlValue(user)) {
        return false;
    }

    return true;
};

const shouldUseJsonFallback = () => process.env.MYSQL_FALLBACK !== 'false';

const escapeIdentifier = (value) => `\`${String(value).replace(/`/g, '``')}\``;

const createMysqlPoolConfig = (database) => {
    const base = getMysqlConfig();

    return {
        host: base.host,
        port: base.port,
        user: base.user,
        password: base.password,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4_general_ci',
        ...(database ? { database } : {}),
    };
};


const ensureDatabaseAndTables = async (pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS admins (
            id CHAR(36) PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            passwordHash TEXT,
            role VARCHAR(32) DEFAULT 'admin',
            active BOOLEAN DEFAULT TRUE,
            lastLoginAt DATETIME NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
            id CHAR(36) PRIMARY KEY,
            name VARCHAR(255) DEFAULT '',
            email VARCHAR(255) DEFAULT '',
            phone VARCHAR(255) DEFAULT NULL,
            whatsapp VARCHAR(255) DEFAULT NULL,
            role VARCHAR(255) DEFAULT NULL,
            company VARCHAR(255) DEFAULT '',
            website VARCHAR(255) DEFAULT NULL,
            country VARCHAR(255) DEFAULT NULL,
            industry VARCHAR(255) DEFAULT NULL,
            companySize VARCHAR(255) DEFAULT NULL,
            budget VARCHAR(255) DEFAULT NULL,
            timeline VARCHAR(255) DEFAULT NULL,
            challenge TEXT DEFAULT '',
            channel VARCHAR(255) DEFAULT NULL,
            service VARCHAR(255) DEFAULT NULL,
            source VARCHAR(255) DEFAULT NULL,
            message TEXT DEFAULT '',
            status VARCHAR(32) DEFAULT 'NEW',
            priority VARCHAR(32) DEFAULT 'MEDIUM',
            notes TEXT DEFAULT '',
            lastContactedAt DATETIME NULL,
            nextFollowUpAt DATETIME NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS consultations (
            id CHAR(36) PRIMARY KEY,
            name VARCHAR(255) DEFAULT '',
            email VARCHAR(255) DEFAULT '',
            phone VARCHAR(255) DEFAULT NULL,
            whatsapp VARCHAR(255) DEFAULT NULL,
            role VARCHAR(255) DEFAULT NULL,
            company VARCHAR(255) DEFAULT '',
            website VARCHAR(255) DEFAULT NULL,
            country VARCHAR(255) DEFAULT NULL,
            industry VARCHAR(255) DEFAULT NULL,
            companySize VARCHAR(255) DEFAULT NULL,
            budget VARCHAR(255) DEFAULT NULL,
            timeline VARCHAR(255) DEFAULT NULL,
            challenge TEXT DEFAULT '',
            channel VARCHAR(255) DEFAULT NULL,
            service VARCHAR(255) DEFAULT NULL,
            source VARCHAR(255) DEFAULT NULL,
            message TEXT DEFAULT '',
            status VARCHAR(32) DEFAULT 'NEW',
            priority VARCHAR(32) DEFAULT 'MEDIUM',
            notes TEXT DEFAULT '',
            lastContactedAt DATETIME NULL,
            nextFollowUpAt DATETIME NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    return pool;
};

export const connectToMongo = async () => {
    if (mysqlReady && mysqlPool) return true;
    if (mysqlInitPromise) return mysqlInitPromise;

    mysqlInitPromise = (async () => {
        const production = process.env.NODE_ENV === 'production';
        let candidate = null;

        try {
            const missing = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_DATABASE']
                .filter((key) => !process.env[key]?.trim());

            if ((production && missing.length) || !hasUsableMysqlConfig()) {
                if (shouldUseJsonFallback()) {
                    console.warn('[db] MySQL configuration is missing or invalid; using JSON fallback.');
                    return false;
                }

                throw new Error('MySQL configuration is missing or invalid.');
            }

            const { database } = getMysqlConfig();

            const bootstrapPool = mysql.createPool({
                ...createMysqlPoolConfig(),
                connectTimeout: 10000,
            });

            try {
                await bootstrapPool.query(`CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(database)}`);
            } catch (error) {
                if (!['ER_DB_CREATE_EXISTS', 'ER_ALREADY_EXISTS'].includes(error?.code)) {
                    throw error;
                }
            } finally {
                await bootstrapPool.end().catch(() => {});
            }

            candidate = mysql.createPool({
                ...createMysqlPoolConfig(database),
                connectTimeout: 10000,
            });

            await candidate.query('SELECT 1');
            await ensureDatabaseAndTables(candidate);

            mysqlPool = candidate;
            mysqlReady = true;
            return true;
        } catch (error) {
            mysqlReady = false;
            mysqlPool = null;
            if (candidate) await candidate.end().catch(() => {});

            if (shouldUseJsonFallback()) {
                console.warn('[db] MySQL unavailable; using JSON fallback.');
                return false;
            }

            if (production) {
                const failure = new Error('MySQL unavailable; JSON fallback disabled in production.');
                failure.code = error.code || 'MYSQL_UNAVAILABLE';
                failure.status = 503;
                throw failure;
            }

            console.warn('[db] MySQL unavailable; using JSON in development.');
            return false;
        }
    })();

    try {
        return await mysqlInitPromise;
    } finally {
        mysqlInitPromise = null;
    }
};

export const connectToMySQL = connectToMongo;

export const readCollection = async (name) => {
    const useMysql = await connectToMongo();

    if (useMysql) {
        const table = tableNameFor(name);
        const [rows] = await mysqlPool.execute(`SELECT * FROM ${escapeIdentifier(table)} ORDER BY createdAt DESC`);
        return rows.map((record) => normalizeRecord(record));
    }

    return readJsonCollection(name);
};

export const appendToCollection = async (name, entry) => {
    const useMysql = await connectToMongo();

    if (useMysql) {
        const table = tableNameFor(name);
        const record = {
            ...entry,
            id: entry.id || crypto.randomUUID(),
            createdAt: entry.createdAt ? entry.createdAt : new Date(),
        };
        const columns = Object.keys(record);
        const placeholders = columns.map(() => '?').join(',');
        const values = columns.map((key) => normalizeSqlValue(record[key], key));

        await mysqlPool.execute(
            `INSERT INTO ${escapeIdentifier(table)} (${columns.map((key) => escapeIdentifier(key)).join(', ')}) VALUES (${placeholders})`,
            values
        );

        return normalizeRecord(record);
    }

    return appendJsonCollection(name, entry);
};

export const updateCollection = async (name, id, updates) => {
    const useMysql = await connectToMongo();

    if (useMysql) {
        const table = tableNameFor(name);
        const entries = Object.entries(updates || {});

        if (!entries.length) {
            const [rows] = await mysqlPool.execute(`SELECT * FROM ${escapeIdentifier(table)} WHERE id = ? LIMIT 1`, [id]);
            return rows[0] ? normalizeRecord(rows[0]) : null;
        }

        const assignments = entries.map(([key]) => `${escapeIdentifier(key)} = ?`).join(', ');
        const values = entries.map(([key, value]) => normalizeSqlValue(value, key));

        await mysqlPool.execute(
            `UPDATE ${escapeIdentifier(table)} SET ${assignments} WHERE id = ?`,
            [...values, id]
        );

        const [rows] = await mysqlPool.execute(`SELECT * FROM ${escapeIdentifier(table)} WHERE id = ? LIMIT 1`, [id]);
        return rows[0] ? normalizeRecord(rows[0]) : null;
    }

    const items = readJsonCollection(name);
    const index = items.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
        return null;
    }

    const nextItem = {
        ...items[index],
        ...Object.fromEntries(
            Object.entries(updates || {}).map(([key, value]) => [
                key,
                value instanceof Date ? value.toISOString() : value,
            ])
        ),
    };

    items[index] = nextItem;
    writeJsonCollection(name, items);

    return normalizeRecord(nextItem);
};

const tableNameFor = (name) => {
    if (!allowedTables.has(name)) {
        throw new Error(`Unsupported table name: ${name}`);
    }

    return name;
};

export const findAdminByEmail = async (email) => {
    const useMysql = await connectToMongo();

    if (!useMysql) {
        const normalizedEmail = String(email).toLowerCase().trim();
        const admins = readJsonCollection('admins');
        const admin = admins.find(
            (entry) =>
                String(entry.email || '').toLowerCase() === normalizedEmail &&
                (entry.role || 'admin') === 'admin' &&
                entry.active !== false
        );

        return admin ? normalizeRecord(admin) : null;
    }

    const [rows] = await mysqlPool.execute(
        `SELECT * FROM ${escapeIdentifier('admins')} WHERE email = ? AND role = 'admin' AND active = 1 LIMIT 1`,
        [String(email).toLowerCase().trim()]
    );

    return rows[0] ? normalizeRecord(rows[0]) : null;
};

export const createAdmin = async ({ email, passwordHash }) => {
    const useMysql = await connectToMongo();

    if (!useMysql) {
        const normalizedEmail = String(email).toLowerCase().trim();
        const admins = readJsonCollection('admins');

        if (admins.some((entry) => String(entry.email || '').toLowerCase() === normalizedEmail)) {
            throw new Error('An administrator with this email already exists.');
        }

        const admin = {
            id: crypto.randomUUID(),
            email: normalizedEmail,
            passwordHash,
            role: 'admin',
            active: true,
            lastLoginAt: null,
            createdAt: new Date().toISOString(),
        };

        admins.push(admin);
        writeJsonCollection('admins', admins);
        return normalizeRecord(admin);
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const [existingRows] = await mysqlPool.execute(
        `SELECT id FROM ${escapeIdentifier('admins')} WHERE email = ? LIMIT 1`,
        [normalizedEmail]
    );

    if (existingRows.length) {
        throw new Error('An administrator with this email already exists.');
    }

    const admin = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
        active: true,
        lastLoginAt: null,
        createdAt: new Date(),
    };

    const columns = Object.keys(admin);
    const values = columns.map((key) => normalizeSqlValue(admin[key], key));

    await mysqlPool.execute(
        `INSERT INTO ${escapeIdentifier('admins')} (${columns.map((key) => escapeIdentifier(key)).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        values
    );

    return admin;
};

export const updateAdminLogin = async (id) => {
    const useMysql = await connectToMongo();

    if (!useMysql) {
        const admins = readJsonCollection('admins');
        const index = admins.findIndex((entry) => String(entry.id) === String(id));

        if (index === -1) {
            return null;
        }

        admins[index].lastLoginAt = new Date().toISOString();
        writeJsonCollection('admins', admins);
        return admins[index];
    }

    const [result] = await mysqlPool.execute(
        `UPDATE ${escapeIdentifier('admins')} SET lastLoginAt = NOW() WHERE id = ?`,
        [id]
    );

    return result;
};

export const updateAdminPassword = async (id, passwordHash) => {
    const useMysql = await connectToMongo();

    if (!useMysql) {
        const admins = readJsonCollection('admins');
        const index = admins.findIndex((entry) => String(entry.id) === String(id));

        if (index === -1) {
            return null;
        }

        admins[index].passwordHash = passwordHash;
        writeJsonCollection('admins', admins);
        return admins[index];
    }

    const [result] = await mysqlPool.execute(
        `UPDATE ${escapeIdentifier('admins')} SET passwordHash = ? WHERE id = ?`,
        [passwordHash, id]
    );

    return result;
};

export const isMongoEnabled = () => mysqlReady;
