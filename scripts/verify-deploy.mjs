// Post-deploy checks, run from your own computer (no SSH needed):
//   npm run verify                                  -> checks https://digitalgapco.com
//   npm run verify -- https://digitalgapco.com https://api.digitalgapco.com
import tls from 'node:tls';

const BASE = (process.argv[2] || 'https://digitalgapco.com').replace(/\/$/, '');
const API = (process.argv[3] || '').replace(/\/$/, '');
const host = new URL(BASE).hostname;

let failed = 0;
let warned = 0;
const pass = (m) => console.log(`  PASS  ${m}`);
const fail = (m) => (failed++, console.log(`  FAIL  ${m}`));
const warn = (m) => (warned++, console.log(`  WARN  ${m}`));

async function get(url, opts = {}) {
  try {
    return await fetch(url, { redirect: 'manual', ...opts, signal: AbortSignal.timeout(15000) });
  } catch (e) {
    return { status: 0, error: e.cause?.code || e.message, headers: new Headers(), text: async () => '', json: async () => ({}) };
  }
}

function certDays(hostname) {
  return new Promise((resolve) => {
    const s = tls.connect({ host: hostname, port: 443, servername: hostname, timeout: 10000 }, () => {
      const c = s.getPeerCertificate();
      s.end();
      resolve(c?.valid_to ? Math.floor((new Date(c.valid_to) - Date.now()) / 86400000) : null);
    });
    s.on('error', () => resolve(null));
    s.on('timeout', () => (s.destroy(), resolve(null)));
  });
}

console.log(`\nVerifying ${BASE}${API ? ` and ${API}` : ''}\n`);

// 1. Frontend
for (const [label, path] of [
  ['home', '/'],
  ['services (refresh on a route)', '/services'],
  ['Indonesian home', '/id'],
  ['Indonesian route', '/id/layanan'],
  ['case study', '/work/mindcare'],
  ['contact', '/contact']
]) {
  const r = await get(BASE + path);
  const body = r.status === 200 ? await r.text() : '';
  if (r.status === 200 && body.includes('<title')) pass(`${label} ${path} → 200`);
  else fail(`${label} ${path} → ${r.status || r.error}`);
}

const nf = await get(`${BASE}/this-page-should-not-exist-${Date.now()}`);
nf.status === 404 ? pass('unknown URL → 404 page') : fail(`unknown URL → ${nf.status} (expected 404)`);

for (const f of ['/sitemap.xml', '/robots.txt']) {
  const r = await get(BASE + f);
  r.status === 200 ? pass(`${f} → 200`) : fail(`${f} → ${r.status || r.error}`);
}

// 2. www + http
const www = await fetch(`https://www.${host}/`, { redirect: 'follow', signal: AbortSignal.timeout(15000) }).catch((e) => ({ status: 0, error: e.cause?.code || e.message }));
www.status === 200 ? pass(`https://www.${host} loads (final ${www.url || ''})`) : fail(`https://www.${host} → ${www.status || www.error}`);

const http = await get(`http://${host}/`);
if ([301, 302, 307, 308].includes(http.status) && (http.headers.get('location') || '').startsWith('https://')) pass('http:// redirects to https://');
else warn(`http:// returned ${http.status || http.error} — enable "Force HTTPS" in hPanel (or FORCE_HTTPS=true)`);

// 3. SSL
for (const h of [host, `www.${host}`, ...(API ? [new URL(API).hostname] : [])]) {
  const days = await certDays(h);
  if (days === null) fail(`SSL certificate for ${h} not readable`);
  else if (days < 14) warn(`SSL for ${h} expires in ${days} days`);
  else pass(`SSL for ${h} valid (${days} days left)`);
}

// 4. API health
async function health(base, label) {
  const r = await get(`${base}/api/health`);
  const d = await r.json().catch(() => ({}));
  if (r.status !== 200 || !d.ok) return fail(`${label} /api/health → ${r.status || r.error} ${JSON.stringify(d)}`);
  pass(`${label} /api/health ok (node ${d.node}, uptime ${d.uptime}s)`);
  d.database === 'connected' ? pass('database connected') : fail(`database: ${d.database}`);
  d.schema === 'ready' ? pass('schema imported (leads, sessions, admin_audit)') : fail(`schema: ${d.schema}`);
  d.sessions === 'mysql' ? pass('sessions stored in MySQL') : fail(`sessions: ${d.sessions}`);
  d.adminLogin ? pass('admin login configured') : fail('admin login not configured');
  d.mail === 'configured' ? pass('SMTP configured') : warn('SMTP not configured — leads will not be emailed');
  for (const w of d.warnings || []) warn(`server: ${w}`);
}
await health(BASE, 'main');
if (API) await health(API, 'api subdomain');

// 5. Auth endpoints
const login = await get(`${BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: BASE },
  body: JSON.stringify({ email: 'verify@example.com', password: 'x'.repeat(16) })
});
login.status === 401 ? pass('login rejects wrong credentials (401)') : fail(`login with wrong credentials → ${login.status || login.error}`);

const me = await get(`${BASE}/api/auth/me`);
me.status === 401 ? pass('/api/auth/me requires a session') : fail(`/api/auth/me → ${me.status}`);

const adm = await get(`${BASE}/admin`);
adm.status === 200 && /noindex/.test(adm.headers.get('x-robots-tag') || '') ? pass('/admin loads and is noindex') : fail(`/admin → ${adm.status}`);

const leak = await get(`${BASE}/.env`);
leak.status !== 200 ? pass('.env is not publicly served') : fail('.env is publicly reachable!');

console.log(`\n${failed ? 'FAIL' : 'SUCCESS'}: ${failed} failed, ${warned} warnings\n`);
process.exit(failed ? 1 : 0);
