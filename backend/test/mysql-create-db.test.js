import test from 'node:test';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';

const originalEnv = { ...process.env };

const resetEnv = () => {
  process.env.MYSQL_HOST = '127.0.0.1';
  process.env.MYSQL_PORT = '3306';
  process.env.MYSQL_DATABASE = 'dgap';
  process.env.MYSQL_USER = 'root';
  process.env.MYSQL_PASSWORD = '';
};

test('connectToMongo creates the database when it does not exist yet', { concurrency: false }, async () => {
  process.env.NODE_ENV = 'development';
  resetEnv();

  const calls = [];
  let databaseExists = false;
  const originalCreatePool = mysql.createPool;

  mysql.createPool = (config) => {
    const pool = {
      config,
      async query(sql) {
        calls.push(sql);

        if (sql.includes('CREATE DATABASE IF NOT EXISTS')) {
          databaseExists = true;
          return [[{ 1: 1 }]];
        }

        if (sql === 'SELECT 1') {
          if (config.database === 'dgap' && !databaseExists) {
            const err = new Error("Unknown database 'dgap'");
            err.code = 'ER_BAD_DB_ERROR';
            throw err;
          }
          return [[{ 1: 1 }]];
        }

        return [[{ 1: 1 }]];
      },
      async execute(sql, params) {
        calls.push(`${sql} :: ${JSON.stringify(params)}`);
        return [[{ affectedRows: 1 }]];
      },
      async end() {},
    };

    return pool;
  };

  try {
    const { connectToMongo } = await import(`../src/utils/database.js?test=${Date.now()}-${Math.random()}`);
    const connected = await connectToMongo();

    assert.equal(connected, true);
    assert.ok(calls.some((sql) => sql.includes('CREATE DATABASE IF NOT EXISTS')));
  } finally {
    mysql.createPool = originalCreatePool;
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) delete process.env[key];
    });
    Object.assign(process.env, originalEnv);
  }
});

test('connectToMongo falls back to JSON storage when MySQL is unavailable in production', { concurrency: false }, async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMysql = { ...process.env };

  process.env.NODE_ENV = 'production';
  delete process.env.MYSQL_HOST;
  delete process.env.MYSQL_PORT;
  delete process.env.MYSQL_DATABASE;
  delete process.env.MYSQL_USER;
  delete process.env.MYSQL_PASSWORD;

  const originalCreatePool = mysql.createPool;
  mysql.createPool = () => {
    const pool = {
      async query() {
        const err = new Error('connect ECONNREFUSED');
        err.code = 'ECONNREFUSED';
        throw err;
      },
      async execute() {
        return [[{ affectedRows: 1 }]];
      },
      async end() {},
    };

    return pool;
  };

  try {
    const { connectToMongo } = await import(`../src/utils/database.js?fallback-${Date.now()}-${Math.random()}`);
    const connected = await connectToMongo();

    assert.equal(connected, false);
  } finally {
    mysql.createPool = originalCreatePool;
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    Object.keys(process.env).forEach((key) => {
      if (!(key in originalMysql)) delete process.env[key];
    });
    Object.assign(process.env, originalMysql);
  }
});
