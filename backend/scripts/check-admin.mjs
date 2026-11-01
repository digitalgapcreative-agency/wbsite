// Checks the hPanel values against the email and password you type on /admin. Runs locally; sends nothing.
// Usage: npm run admin:check
import { verifyPassword } from '../src/auth.js';
import { cleanEnvValue } from '../src/config.js';
import { ask, closePrompt } from './prompt.mjs';

const problems = [];
const describe = (name, raw, clean) => {
  if (raw !== raw.trim()) problems.push(`${name}: has spaces or a line break before/after the value`);
  if (new RegExp(`^\\s*${name}\\s*=`).test(raw)) problems.push(`${name}: starts with "${name}=" (paste only what comes after "=")`);
  if (/^\s*["']/.test(raw)) problems.push(`${name}: is wrapped in quotes`);
  return clean;
};

const rawEmail = await ask('1/4 Paste the ADMIN_EMAIL value exactly as it is in hPanel: ');
const envEmail = describe('ADMIN_EMAIL', rawEmail, cleanEnvValue(rawEmail, 'ADMIN_EMAIL').toLowerCase());
const loginEmail = (await ask('2/4 Email you type on /admin: ')).trim().toLowerCase();

const rawHash = await ask('3/4 Paste the ADMIN_PASSWORD_HASH value exactly as it is in hPanel: ');
const hash = describe('ADMIN_PASSWORD_HASH', rawHash, cleanEnvValue(rawHash, 'ADMIN_PASSWORD_HASH'));
const parts = hash.split(':');
if (parts[0] !== 'scrypt' || parts.length !== 6 || parts[4].length !== 32 || parts[5].length !== 128) {
  console.log('\nFAIL: ADMIN_PASSWORD_HASH is not a complete hash (cut off or wrong value).');
  console.log('      Generate a new one with: npm run admin:hash');
  closePrompt();
  process.exit(1);
}
const pw = await ask('4/4 Password you type on /admin (hidden): ', { hidden: true });
closePrompt();

const emailOk = envEmail === loginEmail;
const passOk = verifyPassword(pw, hash);
console.log('');
console.log(`${emailOk ? 'PASS' : 'FAIL'}  email ${emailOk ? 'matches ADMIN_EMAIL' : `"${loginEmail}" is not ADMIN_EMAIL "${envEmail}"`}`);
console.log(`${passOk ? 'PASS' : 'FAIL'}  password ${passOk ? 'matches ADMIN_PASSWORD_HASH' : 'does not match ADMIN_PASSWORD_HASH'}`);
for (const p of problems) console.log(`NOTE  ${p}. The updated server ignores this; fix it in hPanel anyway.`);

if (emailOk && passOk) {
  console.log('\nSUCCESS: these credentials will log in once the deployed server has these exact values.');
} else {
  if (!emailOk) console.log('\nFix: set ADMIN_EMAIL in hPanel to the email you use, then Guardar e reimplementar.');
  if (!passOk) console.log('\nFix: run "npm run admin:hash", paste the new Value into ADMIN_PASSWORD_HASH, then Guardar e reimplementar.');
  process.exit(1);
}
