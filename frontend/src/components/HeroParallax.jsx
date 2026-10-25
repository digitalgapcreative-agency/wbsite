import { useEffect, useRef } from 'react';
import { TLink } from './ui.jsx';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { whenOpen } from '../lib/gate.js';

/**
 * Home hero: the headline sits over three rows of work cards. The rows start tilted in 3D and
 * faded; scrolling straightens them, brings them forward and slides alternate rows in opposite
 * directions. Scroll-scrubbed with GSAP (replaces the framer-motion version of the old site).
 */
export default function HeroParallax({ header, cards, locale, to, viewLabel }) {
  const root = useRef(null);
  const per = Math.ceil(cards.length / 3);
  const rows = [cards.slice(0, per), cards.slice(per, per * 2), cards.slice(per * 2)].filter((r) => r.length);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let ctx;
    let alive = true;
    whenOpen().then(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (c) => {
          const d = c.conditions.desktop;
          const SHIFT = d ? 1000 : 420;
          const Y0 = d ? -700 : -260;
          const Y1 = d ? 500 : 180;
          const stage = el.querySelector('.hpx__stage');

          gsap.fromTo(
            stage,
            { rotateX: 15, rotateZ: 20, y: Y0, opacity: 0.2 },
            {
              rotateX: 0,
              rotateZ: 0,
              y: Y1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${el.offsetHeight * 0.2}`, scrub: 0.9, invalidateOnRefresh: true }
            }
          );

          el.querySelectorAll('.hpx__row').forEach((row, i) => {
            gsap.fromTo(
              row,
              { x: 0 },
              {
                x: i % 2 === 0 ? SHIFT : -SHIFT,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.9 }
              }
            );
          });
        });
      }, el);
    });
    return () => {
      alive = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="hpx" ref={root} data-intro>
      <div className="hpx__header">{header}</div>
      <div className="hpx__stage" aria-hidden="true">
        {rows.map((row, r) => (
          <div className={`hpx__row ${r % 2 === 0 ? 'hpx__row--rev' : ''}`} key={r}>
            {row.map((card, i) => (
              <TLink
                key={`${r}-${i}`}
                to={card.hash ? `${to(card.route)}#${card.hash}` : to(card.route)}
                className="hpx__card"
                tabIndex={-1}
                data-cursor={viewLabel}
              >
                <img src={card.img} alt="" width="600" height="480" loading={r === 0 ? 'eager' : 'lazy'} decoding="async" />
                <span className="hpx__shade" />
                {card.title?.[locale] ? <span className="hpx__title">{card.title[locale]}</span> : null}
              </TLink>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
