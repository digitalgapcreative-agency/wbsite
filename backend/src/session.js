import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { config } from './config.js';

let storeKind = 'disabled';

/**
 * Sessions are stored in MySQL (table `sessions`) so logins survive restarts and redeploys.
 * Without a database it falls back to memory (fine for local dev only).
 * Without SESSION_SECRET, sessions are disabled and admin login is refused.
 */
export function createSessionMiddleware() {
  if (!config.session.secret) {
    storeKind = 'disabled';
    return (_req, _res, next) => next();
  }

  let store;
  if (config.db.configured) {
    const MySQLStore = MySQLStoreFactory(session);
    store = new MySQLStore({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      createDatabaseTable: true,
      clearExpired: true,
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: config.session.maxAgeHours * 3600 * 1000,
      schema: { tableName: 'sessions', columnNames: { session_id: 'session_id', expires: 'expires', data: 'data' } }
    });
    store.onReady?.().catch((e) => console.error('[session] store error:', e.message));
    storeKind = 'mysql';
  } else {
    storeKind = 'memory';
    console.warn('[session] using in-memory store (no database configured) — not for production');
  }

  return session({
    name: config.session.name,
    secret: config.session.secret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: config.trustProxy,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProd ? 'auto' : false,
      domain: config.session.cookieDomain,
      maxAge: config.session.maxAgeHours * 3600 * 1000,
      path: '/'
    }
  });
}

export const sessionStoreKind = () => storeKind;
