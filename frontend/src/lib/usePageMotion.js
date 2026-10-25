import { useEffect } from 'react';
import { bindReveals, bindMagnetic } from './motion.js';
import { whenOpen } from './gate.js';

/** Runs the shared reveal patterns for a page once the preloader / curtain lets it in. */
export function usePageMotion(ref) {
  useEffect(() => {
    let alive = true;
    let cleanups = [];
    whenOpen().then(() => {
      if (!alive || !ref.current) return;
      cleanups = [bindReveals(ref.current, { intro: true }), bindMagnetic(ref.current)];
    });
    return () => {
      alive = false;
      cleanups.forEach((fn) => fn());
    };
  }, [ref]);
}
