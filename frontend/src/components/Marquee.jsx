import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js';

/** Endless word band in three languages; speeds up and reverses with scroll velocity. */
export default function Marquee({ words }) {
  const track = useRef(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.to(el, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity() / 300;
        const dir = self.direction === -1 ? -1 : 1;
        gsap.to(tween, { timeScale: dir * Math.min(4, 1 + Math.abs(v)), duration: 0.3, overwrite: true });
        gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: false });
      }
    });
    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {row.map((w, i) => (
          <span key={i} className={`marquee__item ${i % 3 === 0 ? 'is-lead' : ''}`}>
            {w}
            <i className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
