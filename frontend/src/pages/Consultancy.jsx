import { useRef } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Split, Eyebrow } from '../components/ui.jsx';

export default function Consultancy() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to } = useI18n();
  const p = t.consultancyPage;

  return (
    <div ref={ref} className="page">
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede}>
        <p className="phero__note" data-reveal="2">
          {p.note}
        </p>
      </PageHero>

      <div className="bleed">
        <div className="bleed__clip" data-unveil>
          <img src="/images/consultancy/structure.webp" alt="" loading="lazy" decoding="async" data-parallax="8" />
        </div>
      </div>

      <section className="section section--light">
        <div className="wrap">
          <div className="sectionhead">
            <Eyebrow>{p.areasTitle}</Eyebrow>
          </div>
          <div className="areas" data-stagger>
            {p.areas.map((a) => (
              <div className="area" key={a.t}>
                <h2 className="area__t">{a.t}</h2>
                <p>{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap signs">
          <Split as="h2" text={p.signsTitle} className="h2" />
          <ul className="signs__list" data-stagger>
            {p.signs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand t={t} to={to} />
    </div>
  );
}
