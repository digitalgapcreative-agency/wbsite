import { useRef } from 'react';
import { useI18n } from '../i18n.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { Button } from '../components/ui.jsx';
import PageHero from '../components/PageHero.jsx';

export default function NotFound() {
  const ref = useRef(null);
  usePageMotion(ref);
  const { t, to } = useI18n();
  return (
    <div ref={ref} className="page page--404">
      <PageHero eyebrow={t.notFound.eyebrow} title={t.notFound.title} lede={t.notFound.body}>
        <div data-reveal="2" className="phero__actions">
          <Button to={to('home')}>{t.notFound.cta}</Button>
        </div>
      </PageHero>
    </div>
  );
}
