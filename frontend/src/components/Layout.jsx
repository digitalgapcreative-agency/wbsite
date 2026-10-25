import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n.js';
import { applyHead } from '../seo.js';
import { site } from '../site.config.js';
import { TransitionContext, TLink, Wordmark, Arrow, Button } from './ui.jsx';
import Cursor from './Cursor.jsx';
import {
  gsap,
  ScrollTrigger,
  startMotion,
  scrollToTop,
  getLenis,
  scrollToEl,
  prefersReducedMotion,
  bindMagnetic
} from '../lib/motion.js';
import { closeGate, openGate } from '../lib/gate.js';

const NAV_KEYS = ['services', 'consultancy', 'work', 'about', 'contact'];

function runPreloader() {
  const el = document.querySelector('.preloader');
  const root = document.documentElement;
  if (!el || root.classList.contains('visited') || prefersReducedMotion()) {
    el?.remove();
    return Promise.resolve();
  }
  const count = el.querySelector('.preloader__count');
  const bar = el.querySelector('.preloader__bar span');
  const word = el.querySelector('.preloader__word');
  const obj = { v: 0 };
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => (el.remove(), resolve()) })
      .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
      .to(obj, {
        v: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => {
          count.textContent = String(Math.round(obj.v)).padStart(3, '0');
          bar.style.transform = `scaleX(${obj.v / 100})`;
        }
      }, 0.2)
      .to(word, { yPercent: -110, duration: 0.6, ease: 'power3.in' })
      .to(el, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.2')
      .add(() => openGate(), '-=0.55');
  });
}

export default function Layout() {
  const { t, locale, to, alternate } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const curtain = useRef(null);
  const header = useRef(null);
  const menuRef = useRef(null);
  const first = useRef(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Boot: motion runtime + preloader
  useEffect(() => {
    startMotion().then(() => runPreloader()).then(() => openGate());
    const off = bindMagnetic(header.current);
    return off;
  }, []);

  // Route change: head tags, scroll reset, curtain out
  useEffect(() => {
    applyHead(location.pathname);
    if (first.current) {
      first.current = false;
      return;
    }
    scrollToTop(true);
    setMenuOpen(false);
    const c = curtain.current;
    if (!c || prefersReducedMotion()) {
      openGate();
      return;
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
    gsap
      .timeline()
      .to(c, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.05 })
      .add(() => openGate(), 0.3)
      .set(c, { yPercent: 100, visibility: 'hidden' });
  }, [location.pathname]);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 200);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu overlay
  useEffect(() => {
    const lenis = getLenis();
    const m = menuRef.current;
    if (!m) return;
    document.documentElement.classList.toggle('menu-open', menuOpen);
    if (menuOpen) {
      lenis?.stop();
      if (!prefersReducedMotion()) {
        gsap.fromTo(m.querySelectorAll('.menu__link > span'), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out', delay: 0.15 });
      }
      const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    lenis?.start();
  }, [menuOpen]);

  const go = useCallback(
    (dest) => {
      const [destPath, destHash] = dest.split('#');
      if (destPath === location.pathname) {
        setMenuOpen(false);
        if (destHash) {
          navigate(dest, { replace: true });
          scrollToEl('#' + destHash);
        } else scrollToTop(false);
        return;
      }
      const c = curtain.current;
      closeGate();
      if (!c || prefersReducedMotion()) {
        navigate(dest);
        return;
      }
      gsap.set(c, { visibility: 'visible', yPercent: 100 });
      gsap.to(c, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => navigate(dest) });
    },
    [location.pathname, navigate]
  );

  const year = new Date().getFullYear();

  return (
    <TransitionContext.Provider value={{ go }}>
      <a className="skip" href="#main">
        {t.nav.skip}
      </a>

      <header ref={header} className={`header ${hidden && !menuOpen ? 'is-hidden' : ''} ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-menu' : ''}`}>
        <div className="header__inner">
          <TLink to={to('home')} className="header__logo" aria-label={t.nav.home}>
            <Wordmark />
          </TLink>
          <nav className="header__nav" aria-label="Primary">
            {NAV_KEYS.slice(0, 4).map((k) => (
              <TLink key={k} to={to(k)} className={`navlink ${location.pathname === to(k) ? 'is-active' : ''}`}>
                <span data-text={t.nav[k]}>{t.nav[k]}</span>
              </TLink>
            ))}
          </nav>
          <div className="header__actions">
            <TLink to={alternate} className="lang" hrefLang={locale === 'en' ? 'id' : 'en'} aria-label={t.nav.switchLabel}>
              {t.nav.switchShort}
            </TLink>
            <Button to={to('contact')} className="header__cta">
              {t.nav.cta}
            </Button>
            <button
              type="button"
              className="burger"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="burger__label">{menuOpen ? t.nav.close : t.nav.menu}</span>
              <span className="burger__lines" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" ref={menuRef} className={`menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu__inner">
          <nav className="menu__nav" aria-label="Menu">
            {['home', ...NAV_KEYS].map((k, i) => (
              <TLink key={k} to={to(k)} className="menu__link" tabIndex={menuOpen ? 0 : -1}>
                <span>
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  {k === 'home' ? 'DGAP' : t.nav[k]}
                </span>
              </TLink>
            ))}
          </nav>
          <div className="menu__aside">
            <p className="menu__tag">{t.footer.tagline}</p>
            {site.email && <p className="menu__mail">{site.email}</p>}
            <TLink to={alternate} className="menu__lang" tabIndex={menuOpen ? 0 : -1}>
              {t.nav.switchLabel}
            </TLink>
          </div>
        </div>
      </div>

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__top">
            <TLink to={to('contact')} className="footer__big" data-cursor={t.nav.contact}>
              <span>{t.footer.big}</span>
              <Arrow dir="diag" className="footer__big-arrow" />
            </TLink>
          </div>
          <div className="footer__grid">
            <div className="footer__brand">
              <Wordmark />
              <p>{t.footer.tagline}</p>
              <p className="footer__muted">
                {site.address.locality}, {locale === 'id' ? 'Jawa Barat' : site.address.region}, Indonesia
              </p>
            </div>
            <div>
              <p className="footer__h">{t.footer.explore}</p>
              <ul className="footer__list">
                {NAV_KEYS.map((k) => (
                  <li key={k}>
                    <TLink to={to(k)}>{t.nav[k]}</TLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="footer__h">{t.footer.contact}</p>
              <ul className="footer__list">
                {site.email && <li><a href={`mailto:${site.email}`}>{site.email}</a></li>}
                {site.whatsapp && <li><a href={`https://wa.me/${site.whatsapp}`} rel="noopener" target="_blank">WhatsApp</a></li>}
                {site.instagram && <li><a href={site.instagram} rel="noopener" target="_blank">Instagram</a></li>}
                {site.linkedin && <li><a href={site.linkedin} rel="noopener" target="_blank">LinkedIn</a></li>}
              </ul>
            </div>
            <div>
              <p className="footer__h">{t.footer.language}</p>
              <ul className="footer__list">
                <li><TLink to={alternate} hrefLang={locale === 'en' ? 'id' : 'en'}>{t.nav.switchLabel}</TLink></li>
              </ul>
            </div>
          </div>
          <div className="footer__base">
            <span>© {year} {site.legalName}. {t.footer.rights}</span>
            <button type="button" className="footer__top-btn" onClick={() => scrollToTop(false)}>
              {t.footer.backTop} <Arrow dir="up" />
            </button>
          </div>
        </div>
      </footer>

      <div ref={curtain} className="curtain" aria-hidden="true">
        <Wordmark />
      </div>
      <Cursor />
    </TransitionContext.Provider>
  );
}
