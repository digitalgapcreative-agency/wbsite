import { useEffect, useRef, useState } from 'react';
import { gsap, isTouch, prefersReducedMotion } from '../lib/motion.js';

/** Custom cursor: a small dot that grows into a labelled disc over [data-cursor] elements. */
export default function Cursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target.closest?.('[data-cursor], a, button, input, select, textarea, label');
      const text = target?.getAttribute?.('data-cursor') || '';
      el.classList.toggle('is-hover', Boolean(target));
      el.classList.toggle('is-label', Boolean(text));
      setLabel(text);
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leave = () => el.classList.add('is-out');
    const enter = () => el.classList.remove('is-out');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__label">{label}</span>
    </div>
  );
}
