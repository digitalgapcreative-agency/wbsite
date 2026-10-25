import { Split, Eyebrow } from './ui.jsx';

export default function PageHero({ eyebrow, title, lede, children, tone = 'dark' }) {
  return (
    <section className={`phero phero--${tone}`} data-intro>
      <div className="wrap phero__inner">
        <Eyebrow>
          <span data-reveal="0">{eyebrow}</span>
        </Eyebrow>
        <Split as="h1" text={title} className="phero__title" />
        {lede && (
          <p className="phero__lede" data-reveal="1">
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
