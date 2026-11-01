import { Split, Button } from './ui.jsx';
import { site } from '../site.config.js';

function SocialIcon({ type }) {
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3h-3.1V7.5c0-.9.3-1.5 1.6-1.5H16V3.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.4-4.1 4.3V10H7v3h2.5v8h4Z" fill="currentColor"/>
      </svg>
    );
  }

  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.1-3.1a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z" fill="currentColor"/>
      </svg>
    );
  }

  return null;
}

export default function CtaBand({ t, to }) {
  const socials = [
    ...(site.instagram ? [{ type: 'instagram', label: 'Instagram', href: site.instagram }] : []),
    ...(site.facebook ? [{ type: 'facebook', label: 'Facebook', href: site.facebook }] : [])
  ];

  return (
    <section className="ctaband">
      <div className="wrap ctaband__inner">
        <Split as="h2" text={t.cta.title} className="ctaband__title" />
        <div className="ctaband__side" data-reveal>
          <p>{t.cta.body}</p>
          <Button to={to('contact')} variant="light">
            {t.cta.button}
          </Button>
          {socials.length > 0 && (
            <div className="ctaband__socials" aria-label="Social media links">
              {socials.map((social) => (
                <a key={social.label} href={social.href} className="ctaband__social" target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <SocialIcon type={social.type} />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
