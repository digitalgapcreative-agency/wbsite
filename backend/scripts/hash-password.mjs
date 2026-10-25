// Generates the value for ADMIN_PASSWORD_HASH (and a SESSION_SECRET) on your own computer.
// Usage: npm run admin:hash -- "your-strong-password"
import crypto from 'node:crypto';
import { hashPassword, verifyPassword } from '../src/auth.js';

const pw = process.argv[2];
if (!pw || pw.length < 12) {
  console.error('FAIL: pass a password of at least 12 characters, e.g. npm run admin:hash -- "a-long-passphrase"');
  process.exit(1);
}
const hash = hashPassword(pw);
if (!verifyPassword(pw, hash)) {
  console.error('FAIL: hash verification failed');
  process.exit(1);
}
console.log('SUCCESS — add these to Hostinger environment variables:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`SESSION_SECRET=${crypto.randomBytes(48).toString('base64url')}`);
