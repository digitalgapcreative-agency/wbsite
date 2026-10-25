import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { ROUTES } from './routes.js';
import './styles/main.css';

const container = document.getElementById('root');

// Preview builds (single-file artifact) can't use real URLs, so they route in memory.
// A plain #token such as #services or #id-layanan picks the starting page.
if (import.meta.env.VITE_PREVIEW === '1') {
  const token = location.hash.replace('#', '');
  const match = ROUTES.flatMap((r) => [r.en, r.id]).find((p) => p.replace(/\//g, '-').replace(/^-/, '') === token);
  createRoot(container).render(
    <MemoryRouter initialEntries={[match || '/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );
} else {
  const app = (
    <StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
  if (container.hasChildNodes()) hydrateRoot(container, app);
  else createRoot(container).render(app);
}
