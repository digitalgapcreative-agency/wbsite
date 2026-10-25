import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { whenOpen } from '../lib/gate.js';

/** The five-stage method. Desktop: pinned horizontal track. Mobile: vertical list. */
export default function MethodTrack({ steps, labels }) {
  const root = useRef(null);
  const track = useRef(null);
  const progress = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let ctx;
    let alive = true;
    whenOpen().then(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 900px)', () => {
          const distance = () => track.current.scrollWidth - el.clientWidth;
          gsap.to(track.current, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: () => '+=' + distance(),
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
              }
            }
          });
        });
        mm.add('(max-width: 899px)', () => {
          gsap.utils.toArray(el.querySelectorAll('.step')).forEach((s) => {
            gsap.from(s, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } });
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
    <div className="method" ref={root}>
      <div className="method__progress" aria-hidden="true">
        <span ref={progress} />
      </div>
      <ol className="method__track" ref={track}>
        {steps.map((s, i) => (
          <li className="step" key={s.name}>
            <div className="step__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
              <span>/05</span>
            </div>
            <h3 className="step__name">
              <span className="visually-hidden">
                {labels.stage} {i + 1}:{' '}
              </span>
              {s.name}
            </h3>
            <p className="step__body">{s.body}</p>
            <p className="step__out">
              <span>{labels.output}</span>
              {s.output}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
