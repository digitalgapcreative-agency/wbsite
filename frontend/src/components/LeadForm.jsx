import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../site.config.js';
import { Arrow } from './ui.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LeadForm({ t, locale }) {
  const { pathname } = useLocation();
  const f = t.form;
  const [values, setValues] = useState({ name: '', company: '', email: '', phone: '', stage: 'unsure', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error | rate

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = f.errorRequired;
    if (values.company.trim().length < 2) e.company = f.errorRequired;
    if (!EMAIL_RE.test(values.email.trim())) e.email = f.errorEmail;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (status === 'sending' || !validate()) return;
    setStatus('sending');
    try {
      const res = await fetch(`${site.apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale, sourcePath: pathname })
      });
      if (res.status === 429) return setStatus('rate');
      if (res.status === 422) {
        const data = await res.json().catch(() => ({}));
        const e = {};
        for (const k of Object.keys(data.errors || {})) e[k] = k === 'email' ? f.errorEmail : f.errorRequired;
        setErrors(e);
        return setStatus('idle');
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
      if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'generate_lead', { method: 'brief_form' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="form__done" role="status">
        <span className="form__done-mark" aria-hidden="true" />
        <p>{f.success}</p>
      </div>
    );
  }

  const field = (k, label, props = {}, optional = false) => (
    <div className={`field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`lead-${k}`}>
        {label}
        {optional && <span className="field__opt"> ({f.optional})</span>}
      </label>
      <input
        id={`lead-${k}`}
        name={k}
        value={values[k]}
        onChange={set(k)}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `lead-${k}-err` : undefined}
        {...props}
      />
      {errors[k] && (
        <p className="field__err" id={`lead-${k}-err`}>
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form__grid">
        {field('name', f.name, { autoComplete: 'name', required: true })}
        {field('company', f.company, { autoComplete: 'organization', required: true })}
        {field('email', f.email, { type: 'email', autoComplete: 'email', inputMode: 'email', required: true })}
        {field('phone', f.phone, { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, true)}
      </div>

      <fieldset className="field field--choice">
        <legend>{f.stage}</legend>
        <div className="chips">
          {Object.entries(f.stages).map(([k, label]) => (
            <label key={k} className={`chip ${values.stage === k ? 'is-on' : ''}`}>
              <input type="radio" name="stage" id={`lead-stage-${k}`} value={k} checked={values.stage === k} onChange={set('stage')} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="lead-message">
          {f.message}
          <span className="field__opt"> ({f.optional})</span>
        </label>
        <textarea id="lead-message" name="message" rows="4" value={values.message} onChange={set('message')} placeholder={f.messagePlaceholder} />
      </div>

      {/* Honeypot */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>

      {(status === 'error' || status === 'rate') && (
        <p className="form__error" role="alert">
          {status === 'rate' ? f.errorRate : f.errorServer} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      )}

      <div className="form__foot">
        <button type="submit" className="btn btn--solid" disabled={status === 'sending'} data-magnetic>
          <span className="btn__label">{status === 'sending' ? f.sending : f.submit}</span>
          <span className="btn__icon">
            <Arrow />
          </span>
        </button>
        <p className="form__privacy">{f.privacy}</p>
      </div>
    </form>
  );
}
