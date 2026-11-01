// Generates ADMIN_PASSWORD_HASH and SESSION_SECRET on your own computer.
// Usage: npm run admin:hash        (asks for the password, hidden; nothing is saved in shell history)
import crypto from 'node:crypto';
import { hashPassword, verifyPassword } from '../src/auth.js';
import { ask, closePrompt } from './prompt.mjs';

const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exit(1); };

let pw = process.argv[2];
if (!pw) {
  pw = await ask('Admin password (hidden, min. 12 characters): ', { hidden: true });
  const again = await ask('Repeat the password (hidden): ', { hidden: true });
  if (pw !== again) fail('the two passwords are different. Run it again.');
}
closePrompt();
if (pw.length < 12) fail('the password must have at least 12 characters.');
if (pw !== pw.trim()) fail('the password starts or ends with a space. Remove it and run again.');

const hash = hashPassword(pw);
if (!verifyPassword(pw, hash)) fail('hash verification failed');

console.log('\nSUCCESS. In hPanel → Variáveis de ambiente, set these two keys.');
console.log('Paste ONLY the value (the line under "Value"), not the key name and not "=".\n');
console.log('Key:   ADMIN_PASSWORD_HASH');
console.log(`Value: ${hash}\n`);
console.log('Key:   SESSION_SECRET');
console.log(`Value: ${crypto.randomBytes(48).toString('base64url')}\n`);
console.log('Then: Guardar e reimplementar. Check before deploying with: npm run admin:check');
