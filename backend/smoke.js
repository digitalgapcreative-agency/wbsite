import 'dotenv/config';
import http from 'node:http';
import { createApp } from './src/core/app.js';

const PORT = 0;

const app = createApp();
const server = http.createServer(app);

const request = (path, options = {}) =>
  new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: server.address().port,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );

    req.on('error', reject);
    req.end();
  });

const assertStatus = (result, expected, name) => {
  if (result.status !== expected) {
    throw new Error(
      `${name}: esperado ${expected}, recebido ${result.status}\n${result.body}`
    );
  }

  console.log(`✓ ${name}`);
};

try {
  await new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', resolve);
  });

  console.log('DGAP smoke test');
  console.log('================');

  const health = await request('/health');
  assertStatus(health, 200, 'Health check');

  const services = await request('/api/services');
  assertStatus(services, 200, 'Services endpoint');

  const me = await request('/api/auth/me');

  if (![401, 403].includes(me.status)) {
    throw new Error(
      `Auth protection: esperado 401/403, recebido ${me.status}`
    );
  }

  console.log('✓ Admin endpoint protegido');

  console.log('\nSmoke test concluído com sucesso.');
} catch (error) {
  console.error('\n✗ Smoke test falhou.');
  console.error(error);
  process.exitCode = 1;
} finally {
  server.close();
}
