import { createContext, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';

/** Heading whose words rise out of a mask. Text stays real, crawlable text. */
export function Split({ as: Tag = 'h2', text, className = '', ...rest }) {
  const words = String(text).split(' ');
  return (
    <Tag className={`split ${className}`} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w">
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export function Arrow({ dir = 'right', className = '' }) {
  const rot = { right: 0, down: 90, left: 180, up: -90, diag: -45 }[dir];
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

/** Wordmark placeholder. Replace with the Brown Sugar logo file when available (see README). */
export function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="wordmark__mono">
        <path d="M6 6h11a14 14 0 0 1 0 28H6z" fill="currentColor" />
        <rect x="17" y="6" width="4" height="28" className="wordmark__gap" />
        <rect x="26" y="17" width="7" height="6" className="wordmark__brass" />
      </svg>
      <span className="wordmark__text">DGAP</span>
    </span>
  );
}

export const TransitionContext = createContext({ go: null });

/** Internal link that plays the page curtain before navigating. */
export function TLink({ to, children, onClick, ...rest }) {
  const { go } = useContext(TransitionContext);
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (go) {
          e.preventDefault();
          go(to);
        }
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({ to, href, children, variant = 'solid', className = '', ...rest }) {
  const cls = `btn btn--${variant} ${className}`;
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      <span className="btn__icon">
        <Arrow />
      </span>
    </>
  );
  if (to)
    return (
      <TLink to={to} className={cls} data-magnetic {...rest}>
        {inner}
      </TLink>
    );
  return (
    <a href={href} className={cls} data-magnetic {...rest}>
      {inner}
    </a>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
