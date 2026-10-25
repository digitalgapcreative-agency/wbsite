/* Client-only motion runtime: Lenis smooth scroll + GSAP ScrollTrigger + shared reveal patterns. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const isBrowser = typeof window !== 'undefined';
export const prefersReducedMotion = () =>
  isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => isBrowser && window.matchMedia('(hover: none), (pointer: coarse)').matches;

let lenis = null;
let started = false;

// Register at import time: components may create triggers before the runtime boots.
if (isBrowser) gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export async function startMotion() {
  if (!isBrowser || started) return lenis;
  started = true;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion-ready');
  if (prefersReducedMotion()) return null;

  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else if (isBrowser) window.scrollTo(0, 0);
}

export function scrollToEl(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/**
 * Wire the generic data-attribute animations inside a root element.
 * Returns a cleanup function (gsap.context revert).
 */
export function bindReveals(root, { intro = false } = {}) {
  if (!isBrowser || !root) return () => {};
  if (prefersReducedMotion()) {
    root.querySelectorAll('[data-count]').forEach((el) => (el.textContent = el.dataset.count));
    return () => {};
  }

  const ctx = gsap.context(() => {
    // Split headings: words rise out of a mask
    root.querySelectorAll('.split').forEach((el) => {
      const words = el.querySelectorAll('.w > span');
      const isIntro = intro && el.closest('[data-intro]');
      gsap.fromTo(words, { yPercent: 110, y: 0 }, {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        delay: isIntro ? 0.15 : 0,
        scrollTrigger: isIntro ? undefined : { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Fade-up reveals
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      const isIntro = intro && el.closest('[data-intro]');
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: isIntro ? 0.45 + Number(el.dataset.reveal || 0) * 0.12 : Number(el.dataset.reveal || 0) * 0.08,
        scrollTrigger: isIntro ? undefined : { trigger: el, start: 'top 90%', once: true }
      });
    });

    // Staggered groups
    root.querySelectorAll('[data-stagger]').forEach((group) => {
      gsap.to(group.children, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });

    // Horizontal rules draw in
    root.querySelectorAll('[data-rule]').forEach((el) => {
      gsap.to(el, {
        scaleX: 1,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });

    // Parallax media
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax || 12);
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    });

    // Image curtains
    root.querySelectorAll('[data-unveil]').forEach((el) => {
      gsap.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.5,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    // Counters
    root.querySelectorAll('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      if (Number.isNaN(end)) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = Math.round(obj.v)),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }, root);

  requestAnimationFrame(() => ScrollTrigger.refresh());
  return () => ctx.revert();
}

/** Magnetic hover for buttons marked data-magnetic. */
export function bindMagnetic(scope = document) {
  if (!isBrowser || isTouch() || prefersReducedMotion()) return () => {};
  const els = [...scope.querySelectorAll('[data-magnetic]')];
  const handlers = els.map((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  });
  return () => handlers.forEach((h) => h());
}
