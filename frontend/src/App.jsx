import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Consultancy from './pages/Consultancy.jsx';
import Work from './pages/Work.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import { ROUTES } from './routes.js';

// Admin is code-split: public visitors never download it.
const Admin = lazy(() => import('./admin/Admin.jsx'));

const PAGES = {
  home: () => <Home />,
  services: () => <Services />,
  consultancy: () => <Consultancy />,
  work: () => <Work />,
  'case-mindcare': () => <CaseStudy slug="mindcare" />,
  about: () => <About />,
  contact: () => <Contact />
};

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="adm-login" aria-busy="true" />}>
            <Admin />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        {ROUTES.flatMap((r) => [
          <Route key={`${r.key}-en`} path={r.en} element={PAGES[r.key]()} />,
          <Route key={`${r.key}-id`} path={r.id} element={PAGES[r.key]()} />
        ])}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
