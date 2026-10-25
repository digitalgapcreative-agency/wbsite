import { useEffect, useRef } from 'react';
import { TLink, Arrow } from './ui.jsx';
import { gsap, isTouch, prefersReducedMotion } from '../lib/motion.js';

/** Service list with a floating preview image that follows the pointer (desktop). */
export default function ServiceIndex({ items, labelView }) {
  const root = useRef(null);
  const preview = useRef(null);

  useEffect(() => {
    const el = root.current;
    const pv = preview.current;
    if (!el || !pv || isTouch() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(pv, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(pv, 'y', { duration: 0.6, ease: 'power3.out' });
    const imgs = [...pv.querySelectorAll('img')];
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const enterRow = (i) => () => {
      gsap.to(pv, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
      imgs.forEach((img, k) => gsap.to(img, { opacity: k === i ? 1 : 0, scale: k === i ? 1 : 1.08, duration: 0.5 }));
    };
    const leave = () => gsap.to(pv, { scale: 0.6, opacity: 0, duration: 0.35, ease: 'power3.in' });
    const rows = [...el.querySelectorAll('.sindex__row')];
    const offs = rows.map((row, i) => {
      const fn = enterRow(i);
      row.addEventListener('pointerenter', fn);
      return () => row.removeEventListener('pointerenter', fn);
    });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      offs.forEach((f) => f());
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className="sindex" ref={root}>
      <ul className="sindex__list" data-stagger>
        {items.map((s, i) => (
          <li key={s.key}>
            <TLink to={s.href} className="sindex__row" data-cursor={labelView}>
              <span className="sindex__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="sindex__name">{s.name}</span>
              <span className="sindex__short">{s.short}</span>
              <span className="sindex__go">
                <Arrow />
              </span>
            </TLink>
          </li>
        ))}
      </ul>
      <div className="sindex__preview" ref={preview} aria-hidden="true">
        {items.map((s) => (
          <img key={s.key} src={s.image} alt="" loading="lazy" decoding="async" />
        ))}
      </div>
    </div>
  );
}
