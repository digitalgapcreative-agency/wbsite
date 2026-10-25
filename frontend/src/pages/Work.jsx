import { useRef } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { TLink, Arrow, Button } from '../components/ui.jsx';

/** Add new case studies to content/*.js `cases` and a route in routes.js; they appear here automatically. */
const CASE_ROUTES = { mindcare: 'case-mindcare' };

export default function Work() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to } = useI18n();
  const p = t.workPage;

  return (
    <div ref={ref} className="page">
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />

      <section className="section section--light">
        <div className="wrap worklist">
          {Object.entries(t.cases).map(([slug, c]) => (
            <TLink key={slug} to={to(CASE_ROUTES[slug])} className="feature feature--list" data-cursor={t.common.view}>
              <div className="feature__media">
                <div className="feature__clip" data-unveil>
                  <img src={c.cover} alt={`${c.client}, ${c.sector}`} loading="lazy" decoding="async" data-parallax="8" />
                </div>
              </div>
              <div className="feature__body">
                <p className="feature__meta">
                  {c.client} · {c.sector} · {c.location}
                </p>
                <h2 className="feature__title">{c.headline}</h2>
                <p className="feature__summary">{c.summary}</p>
                <ul className="tags">
                  {c.scope.slice(0, 5).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <span className="textlink">
                  {t.common.readCase} <Arrow />
                </span>
              </div>
            </TLink>
          ))}

          <div className="slot" data-reveal>
            <div>
              <h2 className="slot__t">{p.comingTitle}</h2>
              <p>{p.comingBody}</p>
            </div>
            <Button to={to('contact')}>{t.nav.cta}</Button>
          </div>
        </div>
      </section>

      <CtaBand t={t} to={to} />
    </div>
  );
}
