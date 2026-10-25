import { useState } from 'react';

/** Accordion. Answers stay in the DOM (good for search and AI answer engines); only their height animates. */
export default function Faq({ items, idPrefix = 'faq' }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={f.q}>
            <h3 className="faq__q">
              <button
                type="button"
                id={`${idPrefix}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                <i className="faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="faq__a" id={`${idPrefix}-a-${i}`} role="region" aria-labelledby={`${idPrefix}-q-${i}`}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
