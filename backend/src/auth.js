import crypto from 'node:crypto';
import { config } from './config.js';

// Password hashes use Node's built-in scrypt (no native deps — works on shared hosting).
// Format: scrypt:N:r:p:saltHex:hashHex   (generate with: npm run admin:hash -- "your password")
const KEYLEN = 64;

export function hashPassword(password, { N = 16384, r = 8, p = 1 } = {}) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, KEYLEN, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt:${N}:${r}:${p}:${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  try {
    const [alg, N, r, p, saltHex, hashHex] = String(stored).split(':');
    if (alg !== 'scrypt' || !saltHex || !hashHex) return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(String(password), Buffer.from(saltHex, 'hex'), expected.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024
    });
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Checks credentials against ADMIN_EMAIL / ADMIN_PASSWORD_HASH. Always runs scrypt to keep timing flat. */
export function checkAdminCredentials(email, password) {
  const emailOk = config.admin.configured && safeEqual(String(email || '').trim().toLowerCase(), config.admin.email);
  const passOk = verifyPassword(password, config.admin.passwordHash || hashDummy);
  return Boolean(emailOk && passOk && config.admin.configured);
}
const hashDummy = 'scrypt:16384:8:1:00000000000000000000000000000000:' + '0'.repeat(128);

export function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.status(401).json({ ok: false, error: 'unauthenticated' });
}

/**
 * CSRF defence for cookie-authenticated, state-changing requests:
 * session cookie is SameSite=Lax, and we additionally require a JSON body type
 * and an Origin/Referer that belongs to the site.
 */
export function requireSameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin') || (req.get('referer') ? new URL(req.get('referer')).origin : '');
  const allowed = new Set([config.siteUrl, ...config.corsOrigins]);
  const selfOrigin = `${req.protocol}://${req.get('host')}`;
  if (origin && !allowed.has(origin) && origin !== selfOrigin) {
    return res.status(403).json({ ok: false, error: 'bad_origin' });
  }
  if (req.method !== 'DELETE' && !req.is('application/json')) {
    return res.status(415).json({ ok: false, error: 'json_required' });
  }
  return next();
}
