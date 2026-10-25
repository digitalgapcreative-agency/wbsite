import { Split, Button } from './ui.jsx';

export default function CtaBand({ t, to }) {
  return (
    <section className="ctaband">
      <div className="wrap ctaband__inner">
        <Split as="h2" text={t.cta.title} className="ctaband__title" />
        <div className="ctaband__side" data-reveal>
          <p>{t.cta.body}</p>
          <Button to={to('contact')} variant="light">
            {t.cta.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
