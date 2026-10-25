import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { checkAdminCredentials, requireAuth, requireSameOrigin } from '../auth.js';
import { audit, deleteLead, exportLeads, getPool, leadStats, listLeads, updateLead } from '../db.js';

export const authRouter = Router();
export const adminRouter = Router();

const ipHash = (req) => crypto.createHash('sha256').update(String(req.ip || '')).digest('hex');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { ok: false, error: 'rate_limited' }
});

authRouter.use(requireSameOrigin);

authRouter.get('/me', (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (req.session?.user) return res.json({ ok: true, user: req.session.user });
  return res.status(401).json({ ok: false, error: 'unauthenticated', loginEnabled: Boolean(config.session.secret && config.admin.configured) });
});

authRouter.post('/login', loginLimiter, (req, res, next) => {
  if (!config.session.secret || !config.admin.configured) {
    return res.status(503).json({ ok: false, error: 'login_disabled' });
  }
  const { email, password } = req.body || {};
  if (!checkAdminCredentials(email, password)) {
    audit(String(email || '').slice(0, 190) || 'unknown', 'login_failed', { ipHash: ipHash(req) });
    return res.status(401).json({ ok: false, error: 'invalid_credentials' });
  }
  // New session id on login prevents session fixation
  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.user = { email: config.admin.email, role: 'admin', loginAt: new Date().toISOString() };
    req.session.save((err2) => {
      if (err2) return next(err2);
      audit(config.admin.email, 'login', { ipHash: ipHash(req) });
      res.json({ ok: true, user: req.session.user });
    });
  });
});

authRouter.post('/logout', (req, res) => {
  if (!req.session) return res.json({ ok: true });
  const who = req.session.user?.email;
  req.session.destroy(() => {
    res.clearCookie(config.session.name, { path: '/', domain: config.session.cookieDomain });
    if (who) audit(who, 'logout');
    res.json({ ok: true });
  });
});

// ---------- Admin API (authenticated) ----------
adminRouter.use(requireSameOrigin, requireAuth, (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (!getPool()) return res.status(503).json({ ok: false, error: 'database_not_configured' });
  next();
});

adminRouter.get('/stats', async (_req, res, next) => {
  try {
    res.json({ ok: true, ...(await leadStats()) });
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/leads', async (req, res, next) => {
  try {
    const { status, q, page, limit } = req.query;
    res.json({ ok: true, ...(await listLeads({ status, q: q ? String(q).slice(0, 100) : '', page, limit })) });
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/leads/:id(\\d+)', async (req, res, next) => {
  try {
    const { status, notes } = req.body || {};
    const n = await updateLead(req.params.id, { status, notes });
    if (!n) return res.status(404).json({ ok: false, error: 'not_found' });
    audit(req.session.user.email, 'lead_update', {
      leadId: Number(req.params.id),
      detail: status ? `status=${status}` : 'notes',
      ipHash: ipHash(req)
    });
    res.json({ ok: true });
  } catch (e) {
    if (e.status === 422) return res.status(422).json({ ok: false, error: 'invalid_status' });
    next(e);
  }
});

adminRouter.delete('/leads/:id(\\d+)', async (req, res, next) => {
  try {
    const n = await deleteLead(req.params.id);
    if (!n) return res.status(404).json({ ok: false, error: 'not_found' });
    audit(req.session.user.email, 'lead_delete', { leadId: Number(req.params.id), ipHash: ipHash(req) });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

const csvCell = (v) => {
  if (v === null || v === undefined) return '';
  let s = v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // spreadsheet formula injection guard
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

adminRouter.get('/leads.csv', async (req, res, next) => {
  try {
    const rows = await exportLeads({ status: req.query.status, q: req.query.q });
    const cols = ['id', 'created_at', 'status', 'name', 'company', 'email', 'phone', 'stage', 'locale', 'source_path', 'message', 'notes'];
    const body = [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\r\n');
    audit(req.session.user.email, 'export', { detail: `${rows.length} rows`, ipHash: ipHash(req) });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="dgap-leads-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send('﻿' + body);
  } catch (e) {
    next(e);
  }
});
