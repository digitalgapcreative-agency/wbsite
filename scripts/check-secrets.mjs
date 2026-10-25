// Scans the project for credentials that should live in environment variables instead.
// Usage: npm run check:secrets   (run before zipping or pushing)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SKIP = new Set(['node_modules', 'dist', '.ssr', 'preview-dist', '.git']);
const EXT = /\.(m?js|jsx|ts|json|sql|html|md|txt|ya?ml|env.*)$/i;

const RULES = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b(DB_PASSWORD|SMTP_PASS|SESSION_SECRET|ADMIN_PASSWORD_HASH)\s*=\s*(?!change-me\b|\$\{|$|\s)[^\s#]{6,}/, 'credential assignment'],
  [/scrypt:\d+:\d+:\d+:[0-9a-f]{32}:[0-9a-f]{64,}/, 'admin password hash'],
  [/\b(password|passwd|secret|api[_-]?key|token)\b\s*[:=]\s*['"][^'"\s]{8,}['"]/i, 'hard-coded secret'],
  [/mysql:\/\/[^:\s]+:[^@\s]+@/, 'database URL with password']
];

const findings = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (EXT.test(e.name) || e.name.startsWith('.env')) {
      if (e.name === '.env' || (e.name.startsWith('.env.') && e.name !== '.env.example')) {
        findings.push(`${path.relative(ROOT, p)}: environment file must not be shipped`);
        continue;
      }
      if (p.endsWith(path.join('scripts', 'check-secrets.mjs'))) continue;
      fs.readFileSync(p, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const [re, label] of RULES) if (re.test(line)) findings.push(`${path.relative(ROOT, p)}:${i + 1}: ${label}`);
        });
    }
  }
}
walk(ROOT);

if (findings.length) {
  console.error('FAIL: possible secrets found:\n  ' + findings.join('\n  '));
  process.exit(1);
}
console.log('SUCCESS: no secrets found in the project files.');
