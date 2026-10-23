import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim() || '';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL?.trim() || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || 'digitalgapcreative@gmail.com';
const BRAND_COLOR = '#250601';
const BRAND_NAME = 'Digital Gap Creative';
const SITE_URL =
  process.env.SITE_URL?.trim() ||
  process.env.FRONTEND_URL?.split(',')[0]?.trim() ||
  'https://digitalgapco.com';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const firstName = (value = '') => {
  const safe = String(value).trim();
  return safe ? escapeHtml(safe.split(/\s+/)[0]) : 'there';
};

const whatsappUrl = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
};

// ─── Shared layout wrapper ────────────────────────────────────────────────────

const layout = (body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(BRAND_NAME)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#250601;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="background:${BRAND_COLOR};border-radius:12px 12px 0 0;padding:28px 36px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(253,253,253,0.5);">
                ${escapeHtml(BRAND_NAME)}
              </p>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(253,253,253,0.35);">
                Strategic Marketing Agency
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 36px 28px;border-radius:0 0 12px 12px;box-shadow:0 8px 32px rgba(37,6,1,0.08);">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#250601;opacity:0.35;letter-spacing:0.1em;">
                © ${new Date().getFullYear()} ${escapeHtml(BRAND_NAME)} ·
                <a href="${escapeHtml(SITE_URL)}" style="color:#250601;opacity:0.5;text-decoration:none;">
                  ${escapeHtml(SITE_URL)}
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── Row helper ───────────────────────────────────────────────────────────────

const row = (label, value) => {
  if (value === undefined || value === null || value === '') return '';

  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(37,6,1,0.06);">
        <span style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(37,6,1,0.4);">
          ${escapeHtml(label)}
        </span>
        <br/>
        <span style="font-size:14px;color:#250601;margin-top:2px;display:block;">
          ${value}
        </span>
      </td>
    </tr>`;
};

// ─── Admin notification email ─────────────────────────────────────────────────

const adminEmailHtml = (data) => {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeWhatsapp = escapeHtml(data.whatsapp);
  const safeCompany = escapeHtml(data.company);
  const safeService = escapeHtml(data.service);
  const safeChannel = escapeHtml(data.channel);
  const safeChallenge = escapeHtml(data.challenge).replace(/\n/g, '<br />');
  const safeFirstName = firstName(data.name);

  const waUrl = whatsappUrl(data.whatsapp);

  return layout(`
      <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#250601;letter-spacing:-0.02em;">
        New Consultation Request 🎯
      </h2>

      <p style="margin:0 0 24px;font-size:13px;color:rgba(37,6,1,0.5);">
        Received on ${escapeHtml(
    new Date(data.createdAt).toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
    })
  )}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Name', safeName)}
        ${row(
    'Email',
    `<a href="mailto:${safeEmail}" style="color:#250601;">${safeEmail}</a>`
  )}
        ${row(
    'WhatsApp',
    waUrl
      ? `<a href="${escapeHtml(waUrl)}" style="color:#25D366;">${safeWhatsapp}</a>`
      : null
  )}
        ${row('Company', safeCompany)}
        ${row('Service Interest', safeService)}
        ${row('Preferred Channel', safeChannel)}
        ${row(
    'Challenge / Message',
    `<span style="white-space:pre-line;">${safeChallenge}</span>`
  )}
      </table>

      <div style="margin-top:28px;padding:16px 20px;background:#f5f0ea;border-radius:8px;border-left:3px solid ${BRAND_COLOR};">
        <p style="margin:0;font-size:12px;font-weight:600;color:rgba(37,6,1,0.5);text-transform:uppercase;letter-spacing:0.15em;">
          Next Step
        </p>

        <p style="margin:6px 0 0;font-size:13px;color:#250601;">
          Reply to <strong>${safeName}</strong> via
          <strong>${escapeHtml(data.channel || 'email')}</strong> within 48 hours.
        </p>
      </div>

      <div style="margin-top:24px;text-align:center;">
        <a
          href="mailto:${safeEmail}"
          style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:12px 28px;border-radius:100px;letter-spacing:0.02em;"
        >
          Reply to ${safeFirstName}
        </a>
      </div>
    `);
};

// ─── Client confirmation email ────────────────────────────────────────────────

const clientEmailHtml = (data) => {
  const safeEmail = escapeHtml(data.email);
  const safeWhatsapp = escapeHtml(data.whatsapp);
  const safeService = escapeHtml(data.service);
  const safeChannel = escapeHtml(data.channel);
  const safeChallenge = escapeHtml(data.challenge).replace(/\n/g, '<br />');

  return layout(`
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(37,6,1,0.4);">
        Your request is confirmed
      </p>

      <h2 style="margin:0 0 12px;font-size:26px;font-weight:700;color:#250601;letter-spacing:-0.02em;line-height:1.2;">
        Thank you, ${firstName(data.name)}. 👋
      </h2>

      <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:rgba(37,6,1,0.6);">
        We've received your consultation request and our team will review it shortly.
        You can expect to hear from us within
        <strong style="color:#250601;">48 hours</strong>
        ${data.channel
      ? `via <strong style="color:#250601;">${escapeHtml(data.channel)}</strong>`
      : ''}.
      </p>

      <div style="background:#f5f0ea;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(37,6,1,0.4);">
          Your Submission Summary
        </p>

        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Name', escapeHtml(data.name))}
          ${row('Email', safeEmail)}
          ${row('WhatsApp', safeWhatsapp)}
          ${row('Service Interest', safeService)}
          ${row('Preferred Contact', safeChannel)}
          ${row('Your Challenge', safeChallenge)}
        </table>
      </div>

      <p style="margin:0 0 24px;font-size:13px;line-height:1.7;color:rgba(37,6,1,0.55);">
        In the meantime, feel free to explore our work and insights at
        <a href="${escapeHtml(SITE_URL)}" style="color:#250601;font-weight:600;">
          ${escapeHtml(SITE_URL)}
        </a>.
      </p>

      <div style="border-top:1px solid rgba(37,6,1,0.08);padding-top:20px;margin-top:4px;">
        <p style="margin:0;font-size:13px;color:rgba(37,6,1,0.5);">
          Warm regards,
        </p>

        <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#250601;">
          ${escapeHtml(BRAND_NAME)} Team
        </p>
      </div>
    `);
};

// ─── Send helpers ─────────────────────────────────────────────────────────────

export const sendConsultationEmails = async (data) => {
  if (!resend) {
    console.warn(
      '[email] RESEND_API_KEY not configured — email delivery skipped.'
    );
    return;
  }

  if (!FROM_EMAIL || !ADMIN_EMAIL) {
    console.warn(
      '[email] FROM_EMAIL or ADMIN_EMAIL is missing — email delivery skipped.'
    );
    return;
  }

  const sends = [
    resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Consultation Request from ${String(data.name || 'Prospect')}`,
      html: adminEmailHtml(data),
    }),

    resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `We received your request, ${String(data.name || 'there').split(/\s+/)[0]} — Digital Gap Creative`,
      html: clientEmailHtml(data),
    }),
  ];

  const results = await Promise.allSettled(sends);

  results.forEach((result, index) => {
    if (result.status === 'rejected' || result.value?.error) {
      console.error(
        `[email] Send #${index + 1} failed:`,
        result.reason?.message || result.reason || result.value?.error?.message || 'Email provider rejected the request.'
      );
    } else {
      console.log(
        `[email] Send #${index + 1} OK — id:`,
        result.value?.data?.id || 'no-id'
      );
    }
  });
};

export const sendContactEmails = async (data) => {
  if (!resend) {
    console.warn(
      '[email] RESEND_API_KEY not configured — email delivery skipped for contact.'
    );
    return;
  }

  if (!FROM_EMAIL || !ADMIN_EMAIL) {
    console.warn(
      '[email] FROM_EMAIL or ADMIN_EMAIL is missing — email delivery skipped for contact.'
    );
    return;
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br />');

  const adminHtml = layout(`
      <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#250601;letter-spacing:-0.02em;">
        New Contact Message 📨
      </h2>

      <p style="margin:0 0 24px;font-size:13px;color:rgba(37,6,1,0.5);">
        Received on ${escapeHtml(
    new Date(data.createdAt).toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
    })
  )}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Name', safeName)}
        ${row(
    'Email',
    `<a href="mailto:${safeEmail}" style="color:#250601;">${safeEmail}</a>`
  )}
        ${row(
    'Message',
    `<span style="white-space:pre-line;">${safeMessage}</span>`
  )}
      </table>
    `);

  const clientHtml = layout(`
      <p style="margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(37,6,1,0.4);">
        Message Received
      </p>

      <h2 style="margin:0 0 12px;font-size:26px;font-weight:700;color:#250601;letter-spacing:-0.02em;line-height:1.2;">
        Thank you, ${firstName(data.name)}. 👋
      </h2>

      <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:rgba(37,6,1,0.6);">
        We have received your message and will get back to you within <strong style="color:#250601;">48 hours</strong>.
      </p>

      <div style="background:#f5f0ea;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(37,6,1,0.4);">
          Your Message Summary
        </p>

        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Name', escapeHtml(data.name))}
          ${row('Email', safeEmail)}
          ${row('Message', safeMessage)}
        </table>
      </div>

      <div style="border-top:1px solid rgba(37,6,1,0.08);padding-top:20px;margin-top:4px;">
        <p style="margin:0;font-size:13px;color:rgba(37,6,1,0.5);">
          Warm regards,
        </p>
        <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#250601;">
          ${escapeHtml(BRAND_NAME)} Team
        </p>
      </div>
    `);

  const sends = [
    resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Contact Request from ${String(data.name || 'User')}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `We received your message, ${String(data.name || 'there').split(/\s+/)[0]} — Digital Gap Creative`,
      html: clientHtml,
    }),
  ];

  const results = await Promise.allSettled(sends);

  results.forEach((result, index) => {
    if (result.status === 'rejected' || result.value?.error) {
      console.error(
        `[email] Contact Send #${index + 1} failed:`,
        result.reason?.message || result.reason || result.value?.error?.message || 'Email provider rejected the request.'
      );
    } else {
      console.log(
        `[email] Contact Send #${index + 1} OK — id:`,
        result.value?.data?.id || 'no-id'
      );
    }
  });
};
