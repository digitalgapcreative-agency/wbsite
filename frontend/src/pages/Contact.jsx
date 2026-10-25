import { useRef, useState } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { site } from '../site.config.js';
import LeadForm from '../components/LeadForm.jsx';
import { Split, Eyebrow } from '../components/ui.jsx';

function CopyValue({ value, labels }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* clipboard unavailable — value stays selectable */
    }
  };
  return (
    <button type="button" className="copy" onClick={copy}>
      {done ? labels.copied : labels.copy}
    </button>
  );
}

export default function Contact() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, locale } = useI18n();
  const p = t.contactPage;

  return (
    <div ref={ref} className="page">
      <section className="contact" data-intro>
        <div className="wrap contact__grid">
          <div className="contact__intro">
            <Eyebrow>
              <span data-reveal="0">{p.eyebrow}</span>
            </Eyebrow>
            <Split as="h1" text={p.title} className="phero__title" />
            <p className="phero__lede" data-reveal="1">
              {p.lede}
            </p>

            <div className="nextsteps" data-reveal="2">
              <p className="svc__label">{p.stepsTitle}</p>
              <ol>
                {p.steps.map((s) => (
                  <li key={s.t}>
                    <b>{s.t}</b>
                    <span>{s.d}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="direct" data-reveal="3">
              <p className="svc__label">{p.directTitle}</p>
              <dl>
                {site.email && (
                  <div>
                    <dt>{p.emailLabel}</dt>
                    <dd>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                      <CopyValue value={site.email} labels={p} />
                    </dd>
                  </div>
                )}
                {site.whatsapp && (
                  <div>
                    <dt>{p.whatsappLabel}</dt>
                    <dd>
                      <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
                        +{site.whatsapp}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt>{p.locationLabel}</dt>
                  <dd>{p.location}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="contact__form" data-reveal="2">
            <LeadForm t={t} locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}
