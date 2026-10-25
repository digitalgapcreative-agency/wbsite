import { useRef } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { site } from '../site.config.js';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Marquee from '../components/Marquee.jsx';
import { Split, Eyebrow } from '../components/ui.jsx';

export default function About() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to, locale } = useI18n();
  const p = t.aboutPage;

  return (
    <div ref={ref} className="page">
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />

      <section className="section section--light">
        <div className="wrap story">
          <div className="story__media">
            <div className="story__clip" data-unveil>
              <img src="/images/about/studio.webp" alt="" loading="lazy" decoding="async" data-parallax="8" />
            </div>
          </div>
          <div className="story__text">
            {p.story.map((s, i) => (
              <p key={i} data-reveal={i}>
                {s}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Marquee words={t.home.marquee} />

      <section className="section section--dark">
        <div className="wrap">
          <div className="sectionhead">
            <Eyebrow>{p.beliefsTitle}</Eyebrow>
          </div>
          <div className="beliefs" data-stagger>
            {p.beliefs.map((b) => (
              <div className="belief" key={b.t}>
                <h2>{b.t}</h2>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap glance">
          <Split as="h2" text={p.factsTitle} className="h2" />
          <dl className="glance__list" data-stagger>
            {p.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
            {site.founder.name && (
              <div>
                <dt>{p.founderTitle}</dt>
                <dd>
                  {site.founder.name}, {site.founder.role[locale]}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <CtaBand t={t} to={to} />
    </div>
  );
}
