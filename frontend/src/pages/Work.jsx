import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { TLink, Arrow, Button } from '../components/ui.jsx';

function WorkFeatureMedia({ slug, cover, images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldSlide = ['mindcare', 'courve', 'bolleno'].includes(slug) && images && images.length > 1;

  useEffect(() => {
    if (!shouldSlide) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [shouldSlide, images]);

  if (shouldSlide) {
    return (
      <div className="feature__media">
        <div className="feature__slider" data-unveil>
          {images.map((image, index) => (
            <img
              key={`${image.src}-${index}`}
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={index === activeIndex ? 'is-active' : ''}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="feature__media">
      <div className="feature__clip" data-unveil>
        <img src={cover} alt={`${slug} cover`} loading="lazy" decoding="async" data-parallax="8" />
      </div>
    </div>
  );
}

/** Add new case studies to content/*.js `cases` and a route in routes.js; they appear here automatically. */
const CASE_ROUTES = { mindcare: 'case-mindcare', bolleno: 'case-bolleno', courve: 'case-courve', yarnbe: 'case-yarnbe' };

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
              <WorkFeatureMedia slug={slug} cover={c.cover} images={c.images} />
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
