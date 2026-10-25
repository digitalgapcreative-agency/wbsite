import { useRef } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { scrollToEl } from '../lib/motion.js';
import { Split, Button, Eyebrow, TLink, Arrow } from '../components/ui.jsx';
import GapVisual from '../components/GapVisual.jsx';
import Marquee from '../components/Marquee.jsx';
import Thesis from '../components/Thesis.jsx';
import MethodTrack from '../components/MethodTrack.jsx';
import ServiceIndex from '../components/ServiceIndex.jsx';
import Faq from '../components/Faq.jsx';
import CtaBand from '../components/CtaBand.jsx';

export default function Home() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to } = useI18n();
  const h = t.home;
  const mc = t.cases.mindcare;

  const serviceItems = [
    ...Object.entries(t.services).map(([key, s]) => ({ key, name: s.name, short: s.short, image: s.image, href: `${to('services')}#${key}` })),
    { key: 'consultancy', name: h.services.consultancyName, short: h.services.consultancyShort, image: '/images/consultancy/structure.webp', href: to('consultancy') }
  ];

  return (
    <div ref={ref} className="page page--home">
      {/* HERO */}
      <section className="hero" data-intro>
        <div className="wrap hero__inner">
          <Eyebrow className="hero__eyebrow">
            <span data-reveal="0">{h.hero.eyebrow}</span>
          </Eyebrow>
          <h1 className="hero__title">
            <Split as="span" text={h.hero.titleA} className="hero__line" />
            <Split as="span" text={h.hero.titleB} className="hero__line hero__line--accent" />
          </h1>
          <div className="hero__foot">
            <p className="hero__lede" data-reveal="1">
              {h.hero.lede}
            </p>
            <div className="hero__ctas" data-reveal="2">
              <Button to={to('contact')}>{h.hero.primary}</Button>
              <a href="#method" className="textlink" onClick={(e) => {
                  e.preventDefault();
                  scrollToEl('#method');
                }}>
                {h.hero.secondary} <Arrow dir="down" />
              </a>
            </div>
          </div>
          <ul className="hero__facts" data-reveal="3">
            {h.hero.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE GAP */}
      <section className="section section--gap" aria-labelledby="gap-statement">
        <div className="wrap">
          <GapVisual t={h.gap} />
          <p className="gap__statement" id="gap-statement" data-reveal>
            {h.gap.statement}
          </p>
        </div>
      </section>

      {/* SYMPTOMS */}
      <section className="section section--light">
        <div className="wrap">
          <div className="sectionhead">
            <Eyebrow>{h.symptoms.eyebrow}</Eyebrow>
            <Split as="h2" text={h.symptoms.title} className="h2" />
          </div>
          <ol className="symptoms" data-stagger>
            {h.symptoms.items.map((s) => (
              <li className="symptom" key={s.t}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* THESIS */}
      <section className="section section--thesis">
        <div className="wrap">
          <Thesis text={h.thesis} />
        </div>
      </section>

      <Marquee words={h.marquee} />

      {/* METHOD */}
      <section className="section section--method" id="method">
        <div className="wrap sectionhead sectionhead--split">
          <div>
            <Eyebrow>{h.method.eyebrow}</Eyebrow>
            <Split as="h2" text={h.method.title} className="h2" />
          </div>
          <p className="sectionhead__intro" data-reveal>
            {h.method.intro}
          </p>
        </div>
        <MethodTrack steps={t.method} labels={t.common} />
      </section>

      {/* SERVICES */}
      <section className="section section--light">
        <div className="wrap">
          <div className="sectionhead sectionhead--split">
            <div>
              <Eyebrow>{h.services.eyebrow}</Eyebrow>
              <Split as="h2" text={h.services.title} className="h2" />
            </div>
            <TLink to={to('services')} className="textlink" data-reveal>
              {t.common.viewAll} <Arrow />
            </TLink>
          </div>
          <ServiceIndex items={serviceItems} labelView={t.common.view} />
        </div>
      </section>

      {/* WORK */}
      <section className="section section--work">
        <div className="wrap">
          <div className="sectionhead sectionhead--split">
            <div>
              <Eyebrow>{h.work.eyebrow}</Eyebrow>
              <Split as="h2" text={h.work.title} className="h2" />
            </div>
            <p className="sectionhead__intro" data-reveal>
              {h.work.intro}
            </p>
          </div>
          <TLink to={to('case-mindcare')} className="feature" data-cursor={t.common.view}>
            <div className="feature__media">
              <div className="feature__clip" data-unveil>
                <img src={mc.cover} alt={`${mc.client}, ${mc.sector}`} loading="lazy" decoding="async" data-parallax="8" />
              </div>
            </div>
            <div className="feature__body">
              <p className="feature__meta">
                {mc.client} · {mc.sector} · {mc.location}
              </p>
              <h3 className="feature__title">{mc.headline}</h3>
              <p className="feature__summary">{mc.summary}</p>
              <span className="textlink">
                {t.common.readCase} <Arrow />
              </span>
            </div>
          </TLink>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="section section--light">
        <div className="wrap">
          <div className="sectionhead">
            <Eyebrow>{h.principles.eyebrow}</Eyebrow>
            <Split as="h2" text={h.principles.title} className="h2" />
          </div>
          <div className="principles" data-stagger>
            {h.principles.items.map((p) => (
              <div className="principle" key={p.t}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--faq">
        <div className="wrap faqwrap">
          <div className="sectionhead">
            <Eyebrow>{h.faq.eyebrow}</Eyebrow>
            <Split as="h2" text={h.faq.title} className="h2" />
          </div>
          <Faq items={t.faq} idPrefix="home-faq" />
        </div>
      </section>

      <CtaBand t={t} to={to} />
    </div>
  );
}
