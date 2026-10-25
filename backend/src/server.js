import './env.js';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { config, configWarnings } from './config.js';
import { ensureSchema, pingDb } from './db.js';
import { createSessionMiddleware } from './session.js';
import { apiRouter } from './routes/api.js';
import { authRouter, adminRouter } from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../../frontend/dist');

const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);

// ---------- HTTPS + canonical host (Hostinger terminates SSL at its proxy) ----------
app.use((req, res, next) => {
  if (req.path === '/api/health') return next();
  const host = req.get('host') || '';
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  if (!isLocal) {
    if (config.forceHttps && req.protocol !== 'https') {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }
    if (config.canonicalHost && host === `www.${config.canonicalHost}`) {
      return res.redirect(301, `https://${config.canonicalHost}${req.originalUrl}`);
    }
  }
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'connect-src': ["'self'", ...config.corsOrigins],
        'frame-ancestors': ["'self'"],
        'form-action': ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: config.isProd ? { maxAge: 15552000, includeSubDomains: true } : false
  })
);
app.use(compression());

// ---------- API ----------
// CORS matters only when the frontend calls the API from another origin (e.g. api.digitalgapco.com).
const corsMw = cors({
  origin(origin, cb) {
    if (!origin || config.corsOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  maxAge: 600
});

app.use('/api', corsMw, express.json({ limit: '20kb' }), createSessionMiddleware());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', apiRouter);
app.all('/api/*', (_req, res) => res.status(404).json({ ok: false, error: 'not_found' }));

// ---------- Frontend ----------
if (fs.existsSync(DIST)) {
  app.use(
    express.static(DIST, {
      index: 'index.html',
      redirect: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
        if (filePath.includes(`${path.sep}admin${path.sep}`)) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      }
    })
  );

  // Admin app: one shell for every /admin/* URL (client-side routing, never indexed)
  app.get(['/admin', '/admin/*'], (_req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(path.join(DIST, 'admin', 'index.html'));
  });

  // Prerendered pages (/services -> /services/index.html). Unknown URLs get the real 404 page.
  app.get('*', (req, res) => {
    let clean;
    try {
      clean = path.normalize(decodeURIComponent(req.path)).replace(/^(\.\.[/\\])+/, '');
    } catch {
      clean = '/';
    }
    const candidate = path.join(DIST, clean.replace(/\/+$/, ''), 'index.html');
    if (candidate.startsWith(DIST) && fs.existsSync(candidate)) {
      if (req.path.length > 1 && req.path.endsWith('/')) return res.redirect(301, req.path.replace(/\/+$/, ''));
      res.setHeader('Cache-Control', 'no-cache');
      return res.sendFile(candidate);
    }
    const notFound = path.join(DIST, '404.html');
    if (fs.existsSync(notFound)) return res.status(404).sendFile(notFound);
    return res.sendFile(path.join(DIST, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => res.type('text').send('Frontend build not found. Run "npm run build" first.'));
}

app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  if (res.headersSent) return;
  res.status(500).json({ ok: false, error: 'internal_error' });
});

// ---------- Start ----------
// Hostinger injects PORT. No host argument: Node listens on all interfaces, not only localhost.
// PORT comes from Hostinger: usually a number, on some setups a socket path. Never hard-code it.
const rawPort = String(process.env.PORT || '3000');
const isSocket = !/^\d+$/.test(rawPort);
const host = process.env.HOST || '0.0.0.0';
const listenArgs = isSocket ? [rawPort] : [Number(rawPort), host];
const server = app.listen(...listenArgs, () => {
  console.log(`[dgap] listening on ${isSocket ? rawPort : `${host}:${rawPort}`} (${config.env}, node ${process.version})`);
  for (const w of configWarnings()) console.warn(`[dgap] config: ${w}`);
  if (config.db.configured) {
    ensureSchema()
      .then(() => pingDb())
      .then((ok) => console.log(`[dgap] database ${ok ? 'connected, schema ready' : 'unreachable'}`))
      .catch((e) => console.error('[dgap] database init failed:', e.message));
  }
});

const shutdown = (sig) => {
  console.log(`[dgap] ${sig} received, closing`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (e) => console.error('[dgap] unhandled rejection:', e?.message || e));
