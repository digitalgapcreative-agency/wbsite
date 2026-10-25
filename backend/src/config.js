const list = (v, fallback = []) =>
  v ? v.split(',').map((s) => s.trim()).filter(Boolean) : fallback;
const bool = (v, fallback) => (v === undefined || v === '' ? fallback : v === 'true' || v === '1');

const env = process.env.NODE_ENV || 'production';
const isProd = env === 'production';

export const config = {
  env,
  isProd,
  siteUrl: (process.env.SITE_URL || 'https://digitalgapco.com').replace(/\/$/, ''),
  trustProxy: bool(process.env.TRUST_PROXY, true),
  // Off by default: enable only if hPanel's own "Force HTTPS" is off and the proxy sends X-Forwarded-Proto.
  forceHttps: bool(process.env.FORCE_HTTPS, false),
  // e.g. "digitalgapco.com": requests to www.digitalgapco.com are 301-redirected here
  canonicalHost: process.env.CANONICAL_HOST || '',
  corsOrigins: list(process.env.CORS_ORIGINS, [
    'https://digitalgapco.com',
    'https://www.digitalgapco.com',
    'https://api.digitalgapco.com'
  ]),

  db: {
    // DB_* names, or the MYSQL_* names already set in hPanel for the old site
    host: process.env.DB_HOST || process.env.MYSQL_HOST || '',
    port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
    user: process.env.DB_USER || process.env.MYSQL_USER || '',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE || '',
    get configured() {
      return Boolean(this.host && this.user && this.database);
    }
  },

  session: {
    secret: process.env.SESSION_SECRET || '',
    name: process.env.SESSION_NAME || 'dgap.sid',
    // ".digitalgapco.com" shares the cookie between the main domain and api.digitalgapco.com
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
    maxAgeHours: Number(process.env.SESSION_MAX_AGE_HOURS) || 8
  },

  admin: {
    email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
    get configured() {
      return Boolean(this.email && this.passwordHash);
    }
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: bool(process.env.SMTP_SECURE, true),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || process.env.SMTP_USER || '',
    to: process.env.MAIL_TO || '',
    get configured() {
      return Boolean(this.host && this.user && this.pass && this.to);
    }
  }
};

/** Problems that should be visible in the log and in /api/health, without leaking values. */
export function configWarnings() {
  const w = [];
  if (!config.db.configured) w.push('DB_HOST / DB_USER / DB_NAME not set');
  if (!config.session.secret) w.push('SESSION_SECRET not set (admin login disabled)');
  else if (config.session.secret.length < 32) w.push('SESSION_SECRET shorter than 32 characters');
  if (!config.admin.configured) w.push('ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set (admin login disabled)');
  if (!config.mail.configured) w.push('SMTP_* / MAIL_TO not set (no lead emails)');
  return w;
}
