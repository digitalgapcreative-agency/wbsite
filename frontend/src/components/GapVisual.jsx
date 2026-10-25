import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { whenOpen } from '../lib/gate.js';

const START = 38; // % of the way the "perceived" bar reaches before scroll closes it

/**
 * The thesis as an instrument: two measured bars. Scrolling closes the gap between
 * what the business is worth and what the market sees.
 */
export default function GapVisual({ t }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let ctx;
    let alive = true;
    whenOpen().then(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        const bar = el.querySelector('.gap__bar--b .gap__fill');
        const span = el.querySelector('.gap__span');
        const num = el.querySelector('.gap__num');
        const label = el.querySelector('.gap__label');
        const closed = el.querySelector('.gap__closed');
        const state = { p: START };
        const mm = gsap.matchMedia();

        const build = (pin) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: pin ? 'top 18%' : 'top 70%',
              end: pin ? '+=75%' : 'bottom 30%',
              scrub: 0.8,
              pin,
              anticipatePin: 1
            }
          });
          tl.fromTo(
            state,
            { p: START },
            {
              p: 100,
              ease: 'none',
              onUpdate: () => {
                const p = state.p;
                bar.style.transform = `scaleX(${p / 100})`;
                span.style.left = `${p}%`;
                span.style.width = `${100 - p}%`;
                num.textContent = `${Math.round(100 - p)}%`;
                const done = p > 99.2;
                label.style.opacity = done ? 0 : 1;
                closed.style.opacity = done ? 1 : 0;
              }
            }
          );
          // Entrance: bars draw in once
          gsap.from(el.querySelectorAll('.gap__track'), {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.4,
            ease: 'expo.out',
            stagger: 0.15,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          });
        };
        mm.add('(min-width: 900px)', () => build(true));
        mm.add('(max-width: 899px)', () => build(false));
      }, el);
    });
    return () => {
      alive = false;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="gap" ref={root} role="img" aria-label={`${t.a} / ${t.b}: ${t.label}`}>
      <div className="gap__scale" aria-hidden="true">
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} style={{ left: `${i * 10}%` }}>
            <i>{i * 10}</i>
          </span>
        ))}
      </div>

      <div className="gap__row">
        <p className="gap__name">{t.a}</p>
        <div className="gap__bar gap__bar--a">
          <div className="gap__track" />
          <div className="gap__fill" />
        </div>
      </div>

      <div className="gap__row">
        <p className="gap__name">{t.b}</p>
        <div className="gap__bar gap__bar--b">
          <div className="gap__track" />
          <div className="gap__fill" style={{ transform: `scaleX(${START / 100})` }} />
          <div className="gap__span" style={{ left: `${START}%`, width: `${100 - START}%` }} aria-hidden="true">
            <span className="gap__label">
              {t.label} <b className="gap__num">{100 - START}%</b>
            </span>
            <span className="gap__closed">{t.closed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
