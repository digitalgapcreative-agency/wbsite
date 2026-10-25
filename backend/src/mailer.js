import nodemailer from 'nodemailer';
import { config } from './config.js';

let transport = null;

function getTransport() {
  if (!config.mail.configured) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: { user: config.mail.user, pass: config.mail.pass }
    });
  }
  return transport;
}

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function sendLeadEmail(lead) {
  const t = getTransport();
  if (!t) return false;
  const rows = [
    ['Name', lead.name],
    ['Company', lead.company],
    ['Email', lead.email],
    ['Phone / WhatsApp', lead.phone || '—'],
    ['Focus', lead.stage],
    ['Language', lead.locale],
    ['Page', lead.sourcePath || '—']
  ];
  await t.sendMail({
    from: config.mail.from,
    to: config.mail.to,
    replyTo: lead.email,
    subject: `New brief — ${lead.company} (${lead.name})`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${lead.message || ''}`,
    html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
      .map(([k, v]) => `<tr><td style="color:#6b5a55"><b>${k}</b></td><td>${esc(v)}</td></tr>`)
      .join('')}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(
      lead.message || ''
    )}</p>`
  });
  return true;
}
