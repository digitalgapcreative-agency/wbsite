import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config, configWarnings } from '../config.js';
import { insertLead, pingDb, schemaReady } from '../db.js';
import { sessionStoreKind } from '../session.js';
import { sendLeadEmail } from '../mailer.js';

export const apiRouter = Router();

apiRouter.get('/health', async (_req, res) => {
  const db = config.db.configured ? await pingDb() : null;
  const schema = db ? await schemaReady() : false;
  const ok = db !== false && (db === null || schema);
  res.set('Cache-Control', 'no-store');
  res.status(ok ? 200 : 503).json({
    ok,
    service: 'dgap-api',
    version: process.env.npm_package_version || '1.1.0',
    env: config.env,
    node: process.version,
    uptime: Math.round(process.uptime()),
    database: db === null ? 'not_configured' : db ? 'connected' : 'unreachable',
    schema: db ? (schema ? 'ready' : 'missing_tables') : 'n/a',
    sessions: sessionStoreKind(),
    adminLogin: Boolean(config.session.secret && config.admin.configured),
    mail: config.mail.configured ? 'configured' : 'not_configured',
    warnings: configWarnings(),
    time: new Date().toISOString()
  });
});

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: 'rate_limited' }
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STAGES = new Set(['brand', 'marketing', 'website', 'operations', 'unsure']);
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

apiRouter.post('/leads', leadLimiter, async (req, res) => {
  const b = req.body || {};

  // Honeypot: real people never fill the hidden "website" field.
  if (b.website) return res.status(200).json({ ok: true });

  const lead = {
    name: clip(b.name, 120),
    company: clip(b.company, 160),
    email: clip(b.email, 190).toLowerCase(),
    phone: clip(b.phone, 40),
    stage: STAGES.has(b.stage) ? b.stage : 'unsure',
    message: clip(b.message, 4000),
    locale: b.locale === 'id' ? 'id' : 'en',
    sourcePath: clip(b.sourcePath, 255),
    userAgent: clip(req.get('user-agent') || '', 255),
    ipHash: crypto.createHash('sha256').update(String(req.ip || '')).digest('hex')
  };

  const errors = {};
  if (lead.name.length < 2) errors.name = 'required';
  if (lead.company.length < 2) errors.company = 'required';
  if (!EMAIL_RE.test(lead.email)) errors.email = 'invalid';
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors });

  let stored = false;
  let emailed = false;

  try {
    stored = Boolean(await insertLead(lead));
  } catch (e) {
    console.error('[leads] db insert failed:', e.message);
  }
  try {
    emailed = await sendLeadEmail(lead);
  } catch (e) {
    console.error('[leads] email failed:', e.message);
  }

  if (!stored && !emailed) {
    return res.status(503).json({ ok: false, error: 'unavailable' });
  }
  return res.status(201).json({ ok: true });
});
