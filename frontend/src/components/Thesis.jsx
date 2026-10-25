import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { whenOpen } from '../lib/gate.js';

/** Large statement whose words light up as it scrolls through the viewport. */
export default function Thesis({ text }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let ctx;
    let alive = true;
    whenOpen().then(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll('.thesis__w'),
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true }
          }
        );
      }, el);
    });
    return () => {
      alive = false;
      ctx?.revert();
    };
  }, []);

  return (
    <p className="thesis" ref={ref}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="thesis__w">
          {w}{' '}
        </span>
      ))}
    </p>
  );
}
