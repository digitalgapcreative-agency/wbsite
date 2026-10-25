import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { headFor, headToString } from './seo.js';
import { ROUTES } from './routes.js';
import { site } from './site.config.js';

export function render(url) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
  const { tags, lang } = headFor(url);
  return { html, head: headToString(tags), lang };
}

export { ROUTES, site };
