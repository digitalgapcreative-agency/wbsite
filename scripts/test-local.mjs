// End-to-end test of forms, login, sessions and database operations against a running server.
// Usage: TEST_ADMIN_PASSWORD="..." npm run test:local -- http://localhost:3000
// (needs the same ADMIN_EMAIL in the environment as the server)
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.TEST_ADMIN_PASSWORD;

let failed = 0;
const ok = (c, m) => (c ? console.log(`  PASS  ${m}`) : (failed++, console.log(`  FAIL  ${m}`)));
let cookie = '';

async function call(path, { method = 'GET', body, raw } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), Origin: BASE, ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  return { status: res.status, data: raw ? await res.text() : await res.json().catch(() => ({})), headers: res.headers };
}

console.log(`\nTesting ${BASE}\n`);
const h = await call('/api/health');
ok(h.status === 200 && h.data.ok, `health ok (db ${h.data.database}, schema ${h.data.schema}, sessions ${h.data.sessions})`);

const tag = `e2e-${Date.now()}`;
const lead = await call('/api/leads', {
  method: 'POST',
  body: { name: 'E2E Tester', company: tag, email: 'e2e@example.com', stage: 'website', message: 'Automated test — safe to delete', locale: 'en', sourcePath: '/contact' }
});
ok(lead.status === 201, `form submission stored (${lead.status})`);
const bad = await call('/api/leads', { method: 'POST', body: { name: '', company: '', email: 'x' } });
ok(bad.status === 422, 'form validation rejects invalid input');

ok((await call('/api/admin/leads')).status === 401, 'admin API blocked without session');
ok((await call('/api/auth/login', { method: 'POST', body: { email: EMAIL, password: 'wrong' } })).status === 401, 'wrong password rejected');

if (!EMAIL || !PASSWORD) {
  console.log('  SKIP  login flow — set ADMIN_EMAIL and TEST_ADMIN_PASSWORD to test it');
} else {
  const login = await call('/api/auth/login', { method: 'POST', body: { email: EMAIL, password: PASSWORD } });
  ok(login.status === 200 && cookie.includes('='), 'login creates a session cookie');
  ok((await call('/api/auth/me')).status === 200, 'session recognised on next request');

  const list = await call(`/api/admin/leads?q=${tag}`);
  const row = list.data.rows?.[0];
  ok(row && row.company === tag, 'new lead visible in admin list');

  if (row) {
    ok((await call(`/api/admin/leads/${row.id}`, { method: 'PATCH', body: { status: 'contacted', notes: 'called' } })).status === 200, 'status + notes updated');
    const again = await call(`/api/admin/leads?q=${tag}`);
    ok(again.data.rows?.[0]?.status === 'contacted', 'update persisted in database');
    const csv = await call(`/api/admin/leads.csv?q=${tag}`, { raw: true });
    ok(csv.status === 200 && csv.data.includes(tag), 'CSV export works');
    ok((await call(`/api/admin/leads/${row.id}`, { method: 'DELETE' })).status === 200, 'test lead deleted');
  }
  const stats = await call('/api/admin/stats');
  ok(stats.status === 200 && typeof stats.data.last30 === 'number', 'stats endpoint works');

  ok((await call('/api/auth/logout', { method: 'POST', body: {} })).status === 200, 'logout');
  ok((await call('/api/auth/me')).status === 401, 'session destroyed after logout');
}

console.log(`\n${failed ? 'FAIL' : 'SUCCESS'}: ${failed} check(s) failed\n`);
process.exit(failed ? 1 : 0);
