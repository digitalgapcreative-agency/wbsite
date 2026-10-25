import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { whenOpen } from '../lib/gate.js';
import { scrollToEl } from '../lib/motion.js';
import { site, formatIDR } from '../site.config.js';
import PageHero from '../components/PageHero.jsx';
import MethodTrack from '../components/MethodTrack.jsx';
import Faq from '../components/Faq.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Split, Eyebrow, Button, TLink } from '../components/ui.jsx';

export default function Services() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to } = useI18n();
  const p = t.servicesPage;
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    whenOpen().then(() => setTimeout(() => scrollToEl(hash), 250));
  }, [hash]);

  return (
    <div ref={ref} className="page">
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />

      <section className="clients" aria-labelledby="clients-title">
        <div className="wrap">
          <div className="clients__head">
            <Eyebrow>{p.clientsEyebrow}</Eyebrow>
            <Split as="h2" text={p.clientsTitle} className="clients__title" id="clients-title" />
          </div>
          <ul className="clients__list" data-stagger>
            {site.clients.map((c) => (
              <li key={c.name} className="clients__item">
                {c.caseKey ? (
                  <TLink to={to(c.caseKey)} className="clients__name" data-cursor={t.common.view}>
                    {c.logo ? <img src={c.logo} alt={c.name} /> : c.name}
                  </TLink>
                ) : (
                  <span className="clients__name">{c.logo ? <img src={c.logo} alt={c.name} /> : c.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--method">
        <div className="wrap sectionhead">
          <Split as="h2" text={p.methodTitle} className="h2" />
        </div>
        <MethodTrack steps={t.method} labels={t.common} />
      </section>

      <section className="section section--light" aria-labelledby="services-list">
        <div className="wrap">
          <div className="sectionhead">
            <Eyebrow>{p.listTitle}</Eyebrow>
            <h2 className="visually-hidden" id="services-list">
              {p.listTitle}
            </h2>
          </div>
          <div className="svc">
            {Object.entries(t.services).map(([key, s], i) => (
              <article className="svc__item" id={key} key={key}>
                <div className="svc__media">
                  <div className="svc__clip" data-unveil>
                    <img src={s.image} alt="" loading="lazy" decoding="async" data-parallax="6" />
                  </div>
                </div>
                <div className="svc__body">
                  <p className="svc__num">{String(i + 1).padStart(2, '0')}</p>
                  <Split as="h3" text={s.name} className="svc__name" />
                  <p className="svc__summary" data-reveal>
                    {s.summary}
                  </p>
                  {site.clients.some((c) => c.services.includes(key)) && (
                    <p className="svc__clients" data-reveal>
                      <span>{t.common.appliedFor}</span>
                      {site.clients
                        .filter((c) => c.services.includes(key))
                        .map((c) =>
                          c.caseKey ? (
                            <TLink key={c.name} to={to(c.caseKey)}>
                              {c.name}
                            </TLink>
                          ) : (
                            <b key={c.name}>{c.name}</b>
                          )
                        )}
                    </p>
                  )}
                  <p className="svc__for" data-reveal>
                    <span>{t.common.forYouIf}</span>
                    {s.forYouIf}
                  </p>
                  <div className="svc__cols" data-reveal>
                    <div>
                      <p className="svc__label">{t.common.deliverables}</p>
                      <ul className="ticks">
                        {s.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <dl className="svc__facts">
                      <div>
                        <dt>{t.common.duration}</dt>
                        <dd>{s.duration}</dd>
                      </div>
                      <div>
                        <dt>{t.common.investment}</dt>
                        <dd>
                          {site.pricing[key] ? (
                            <>
                              {t.common.from} <b>{formatIDR(site.pricing[key])}</b>
                            </>
                          ) : (
                            t.common.quoted
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap">
          <div className="sectionhead">
            <Split as="h2" text={p.engagement.title} className="h2" />
          </div>
          <div className="principles principles--three" data-stagger>
            {p.engagement.items.map((it) => (
              <div className="principle" key={it.t}>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </div>
            ))}
          </div>
          <div className="aside-cta" data-reveal>
            <div>
              <h3>{p.consultancyTitle}</h3>
              <p>{p.consultancyBody}</p>
            </div>
            <Button to={to('consultancy')} variant="ghost">
              {p.consultancyCta}
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--faq">
        <div className="wrap faqwrap">
          <div className="sectionhead">
            <Eyebrow>{t.home.faq.eyebrow}</Eyebrow>
            <Split as="h2" text={t.home.faq.title} className="h2" />
          </div>
          <Faq items={t.faq} idPrefix="svc-faq" />
        </div>
      </section>

      <CtaBand t={t} to={to} />
    </div>
  );
}
