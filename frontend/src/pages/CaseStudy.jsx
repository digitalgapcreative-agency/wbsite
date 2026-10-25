import { useRef } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import CtaBand from '../components/CtaBand.jsx';
import { Split, Eyebrow, TLink, Arrow } from '../components/ui.jsx';

export default function CaseStudy({ slug }) {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to } = useI18n();
  const c = t.cases[slug];

  return (
    <div ref={ref} className="page">
      <article>
        <section className="phero phero--dark case-hero" data-intro>
          <div className="wrap phero__inner">
            <TLink to={to('work')} className="crumb" data-reveal="0">
              <Arrow dir="left" /> {t.nav.work}
            </TLink>
            <Eyebrow>
              <span data-reveal="0">
                {c.client} · {c.sector} · {c.location}
              </span>
            </Eyebrow>
            <Split as="h1" text={c.headline} className="phero__title" />
            <p className="phero__lede" data-reveal="1">
              {c.summary}
            </p>
            <dl className="case-facts" data-reveal="2">
              {c.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{/^\d+$/.test(f.v) ? <span data-count={f.v}>{f.v}</span> : f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="bleed">
          <div className="bleed__clip" data-unveil>
            <img src={c.cover} alt={`${c.client} cover visual`} decoding="async" data-parallax="8" />
          </div>
        </div>

        <section className="section section--light">
          <div className="wrap case">
            <aside className="case__aside">
              <p className="svc__label">{t.common.deliverables}</p>
              <ul className="ticks">
                {c.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
            <div className="case__body">
              {c.sections.map((s, i) => (
                <div className="case__block" key={s.title}>
                  <h2 className="case__h" data-reveal>
                    {s.title}
                  </h2>
                  <p data-reveal="1">{s.body}</p>
                  {i === 1 && c.images[0] && (
                    <figure className="case__fig">
                      <div className="case__clip" data-unveil>
                        <img src={c.images[0].src} alt={c.images[0].alt} loading="lazy" decoding="async" />
                      </div>
                    </figure>
                  )}
                  {i === 3 && c.images[1] && (
                    <figure className="case__fig">
                      <div className="case__clip" data-unveil>
                        <img src={c.images[1].src} alt={c.images[1].alt} loading="lazy" decoding="async" />
                      </div>
                    </figure>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>

      <CtaBand t={t} to={to} />
    </div>
  );
}
